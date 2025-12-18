# Configuration Guide

This document provides detailed information about configuring the Restaurant Backend API for different environments.

## Table of Contents

- [Environment Variables](#environment-variables)
- [Database Configuration](#database-configuration)
- [CORS Configuration](#cors-configuration)
- [Logging Configuration](#logging-configuration)
- [Development Setup](#development-setup)
- [Production Setup](#production-setup)

## Environment Variables

The application can be configured using environment variables. Create a `.env` file in the project root for local development.

### Available Variables

#### DATABASE_URL
- **Description**: Path to the SQLite database file
- **Type**: String (file path)
- **Default**: `restaurants.db`
- **Example**: `DATABASE_URL=./data/restaurants.db`

#### CORS_ORIGINS
- **Description**: Comma-separated list of allowed origins for CORS
- **Type**: String (comma-separated URLs)
- **Default**: `http://localhost:3000,http://localhost:5173,http://localhost:8080`
- **Example**: `CORS_ORIGINS=https://myapp.com,https://www.myapp.com`

#### LOG_LEVEL
- **Description**: Logging verbosity level
- **Type**: String (DEBUG, INFO, WARNING, ERROR, CRITICAL)
- **Default**: `INFO`
- **Example**: `LOG_LEVEL=DEBUG`

#### HOST
- **Description**: Host address for the server to bind to
- **Type**: String (IP address or hostname)
- **Default**: `0.0.0.0` (all interfaces)
- **Example**: `HOST=127.0.0.1`

#### PORT
- **Description**: Port number for the server
- **Type**: Integer
- **Default**: `8000`
- **Example**: `PORT=8080`

### Example .env File

```env
# Database
DATABASE_URL=restaurants.db

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:5173

# Logging
LOG_LEVEL=INFO

# Server
HOST=0.0.0.0
PORT=8000
```

### Loading Environment Variables

The application automatically loads environment variables from the system. To use a `.env` file, install `python-dotenv`:

```bash
pip install python-dotenv
```

Then add to `backend/main.py`:

```python
from dotenv import load_dotenv
load_dotenv()
```

## Database Configuration

### SQLite (Default)

The application uses SQLite by default, which is suitable for development and small-scale deployments.

**Advantages:**
- No separate database server required
- Simple setup and configuration
- File-based storage

**Limitations:**
- Not suitable for high-concurrency scenarios
- Limited to single-server deployments
- No built-in replication

### Database Initialization

Initialize the database schema:

```bash
python -c "import asyncio; from backend.database.db import init_db; asyncio.run(init_db())"
```

### Seeding Sample Data

Populate the database with sample restaurants and menu items:

```bash
python backend/database/seed_data.py
```

### Database Location

By default, the database file is created in the project root as `restaurants.db`. To change the location:

```bash
# Set environment variable
export DATABASE_URL=/path/to/your/database.db

# Or in .env file
DATABASE_URL=/path/to/your/database.db
```

### Database Backup

Since SQLite is file-based, backing up is simple:

```bash
# Copy the database file
cp restaurants.db restaurants_backup.db

# Or use SQLite backup command
sqlite3 restaurants.db ".backup restaurants_backup.db"
```

### Migrating to PostgreSQL (Production)

For production deployments, consider PostgreSQL:

1. Install dependencies:
```bash
pip install asyncpg sqlalchemy
```

2. Update database connection in `backend/database/db.py`:
```python
import asyncpg

async def get_db_connection():
    return await asyncpg.connect(
        host='localhost',
        port=5432,
        user='dbuser',
        password='dbpass',
        database='restaurants'
    )
```

3. Update environment variables:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/restaurants
```

## CORS Configuration

Cross-Origin Resource Sharing (CORS) allows your API to be accessed from web applications running on different domains.

### Development Configuration

The default configuration allows requests from common development servers:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # React
        "http://localhost:5173",  # Vite
        "http://localhost:8080",  # Vue
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Production Configuration

For production, specify exact origins:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://myapp.com",
        "https://www.myapp.com",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Content-Type", "Authorization"],
)
```

### CORS Options

| Option | Description | Development | Production |
|--------|-------------|-------------|------------|
| `allow_origins` | Allowed origin URLs | `["*"]` or specific | Specific origins only |
| `allow_credentials` | Allow cookies/auth | `True` | `True` if needed |
| `allow_methods` | Allowed HTTP methods | `["*"]` | Specific methods |
| `allow_headers` | Allowed headers | `["*"]` | Specific headers |
| `max_age` | Preflight cache time | Not set | `3600` (1 hour) |

### Testing CORS

Test CORS configuration:

```bash
# Test preflight request
curl -X OPTIONS http://localhost:8000/api/restaurants \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: GET" \
  -v

# Test actual request
curl http://localhost:8000/api/restaurants \
  -H "Origin: http://localhost:3000" \
  -v
```

## Logging Configuration

### Log Levels

| Level | When to Use | Example |
|-------|-------------|---------|
| DEBUG | Detailed diagnostic information | Variable values, function calls |
| INFO | General informational messages | Request received, operation completed |
| WARNING | Warning messages for unexpected events | Deprecated feature used |
| ERROR | Error messages for failures | Database connection failed |
| CRITICAL | Critical errors causing shutdown | System out of memory |

### Setting Log Level

**Via Environment Variable:**
```bash
export LOG_LEVEL=DEBUG
```

**Via Code (backend/main.py):**
```python
import logging
import os

log_level = os.getenv('LOG_LEVEL', 'INFO')
logging.basicConfig(
    level=getattr(logging, log_level),
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
```

### Log Format

The default log format includes:
- Timestamp
- Logger name
- Log level
- Message

Example output:
```
2024-01-15 10:30:45,123 - backend.main - INFO - Request: GET /api/restaurants
2024-01-15 10:30:45,156 - backend.main - INFO - Response: GET /api/restaurants - Status: 200
```

### Custom Log Format

Customize the log format:

```python
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s | %(levelname)-8s | %(name)s | %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)
```

### Logging to File

Configure file logging:

```python
import logging
from logging.handlers import RotatingFileHandler

# Create logs directory
os.makedirs('logs', exist_ok=True)

# Configure file handler
file_handler = RotatingFileHandler(
    'logs/app.log',
    maxBytes=10485760,  # 10MB
    backupCount=5
)
file_handler.setFormatter(
    logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
)

# Add handler to logger
logger = logging.getLogger()
logger.addHandler(file_handler)
```

### Request Logging

The application includes middleware for logging all requests:

```python
@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info(f"Request: {request.method} {request.url.path}")
    response = await call_next(request)
    logger.info(f"Response: {request.method} {request.url.path} - Status: {response.status_code}")
    return response
```

## Development Setup

### Quick Start

1. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r backend/requirements.txt
```

3. Create `.env` file:
```env
DATABASE_URL=restaurants.db
LOG_LEVEL=DEBUG
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

4. Initialize database:
```bash
python -c "import asyncio; from backend.database.db import init_db; asyncio.run(init_db())"
python backend/database/seed_data.py
```

5. Run development server:
```bash
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

### Development Tools

**Auto-reload**: The `--reload` flag automatically restarts the server when code changes.

**Interactive API Docs**: Access at `http://localhost:8000/docs`

**Alternative Docs**: Access at `http://localhost:8000/redoc`

## Production Setup

### Prerequisites

- Python 3.10+
- Production ASGI server (Gunicorn with Uvicorn workers)
- Reverse proxy (nginx, Apache)
- SSL/TLS certificates

### Production Checklist

- [ ] Set `LOG_LEVEL=WARNING` or `ERROR`
- [ ] Configure specific CORS origins (no wildcards)
- [ ] Use environment variables for sensitive data
- [ ] Set up database backups
- [ ] Configure log rotation
- [ ] Implement rate limiting
- [ ] Set up monitoring and alerting
- [ ] Use HTTPS with valid SSL certificates
- [ ] Configure firewall rules
- [ ] Set up health check monitoring

### Running with Gunicorn

Install Gunicorn:
```bash
pip install gunicorn
```

Run with multiple workers:
```bash
gunicorn backend.main:app \
  --workers 4 \
  --worker-class uvicorn.workers.UvicornWorker \
  --bind 0.0.0.0:8000 \
  --access-logfile logs/access.log \
  --error-logfile logs/error.log \
  --log-level warning
```

### Systemd Service

Create `/etc/systemd/system/restaurant-api.service`:

```ini
[Unit]
Description=Restaurant Backend API
After=network.target

[Service]
Type=notify
User=www-data
Group=www-data
WorkingDirectory=/var/www/restaurant-api
Environment="PATH=/var/www/restaurant-api/venv/bin"
ExecStart=/var/www/restaurant-api/venv/bin/gunicorn backend.main:app \
  --workers 4 \
  --worker-class uvicorn.workers.UvicornWorker \
  --bind 0.0.0.0:8000

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable restaurant-api
sudo systemctl start restaurant-api
sudo systemctl status restaurant-api
```

### Nginx Reverse Proxy

Configure nginx (`/etc/nginx/sites-available/restaurant-api`):

```nginx
server {
    listen 80;
    server_name api.example.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable and reload:
```bash
sudo ln -s /etc/nginx/sites-available/restaurant-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### SSL/TLS with Let's Encrypt

Install Certbot:
```bash
sudo apt install certbot python3-certbot-nginx
```

Obtain certificate:
```bash
sudo certbot --nginx -d api.example.com
```

### Monitoring

**Health Check Endpoint**: `GET /health`

**Monitoring Tools**:
- Prometheus + Grafana
- Datadog
- New Relic
- Sentry (for error tracking)

**Example Health Check Script**:
```bash
#!/bin/bash
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/health)
if [ $response -eq 200 ]; then
    echo "API is healthy"
    exit 0
else
    echo "API is down"
    exit 1
fi
```

## Security Considerations

### API Security Best Practices

1. **Rate Limiting**: Implement rate limiting to prevent abuse
2. **Authentication**: Add authentication for sensitive endpoints
3. **Input Validation**: Pydantic models provide validation
4. **SQL Injection**: Use parameterized queries (already implemented)
5. **CORS**: Configure specific origins in production
6. **HTTPS**: Always use HTTPS in production
7. **Security Headers**: Add security headers via middleware

### Adding Rate Limiting

Install slowapi:
```bash
pip install slowapi
```

Configure in `backend/main.py`:
```python
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

@app.get("/api/restaurants")
@limiter.limit("100/minute")
async def get_restaurants(request: Request, ...):
    ...
```

## Troubleshooting

### Common Issues

**Issue**: Port already in use
```bash
# Find process using port 8000
lsof -i :8000  # macOS/Linux
netstat -ano | findstr :8000  # Windows

# Kill the process or use a different port
uvicorn backend.main:app --port 8001
```

**Issue**: Database locked
```
Solution: Ensure only one process accesses the database at a time.
For production, migrate to PostgreSQL.
```

**Issue**: CORS errors
```
Solution: Verify the frontend origin is in the allow_origins list.
Check browser console for specific CORS error messages.
```

**Issue**: Module import errors
```
Solution: Ensure you're in the project root and virtual environment is activated.
Verify PYTHONPATH includes the project root.
```

## Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Pydantic Documentation](https://docs.pydantic.dev/)
- [aiosqlite Documentation](https://aiosqlite.omnilib.dev/)
- [Uvicorn Documentation](https://www.uvicorn.org/)
- [Gunicorn Documentation](https://docs.gunicorn.org/)
