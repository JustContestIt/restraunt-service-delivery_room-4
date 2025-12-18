#!/bin/bash

# Initialize and seed database
echo "Initializing database..."
python -m backend.database.seed_data

# Start the server
echo "Starting server..."
uvicorn backend.main:app --host 0.0.0.0 --port ${PORT:-8000}
