#!/bin/sh
set -e

cd /app

# Cache config/routes for faster boot in production
php artisan config:cache || true
php artisan route:cache || true

# Run database migrations on startup (safe for repeat deploys).
# If migrations fail we prefer stopping startup so the issue is visible.
php artisan migrate --force

exec php -S 0.0.0.0:${PORT:-10000} -t public public/index.php

