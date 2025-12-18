# Restaurant Service Delivery

Full-stack restaurant selection and food delivery platform with React frontend and FastAPI backend.

## Project Structure

```
project/
├── frontend/          # React + TypeScript + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/  # API client and data adapters
│   │   ├── types/
│   │   └── App.tsx
│   ├── package.json
│   └── vite.config.ts
│
├── backend/           # FastAPI + Python backend
│   ├── models/        # Pydantic schemas
│   ├── database/      # Database functions
│   ├── tests/         # Unit and property tests
│   ├── main.py        # FastAPI application
│   └── README.md      # Backend documentation
│
└── README.md          # This file
```

## Features

### Frontend
- 🎨 Modern React UI with TypeScript
- 🎯 Restaurant browsing and filtering by cuisine
- 🍕 Menu viewing and cart management
- 📱 Responsive design with Tailwind CSS
- ⚡ Fast development with Vite

### Backend
- 🚀 FastAPI REST API
- 🗄️ SQLite database with async operations
- ✅ Pydantic data validation
- 📝 Comprehensive API documentation
- 🧪 Unit and property-based tests

## Quick Start

### Prerequisites

- **Node.js** 18+ (for frontend)
- **Python** 3.10+ (for backend)
- **npm** or **yarn** (for frontend)
- **pip** (for backend)

### 1. Start Backend

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Initialize database
python -c "import asyncio; from database.db import init_db; asyncio.run(init_db())"

# Seed database with sample data (optional)
python database/seed_data.py

# Start backend server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at: http://localhost:8000
- API Docs: http://localhost:8000/docs
- Alternative Docs: http://localhost:8000/redoc

### 2. Start Frontend

```bash
# Navigate to frontend directory (in a new terminal)
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will be available at: http://localhost:5173

## API Integration

The frontend connects to the backend API through:

1. **API Client** (`frontend/src/services/api.ts`)
   - Handles all HTTP requests to backend
   - Type-safe API calls

2. **Data Adapter** (`frontend/src/services/dataAdapter.ts`)
   - Converts backend data format to frontend types
   - Handles data transformation

3. **React Hooks** (`frontend/src/hooks/useRestaurants.ts`)
   - `useRestaurants()` - Fetch and filter restaurants
   - `useRestaurantMenu()` - Fetch restaurant menu

4. **Vite Proxy** (`frontend/vite.config.ts`)
   - Proxies `/api` requests to backend
   - Avoids CORS issues in development

## Environment Variables

### Frontend (.env)

```env
VITE_API_URL=http://localhost:8000
VITE_DEV_MODE=true
```

### Backend

```env
DATABASE_URL=restaurants.db
LOG_LEVEL=INFO
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

## API Endpoints

### Restaurants

- `GET /api/restaurants` - List all restaurants
  - Query params: `cuisine`, `max_price`
- `GET /api/restaurants/{id}` - Get restaurant details
- `GET /api/restaurants/{id}/menu` - Get restaurant menu

### Cuisines

- `GET /api/cuisines` - List all available cuisines

### Health

- `GET /health` - API health check

See `backend/API_EXAMPLES.md` for detailed API documentation.

## Development

### Frontend Development

```bash
cd frontend

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Backend Development

```bash
cd backend

# Run tests
pytest tests/

# Run with auto-reload
uvicorn main:app --reload

# Check code style
black . --check
mypy .
```

## Testing

### Backend Tests

```bash
cd backend

# Run all tests
pytest

# Run with coverage
pytest --cov=. --cov-report=html

# Run specific test file
pytest tests/test_database.py
```

### Frontend Tests

```bash
cd frontend

# Run tests (when configured)
npm test
```

## Deployment

### Backend Deployment

See `backend/CONFIGURATION.md` for detailed deployment instructions.

Quick production setup:

```bash
# Install Gunicorn
pip install gunicorn

# Run with Gunicorn
gunicorn backend.main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### Frontend Deployment

```bash
cd frontend

# Build for production
npm run build

# Output will be in frontend/dist/
# Deploy dist/ folder to your hosting service (Vercel, Netlify, etc.)
```

## Project Documentation

- **Backend API**: `backend/README.md`
- **API Examples**: `backend/API_EXAMPLES.md`
- **Configuration Guide**: `backend/CONFIGURATION.md`
- **Requirements**: `backend/specs/restaurant-backend/requirements.md`
- **Design**: `backend/specs/restaurant-backend/design.md`

## Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Hooks

### Backend
- FastAPI
- Python 3.10+
- SQLite + aiosqlite
- Pydantic v2
- pytest + hypothesis

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

[Add your license here]

## Support

For issues and questions:
- Create an issue in the repository
- Check the documentation in `backend/` folder
