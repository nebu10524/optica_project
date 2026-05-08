# Sistema Inteligente de Evaluación Preliminar de Problemas Visuales mediante Visión Computacional en Multi Ópticas

Aplicación web **cliente-servidor** para apoyar la gestión de pacientes, el registro de retinografías y un **análisis asistido** mediante modelo de **inteligencia artificial** (Google Gemini), con historial clínico y **generación de informes en PDF**. Proyecto desarrollado en el marco de **Multiopticas** (Huancayo, Perú).

> El sistema es una herramienta de apoyo; no sustituye el criterio del profesional de la salud visual.

## Tecnologías

| Capa | Tecnología |
|------|------------|
| Entorno local | **XAMPP** (Apache + MySQL/MariaDB + PHP) en Windows, o equivalente |
| Backend | PHP 8.2+, **Laravel 12**, Laravel Sanctum |
| Frontend | **React 19**, **Vite 8**, React Router, Axios, Bootstrap 5 |
| Datos | MySQL/MariaDB (vía XAMPP) o **SQLite** para pruebas rápidas |
| Informes | **DomPDF** (Laravel) |
| IA | **Google Gemini** API (modelo configurado en código, p. ej. `gemini-2.5-flash`) |

## Estructura del proyecto

```
optica_project/
├── backend/                      # API REST Laravel
├── frontend/                     # SPA React + Vite
├── Docs/                         # Documentación (patente, constancia, plan de pruebas, evidencias)
│   ├── Constancia de Aprobacion/
│   ├── Patente/
│   ├── Plan de Pruebas/
│   └── Pruebas_Evidencias/
├── README.md
└── .gitignore
```

Este repositorio es **privado**: `Docs/` puede estar en Git para tu respaldo. Si algún día el repo fuera **público**, convendría no incluir documentos con datos personales o legales sensibles.

## Qué incluye Git (y qué instalar después de clonar)

El repo lleva **todo el código** del backend y del frontend: rutas, controladores, modelos, vistas Blade/PDF, componentes React, tests, migraciones y `Docs/`.

**No se suben** (por tamaño y buenas prácticas):

- `backend/vendor/` → en tu PC ejecuta `composer install` dentro de `backend/`.
- `frontend/node_modules/` → ejecuta `npm install` dentro de `frontend/`.
- `backend/.env` → no va a Git. Copia `backend/.env.example` a `.env`, pon `APP_KEY` (`php artisan key:generate`) y tu `GEMINI_API_KEY`.

Así el repositorio sigue ligero y cualquier clon queda listo tras esos tres pasos.

**Base de datos:** el proyecto incluye migraciones para `usuarios`, `pacientes`, `evaluaciones_retina`, `imagenes_retina` e `historial_retina`. En una base **nueva**, `php artisan migrate` crea el esquema. Si ya tenías tablas creadas a mano y falla una migración, respalda los datos y valora `php artisan migrate:fresh` (borra todas las tablas del proyecto).

## XAMPP (desarrollo en Windows)

1. Instala [XAMPP](https://www.apachefriends.org/) con **PHP 8.2 o superior** (comprueba la versión en el panel; Laravel 12 lo requiere).
2. Abre **XAMPP Control Panel** y arranca **MySQL** (y **Apache** solo si lo usarás para servir el `public` de Laravel; ver abajo).
3. En **phpMyAdmin** (`http://localhost/phpmyadmin`): crea una base de datos, por ejemplo `optica_db`.
4. Añade **Composer** al PATH o ejecútalo desde su instalación; en la carpeta `backend` ejecuta `composer install`.
5. Copia `backend/.env.example` a `backend/.env`, genera clave: `php artisan key:generate`.
6. En `backend/.env`, configura MySQL (ejemplo típico con XAMPP):

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=optica_db
DB_USERNAME=root
DB_PASSWORD=

GEMINI_API_KEY=tu_clave_aqui
```

7. Migraciones y enlace de storage:

```bash
cd backend
php artisan migrate
php artisan storage:link
```

**Forma más simple de levantar la API (recomendada):** no hace falta Apache para Laravel si usas el servidor integrado:

```bash
cd backend
php artisan serve
```

La API quedará en `http://127.0.0.1:8000`. Sigues usando **MySQL de XAMPP** solo como motor de base de datos.

**Alternativa con Apache:** configura un **Virtual Host** apuntando el `DocumentRoot` a `...\optica_project\backend\public` y ajusta `APP_URL` en `.env` a esa URL. Requiere `mod_rewrite` habilitado.

El **frontend** (React) se ejecuta aparte con Node:

```bash
cd frontend
npm install
npm run dev
```

En `frontend/src/api/axios.js` deja `baseURL` al mismo host donde corre Laravel (p. ej. `http://127.0.0.1:8000/api/`).

## Requisitos previos

- **XAMPP** (o PHP 8.2+ + MySQL por separado)
- [Composer](https://getcomposer.org/)
- [Node.js](https://nodejs.org/) (LTS) y npm
- Cuenta y **clave de API** de [Google AI Studio / Gemini](https://aistudio.google.com/)

## Instalación rápida (resumen)

```bash
git clone https://github.com/nebu10524/optica_project.git
cd optica_project/backend
composer install
copy .env.example .env
php artisan key:generate
# Editar .env: DB_* y GEMINI_API_KEY
php artisan migrate
php artisan storage:link
php artisan serve
```

En otra terminal:

```bash
cd optica_project/frontend
npm install
npm run dev
```

### Base SQLite (sin MySQL)

Si prefieres probar sin XAMPP/MySQL, en `.env` puedes usar SQLite:

```env
DB_CONNECTION=sqlite
```

Crea `backend/database/database.sqlite` (archivo vacío) y ejecuta `php artisan migrate`.

## Scripts útiles

| Ubicación | Comando | Descripción |
|-----------|---------|-------------|
| `frontend/` | `npm run dev` | Servidor de desarrollo Vite |
| `frontend/` | `npm run build` | Compilación para producción |
| `backend/` | `php artisan serve` | API Laravel |
| `backend/` | `php artisan migrate` | Migraciones |
| `backend/` | `php artisan test` | Pruebas PHPUnit |

## Seguridad

- **No suba** `backend/.env` ni archivos `*.env.txt` con claves; el `.gitignore` los excluye.
- La **clave de Gemini** solo en `.env` local (y en variables de entorno en servidor si despliegas).
- Aunque el repo sea **privado**, no invites a colaboradores de forma casual si `Docs/` contiene datos sensibles.

## Autores

- **Andy Brayan Torres Crisóstomo** — desarrollo backend / integración  
- **Xiomara Andrea Mejía Cosios** — desarrollo frontend  
- **Jasmi Janeli Álvarez Caisahuana** — pruebas y documentación técnica  

**Contexto:** proyecto vinculado a **Multiopticas** (Huancayo, Perú).

## Licencia

Defina la licencia del código (por ejemplo MIT, propietaria o la que acuerde el equipo y la empresa titular).

---

**Versión del software referida en documentación:** v1.0
