import { useEffect, useMemo, useState } from 'react';

const DEFAULT_TIMEOUT_MS = 9000;

const getEmbedConfig = () => {
  const terminalUrl = process.env.REACT_APP_SSH_TERMINAL_URL?.trim() || '';
  const embedMode = process.env.REACT_APP_SSH_TERMINAL_EMBED_MODE?.trim() || 'iframe';
  const healthcheckUrl = process.env.REACT_APP_SSH_TERMINAL_HEALTHCHECK_URL?.trim() || '';

  return {
    terminalUrl,
    embedMode,
    healthcheckUrl,
  };
};

const isAbsoluteHttpUrl = (value) => /^https?:\/\//i.test(value);

const SshTerminalEmbed = () => {
  const { terminalUrl, embedMode, healthcheckUrl } = useMemo(() => getEmbedConfig(), []);
  const [status, setStatus] = useState(() => {
    if (!terminalUrl) {
      return 'missing-config';
    }

    if (embedMode !== 'iframe') {
      return 'unsupported-mode';
    }

    if (!isAbsoluteHttpUrl(terminalUrl)) {
      return 'invalid-config';
    }

    return 'loading';
  });

  useEffect(() => {
    if (status !== 'loading') {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setStatus('timeout');
    }, DEFAULT_TIMEOUT_MS);

    return () => window.clearTimeout(timeoutId);
  }, [status]);

  const handleLoad = () => {
    setStatus('ready');
  };

  const handleError = () => {
    setStatus('unavailable');
  };

  const renderMessage = () => {
    switch (status) {
      case 'missing-config':
        return {
          title: 'Live terminal not configured',
          body: 'Set REACT_APP_SSH_TERMINAL_URL to your hosted terminal bridge to enable the embedded session.',
        };
      case 'unsupported-mode':
        return {
          title: 'Unsupported terminal embed mode',
          body: 'This page currently supports iframe embeds only. Set REACT_APP_SSH_TERMINAL_EMBED_MODE=iframe.',
        };
      case 'invalid-config':
        return {
          title: 'Terminal URL is invalid',
          body: 'REACT_APP_SSH_TERMINAL_URL must be an absolute http or https URL.',
        };
      case 'timeout':
        return {
          title: 'Terminal is taking longer than expected',
          body: 'The remote terminal service did not finish loading in time. You can still open it directly or SSH from your own terminal.',
        };
      case 'unavailable':
        return {
          title: 'Terminal service unavailable',
          body: 'The embedded terminal could not be loaded. Open the terminal directly or use the SSH command below.',
        };
      default:
        return null;
    }
  };

  const message = renderMessage();
  const showOverlay = status !== 'ready';
  const showFrame = status === 'loading' || status === 'ready' || status === 'timeout';

  return (
    <section className="ssh-terminal-section" aria-labelledby="ssh-live-terminal-title">
      <div className="ssh-section-header">
        <div>
          <p className="ssh-eyebrow">Live session</p>
          <h2 id="ssh-live-terminal-title">Embedded browser terminal</h2>
        </div>
        {terminalUrl && isAbsoluteHttpUrl(terminalUrl) ? (
          <a
            className="ssh-terminal-link"
            href={terminalUrl}
            target="_blank"
            rel="noreferrer"
          >
            Open full terminal
          </a>
        ) : null}
      </div>

      <div className={`ssh-terminal-shell ssh-terminal-shell--${status}`}>
        {showFrame ? (
          <iframe
            title="SSH portfolio terminal"
            src={terminalUrl}
            className={`ssh-terminal-frame${status === 'ready' ? ' is-ready' : ''}`}
            onLoad={handleLoad}
            onError={handleError}
            allow="clipboard-read; clipboard-write"
          />
        ) : (
          <div className="ssh-terminal-frame ssh-terminal-frame--placeholder" aria-hidden="true" />
        )}

        {showOverlay ? (
          <div className="ssh-terminal-overlay" role={status === 'loading' ? 'status' : 'alert'}>
            {status === 'loading' ? (
              <>
                <div className="ssh-terminal-spinner" aria-hidden="true" />
                <p className="ssh-terminal-status-title">Connecting to terminal service…</p>
                <p className="ssh-terminal-status-body">
                  If the session does not appear, you can open it in a new tab or use your local SSH client.
                </p>
              </>
            ) : (
              <>
                <p className="ssh-terminal-status-title">{message?.title}</p>
                <p className="ssh-terminal-status-body">{message?.body}</p>
                {healthcheckUrl && isAbsoluteHttpUrl(healthcheckUrl) ? (
                  <a
                    className="ssh-terminal-inline-link"
                    href={healthcheckUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Check terminal service status
                  </a>
                ) : null}
              </>
            )}
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default SshTerminalEmbed;
