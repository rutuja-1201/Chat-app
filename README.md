# Spur Chat App - AI Live Chat Agent

A full-stack AI-powered customer support chat application built for the Spur take-home assignment.

## 🚀 Features

- **Real-time Chat Interface**: Clean, modern chat UI with auto-scrolling and typing indicators
- **AI-Powered Responses**: Integrated with OpenAI GPT for intelligent customer support
- **Conversation Persistence**: All messages are saved to PostgreSQL database
- **Session Management**: Conversations persist across page reloads
- **Error Handling**: Robust error handling for API failures, timeouts, and edge cases
- **Input Validation**: Message length limits and validation on both client and server
- **FAQ Knowledge**: Pre-configured with shipping, return, and support hour information

## 🛠️ Tech Stack

- **Backend**: Node.js + TypeScript + Express
- **Frontend**: React + TypeScript + Vite
- **Database**: PostgreSQL
- **LLM**: OpenAI GPT-3.5-turbo or Groq (configurable)

## 📋 Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (local or cloud)
- OpenAI API key

## 🏃 Local Setup

### 1. Clone and Install Dependencies

```bash
# Install root dependencies (if using workspaces)
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Database Setup

Create a PostgreSQL database:

```bash
createdb chat_app
```

Or using psql:

```sql
CREATE DATABASE chat_app;
```

### 3. Environment Variables

**Backend** (`backend/.env`):

```env
PORT=3001
DATABASE_URL=postgresql://user:password@localhost:5432/chat_app

# LLM Configuration (Free Options Available!)
# Option 1: Groq (Recommended - Free & Fast)
LLM_PROVIDER=groq
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.1-8b-instant

# Option 2: OpenAI (if you have credits)
# LLM_PROVIDER=openai
# OPENAI_API_KEY=your_openai_api_key_here
# OPENAI_MODEL=gpt-3.5-turbo

NODE_ENV=development
```

**📝 Get a FREE Groq API Key:** See [GET_FREE_API_KEY.md](./GET_FREE_API_KEY.md) for step-by-step instructions!

**Frontend** (`frontend/.env`):

```env
VITE_API_URL=http://localhost:3001
```

### 4. Run Database Migrations

```bash
cd backend
npm run migrate
```

This will create the `conversations` and `messages` tables.

### 5. Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:5173` and the backend at `http://localhost:3001`.

## 📁 Project Structure

```
Chat-App/
├── backend/
│   ├── src/
│   │   ├── db/
│   │   │   ├── connection.ts      # Database connection pool
│   │   │   ├── schema.sql         # Database schema
│   │   │   └── migrate.ts         # Migration script
│   │   ├── services/
│   │   │   ├── chatService.ts     # Chat business logic
│   │   │   └── llmService.ts      # OpenAI integration
│   │   ├── routes/
│   │   │   └── chat.ts            # Chat API routes
│   │   ├── middleware/
│   │   │   ├── errorHandler.ts    # Global error handler
│   │   │   └── validateInput.ts   # Input validation
│   │   └── index.ts               # Express server
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── ChatWidget.tsx     # Main chat component
│   │   ├── App.tsx                # Main app component
│   │   ├── App.css                # App styles
│   │   ├── index.css              # Global styles
│   │   └── main.tsx               # Entry point
│   ├── package.json
│   └── vite.config.ts
├── README.md
└── package.json
```

## 🏗️ Architecture Overview

### Backend Architecture

The backend follows a layered architecture:

1. **Routes Layer** (`routes/`): HTTP endpoints, request validation
2. **Services Layer** (`services/`): Business logic and external API calls
3. **Database Layer** (`db/`): Database connection and schema
4. **Middleware** (`middleware/`): Error handling and input validation

**Key Design Decisions:**

- **Separation of Concerns**: Clear separation between routes, services, and data access
- **Error Handling**: Centralized error handler with proper HTTP status codes
- **Type Safety**: Full TypeScript coverage with Zod for runtime validation
- **LLM Abstraction**: `llmService.ts` encapsulates OpenAI calls, making it easy to swap providers
- **Session Management**: UUID-based sessions stored in localStorage and database

### Frontend Architecture

- **Component-Based**: React with reusable components
- **State Management**: Local component state with React hooks
- **API Integration**: Direct fetch calls with error handling
- **UX Features**: Typing indicators, auto-scroll, disabled states, welcome suggestions

### Database Schema

```sql
conversations (
  id UUID PRIMARY KEY,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

messages (
  id UUID PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id),
  sender VARCHAR(10) CHECK (sender IN ('user', 'ai')),
  text TEXT,
  created_at TIMESTAMP
)
```

### LLM Integration

**Provider**: OpenAI GPT-3.5-turbo (configurable via `OPENAI_MODEL`)

**Prompting Strategy**:
- System prompt includes store policies (shipping, returns, support hours)
- Conversation history is included for context
- Max tokens: 500 (cost control)
- Temperature: 0.7 (balanced creativity/consistency)

**Error Handling**:
- API key validation
- Rate limit handling
- Timeout handling
- Graceful degradation with user-friendly error messages

## 🧪 Testing the Application

1. **Basic Chat Flow**:
   - Open the app, type a message, verify AI response
   - Check that messages persist after page reload

2. **Error Cases**:
   - Send empty message (should be blocked)
   - Send very long message (should be truncated/validated)
   - Disconnect network (should show error message)

3. **FAQ Testing**:
   - Ask about return policy
   - Ask about shipping
   - Ask about support hours

## 🔒 Security & Best Practices

- ✅ Environment variables for secrets (no hardcoded API keys)
- ✅ Input validation on both client and server
- ✅ SQL injection protection (parameterized queries)
- ✅ CORS configuration
- ✅ Request size limits
- ✅ Error messages don't leak sensitive information

## 📝 Trade-offs & Future Improvements

### Current Trade-offs

1. **No Authentication**: Sessions are UUID-based, no user accounts (per requirements)
2. **Simple Error Messages**: Generic error messages to avoid exposing internals
3. **No Rate Limiting**: Could add per-session rate limiting for production
4. **Basic UI**: Functional but could be enhanced with animations, themes, etc.

### If I Had More Time...

1. **Enhanced UX**:
   - Message timestamps with relative time ("2 minutes ago")
   - Message reactions/feedback
   - File upload support
   - Markdown rendering in messages

2. **Backend Improvements**:
   - Redis caching for frequently asked questions
   - Rate limiting per session
   - WebSocket support for real-time updates
   - Analytics/monitoring integration

3. **LLM Enhancements**:
   - Streaming responses for better UX
   - Support for multiple LLM providers (fallback)
   - Fine-tuned prompts based on conversation context
   - Token usage tracking and cost monitoring

4. **Database Optimizations**:
   - Full-text search for message history
   - Conversation summaries
   - Message indexing for faster queries

5. **Testing**:
   - Unit tests for services
   - Integration tests for API endpoints
   - E2E tests for chat flow

## 📄 License

This project is built for the Spur take-home assignment.

