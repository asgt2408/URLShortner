# URL Shortner

A full-stack URL shortening project built with **FastAPI**, **React**, and **MySQL**. Store a URL, receive an eight-character alphanumeric code, and use that code to retrieve the original URL.

> The current application returns short codes and looks up their original URLs. It does not generate clickable short links or provide an HTTP redirect endpoint.

## Features

- Generate random codes using Python's `secrets` module.
- Reuse the existing code when the same URL is submitted again.
- Persist URL mappings in MySQL through SQLAlchemy.
- Shorten and decode URLs from a React interface.
- Explore the backend through FastAPI's interactive API documentation.

## Tech stack

| Layer | Technologies |
| --- | --- |
| Frontend | React 19, Vite 8, CSS |
| Backend | Python, FastAPI, Uvicorn, Pydantic |
| Database | MySQL, SQLAlchemy, PyMySQL |
| Containers | Docker, Docker Compose |

## Project structure

```text
URLShortner/
├── Backend/
│   ├── database.py          # Database connection and session setup
│   ├── main.py              # FastAPI application and CORS configuration
│   ├── models.py            # URL mapping model
│   ├── routes/
│   │   ├── urlshort.py      # Create or retrieve a short code
│   │   └── decodeurl.py     # Look up the original URL
│   ├── requirements.txt
│   └── Dockerfile
├── Frontend/
│   ├── src/App.jsx          # Shorten and decode interface
│   ├── package.json
│   └── Dockerfile
└── docker-compose.yml
```

## Run locally

### Prerequisites

- Python 3.12 (the version used by the backend Docker image).
- Node.js 22.12+ and npm, compatible with the frontend's Vite version.
- A running MySQL server.
- Git.

### 1. Clone the repository

```bash
git clone https://github.com/asgt2408/URLShortner.git
cd URLShortner
```

### 2. Configure MySQL

Create the database in your MySQL client:

```sql
CREATE DATABASE IF NOT EXISTS url;
```

Update `DATABASE_URL` in `Backend/database.py` with your local connection details. The connection format is:

```text
mysql+pymysql://<username>:<password>@<host>:3306/url
```

For a backend and MySQL server running directly on the same machine, use `localhost` as the host. The checked-in configuration uses `host.docker.internal`, intended for a container connecting to a database on its host.

The backend currently reads this connection string directly from the source file; setting a `DATABASE_URL` environment variable or creating a `.env` file alone will not change it. Keep your own credentials out of commits. SQLAlchemy creates the `url` table on backend startup, so the database user needs permission to create tables as well as read and write rows.

### 3. Start the backend

From the repository root:

```bash
cd Backend
python -m venv .venv
```

Activate the virtual environment:

```bash
# macOS / Linux
source .venv/bin/activate
```

```powershell
# Windows PowerShell
.venv\Scripts\Activate.ps1
```

Install dependencies and start the API from the `Backend` directory:

```bash
python -m pip install -r requirements.txt
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Interactive API documentation: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs).

### 4. Start the frontend

Open a second terminal and run from the repository root:

```bash
cd Frontend
npm ci
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). Use this hostname because the backend currently allows that exact origin through CORS.

### 5. Use the interface

1. Select **URLShortner**, enter a complete URL such as `https://example.com`, and press **Enter**.
2. Copy the code shown in the output.
3. Select **Decode URL**, paste the code, and press **Enter** to retrieve the original URL.

## API reference

Base URL: `http://127.0.0.1:8000`

| Method | Endpoint | Input | Success response |
| --- | --- | --- | --- |
| POST | `/URLShortner/url_shorten` | JSON body with `url_code` | `{"code":"aB3dE6gH"}` |
| GET | `/URLShortner/decode_url` | Query parameter `code` | `{"URL":"https://example.com"}` |

### Shorten a URL

```bash
curl -X POST http://127.0.0.1:8000/URLShortner/url_shorten \
  -H "Content-Type: application/json" \
  -d '{"url_code":"https://example.com"}'
```

Example response (the generated code varies):

```json
{"code":"aB3dE6gH"}
```

Submitting the same URL again returns its stored code.

### Decode a code

Replace the sample code with one returned by the shorten endpoint:

```bash
curl "http://127.0.0.1:8000/URLShortner/decode_url?code=aB3dE6gH"
```

Example response:

```json
{"URL":"https://example.com"}
```

An unknown code returns HTTP `409` with:

```json
{"detail":"URL not found"}
```

## Docker

Dockerfiles are included for both services. Before running Compose:

1. Change the build paths in `docker-compose.yml` from `./backend` and `./frontend` to `./Backend` and `./Frontend`. The directory names are case-sensitive on Linux.
2. Configure `Backend/database.py` for a reachable MySQL server. Compose does not include a MySQL service.
3. If MySQL runs on the host, ensure `host.docker.internal` resolves inside the backend container. Docker Desktop provides this name; Linux Docker Engine may require an `extra_hosts` mapping on the backend service:

   ```yaml
   extra_hosts:
     - "host.docker.internal:host-gateway"
   ```

Then run from the repository root:

```bash
docker compose up --build
```

The frontend is exposed at `http://localhost:5173` and the API at `http://127.0.0.1:8000`. The frontend container runs the Vite development server.

To stop the services:

```bash
docker compose down
```

## Frontend commands

Run these inside `Frontend/`:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Generate the production frontend in `dist/` |
| `npm run preview` | Preview a production build locally |
| `npm run lint` | Run ESLint |

## Current limitations

- The API accepts a plain string without validating that it is a valid URL.
- Generated codes are random, but collisions are not checked and the database does not enforce code uniqueness.
- The frontend API address and backend CORS origin are hardcoded. Update `Frontend/src/App.jsx` and `Backend/main.py` when changing hosts or ports.
- The project has no authentication, rate limiting, expiration, or click analytics.
- There is no automated test suite in the repository.
