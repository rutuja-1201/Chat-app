# How to Get a Free LLM API Key

This project supports multiple LLM providers. Here are the **free options**:

## Option 1: Groq (Recommended - Fast & Free) ⚡

**Groq offers a generous free tier with very fast responses!**

### Steps:
1. Go to [https://console.groq.com](https://console.groq.com)
2. Sign up for a free account (use Google/GitHub login)
3. Navigate to "API Keys" in the dashboard
4. Click "Create API Key"
5. Copy your API key

### Update your `.env` file:
```env
LLM_PROVIDER=groq
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.1-8b-instant
```

**Available Groq Models (all free):**
- `llama-3.1-8b-instant` (fastest, recommended)
- `llama-3.1-70b-versatile` (more capable)
- `mixtral-8x7b-32768` (good balance)

## Option 2: Hugging Face (Free)

1. Go to [https://huggingface.co](https://huggingface.co)
2. Sign up for a free account
3. Go to Settings → Access Tokens
4. Create a new token with "Read" permissions
5. Copy your token

### Update your `.env` file:
```env
LLM_PROVIDER=huggingface
HUGGINGFACE_API_KEY=your_token_here
```

## Option 3: Together AI (Free Tier)

1. Go to [https://together.ai](https://together.ai)
2. Sign up for a free account
3. Navigate to API Keys
4. Create a new API key
5. Copy your key

### Update your `.env` file:
```env
LLM_PROVIDER=together
TOGETHER_API_KEY=your_key_here
```

## Option 4: OpenAI (Not Free, but if you have credits)

If you have OpenAI credits, you can still use it:

```env
LLM_PROVIDER=openai
OPENAI_API_KEY=your_openai_key_here
OPENAI_MODEL=gpt-3.5-turbo
```

## Quick Setup (Groq - Recommended)

1. Get your Groq API key from [console.groq.com](https://console.groq.com)
2. Edit `backend/.env`:
   ```env
   LLM_PROVIDER=groq
   GROQ_API_KEY=gsk_your_key_here
   ```
3. Restart your backend server

That's it! No credit card required. 🎉

