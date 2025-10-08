# Deployment Guide

## Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `shopping-list-app` (or your preferred name)
3. Description: "Real-time shopping list app with Google OAuth and smart categorization"
4. Choose **Public** or **Private**
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click **Create repository**

## Step 2: Push Code to GitHub

Run these commands in your terminal:

```bash
git remote add origin https://github.com/YOUR_USERNAME/shopping-list-app.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

## Step 3: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. Go to https://vercel.com
2. Sign in with GitHub
3. Click **"Add New..."** → **"Project"**
4. Import your `shopping-list-app` repository
5. Configure your project:
   - **Framework Preset**: Other
   - **Build Command**: (leave empty)
   - **Output Directory**: (leave empty)
   - **Install Command**: `npm install`

6. **Add Environment Variables** (click "Environment Variables"):
   ```
   SUPABASE_URL=https://xfvbufykjhffmhgozbnm.supabase.co
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmdmJ1ZnlramhmZm1oZ296Ym5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4NTQwMTksImV4cCI6MjA3NTQzMDAxOX0.g1IxCdU2FnjMCDs0Vtt-lvM0yzvunQplmZzBwVp1D6k
   PORT=3000
   ```

7. Click **Deploy**

### Option B: Deploy via CLI

```bash
npm install -g vercel
vercel login
vercel
```

Follow the prompts and add the environment variables when asked.

## Step 4: Update Google OAuth Settings

After deployment, Vercel will give you a URL like: `https://shopping-list-app-xxxxx.vercel.app`

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to **Credentials**
4. Edit your OAuth 2.0 Client ID
5. Add to **Authorized JavaScript origins**:
   - `https://shopping-list-app-xxxxx.vercel.app` (your Vercel URL)
   - `https://xfvbufykjhffmhgozbnm.supabase.co`

6. Add to **Authorized redirect URIs**:
   - `https://xfvbufykjhffmhgozbnm.supabase.co/auth/v1/callback`

7. Click **Save**

## Step 5: Update Supabase Settings

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/xfvbufykjhffmhgozbnm
2. Go to **Authentication → URL Configuration**
3. Add your Vercel URL to **Site URL**: `https://shopping-list-app-xxxxx.vercel.app`
4. Add to **Redirect URLs**:
   - `https://shopping-list-app-xxxxx.vercel.app`
   - `http://localhost:3000` (for local development)

## Architecture

```
┌─────────────────┐
│   Vercel        │
│  (Frontend +    │◄──── Users access via HTTPS
│   Backend)      │
└────────┬────────┘
         │
         ├──────────► Socket.IO (Real-time sync)
         │
         └──────────► Supabase
                     ├── PostgreSQL (Data storage)
                     └── Auth (Google OAuth)
```

## Environment Variables Explanation

- **SUPABASE_URL**: Your Supabase project URL
- **SUPABASE_ANON_KEY**: Public/Anonymous key from Supabase (safe to expose in frontend)
- **PORT**: Port number for the server (Vercel will override this)

## Post-Deployment Checklist

- [ ] GitHub repository created and code pushed
- [ ] Vercel deployment successful
- [ ] Environment variables configured in Vercel
- [ ] Google OAuth redirect URLs updated
- [ ] Supabase URL configuration updated
- [ ] Test login with Google
- [ ] Test creating a trip
- [ ] Test adding items
- [ ] Test real-time sync (open in 2 browsers)
- [ ] Test deleting trips and items

## Troubleshooting

### Google Sign-In Not Working
- Check Google Cloud Console OAuth settings
- Verify redirect URLs match exactly
- Check browser console for errors

### Items Not Saving
- Verify Supabase environment variables are correct
- Check Supabase SQL logs for errors
- Ensure `quantity` column was added to `shopping_items` table

### Real-time Sync Not Working
- Socket.IO works on Vercel but with some limitations
- WebSocket connections should work fine
- Check Vercel logs for connection errors

## Custom Domain (Optional)

1. In Vercel dashboard, go to **Settings → Domains**
2. Add your custom domain
3. Update DNS records as instructed
4. Update Google OAuth and Supabase URLs to use your custom domain

## Local Development

To run locally:

```bash
npm install
npm start
```

Open http://localhost:3000

## Continuous Deployment

Every time you push to the `main` branch on GitHub, Vercel will automatically deploy the changes.

```bash
git add .
git commit -m "Your commit message"
git push
```

Vercel will build and deploy within 1-2 minutes.
