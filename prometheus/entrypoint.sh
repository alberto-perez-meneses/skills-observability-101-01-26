#!/bin/sh
set -eu

TEMPLATE=/etc/prometheus/prometheus.yml.template
CONFIG=/etc/prometheus/prometheus.yml

echo "Rendering Prometheus config..."

: "${OPENOBSERVE_REMOTE_USER:?OPENOBSERVE_REMOTE_USER is required}"
: "${OPENOBSERVE_REMOTE_KEY:?OPENOBSERVE_REMOTE_KEY is required}"

# BusyBox sed replacement (no external tools needed)
sed \
  -e "s|__OPENOBSERVE_REMOTE_USER__|${OPENOBSERVE_REMOTE_USER}|g" \
  -e "s|__OPENOBSERVE_REMOTE_KEY__|${OPENOBSERVE_REMOTE_KEY}|g" \
  "$TEMPLATE" > "$CONFIG"

echo "Starting Prometheus..."
exec /bin/prometheus \
  --config.file="$CONFIG" \
  --storage.tsdb.path=/prometheus \
  --web.console.libraries=/usr/share/prometheus/console_libraries \
  --web.console.templates=/usr/share/prometheus/consoles
