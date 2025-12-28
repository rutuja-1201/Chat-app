# Free Deployment Guide

This guide covers multiple free deployment options for the Chat-App project.

## 🎯 Recommended: Render (Easiest - All-in-One)

**Free Tier Includes:**
- PostgreSQL database (free tier)
- Web services for backend and frontend
- Automatic SSL certificates
- 750 hours/month free

### Step-by-Step Deployment on Render

#### 1. Create Render Account
- Go to https://render.com
- Sign up with GitHub (free)

#### 2. Create PostgreSQL Database
1. Click "New +" → "PostgreSQL"
2. Name: `chat-db`
3. Database: `chat_app`
4. User: `chat_user`
5. Plan: **Free**
6. Click "Create Database"
7. **Copy the Internal Database URL** (you'll need this)

#### 3. Deploy Backend
1. Click "New +" → "Web Service"
2. Connect your GitHub repository: `rutuja-1201/Chat-app`
3. Configure:
   - **Name**: `chat-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: **Free**

4. Add Environment Variables:
   ```
   NODE_ENV=production
   DATABASE_URL=<paste Internal Database URL from step 2>
   LLM_PROVIDER=groq
   GROQ_API_KEY=<your_groq_api_key>
   GROQ_MODEL=llama-3.1-8b-instant
   ```

5. Click "Create Web Service"
6. Wait for deployment (5-10 minutes)
7. **Copy the backend URL** (e.g., `https://chat-backend.onrender.com`)

#### 4. Deploy Frontend
1. Click "New +" → "Static Site"
2. Connect your GitHub repository: `rutuja-1201/Chat-app`
3. Configure:
   - **Name**: `chat-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
   - **Plan**: **Free**

4. Add Environment Variable:
   ```
   VITE_API_URL=<paste backend URL from step 3>
   ```

5. Click "Create Static Site"
6. Wait for deployment (3-5 minutes)
7. **Your app will be live!** (e.g., `https://chat-frontend.onrender.com`)

#### 5. Run Database Migrations
After backend is deployed:
1. Go to your backend service on Render
2. Click "Shell" tab
3. Run:
   ```bash
   npm run migrate
   ```

**Note**: Render free tier services spin down after 15 minutes of inactivity. First request after spin-down takes ~30 seconds.

---

## Option 2: Vercel (Frontend) + Railway (Backend + DB)

### Frontend on Vercel (Free)

**Free Tier:**
- Unlimited static sites
- Automatic SSL
- Global CDN
- 100GB bandwidth/month

#### Steps:
1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "New Project"
4. Import repository: `rutuja-1201/Chat-app`
5. Configure:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

6. Add Environment Variable:
   ```
   VITE_API_URL=<your_backend_url>
   ```

7. Click "Deploy"

### Backend + Database on Railway (Free)

**Free Tier:**
- $5 credit/month (enough for small apps)
- PostgreSQL included
- Automatic deployments

#### Steps:
1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select `rutuja-1201/Chat-app`
5. Add PostgreSQL:
   - Click "+ New" → "Database" → "PostgreSQL"
   - Railway auto-creates `DATABASE_URL`

6. Add Backend Service:
   - Click "+ New" → "GitHub Repo" → Select your repo
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

7. Add Environment Variables:
   ```
   NODE_ENV=production
   DATABASE_URL=<auto-filled from PostgreSQL>
   LLM_PROVIDER=groq
   GROQ_API_KEY=<your_groq_api_key>
   GROQ_MODEL=llama-3.1-8b-instant
   ```

8. Deploy and get backend URL
9. Update Vercel's `VITE_API_URL` with Railway backend URL

---

## Option 3: Netlify (Frontend) + Fly.io (Backend + DB)

### Frontend on Netlify (Free)

**Free Tier:**
- 100GB bandwidth/month
- 300 build minutes/month
- Automatic SSL

#### Steps:
1. Go to https://netlify.com
2. Sign up with GitHub
3. Click "Add new site" → "Import an existing project"
4. Connect `rutuja-1201/Chat-app`
5. Configure:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`

6. Add Environment Variable:
   ```
   VITE_API_URL=<your_backend_url>
   ```

7. Click "Deploy site"

### Backend + Database on Fly.io (Free)

**Free Tier:**
- 3 shared-cpu VMs
- 3GB persistent volume
- 160GB outbound data transfer/month

#### Steps:
1. Install Fly CLI:
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. Sign up: https://fly.io/app/sign-up

3. Create PostgreSQL:
   ```bash
   fly postgres create --name chat-db --region ord
   fly postgres attach chat-db
   ```

4. Create backend app:
   ```bash
   cd backend
   fly launch --name chat-backend
   ```

5. Set environment variables:
   ```bash
   fly secrets set LLM_PROVIDER=groq
   fly secrets set GROQ_API_KEY=<your_key>
   fly secrets set GROQ_MODEL=llama-3.1-8b-instant
   fly secrets set NODE_ENV=production
   ```

6. Deploy:
   ```bash
   fly deploy
   ```

---

## Option 4: All on Render (Simplest)

You already have `render.yaml` configured! Just:

1. Go to https://render.com
2. Sign up with GitHub
3. Click "New +" → "Blueprint"
4. Connect your repository: `rutuja-1201/Chat-app`
5. Render will auto-detect `render.yaml`
6. Add your environment variables in the dashboard
7. Click "Apply"

**That's it!** Render will deploy everything automatically.

---

## 🗄️ Free PostgreSQL Database Options

If you need a separate database:

1. **Neon** (Recommended - Best Free Tier)
   - https://neon.tech
   - 0.5GB storage free
   - No credit card required
   - Auto-scaling

2. **Supabase**
   - https://supabase.com
   - 500MB database free
   - Includes PostgreSQL

3. **ElephantSQL**
   - https://www.elephantsql.com
   - 20MB free tier
   - Simple setup

---

## 🔧 Environment Variables Setup

### Backend Variables:
```env
NODE_ENV=production
DATABASE_URL=<your_database_url>
LLM_PROVIDER=groq
GROQ_API_KEY=<your_groq_api_key>
GROQ_MODEL=llama-3.1-8b-instant
```

### Frontend Variables:
```env
VITE_API_URL=<your_backend_url>
```

---

## 📝 Post-Deployment Checklist

- [ ] Database migrations run successfully
- [ ] Backend health check works (`/health` endpoint)
- [ ] Frontend can connect to backend
- [ ] CORS is configured correctly
- [ ] Environment variables are set
- [ ] SSL certificates are active (HTTPS)
- [ ] Test chat functionality end-to-end

---

## 🚨 Common Issues & Solutions

### Issue: Backend can't connect to database
**Solution**: Use Internal Database URL (not External) on Render

### Issue: CORS errors
**Solution**: Update backend CORS to allow your frontend domain:
```typescript
app.use(cors({
  origin: ['https://your-frontend-url.com']
}));
```

### Issue: Environment variables not working
**Solution**: 
- Vite requires `VITE_` prefix for frontend
- Restart services after adding env vars
- Check variable names match exactly

### Issue: Slow first request (Render)
**Solution**: This is normal on free tier (15-min spin-down). Consider:
- Using a cron job to ping your service
- Upgrading to paid tier
- Using Railway/Fly.io which don't spin down

---

## 💰 Cost Comparison

| Platform | Free Tier | Limitations |
|----------|-----------|-------------|
| **Render** | ✅ | Spins down after 15min inactivity |
| **Vercel** | ✅ | 100GB bandwidth/month |
| **Railway** | ✅ | $5 credit/month |
| **Netlify** | ✅ | 100GB bandwidth/month |
| **Fly.io** | ✅ | 3 VMs, 160GB transfer/month |

**Recommendation**: Start with **Render** (easiest) or **Railway** (no spin-down).

---

## 🎯 Quick Start (Render - Recommended)

1. Sign up at https://render.com
2. Create PostgreSQL database (free)
3. Deploy backend as Web Service
4. Deploy frontend as Static Site
5. Run migrations via Shell
6. Done! 🎉

Your app will be live in ~15 minutes!
