FROM php:8.2-cli

WORKDIR /app

# System dependencies and PHP extensions required by Laravel + PostgreSQL
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libpq-dev \
    libzip-dev \
    libpng-dev \
    libjpeg62-turbo-dev \
    libfreetype6-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo pdo_pgsql zip gd \
    && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Copy full project before composer install because Laravel scripts
# may call artisan during install (which requires full source tree).
COPY . .

# Prepare runtime directories
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-progress \
    && mkdir -p storage/framework/{cache,sessions,views} storage/logs bootstrap/cache \
    && mkdir -p /tmp/php \
    && chmod -R 775 storage bootstrap/cache /tmp/php

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# PHP runtime overrides for uploads and execution limits
COPY php.ini /usr/local/etc/php/conf.d/99-custom.ini

EXPOSE 10000

CMD ["/entrypoint.sh"]

