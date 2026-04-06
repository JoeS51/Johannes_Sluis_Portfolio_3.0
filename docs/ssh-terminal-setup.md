# SSH Browser Terminal Setup

This guide explains how to expose the existing SSH portfolio at `joesluis.dev:22` through a browser terminal served from `https://terminal.joesluis.dev/wetty`.

## Architecture

- `joesluis.dev:22` remains the real SSH portfolio target.
- `terminal.joesluis.dev:443` serves a browser terminal over HTTPS.
- A WeTTY container runs on the EC2 instance and connects to `joesluis.dev:22`.
- The React portfolio page embeds the browser terminal in an `iframe`.

## Prerequisites

- An AWS EC2 instance already serving the SSH portfolio on `joesluis.dev`
- Access to the DNS provider for `joesluis.dev`
- SSH access to the EC2 instance
- Ports `22`, `80`, and `443` allowed in the EC2 security group

## 1. Add DNS

Create an `A` record:

- `terminal.joesluis.dev -> <your-ec2-public-ip>`

## 2. Open EC2 Security Group Ports

Allow inbound traffic for:

- `22` for SSH
- `80` for HTTP
- `443` for HTTPS

## 3. Install Docker on EC2

Amazon Linux example:

```bash
sudo dnf update -y
sudo dnf install -y docker
sudo systemctl enable --now docker
sudo usermod -aG docker ec2-user
newgrp docker
```

Verify Docker:

```bash
docker --version
```

## 4. Run WeTTY

Run WeTTY on port `3000` and lock it to the SSH portfolio host:

```bash
docker run -d \
  --name wetty \
  --restart unless-stopped \
  -p 3000:3000 \
  wettyoss/wetty \
  --ssh-host=joesluis.dev \
  --ssh-port=22 \
  --base=/wetty \
  --allow-iframe
```

Optional: prefill a username in the WeTTY login form:

```bash
docker run -d \
  --name wetty \
  --restart unless-stopped \
  -p 3000:3000 \
  wettyoss/wetty \
  --ssh-host=joesluis.dev \
  --ssh-port=22 \
  --ssh-user=<your-ssh-user> \
  --base=/wetty \
  --allow-iframe
```

Useful Docker commands:

```bash
docker ps
docker logs wetty
docker restart wetty
```

## 5. Put HTTPS in Front of WeTTY

Use a reverse proxy so the browser terminal is served at `https://terminal.joesluis.dev`.

### Option A: Caddy

Install Caddy, then create this Caddyfile:

```caddy
terminal.joesluis.dev {
  reverse_proxy localhost:3000
  respond /healthz 200
}
```

Notes:

- Caddy will automatically provision TLS certificates when DNS is set correctly.
- `reverse_proxy` supports the WebSocket traffic WeTTY needs.

### Option B: Nginx

If the server already uses Nginx, add a server block like this:

```nginx
server {
    listen 80;
    server_name terminal.joesluis.dev;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name terminal.joesluis.dev;

    ssl_certificate /path/to/fullchain.pem;
    ssl_certificate_key /path/to/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location = /healthz {
        return 200 'ok';
        add_header Content-Type text/plain;
    }
}
```

## 6. Configure the Frontend

In this repo, set the SSH terminal env vars in `.env`:

```bash
DISABLE_ESLINT_PLUGIN=true
REACT_APP_SSH_TERMINAL_URL=https://terminal.joesluis.dev/wetty
REACT_APP_SSH_TERMINAL_EMBED_MODE=iframe
REACT_APP_SSH_TERMINAL_HEALTHCHECK_URL=https://terminal.joesluis.dev/healthz
```

Important:

- `REACT_APP_SSH_TERMINAL_URL` must be the browser-accessible HTTPS URL, not `ssh joesluis.dev`.
- Create React App reads env vars at startup/build time, so restart the dev server or rebuild after changing them.

## 7. Rebuild and Redeploy the Frontend

Once the env vars are set:

```bash
npm run build
```

Deploy the updated frontend as usual.

## 8. Verify the End-to-End Flow

Checks:

- `https://terminal.joesluis.dev/wetty` opens in a browser
- `https://terminal.joesluis.dev/healthz` returns `200`
- `/ssh-portfolio` loads the iframe instead of the "Live terminal not configured" fallback
- The embedded terminal can connect to `joesluis.dev:22`

## Security Notes

- Keep the WeTTY target pinned to `joesluis.dev` with `--ssh-host=joesluis.dev`.
- Do not expose a generic SSH gateway to arbitrary hosts.
- Use HTTPS only for `terminal.joesluis.dev`.
- Prefer a restricted SSH user or key-based auth if that works with the portfolio design.
- Make sure iframe embedding is explicitly allowed with `--allow-iframe`.

## Troubleshooting

### Browser page still says "Live terminal not configured"

- Confirm `.env` contains `REACT_APP_SSH_TERMINAL_URL`
- Restart the React dev server or rebuild the site
- Confirm the env var value starts with `https://`

### WeTTY works directly but not inside the portfolio page

- Confirm the WeTTY URL is `/wetty`
- Confirm the terminal service allows iframe embedding
- Confirm the reverse proxy is forwarding WebSocket traffic correctly

### `terminal.joesluis.dev` does not load

- Confirm DNS points to the EC2 public IP
- Confirm ports `80` and `443` are open in the EC2 security group
- Confirm Caddy or Nginx is running
- Check `docker logs wetty`

## Sources

- [WeTTY README](https://github.com/butlerx/wetty)
- [Caddy reverse_proxy docs](https://caddyserver.com/docs/caddyfile/directives/reverse_proxy)
