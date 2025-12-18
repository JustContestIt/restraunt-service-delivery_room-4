# Development Scripts

Quick start scripts for running the Restaurant Service application.

## Available Scripts

### 🚀 Start Development Servers

**Windows PowerShell:**
```powershell
.\start-dev.ps1
```

**Windows CMD:**
```cmd
start-dev.bat
```

This will start both:
- Backend server on http://localhost:8000
- Frontend server on http://localhost:5173

### 🛑 Stop Development Servers

**Windows PowerShell:**
```powershell
.\stop-dev.ps1
```

This will stop all running backend and frontend processes.

## First Time Setup

Before running the scripts for the first time, make sure to:

### 1. Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python -c "import asyncio; from database.db import init_db; asyncio.run(init_db())"
python database/seed_data.py
```

### 2. Frontend Setup

```bash
cd frontend
npm install
```

## Manual Start (Alternative)

If the scripts don't work, you can start servers manually:

**Terminal 1 - Backend:**
```bash
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## Troubleshooting

### PowerShell Execution Policy Error

If you get an error about execution policy, run:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Port Already in Use

If port 8000 or 5173 is already in use:

**Check what's using the port:**
```powershell
# Check port 8000
netstat -ano | findstr :8000

# Check port 5173
netstat -ano | findstr :5173
```

**Kill the process:**
```powershell
# Replace <PID> with the process ID from above
taskkill /PID <PID> /F
```

### Backend Not Starting

Make sure:
- Python virtual environment is activated
- All dependencies are installed: `pip install -r backend/requirements.txt`
- Database is initialized

### Frontend Not Starting

Make sure:
- Node.js is installed (v18+)
- Dependencies are installed: `npm install` in frontend folder
- No other Vite server is running

## URLs

After starting the servers:

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8000 |
| API Documentation | http://localhost:8000/docs |
| Alternative API Docs | http://localhost:8000/redoc |
| Health Check | http://localhost:8000/health |

## Development Workflow

1. Run `start-dev.ps1` or `start-dev.bat`
2. Wait for both servers to start (backend ~3 seconds, frontend ~5 seconds)
3. Open http://localhost:5173 in your browser
4. Make changes to code - both servers will auto-reload
5. When done, run `stop-dev.ps1` or close the terminal windows

## Notes

- Backend uses auto-reload (changes to Python files will restart the server)
- Frontend uses HMR (Hot Module Replacement - instant updates without full reload)
- Frontend proxies API requests to backend automatically
- CORS is configured for development origins
