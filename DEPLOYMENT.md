# 🚀 Production Deployment Guide

This guide explains how to deploy your portfolio website to production and resolve CORS issues.

## ✅ CORS Issue - RESOLVED

The CORS error in production has been fixed by:

1. **Disabling CORS in production** - Since the React app and API are served from the same origin in production, CORS is not needed
2. **Using relative URLs** - The client now automatically uses relative API paths in production
3. **Proper environment detection** - The app detects production mode and adjusts accordingly

## 📋 Pre-Deployment Checklist

### 1. Server Configuration
- ✅ CORS set to `false` in production (already configured)
- ✅ `NODE_ENV` environment variable set to `production`
- ✅ `JWT_SECRET` configured (strong, unique secret)
- ✅ Database path configured correctly
- ✅ Port configured (default: 3000)

### 2. Client Configuration
- ✅ API URLs use relative paths in production (already configured)
- ✅ Build output directory set to `../dist` (already configured)

## 🛠️ Deployment Steps

### Step 1: Set Environment Variables

Create `server/.env` file with production values:

```env
NODE_ENV=production
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
DB_PATH=./database/portfolio.db

# Optional: Additional security settings
MAX_LOGIN_ATTEMPTS=3
LOCKOUT_DURATION=43200000
```

**Important:** Generate a strong JWT secret using:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 2: Build the Frontend

```bash
# Navigate to client directory
cd client

# Build for production (outputs to ../dist)
npm run build

# Output should show:
# ✓ built in [time]
# dist/index.html [size]
# dist/assets/* [files]
```

The build creates an optimized production bundle in the `dist/` directory at the project root.

### Step 3: Verify Build Output

Check that the build was successful:

```bash
# From project root
ls -la dist/

# Should contain:
# - index.html
# - assets/
# - robots.txt
# - other static files
```

### Step 4: Start Production Server

```bash
# From project root
cd server
NODE_ENV=production npm start

# Or use the root script:
cd ..
npm start
```

The server will:
- Serve the React app from `/dist`
- Serve API endpoints from `/api/*`
- Handle all React routing automatically
- Run on port 3000 (or your configured PORT)

## 🌐 Production Architecture

```
┌─────────────────────────────────────────────┐
│          https://your-domain.com            │
├─────────────────────────────────────────────┤
│                                             │
│  Express.js Server (Port 3000)             │
│                                             │
│  ┌─────────────────┐  ┌─────────────────┐ │
│  │  Static Files   │  │   API Routes    │ │
│  │   (React SPA)   │  │   /api/*        │ │
│  │                 │  │                 │ │
│  │  - /            │  │  - /api/auth    │ │
│  │  - /admin       │  │  - /api/blog    │ │
│  │  - /assets/*    │  │  - /api/health  │ │
│  └─────────────────┘  └─────────────────┘ │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │      SQLite Database                │   │
│  │      ./database/portfolio.db        │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

**Key Points:**
- ✅ Single server handles everything
- ✅ Same origin = No CORS needed
- ✅ React app uses relative URLs (`/api/...`)
- ✅ All requests go through one domain

## 🖥️ Deployment Platforms

### Option 1: Railway (Recommended)

1. **Install Railway CLI:**
   ```bash
   npm i -g @railway/cli
   railway login
   ```

2. **Initialize project:**
   ```bash
   railway init
   ```

3. **Add environment variables:**
   ```bash
   railway variables set NODE_ENV=production
   railway variables set JWT_SECRET=your-secret-here
   railway variables set PORT=3000
   ```

4. **Deploy:**
   ```bash
   railway up
   ```

5. **Configure start command in Railway dashboard:**
   - Build Command: `cd client && npm install && npm run build && cd ../server && npm install`
   - Start Command: `cd server && npm start`

### Option 2: Render

1. **Create `render.yaml` in project root:**
   ```yaml
   services:
     - type: web
       name: portfolio
       env: node
       buildCommand: cd client && npm install && npm run build && cd ../server && npm install
       startCommand: cd server && npm start
       envVars:
         - key: NODE_ENV
           value: production
         - key: JWT_SECRET
           generateValue: true
         - key: PORT
           value: 3000
   ```

2. **Connect your GitHub repository to Render**

3. **Deploy automatically on push**

### Option 3: DigitalOcean App Platform

1. **Create app from GitHub repository**

2. **Configure build settings:**
   - Build Command: `cd client && npm install && npm run build && cd ../server && npm install`
   - Run Command: `cd server && npm start`

3. **Add environment variables in dashboard**

4. **Deploy**

### Option 4: VPS (Ubuntu/Debian)

1. **Install Node.js:**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

2. **Clone and setup:**
   ```bash
   git clone <your-repo>
   cd portfolio
   npm install
   cd client && npm install && npm run build
   cd ../server && npm install
   ```

3. **Install PM2:**
   ```bash
   sudo npm install -g pm2
   ```

4. **Start with PM2:**
   ```bash
   cd server
   NODE_ENV=production pm2 start index.js --name portfolio
   pm2 save
   pm2 startup
   ```

5. **Setup Nginx reverse proxy:**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## 🔍 Testing Your Deployment

### 1. Health Check
```bash
curl https://your-domain.com/api/health
# Should return: {"status":"ok",...}
```

### 2. Frontend Access
- Visit `https://your-domain.com/`
- Should load your portfolio homepage
- Check browser console for errors

### 3. Admin Panel
- Visit `https://your-domain.com/admin`
- Should show login or setup wizard
- Test login functionality

### 4. API Endpoints
```bash
# Test blog posts
curl https://your-domain.com/api/blog-posts

# Test setup status
curl https://your-domain.com/api/auth/setup-status
```

## 🐛 Troubleshooting

### CORS Errors Still Appearing?

**Check these:**
1. ✅ Server `NODE_ENV` is set to `production`
2. ✅ Client was rebuilt after code changes (`npm run build`)
3. ✅ Server is serving from correct `dist/` path
4. ✅ No `VITE_API_URL` environment variable in production

**Verify in browser console:**
```javascript
// Should be empty or relative path, NOT http://localhost:3000
console.log(import.meta.env.VITE_API_URL);
```

### Build Issues

```bash
# Clear all caches and rebuild
rm -rf client/node_modules client/dist dist
cd client && npm install && npm run build
```

### Database Not Found

```bash
# Database is auto-created, but verify path
cd server
ls -la database/
# Should show portfolio.db
```

### 404 on Page Refresh

This means the server's catch-all route isn't working. Verify:
1. `dist/` directory exists at project root
2. Server's static file serving is configured correctly
3. The catch-all `app.get('*')` route is after API routes

### Environment Variables Not Working

```bash
# Check if .env is loaded
cd server
cat .env

# Verify in code
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
```

## 📊 Performance Optimization

### 1. Enable Compression
Add to `server/index.js`:
```javascript
import compression from 'compression';
app.use(compression());
```

### 2. Cache Static Assets
```javascript
if (NODE_ENV === 'production') {
    app.use(express.static(distPath, {
        maxAge: '1y',
        etag: false
    }));
}
```

### 3. Database Optimization
```sql
-- Add indexes for better performance
CREATE INDEX idx_blog_posts_published ON blog_posts(published);
CREATE INDEX idx_users_username ON users(username);
```

## 🔒 Security Checklist

- ✅ Strong JWT_SECRET (32+ characters)
- ✅ Environment variables not committed to git
- ✅ HTTPS enabled (use Let's Encrypt)
- ✅ Database file has proper permissions (600)
- ✅ Rate limiting enabled on auth endpoints
- ✅ Helmet.js security headers configured
- ✅ Password requirements enforced
- ✅ Account lockout after failed attempts

## 📝 Maintenance

### Update Deployment

```bash
# Pull latest changes
git pull origin main

# Rebuild client
cd client && npm run build

# Restart server
cd ../server
pm2 restart portfolio
# OR on Railway/Render: git push triggers auto-deploy
```

### Backup Database

```bash
# Create backup
cp server/database/portfolio.db server/database/portfolio.db.backup

# Or use sqlite3
sqlite3 server/database/portfolio.db ".backup portfolio.db.backup"
```

### Monitor Logs

```bash
# PM2 logs
pm2 logs portfolio

# Or check platform-specific logs
railway logs
# OR render logs in dashboard
```

## 🎉 Success!

Your portfolio should now be running in production without CORS errors!

**Access your site:**
- Portfolio: `https://your-domain.com/`
- Admin Panel: `https://your-domain.com/admin`
- API: `https://your-domain.com/api/health`

All requests use the same origin, eliminating CORS issues entirely.

---

**Need help?** Check the main [README.md](./README.md) for more information.
