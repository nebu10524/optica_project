#!/bin/sh
set -e

cd /app

# Cache config/routes for faster boot in production
php artisan config:cache || true
php artisan route:cache || true

# Run database migrations on startup (safe for repeat deploys)
php artisan migrate --force || true

exec php -S 0.0.0.0:${PORT:-10000} -t public public/index.php

