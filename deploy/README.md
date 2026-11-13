# Deployment

Live at https://thedeeprootsfoundation.org (Ubuntu VPS `187.126.112.98`).

## Deploy changes

1. Merge your work into `main` and push it.
2. Run `npm run deploy` (or `bash deploy/deploy.sh`).

This SSHes into the server (`deepRoots` host in `~/.ssh/config`) and runs
`deploy-deeproots`, which pulls `main`, runs `npm ci` + `npm run build`, and restarts the app.

## Files

| File | Location on server | Purpose |
| --- | --- | --- |
| `deploy.sh` | — (runs locally) | Triggers a deploy over SSH |
| `deploy-deeproots.sh` | `/usr/local/bin/deploy-deeproots` | Pull, build, restart (refuses to run without the env file) |
| `deeproots.service` | `/etc/systemd/system/deeproots.service` | Runs `next start` on `127.0.0.1:3000` as user `deeproots` |
| `nginx-deeproots.conf` | `/etc/nginx/sites-available/deeproots` | Reverse proxy + SSL (SSL lines managed by Certbot) |

App code lives in `/var/www/deeproots`. SSL is from Let's Encrypt and auto-renews via `certbot.timer`.

After changing any of these files in the repo, copy them to their server location
(e.g. `install -m 755 deploy/deploy-deeproots.sh /usr/local/bin/deploy-deeproots`).

## Server secrets: `/var/www/deeproots/.env.production.local`

The site has a backend (Razorpay donations, MongoDB, contact form), so the server needs
one env file. Next.js reads it during both `next build` and `next start`; it is git-ignored,
so `git pull` never touches it. Create it once, readable only by the app user:

```bash
sudo -u deeproots tee /var/www/deeproots/.env.production.local > /dev/null <<'EOF'
NEXT_PUBLIC_SITE_URL=https://thedeeprootsfoundation.org

# Required for donations (live keys from Razorpay Dashboard → API Keys)
RAZORPAY_KEY_ID=rzp_live_...
RAZORPAY_KEY_SECRET=...
# Optional until the webhook is configured in Razorpay
RAZORPAY_WEBHOOK_SECRET=

# Database: set MONGODB_URI, or run without one by keeping donations in memory
# (lost on restart/deploy; Razorpay's dashboard stays the permanent record).
MONGODB_URI=
ALLOW_MEMORY_STORE=true
EOF
chmod 600 /var/www/deeproots/.env.production.local
```

- `NEXT_PUBLIC_SITE_URL` is baked in at build time, so a change needs a rebuild (`deploy-deeproots`).
- Razorpay keys, MongoDB and `ALLOW_MEMORY_STORE` are read at runtime: after editing them,
  `systemctl restart deeproots` is enough.
- Without Razorpay keys the site runs, but the donation form shows "gateway not configured".
- Never set `ALLOW_PAYMENT_SIMULATION` here (it is ignored in production anyway).

## Razorpay setup

- **Webhook:** Dashboard → Settings → Webhooks → `https://thedeeprootsfoundation.org/api/donations/webhook`,
  events `payment.authorized`, `payment.captured`, `payment.failed`, `order.paid`, `refund.processed`.
  Put the webhook secret in `RAZORPAY_WEBHOOK_SECRET`.
- The live site's domain must be approved on the Razorpay account for live payments.

## Requirements

- Node.js **20.9 or newer** (Next.js 16).
- nginx must pass the real client IP (`proxy_set_header X-Real-IP $remote_addr;`, already in
  `nginx-deeproots.conf`); the API rate limiter relies on it.
- The server needs outbound HTTPS: Google Fonts at build time, and Razorpay and Google Forms at runtime.

## Useful commands (on the server)

```bash
systemctl status deeproots        # app status
journalctl -u deeproots -f        # app logs
nginx -t && systemctl reload nginx
certbot certificates              # SSL expiry
```
