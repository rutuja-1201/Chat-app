# Quick Start Guide

## Prerequisites Check

- ✅ Node.js 18+ installed
- ✅ PostgreSQL installed and running
- ✅ OpenAI API key

## 5-Minute Setup

### 1. Install Dependencies

```bash
./setup.sh
```

Or manually:
```bash
cd backend && npm install
cd ../frontend && npm install
```

### 2. Create Database

```bash
createdb chat_app
```

### 3. Environment Variables

**Backend** - Create `backend/.env`:
```env
PORT=3001
DATABASE_URL=postgresql://localhost:5432/chat_app

# Use Groq (Free & Fast) - Get key from https://console.groq.com
LLM_PROVIDER=groq
GROQ_API_KEY=gsk-your-key-here
GROQ_MODEL=llama-3.1-8b-instant

NODE_ENV=development
```

**📝 Need a free API key?** See [GET_FREE_API_KEY.md](./GET_FREE_API_KEY.md)

**Frontend** - Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:3001
```

### 4. Run Migrations

```bash
cd backend
npm run migrate
```

### 5. Start Servers

**Terminal 1:**
```bash
cd backend
npm run dev
```

**Terminal 2:**
```bash
cd frontend
npm run dev
```

### 6. Open Browser

Visit `http://localhost:5173`

## Testing

Try asking:
- "What's your return policy?"
- "Do you ship to USA?"
- "What are your support hours?"

## Troubleshooting

**Database connection error:**
- Check PostgreSQL is running: `pg_isready`
- Verify DATABASE_URL in backend/.env

**OpenAI API error:**
- Verify OPENAI_API_KEY is set correctly
- Check you have API credits

**Frontend can't connect:**
- Verify backend is running on port 3001
- Check VITE_API_URL in frontend/.env

