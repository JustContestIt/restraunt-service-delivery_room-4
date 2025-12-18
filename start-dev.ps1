# Development Server Startup Script
# This script starts both backend and frontend servers

Write-Host "🚀 Starting Restaurant Service Development Servers..." -ForegroundColor Green
Write-Host ""

# Start Backend
Write-Host "📦 Starting Backend Server..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; Write-Host '🐍 Backend Server' -ForegroundColor Yellow; uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000"

# Wait a bit for backend to start
Start-Sleep -Seconds 3

# Start Frontend
Write-Host "⚛️  Starting Frontend Server..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; Write-Host '⚛️  Frontend Server' -ForegroundColor Blue; npm run dev"

Write-Host ""
Write-Host "✅ Both servers are starting!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 Backend:  http://localhost:8000" -ForegroundColor Yellow
Write-Host "📍 Frontend: http://localhost:5173" -ForegroundColor Blue
Write-Host "📚 API Docs: http://localhost:8000/docs" -ForegroundColor Magenta
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
