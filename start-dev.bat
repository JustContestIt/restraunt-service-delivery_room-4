@echo off
REM Development Server Startup Script (Windows CMD)
REM This script starts both backend and frontend servers

echo.
echo ========================================
echo   Restaurant Service Dev Servers
echo ========================================
echo.

echo Starting Backend Server...
start "Backend Server" cmd /k "uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000"

timeout /t 3 /nobreak >nul

echo Starting Frontend Server...
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo   Servers Started!
echo ========================================
echo.
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:5173
echo API Docs: http://localhost:8000/docs
echo.
echo Press any key to exit...
pause >nul
