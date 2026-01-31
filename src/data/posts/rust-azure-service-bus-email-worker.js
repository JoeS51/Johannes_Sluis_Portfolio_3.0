const post = {
  slug: 'rust-azure-service-bus-email-worker',
  frontmatter: {
    title: 'Emailing Service in Rust using Azure Service Bus',
    description:
      'How I built a Rust worker that reads Azure Service Bus messages and dispatches emails.',
    date: '2025-11-15',
    tags: ['Rust', 'Azure', 'Backend'],
    cover: null
  },
  content: `
## Why I needed this worker

I wanted a single, reliable worker that listened to Azure Service Bus and sent out emails (welcome emails, weekly reports, and alerts). I could have simply used EmailJS or something similar, but this was a good excuse to use Rust since I had recently finished the Rust handbook.

## Architecture at a glance

- **Trigger:** Azure Service Bus queue with duplicate detection and a dead-letter queue (DLQ)
- **Worker:** A Tokio-based async loop in Rust
- **Email:** SMTP via the \`lettre\` crate with reusable templates
- **Config:** Environment variables injected at deploy time (no secrets in code)
- **Telemetry:** \`tracing\` for logs and \`metrics\` counters on processed, retried, and DLQ messages

\`\`\`mermaid
flowchart LR
  A[Producer services] --> B[Azure Service Bus queue]
  B --> C[Rust worker]
  C -->|SMTP| D[Email provider]
  C -->|DLQ on failure| E[Dead-letter queue]
\`\`\`

## Message contract

Each message is JSON with just enough context to pick the email template and render it safely:

\`\`\`json
{
  "tenant_id": "acme-co",
  "event": "weekly_report_ready",
  "recipient": "alex@acme.co",
  "payload": {
    "report_url": "https://reports.acme.co/r/123",
    "week_of": "2025-02-09"
  }
}
\`\`\`

The \`event\` drives template selection, and \`tenant_id\` becomes part of the idempotency key so reruns don’t send duplicates.

## Core loop

I used the official Azure SDK plus Tokio’s concurrency primitives. The worker prefetches messages in small batches, processes them concurrently with a cap, and completes or dead-letters explicitly. That keeps throughput steady while avoiding noisy-neighbor SMTP slowdowns.

\`\`\`rust
use azure_messaging_servicebus::{Client, ReceiveMode};
use lettre::{Message, SmtpTransport, Transport};
use serde::Deserialize;
use tokio::task::JoinSet;
use tracing::{error, info};

#[derive(Deserialize)]
struct EmailJob { tenant_id: String, event: String, recipient: String, payload: serde_json::Value }

async fn run() -> anyhow::Result<()> {
    let client = Client::from_connection_string(std::env::var("SERVICEBUS_CONNECTION")?)?;
    let mut receiver = client
        .queue_client("email-jobs")
        .receive_messages()
        .max_message_count(8)
        .prefetch_count(16)
        .receive_mode(ReceiveMode::PeekLock);

    let smtp = SmtpTransport::relay("smtp.example.com")?.build();

    loop {
        let messages = receiver.receive().await?;
        let mut tasks = JoinSet::new();

        for message in messages {
            tasks.spawn(handle_message(message, smtp.clone()));
        }

        while let Some(result) = tasks.join_next().await {
            if let Err(err) = result {
                error!(?err, "worker task failed");
            }
        }
    }
}

async fn handle_message(message: azure_messaging_servicebus::Message, smtp: SmtpTransport) -> anyhow::Result<()> {
    let job: EmailJob = serde_json::from_slice(&message.body)?;
    send_email(&job, &smtp).await?;
    message.complete().await?;
    info!(event = %job.event, recipient = %job.recipient, "email sent");
    Ok(())
}
\`\`\`

Key choices:
- **PeekLock** mode lets me complete or abandon explicitly.
- **prefetch_count** keeps throughput steady without overwhelming SMTP.
- **JoinSet** keeps the loop responsive while limiting concurrency.

## Email rendering and retries

- Templates live alongside the code as Handlebars files, compiled at startup.
- SMTP failures are retried with exponential backoff (up to 3 attempts) before moving to the DLQ.
- Idempotency keys combine \`tenant_id\`, \`event\`, and \`recipient\`, so duplicate messages short-circuit gracefully instead of spamming inboxes.

\`\`\`rust
async fn send_email(job: &EmailJob, smtp: &SmtpTransport) -> anyhow::Result<()> {
    let subject = format!("{} notification", job.event);
    let html = render_template(&job.event, &job.payload)?;

    let email = Message::builder()
        .from("no-reply@acme.co".parse()?)
        .to(job.recipient.parse()?)
        .subject(subject)
        .body(html)?;

    for attempt in 1..=3 {
        match smtp.send(&email) {
            Ok(_) => return Ok(()),
            Err(err) if attempt < 3 => {
                tracing::warn!(?err, attempt, "retrying email send");
                tokio::time::sleep(std::time::Duration::from_secs(2u64.pow(attempt))).await;
            }
            Err(err) => return Err(err.into()),
        }
    }

    Ok(())
}
\`\`\`

## Deployment and secrets

- Built into a small container with a multi-stage Dockerfile.
- Deployed on Azure Container Apps with autoscaling based on queue length.
- Secrets provided via Managed Identity and injected as env vars (no connection strings in images).

## Observability

- \`tracing-subscriber\` for structured logs with correlation IDs from Service Bus message properties.
- Metrics counters for processed, retried, abandoned, and dead-lettered messages exported to Azure Monitor.
- Alerts fire when DLQ length grows or when retry rates spike.

## Lessons learned

1. **Prefetch matters:** Too high and SMTP back-pressure caused timeouts; 16 was a sweet spot.
2. **Make messages template-friendly:** Keep payloads narrow and typed so rendering can’t panic.
3. **DLQ is your friend:** Treat it as a separate backlog with dashboards and periodic replay, not a graveyard.
4. **Cold starts are fine:** With Rust, cold starts on Container Apps stayed under a second even with TLS warmup.

## Next steps

I want to add automatic retries with scheduled messages for noisy email providers and wire in OpenTelemetry traces to follow a message from producer through to SMTP delivery.
`
};

export default post;
