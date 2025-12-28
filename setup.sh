#!/bin/bash

echo "🚀 Setting up Spur Chat App..."

echo "📦 Installing backend dependencies..."
cd backend && npm install && cd ..

echo "📦 Installing frontend dependencies..."
cd frontend && npm install && cd ..

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Set up your PostgreSQL database"
echo "2. Copy backend/.env.example to backend/.env and fill in your values"
echo "3. Copy frontend/.env.example to frontend/.env"
echo "4. Run 'cd backend && npm run migrate' to set up the database"
echo "5. Start the backend: 'cd backend && npm run dev'"
echo "6. Start the frontend: 'cd frontend && npm run dev'"

