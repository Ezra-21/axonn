#!/bin/sh
set -e

cd /app/backend

echo "==> Applying database migrations..."
npx prisma migrate deploy

if [ "$RUN_SEED" = "true" ]; then
  echo "==> Seeding database..."
  npm run db:seed || echo "(seeding skipped/failed, continuing)"
fi

echo "==> Starting backend on port ${PORT:-4000}..."
node src/server.js &
BACKEND_PID=$!

cd /app/frontend
echo "==> Starting frontend on port 3000..."
npm run start &
FRONTEND_PID=$!

term() {
  echo "==> Shutting down..."
  kill "$BACKEND_PID" "$FRONTEND_PID" 2>/dev/null || true
}
trap term TERM INT

while kill -0 "$BACKEND_PID" 2>/dev/null && kill -0 "$FRONTEND_PID" 2>/dev/null; do
  sleep 5
done

echo "==> A process exited; stopping container."
term
exit 1
