# Sistema Inteligente de Evaluación Preliminar de Problemas Visuales mediante Visión Computacional en Multi Ópticas

Aplicación web **cliente-servidor** para apoyar la gestión de pacientes, el registro de retinografías y un **análisis asistido** mediante modelo de **inteligencia artificial** (Google Gemini), con historial clínico y **generación de informes en PDF**. Proyecto desarrollado en el marco de **Multiopticas** (Huancayo, Perú).

> El sistema es una herramienta de apoyo; no sustituye el criterio del profesional de la salud visual.

## Tecnologías

| Capa | Tecnología |
|------|------------|
| Backend | PHP 8.2+, **Laravel 12**, Laravel Sanctum |
| Frontend | **React 19**, **Vite 8**, React Router, Axios, Bootstrap 5 |
| Datos | Base relacional (por defecto **SQLite** en desarrollo; compatible con MySQL/MariaDB) |
| Informes | **DomPDF** (Laravel) |
| IA | **Google Gemini** API (modelo configurado en código, p. ej. `gemini-2.5-flash`) |

## Estructura del proyecto

En tu máquina el repositorio puede organizarse así (las carpetas bajo `Docs/` son **solo para uso local** o trámites; **no deben publicarse** en un GitHub abierto):

```
optica_project/
├── backend/                      # API REST Laravel
├── frontend/                     # SPA React + Vite
├── Docs/                         # Ver sección “Privacidad” — excluida del Git público
│   ├── Constancia de Aprobacion/
│   ├── Patente/
│   ├── Plan de Pruebas/
│   └── Pruebas_Evidencias/
├── README.md
└── (scripts .py opcionales en raíz para generar Word, si los usas)
```

## Privacidad y qué conviene subir a GitHub

En un repositorio **público**, cualquiera puede clonar y descargar todo. Por eso **no es recomendable** incluir:

- Constancias, poderes, datos de representante legal o de la empresa más allá de lo estrictamente necesario.
- Borradores o PDF de **registro / patente / Indecopi** con datos personales (DNI, domicilios, firmas).
- **Evidencias de pruebas** con capturas que muestren datos reales de pacientes o de la clínica.

**Recomendación práctica:**

1. Mantén la carpeta **`Docs/`** solo en tu disco, en un **Drive privado** o en un repo **privado** aparte si tu institución lo permite.
2. Este proyecto incluye un **`.gitignore` en la raíz** que ignora la carpeta **`Docs/`** y los **`.docx`** generados en la raíz, para que no se suban por accidente al hacer `git add .`
3. Si alguna vez metiste `Docs/` en Git antes de ignorarla, quítala del índice sin borrarla en disco:  
   `git rm -r --cached Docs`

El **código** (`backend/`, `frontend/`) y un **README** genérico sí suelen publicarse; los **datos personales, legales y clínicos** no.

## Requisitos previos

- [PHP](https://www.php.net/) **8.2 o superior** con extensiones habituales de Laravel (`openssl`, `pdo`, `mbstring`, `tokenizer`, `xml`, `ctype`, `json`, `fileinfo`)
- [Composer](https://getcomposer.org/)
- [Node.js](https://nodejs.org/) (LTS recomendado) y npm
- Cuenta y **clave de API** de [Google AI Studio / Gemini](https://aistudio.google.com/) para el análisis de imágenes

## Instalación y configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/TU_USUARIO/TU_REPO.git
cd TU_REPO
```

### 2. Backend (Laravel)

```bash
cd backend
composer install
copy .env.example .env   # Windows: copy | Linux/macOS: cp
php artisan key:generate
```

Configure la base de datos en `.env`. El ejemplo usa SQLite; si usa la ruta por defecto de Laravel:

```env
DB_CONNECTION=sqlite
# Deje DB_DATABASE vacío o apunte database/database.sqlite
```

Cree el archivo de base de datos si hace falta:

```bash
# Ejemplo SQLite
type NUL > database\database.sqlite   # Windows PowerShell/CMD; o New-Item en PowerShell
php artisan migrate
```

Añada la clave de Gemini:

```env
GEMINI_API_KEY=tu_clave_aqui
```

Enlace el almacenamiento público para las imágenes de retina:

```bash
php artisan storage:link
```

Levante el servidor de desarrollo:

```bash
php artisan serve
```

Por defecto la API queda en `http://127.0.0.1:8000`.

### 3. Frontend (React + Vite)

En otra terminal:

```bash
cd frontend
npm install
npm run dev
```

Ajuste la URL de la API si no usa el puerto por defecto. En `frontend/src/api/axios.js` la `baseURL` debe apuntar al backend, por ejemplo:

```js
baseURL: 'http://127.0.0.1:8000/api/'
```

## Scripts útiles

| Ubicación | Comando | Descripción |
|-----------|---------|-------------|
| `frontend/` | `npm run dev` | Servidor de desarrollo Vite |
| `frontend/` | `npm run build` | Compilación para producción |
| `frontend/` | `npm run preview` | Vista previa del build |
| `backend/` | `php artisan serve` | Servidor de desarrollo Laravel |
| `backend/` | `php artisan migrate` | Ejecutar migraciones |
| `backend/` | `php artisan test` | Pruebas PHPUnit (si las hubiera) |

## Seguridad

- **No suba** el archivo `.env` ni claves (`GEMINI_API_KEY`) al repositorio.
- Compruebe que `.gitignore` ignore `backend/.env`, `frontend/node_modules/`, `backend/vendor/` y la carpeta **`Docs/`** (este repo ya lo hace en la raíz).
- En producción use HTTPS, variables de entorno seguras y políticas CORS acotadas.

## Autores

- **Andy Brayan Torres Crisóstomo** — desarrollo backend / integración  
- **Xiomara Andrea Mejía Cosios** — desarrollo frontend  
- **Jasmi Janeli Álvarez Caisahuana** — pruebas y documentación técnica  

**Contexto:** proyecto vinculado a **Multiopticas** (Huancayo, Perú).

## Documentación técnica generada con scripts (opcional)

Si en la raíz tienes scripts Python que generan archivos Word (por ejemplo para archivo académico), puedes ejecutarlos **en local**; las salidas `.docx` en la raíz están pensadas para **no versionarse** en Git (véase `.gitignore`). Requiere `pip install python-docx`.

## Licencia

Defina la licencia del código (por ejemplo MIT, propietaria o la que acuerde el equipo y la empresa titular). Mientras no se indique lo contrario, el contenido de este repositorio es material académico/profesional del equipo citado.

---

**Versión del software referida en documentación:** v1.0
