# Quick Start Guide

## 🚀 Initial Setup (One-Time)

### 1. Create GitHub Repository
Go to https://github.com/new and create a repository named `shopping-list-app`

### 2. Push to GitHub
```bash
# Add your GitHub repo as remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/shopping-list-app.git

# Push your code
git push -u origin main
```

### 3. Install Vercel CLI
```bash
npm install -g vercel
```

### 4. Login to Vercel
```bash
vercel login
```

### 5. Initial Deployment
```bash
vercel
```

Follow the prompts:
- **Set up and deploy?** → Yes
- **Which scope?** → Select your account
- **Link to existing project?** → No
- **Project name?** → shopping-list-app (or press Enter)
- **Directory?** → Press Enter (current directory)
- **Override settings?** → No

### 6. Add Environment Variables
```bash
vercel env add SUPABASE_URL
# Paste: https://xfvbufykjhffmhgozbnm.supabase.co

vercel env add SUPABASE_ANON_KEY
# Paste: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmdmJ1ZnlramhmZm1oZ296Ym5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4NTQwMTksImV4cCI6MjA3NTQzMDAxOX0.g1IxCdU2FnjMCDs0Vtt-lvM0yzvunQplmZzBwVp1D6k
```

### 7. Deploy to Production
```bash
vercel --prod
```

Vercel will give you a URL like: `https://shopping-list-app-xxx.vercel.app`

### 8. Update OAuth Settings

**Google Cloud Console** (https://console.cloud.google.com/):
- Go to Credentials → Your OAuth Client
- Add to **Authorized JavaScript origins**:
  - `https://your-vercel-url.vercel.app`
- Save

**Supabase Dashboard** (https://supabase.com/dashboard/project/xfvbufykjhffmhgozbnm):
- Go to Authentication → URL Configuration
- Add to **Redirect URLs**:
  - `https://your-vercel-url.vercel.app`
- Save

---

## 🔄 Daily Workflow (After Setup)

### Option 1: Quick Deploy Script
```bash
./deploy.sh "Your commit message"
```

### Option 2: NPM Command
```bash
npm run deploy
```

### Option 3: Manual Steps
```bash
# 1. Stage and commit changes
git add .
git commit -m "Your commit message"

# 2. Push to GitHub
git push

# 3. Deploy to Vercel
vercel --prod
```

---

## 📝 Common Commands

### Local Development
```bash
npm start
# Opens at http://localhost:3000
```

### Check Git Status
```bash
git status
```

### View Deployed URL
```bash
vercel ls
```

### View Logs
```bash
vercel logs
```

### Rollback to Previous Deployment
```bash
vercel rollback
```

---

## 🎯 Quick Deploy Examples

**Deploy with custom message:**
```bash
./deploy.sh "Added new feature X"
```

**Deploy without message (uses default):**
```bash
./deploy.sh
```

**Deploy using npm:**
```bash
npm run deploy
```

---

## 🔧 Troubleshooting

### "vercel: command not found"
Install Vercel CLI:
```bash
npm install -g vercel
```

### "Permission denied: ./deploy.sh"
Make script executable:
```bash
chmod +x deploy.sh
```

### "Authentication failed"
Login again:
```bash
vercel login
```

### View deployment errors
```bash
vercel logs --follow
```

---

## 📦 What Gets Deployed?

- ✅ Frontend (HTML, CSS, JS)
- ✅ Backend (Node.js server)
- ✅ Socket.IO for real-time sync
- ✅ All dependencies from package.json

**Note:** Database stays on Supabase (not deployed to Vercel)

---

## 🌐 Architecture After Deployment

```
GitHub Repository
       ↓ (push)
Vercel Deployment
       ↓ (uses)
Supabase Backend
   ├── PostgreSQL Database
   └── Google OAuth
```

Every `git push` can trigger automatic deployment if you enable it in Vercel settings!
