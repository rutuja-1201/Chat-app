# 🚀 Quick Free Deployment Guide

## Easiest Option: Render (Recommended)

### Why Render?
- ✅ Free PostgreSQL database
- ✅ Free web hosting for backend
- ✅ Free static site hosting for frontend
- ✅ Automatic SSL
- ✅ Easy GitHub integration
- ⚠️ Services spin down after 15min inactivity (first request takes ~30s)

### Step 1: Sign Up
1. Go to https://render.com
2. Click "Get Started for Free"
3. Sign up with GitHub

### Step 2: Create Database (2 minutes)
1. Dashboard → "New +" → "PostgreSQL"
2. Settings:
   - **Name**: `chat-db`
   - **Database**: `chat_app`
   - **User**: `chat_user`
   - **Plan**: **Free**
3. Click "Create Database"
4. **Important**: Copy the **Internal Database URL** (starts with `postgresql://`)

### Step 3: Deploy Backend (5 minutes)
1. Dashboard → "New +" → "Web Service"
2. Connect GitHub repo: `rutuja-1201/Chat-app`
3. Settings:
   - **Name**: `chat-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: **Free**
4. Environment Variables (click "Advanced"):
   ```
   NODE_ENV = production
   DATABASE_URL = <paste Internal Database URL>
   LLM_PROVIDER = groq
   GROQ_API_KEY = <your_groq_api_key>
   GROQ_MODEL = llama-3.1-8b-instant
   ```
5. Click "Create Web Service"
6. Wait 5-10 minutes for deployment
7. Copy your backend URL (e.g., `https://chat-backend.onrender.com`)

### Step 4: Run Migrations
1. Go to your backend service
2. Click "Shell" tab
3. Run:
   ```bash
   npm run migrate
   ```
4. Wait for "Migration completed successfully"

### Step 5: Deploy Frontend (3 minutes)
1. Dashboard → "New +" → "Static Site"
2. Connect GitHub repo: `rutuja-1201/Chat-app`
3. Settings:
   - **Name**: `chat-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
   - **Plan**: **Free**
4. Environment Variables:
   ```
   VITE_API_URL = <paste your backend URL from Step 3>
   ```
5. Click "Create Static Site"
6. Wait 3-5 minutes
7. **Done!** Your app is live! 🎉

### Step 6: Test Your App
1. Visit your frontend URL
2. Try sending a message
3. Check that messages persist after reload

---

## Alternative: Railway (No Spin-Down)

**Why Railway?**
- ✅ $5 free credit/month (enough for small apps)
- ✅ No spin-down (always on)
- ✅ PostgreSQL included
- ✅ Automatic deployments

### Quick Steps:
1. Sign up at https://railway.app (GitHub)
2. "New Project" → "Deploy from GitHub repo"
3. Select `rutuja-1201/Chat-app`
4. Add PostgreSQL database (auto-creates `DATABASE_URL`)
5. Add backend service:
   - Root: `backend`
   - Build: `npm install && npm run build`
   - Start: `npm start`
6. Add environment variables:
   ```
   LLM_PROVIDER=groq
   GROQ_API_KEY=<your_key>
   GROQ_MODEL=llama-3.1-8b-instant
   ```
7. Deploy frontend separately or use Vercel/Netlify

---

## Get Free Groq API Key

1. Go to https://console.groq.com
2. Sign up (free)
3. Go to "API Keys"
4. Create new key
5. Copy and use in environment variables

**No credit card required!**

---

## Troubleshooting

### Backend won't start
- Check environment variables are set
- Check build logs for errors
- Ensure `DATABASE_URL` is Internal URL (not External)

### Frontend can't connect
- Check `VITE_API_URL` is set correctly
- Rebuild frontend after changing env vars
- Check CORS settings in backend

### Database connection fails
- Use Internal Database URL (Render)
- Check database is running
- Verify migrations ran successfully

### Slow first request
- Normal on Render free tier (15min spin-down)
- First request after inactivity takes ~30 seconds
- Subsequent requests are fast

---

## Cost: $0/month ✅

All options above are completely free!
