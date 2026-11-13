#!/bin/bash
# Pull latest main, rebuild, restart the DeepRoots site.
set -euo pipefail
cd /var/www/deeproots

# Secrets (MongoDB, Razorpay, site URL) live only on the server. Without them the build
# would succeed but every donation would fail, so refuse to deploy.
if [ ! -f .env.production.local ]; then
  echo "Missing /var/www/deeproots/.env.production.local (see deploy/README.md). Aborting." >&2
  exit 1
fi
sudo -u deeproots -H bash -c "git pull --ff-only && npm ci --no-audit --no-fund --loglevel=error && NEXT_TELEMETRY_DISABLED=1 npm run build"
systemctl restart deeproots
echo "Deployed $(git rev-parse --short HEAD)"
