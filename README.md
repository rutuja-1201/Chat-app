# Spur Chat App - AI Live Chat Agent

A full-stack AI-powered customer support chat application built for the Spur take-home assignment.

## 🚀 Features

- **Real-time Chat Interface**: Clean, modern chat UI with auto-scrolling and typing indicators
- **AI-Powered Responses**: Integrated with OpenAI/Groq for intelligent customer support
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
- LLM API key (OpenAI or Groq)

## 🏃 How to Run Locally (Step by Step)

### Step 1: Clone and Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd Chat-App

# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 2: Set Up Database

Create a PostgreSQL database:

```bash
# Using createdb command
createdb chat_app
```

Or using psql:

```sql
CREATE DATABASE chat_app;
```

### Step 3: Run Database Migrations

```bash
cd backend
npm run migrate
```

This will create the following tables:
- `conversations` - Stores conversation sessions
- `messages` - Stores all user and AI messages

The migration script reads `backend/src/db/schema.sql` and executes it against your database.

### Step 4: Configure Environment Variables

**Backend** - Create `backend/.env` file:

```env
PORT=3001
DATABASE_URL=postgresql://user:password@localhost:5432/chat_app

# LLM Configuration
# Option 1: Groq (Recommended - Free & Fast)
LLM_PROVIDER=groq
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.1-8b-instant

# Option 2: OpenAI
# LLM_PROVIDER=openai
# OPENAI_API_KEY=your_openai_api_key_here
# OPENAI_MODEL=gpt-3.5-turbo

NODE_ENV=development
```

**Frontend** - Create `frontend/.env` file:

```env
VITE_API_URL=http://localhost:3001
```

**Getting API Keys:**
- **Groq (Free)**: See [GET_FREE_API_KEY.md](./GET_FREE_API_KEY.md) for step-by-step instructions
- **OpenAI**: Get your API key from https://platform.openai.com/api-keys

### Step 5: Start the Application

**Terminal 1 - Start Backend:**
```bash
cd backend
npm run dev
```

The backend will start on `http://localhost:3001`

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:5173`

Open your browser and navigate to `http://localhost:5173` to start chatting!

## 🏗️ Architecture Overview

### Backend Structure

The backend follows a **layered architecture** with clear separation of concerns:

```
backend/src/
├── index.ts              # Express server setup & entry point
├── routes/
│   └── chat.ts          # HTTP endpoints (POST /chat/message, GET /chat/history/:sessionId)
├── services/
│   ├── chatService.ts   # Business logic (conversation management, message persistence)
│   └── llmService.ts    # LLM integration (OpenAI/Groq API calls)
├── middleware/
│   ├── errorHandler.ts  # Global error handler
│   └── validateInput.ts # Input validation middleware
└── db/
    ├── connection.ts    # PostgreSQL connection pool
    ├── schema.sql       # Database schema definition
    └── migrate.ts       # Migration script
```

**Layers:**

1. **Routes Layer** (`routes/`): 
   - Handles HTTP requests/responses
   - Request validation using Zod schemas
   - Delegates to services for business logic

2. **Services Layer** (`services/`):
   - `chatService.ts`: Manages conversations, saves messages, retrieves history
   - `llmService.ts`: Encapsulates LLM API calls, handles errors, formats prompts

3. **Database Layer** (`db/`):
   - Connection pooling for PostgreSQL
   - Schema definitions and migrations
   - Parameterized queries for SQL injection protection

4. **Middleware** (`middleware/`):
   - Centralized error handling
   - Input validation and sanitization

### Design Decisions

1. **LLM Provider Abstraction**: The `llmService.ts` uses a factory pattern to support multiple providers (OpenAI, Groq). This makes it easy to swap providers or add fallbacks without changing business logic.

2. **Session Management**: UUID-based sessions stored in both localStorage (client) and database (server). This allows conversation persistence without requiring authentication.

3. **Conversation History**: Full conversation history is sent to the LLM on each request for context-aware responses. This is stored efficiently in PostgreSQL with proper indexing.

4. **Error Handling Strategy**: 
   - LLM API errors are caught and transformed into user-friendly messages
   - Different error types (401, 429, 503, timeouts) are handled specifically
   - Errors never crash the server - always return proper HTTP responses

5. **Type Safety**: Full TypeScript coverage with Zod for runtime validation ensures type safety at the API boundary.

6. **Database Schema**: Simple two-table design (conversations + messages) with foreign key constraints and indexes for performance.

### Frontend Structure

- **Component-Based**: Single main component (`ChatWidget.tsx`) handles all chat functionality
- **State Management**: React hooks (`useState`, `useEffect`) for local state
- **API Integration**: Direct `fetch` calls with error handling
- **UX Features**: Typing indicators, auto-scroll, disabled states, welcome suggestions

## 🤖 LLM Integration

### Provider

The application supports two LLM providers:

1. **Groq** (Default, Recommended)
   - Free tier available
   - Fast inference with Llama models
   - Model: `llama-3.1-8b-instant`

2. **OpenAI**
   - GPT-3.5-turbo or GPT-4
   - Requires API credits
   - Model: `gpt-3.5-turbo` (configurable)

Provider is configured via `LLM_PROVIDER` environment variable.

### Prompting Strategy

**System Prompt:**
The system prompt includes comprehensive store information:
- Shipping policy (worldwide shipping, rates, free shipping threshold)
- Return/refund policy (30-day returns, refund processing time)
- Support hours (business hours, contact email)

**Conversation Context:**
- Full conversation history is included in each LLM request
- Messages are formatted as `{ role: 'user' | 'assistant', content: string }`
- History helps the AI maintain context across the conversation

**Configuration:**
- **Max Tokens**: 500 (cost control, ensures concise responses)
- **Temperature**: 0.7 (balanced creativity and consistency)
- **Model Selection**: Configurable via environment variables

**Error Handling:**
- Invalid API key (401) → User-friendly error message
- Rate limit exceeded (429) → Suggests retry
- Service unavailable (503) → Temporary error message
- Timeouts → Request timeout error
- All errors are caught and displayed to the user without crashing

## 📝 Trade-offs & "If I Had More Time..."

### Current Trade-offs

1. **No Authentication**: Sessions are UUID-based stored in localStorage. Simple but not secure for production. Per requirements, no auth was needed.

2. **No Rate Limiting**: Could add per-session rate limiting to prevent abuse. Currently relies on LLM provider rate limits.

3. **Synchronous LLM Calls**: Responses are blocking. Streaming would provide better UX but adds complexity.

4. **Simple Error Messages**: Generic error messages to avoid exposing internal details. Could be more specific for debugging.

5. **Basic UI**: Functional but could be enhanced with animations, themes, better mobile responsiveness.

6. **No Caching**: Every request hits the LLM. Could cache common FAQ responses in Redis.

### If I Had More Time...

1. **Enhanced UX**:
   - Streaming LLM responses for real-time typing effect
   - Message timestamps with relative time ("2 minutes ago")
   - Message reactions/feedback (thumbs up/down)
   - File upload support for images/documents
   - Markdown rendering in messages
   - Dark mode theme
   - Better mobile responsiveness

2. **Backend Improvements**:
   - Redis caching for frequently asked questions
   - Rate limiting per session (sliding window)
   - WebSocket support for real-time bidirectional communication
   - Analytics/monitoring integration (Sentry, DataDog)
   - Request logging and metrics
   - Health check endpoints with detailed status

3. **LLM Enhancements**:
   - Support for multiple LLM providers with automatic fallback
   - Fine-tuned prompts based on conversation context
   - Token usage tracking and cost monitoring
   - Response quality scoring
   - A/B testing different prompts/models

4. **Database Optimizations**:
   - Full-text search for message history
   - Conversation summaries for long threads
   - Message indexing for faster queries
   - Archival strategy for old conversations
   - Database connection pooling optimization

5. **Testing**:
   - Unit tests for services (chatService, llmService)
   - Integration tests for API endpoints
   - E2E tests for complete chat flow
   - Load testing for concurrent users
   - LLM response quality tests

6. **Production Readiness**:
   - Docker containerization
   - CI/CD pipeline
   - Environment-specific configurations
   - Database backup strategy
   - Monitoring and alerting

## 🧪 Testing the Application

1. **Basic Chat Flow**:
   - Open the app, type a message, verify AI response
   - Check that messages persist after page reload
   - Test conversation history loading

2. **Error Cases**:
   - Send empty message (should be blocked)
   - Send very long message (should be validated/truncated)
   - Disconnect network (should show error message)
   - Test with invalid API key

3. **FAQ Testing**:
   - Ask about return policy
   - Ask about shipping
   - Ask about support hours
   - Verify AI responds with correct information

## 🔒 Security & Best Practices

- ✅ Environment variables for secrets (no hardcoded API keys)
- ✅ Input validation on both client and server
- ✅ SQL injection protection (parameterized queries)
- ✅ CORS configuration
- ✅ Request size limits (1MB)
- ✅ Error messages don't leak sensitive information
- ✅ TypeScript for type safety
- ✅ Zod for runtime validation

## 📁 Project Structure

```
Chat-App/
├── backend/
│   ├── src/
│   │   ├── db/
│   │   │   ├── connection.ts
│   │   │   ├── schema.sql
│   │   │   └── migrate.ts
│   │   ├── services/
│   │   │   ├── chatService.ts
│   │   │   └── llmService.ts
│   │   ├── routes/
│   │   │   └── chat.ts
│   │   ├── middleware/
│   │   │   ├── errorHandler.ts
│   │   │   └── validateInput.ts
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── ChatWidget.tsx
│   │   ├── App.tsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
├── README.md
└── package.json
```

## 📄 License

This project is built for the Spur take-home assignment.
