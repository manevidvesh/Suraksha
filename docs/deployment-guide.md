# SURAKSHA Deployment Guide

This guide details how to deploy the **SURAKSHA Decision Support System** across different deployment environments:
1. **Free Cloud Tier (Recommended for Demos & Production)**: Vercel (Frontend) + Render (Backend) + Supabase PostGIS (Optional DB)
2. **Single Server / VPS (Docker Compose)**: DigitalOcean / AWS EC2 / Linux VM
3. **Local Staging / Intranet**: Running on your local machine or local area network
4. **Instant Public Tunneling**: Exposing local instance to the web via Cloudflare Tunnel / Ngrok

---

## 🌟 Architecture Summary

- **Frontend**: Next.js 14 App Router, Tailwind CSS, MapLibre GL, Recharts, Lucide.
- **Backend**: FastAPI, Uvicorn, GeoPandas, Shapely, Scikit-learn, Pydantic v2.
- **Database**: Dual-mode — runs **out-of-the-box with zero database setup** using pre-seeded spatial memory cache, OR connects to PostgreSQL + PostGIS via `DATABASE_URL`.

---

## 🚀 Option 1: Free Cloud Deployment (Recommended)

This setup costs $0 and connects directly to your GitHub repository (`manevidvesh/Suraksha`) for automated CI/CD deployments whenever you push commits.

### Step 1: Deploy Backend on Render
1. Go to [render.com](https://render.com) and sign up / log in with GitHub.
2. Click **New +** → **Web Service**.
3. Select your repository: `manevidvesh/Suraksha`.
4. Configure service settings:
   - **Name**: `suraksha-backend`
   - **Language / Runtime**: `Docker`
   - **Dockerfile Path**: `./backend/Dockerfile`
   - **Docker Context**: `.`
   - **Instance Type**: `Free`
5. Under **Environment Variables**, add:
   - `ENVIRONMENT`: `production`
   - `CORS_ORIGINS`: `*`
   - *(Optional)* `GEMINI_API_KEY`: Your Google Gemini API Key (for live LLM executive briefs)
   - *(Optional)* `DATABASE_URL`: Your Supabase/PostgreSQL connection string (if using external DB)
6. Click **Deploy Web Service**.
7. Once deployed, copy your backend URL (e.g., `https://suraksha-backend.onrender.com`). Verify it by visiting `https://suraksha-backend.onrender.com/health`.

---

### Step 2: Deploy Frontend on Vercel
1. Go to [vercel.com](https://vercel.com) and log in with GitHub.
2. Click **Add New…** → **Project**.
3. Import `manevidvesh/Suraksha`.
4. In the Project Settings:
   - **Root Directory**: Click *Edit* and select `frontend`.
   - **Framework Preset**: Next.js (auto-detected).
5. In **Environment Variables**, add:
   - **Key**: `NEXT_PUBLIC_API_BASE_URL`
   - **Value**: Your Render backend URL from Step 1 (e.g., `https://suraksha-backend.onrender.com`).
6. Click **Deploy**.
7. Within ~60 seconds, Vercel will give you a live production URL (e.g., `https://suraksha.vercel.app`).

---

### Step 3 (Optional): PostGIS Database on Supabase
If you want persistent PostgreSQL + PostGIS storage rather than the built-in spatial cache:
1. Create a free project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** in Supabase and run:
   ```sql
   CREATE EXTENSION IF NOT EXISTS postgis;
   ```
3. Run the SQL statements from `database/schema.sql` and `database/seed.sql`.
4. Copy the connection URI from **Project Settings → Database → Connection string (URI)**.
5. In your Render Web Service environment variables, set `DATABASE_URL` to this URI.

---

## 🐳 Option 2: Single Server / VPS with Docker Compose

If you have a Linux server (AWS EC2, DigitalOcean Droplet, Ubuntu VPS):

1. Clone the repository and install Docker:
   ```bash
   git clone https://github.com/manevidvesh/Suraksha.git
   cd Suraksha
   ```
2. Run Docker Compose:
   ```bash
   docker-compose up -d --build
   ```
3. Docker Compose will start:
   - `suraksha-postgis` on port `5432` with PostGIS and seed data.
   - `suraksha-backend` on port `8000`.
   - `suraksha-frontend` on port `3000`.
4. Point a reverse proxy (Nginx or Caddy) to port `3000` (frontend) and port `8000` (backend API) with SSL certificates.

---

## 💻 Option 3: Local Staging & Intranet Hosting

You can run both the backend and frontend directly on your local machine:

### Terminal 1: Backend
```powershell
# From project root
python run.py
# API runs on http://localhost:8000 (Swagger docs: http://localhost:8000/docs)
```

### Terminal 2: Frontend
```powershell
cd frontend
npm.cmd run build
npm.cmd run start
# Production frontend runs on http://localhost:3000
```

---

## 🌐 Option 4: Instant Public Access via Cloudflare Tunnel / Ngrok

If you want to demo your local setup to judges or teammates immediately without cloud hosting:

1. Start your local backend and frontend as in Option 3.
2. Install Cloudflare Tunnel (`cloudflared`) or Ngrok:
   ```powershell
   # Using cloudflared
   cloudflared tunnel --url http://localhost:3000
   ```
3. Cloudflare will instantly generate a public `https://....trycloudflare.com` URL accessible from any device anywhere in the world!
