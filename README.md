# 🚀 Professional Portfolio Website

A modern, full-stack portfolio website built with React, TypeScript, and Express.js. Features a beautiful responsive design, secure admin panel, and dynamic blog management system.

![Portfolio Preview](/My%20Porfolio%20Site.png)

## ✨ Features

### 🌐 **Public Portfolio**
- **Responsive Design** - Beautiful, mobile-first design that works on all devices
- **Modern UI** - Built with shadcn/ui components and Tailwind CSS
- **Portfolio Sections**:
  - Hero section with professional introduction
  - Projects showcase with dynamic content
  - About section with personal story
  - Skills and technologies display
  - FAQ section for common questions
  - Contact form for direct email communication

### 🔐 **Admin Panel**
- **Secure Authentication** - JWT-based login with account lockout protection
- **First-Time Setup** - Guided setup wizard for initial admin account creation
- **Blog Management** - Full CRUD operations for blog posts with database persistence
- **Real-time Updates** - Changes reflect immediately on the portfolio
- **Loading States** - Smooth UX with loading indicators and error handling

### 🛡️ **Security Features**
- JWT token-based authentication
- Password strength validation (15+ chars, 2+ numbers, 2+ special characters)
- Account lockout after 3 failed login attempts (12-hour lock)
- Rate limiting on authentication endpoints
- CORS protection
- Security headers with Helmet.js
- SQL injection prevention with prepared statements

## 🛠️ Technology Stack

### **Frontend**
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | ^18.3.1 | Modern UI library |
| **TypeScript** | ^5.8.3 | Type safety and better DX |
| **Vite** | ^5.4.19 | Fast build tool and dev server |
| **Tailwind CSS** | ^3.4.17 | Utility-first CSS framework |
| **shadcn/ui** | Latest | Beautiful, accessible component library |
| **React Router** | ^6.30.1 | Client-side routing |
| **TanStack Query** | ^5.83.0 | Powerful data fetching and caching |
| **React Hook Form** | ^7.61.1 | Performant form handling |
| **Zod** | ^3.25.76 | TypeScript-first schema validation |

### **Backend**
| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | v18+ | JavaScript runtime |
| **Express.js** | ^4.18.2 | Web application framework |
| **SQLite** | ^9.2.2 | Lightweight database |
| **JWT** | ^9.0.2 | Secure authentication |
| **bcrypt** | ^6.0.0 | Password hashing |
| **Helmet** | ^7.1.0 | Security middleware |
| **CORS** | ^2.8.5 | Cross-origin resource sharing |

### **Development Tools**
- **ESLint** - Code linting and formatting
- **TypeScript ESLint** - TypeScript-specific linting rules
- **Nodemon** - Auto-restart development server
- **Concurrently** - Run multiple scripts simultaneously

## 🚀 Quick Start

### Prerequisites
- **Node.js** v18 or higher
- **npm** v9 or higher

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/portfolio-website.git
   cd portfolio-website
   ```

2. **Install dependencies:**
   ```bash
   # Install both frontend and backend dependencies
   npm install
   cd client && npm install
   cd ../server && npm install
   cd ..
   ```

3. **Set up environment variables:**
   ```bash
   # Create server environment file
   cp server/env.example server/.env
   # Edit server/.env with your values
   ```

---

## 💻 Development Setup

### Running in Development Mode

Development mode runs **two separate servers**:
- **Frontend (Vite)**: Hot reload, fast refresh, dev server on port 5173
- **Backend (Express)**: Auto-restart with Nodemon on port 3000

#### Start Both Servers

```bash
# From project root - starts both frontend and backend
npm run dev
```

This runs:
- React dev server with hot module replacement (HMR)
- Express server with auto-restart on file changes

#### Or Start Individually

```bash
# Frontend only
npm run dev:client
# Runs on http://localhost:5173

# Backend only
npm run dev:server
# Runs on http://localhost:3000
```

### Development URLs

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:5173 | React app with HMR |
| **Backend API** | http://localhost:3000/api | Express REST API |
| **Admin Panel** | http://localhost:5173/admin | Admin dashboard |

### Development Environment Variables

Create `server/.env`:

```env
NODE_ENV=development
PORT=3000
JWT_SECRET=your-development-jwt-secret-key
DB_PATH=./database/portfolio.db

# Optional: Enable detailed logging
DEBUG=express:*
```

### Development Features

- ✅ **Hot Module Replacement** - Instant updates without refresh
- ✅ **Auto-restart** - Backend restarts on code changes
- ✅ **Source maps** - Easy debugging
- ✅ **Detailed errors** - Full stack traces
- ✅ **CORS enabled** - Frontend can call backend API
- ✅ **Fast builds** - Vite's lightning-fast bundling

---

## 🏭 Production Setup

### Architecture

In production, a **single Express server** serves:
- Static React build files (HTML, CSS, JS)
- REST API endpoints
- All routes through one port (default: 3000)

```
┌─────────────────────────────────────┐
│   Single Express.js Server          │
│                                     │
│  ┌──────────────┐  ┌─────────────┐  │
│  │ Static Files │  │  API Routes │  │
│  │ (React App)  │  │  /api/*     │  │
│  └──────────────┘  └─────────────┘  │
│                                     │
│  Port 3000 (configurable)           │
└─────────────────────────────────────┘
```

### Build for Production

#### 1. Build the Frontend

```bash
cd client
npm run build
```

This creates optimized production files in `dist/` (configured in `vite.config.ts` to output to `../dist/`)

#### 2. Production Environment Variables

Create `server/.env` for production:

```env
NODE_ENV=production
PORT=3000
JWT_SECRET=your-super-secret-production-jwt-key-change-this
DB_PATH=./database/portfolio.db

# Security
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

**⚠️ Security Notes:**
- Generate a strong JWT secret: `openssl rand -base64 32`
- Never commit `.env` files to version control
- Use different secrets for dev and production
- Restrict CORS origins in production

#### 3. Start Production Server (Manual)

```bash
cd server
NODE_ENV=production npm start
```

Server runs on port 3000 (configurable via PORT environment variable).

---

## 🚦 PM2 Production Deployment (Recommended)

PM2 is the industry-standard process manager for Node.js applications in production. It's like Gunicorn for Node.js.

### Why PM2?

- ✅ **Process management** - Keeps your app running 24/7
- ✅ **Auto-restart** - Automatically restarts if app crashes
- ✅ **Cluster mode** - Run multiple instances (CPU cores)
- ✅ **Zero-downtime reloads** - Update without stopping service
- ✅ **Log management** - Automatic log rotation
- ✅ **Monitoring** - Built-in performance monitoring
- ✅ **Startup scripts** - Auto-start on system reboot

### Install PM2

```bash
# Install PM2 globally
sudo npm install -g pm2
```

### PM2 Configuration

Create `ecosystem.config.js` in project root:

```javascript
module.exports = {
  apps: [{
    name: 'portfolio-api',
    script: './server/index.js',
    cwd: '/home/your-user/portfolio-website',
    instances: 2,  // Or 'max' to use all CPU cores
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    max_memory_restart: '500M',
    autorestart: true,
    watch: false,
    max_restarts: 10,
    min_uptime: '10s'
  }]
};
```

### PM2 Commands

#### Starting Your App

```bash
# Start with ecosystem config
pm2 start ecosystem.config.js

# Or start directly (simple)
pm2 start server/index.js --name portfolio-api -i 2

# Start in cluster mode with max CPU cores
pm2 start server/index.js --name portfolio-api -i max
```

#### Managing Your App

```bash
# List all processes
pm2 list

# Monitor in real-time
pm2 monit

# View logs
pm2 logs portfolio-api

# View last 100 lines
pm2 logs portfolio-api --lines 100

# Restart app
pm2 restart portfolio-api

# Reload (zero-downtime)
pm2 reload portfolio-api

# Stop app
pm2 stop portfolio-api

# Delete from PM2
pm2 delete portfolio-api

# Restart all apps
pm2 restart all
```

#### Auto-Start on System Boot

```bash
# Generate startup script
pm2 startup

# Save current process list
pm2 save

# To disable startup
pm2 unstartup
```

### PM2 Deployment Workflow

```bash
# 1. Pull latest code
cd ~/portfolio-website
git pull origin main

# 2. Install dependencies (if needed)
npm install
cd client && npm install
cd ../server && npm install
cd ..

# 3. Build frontend
cd client && npm run build && cd ..

# 4. Reload app (zero-downtime)
pm2 reload portfolio-api

# Or restart if major changes
pm2 restart portfolio-api

# 5. Check status
pm2 list
pm2 logs portfolio-api --lines 20
```

### PM2 Advanced Features

#### Memory-based Auto-restart

```bash
pm2 start server/index.js --name portfolio-api --max-memory-restart 500M
```

#### Log Rotation

```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

#### Monitoring Dashboard

```bash
pm2 plus  # Connect to PM2 Plus for advanced monitoring
```

---

## 🌍 Reverse Proxy Setup

### Caddy (Recommended - Auto HTTPS)

`/etc/caddy/Caddyfile`:

```caddy
yourdomain.com {
    reverse_proxy localhost:3000
    encode gzip
    
    # Optional: Custom headers
    header {
        X-Frame-Options "SAMEORIGIN"
        X-Content-Type-Options "nosniff"
        Referrer-Policy "strict-origin-when-cross-origin"
    }
}
```

Reload Caddy:
```bash
sudo systemctl reload caddy
```

### Nginx Alternative

`/etc/nginx/sites-available/portfolio`:

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 📊 Development vs Production Comparison

| Feature | Development | Production |
|---------|-------------|------------|
| **Servers** | 2 separate (Vite + Express) | 1 Express server |
| **Frontend** | Vite dev server (port 5173) | Static files from Express |
| **Backend** | Nodemon auto-restart (port 3000) | PM2 managed (port 3000) |
| **Hot Reload** | ✅ Instant HMR | ❌ Requires rebuild |
| **Build** | Not needed | Required (`npm run build`) |
| **Process Manager** | None (manual) | PM2 recommended |
| **Logging** | Console output | PM2 log files |
| **Clustering** | Single process | Multi-process with PM2 |
| **Auto-restart** | ❌ Manual restart | ✅ PM2 auto-restart |
| **Environment** | `NODE_ENV=development` | `NODE_ENV=production` |
| **CORS** | Permissive | Restricted origins |
| **Source Maps** | ✅ Full | ❌ Minimal/None |
| **Minification** | ❌ Not minified | ✅ Minified |
| **SSL/HTTPS** | Not needed | Via Caddy/Nginx |

---

## 📁 Project Structure

```
portfolio-website/
├── client/                    # React Frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── ui/           # shadcn/ui components
│   │   │   ├── Hero.tsx      # Landing section
│   │   │   ├── Projects.tsx  # Portfolio showcase
│   │   │   ├── About.tsx     # About section
│   │   │   ├── Skills.tsx    # Skills display
│   │   │   ├── Contact.tsx   # Contact form
│   │   │   ├── LoginForm.tsx # Admin login
│   │   │   ├── SetupWizard.tsx # First-time setup
│   │   │   └── PasswordStrengthIndicator.tsx
│   │   ├── pages/            # Page components
│   │   │   ├── Index.tsx     # Main portfolio page
│   │   │   ├── AdminDashboard.tsx # Admin panel
│   │   │   ├── Login.tsx     # Login page
│   │   │   └── NotFound.tsx  # 404 page
│   │   ├── contexts/         # React contexts
│   │   │   └── BlogContext.tsx # Blog state management
│   │   ├── hooks/            # Custom hooks
│   │   │   └── useAuth.tsx   # Authentication hook
│   │   └── lib/              # Utilities and helpers
│   ├── dist/                 # Production build output
│   └── package.json          # Frontend dependencies
├── server/                   # Express.js Backend
│   ├── routes/              # API routes
│   │   ├── api.js           # Main API endpoints
│   │   └── auth.js          # Authentication routes
│   ├── models/              # Database models
│   │   └── index.js         # SQLite models
│   ├── middleware/          # Express middleware
│   │   └── auth.js          # JWT authentication
│   ├── database/            # Database files
│   │   ├── schema.sql       # Database schema
│   │   └── portfolio.db     # SQLite database
│   ├── config/              # Configuration files
│   │   └── database.js      # Database config
│   ├── utils/               # Utility functions
│   │   └── password.js      # Password utilities
│   ├── scripts/             # Utility scripts
│   │   └── unlock-admin.js  # Unlock locked accounts
│   ├── .env                 # Environment variables (gitignored)
│   ├── .env.example         # Example environment file
│   └── index.js             # Server entry point
├── ecosystem.config.js      # PM2 configuration
├── package.json             # Root package.json
└── README.md               # This file
```

---

## 🔧 Available Scripts

### Root Level

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both frontend and backend in development mode |
| `npm run dev:client` | Start only React development server |
| `npm run dev:server` | Start only Express server with auto-reload |
| `npm run build` | Build React app for production |
| `npm start` | Start production server (after building) |

### Client (`cd client`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

### Server (`cd server`)

| Command | Description |
|---------|-------------|
| `npm start` | Start production server |
| `npm run dev` | Start server with Nodemon (auto-reload) |

---

## 🔐 Admin Panel Guide

### First-Time Setup
1. Visit `/admin` on your portfolio website
2. If no admin account exists, you'll see the setup wizard
3. Create your admin account with:
   - Username (3+ characters)
   - Valid email address
   - Strong password (15+ chars, 2+ numbers, 2+ special characters)
4. Complete setup to access the admin dashboard

### Managing Content

**Blog Posts:**
- Create new blog posts with title, description, content, and tags
- Edit existing posts
- Delete posts with confirmation
- Publish/unpublish posts
- All changes save to SQLite database

### Security Features
- JWT token authentication
- Automatic logout on token expiry
- Account lockout after 3 failed login attempts (12-hour lock)
- Rate limiting on authentication endpoints

### Unlocking Locked Account

If you get locked out:

```bash
cd server
node scripts/unlock-admin.js your-username
```

---

## 📡 API Endpoints

### Authentication
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/setup-status` | GET | Check if admin account exists |
| `/api/auth/setup` | POST | Create initial admin account |
| `/api/auth/login` | POST | Admin login |
| `/api/auth/verify` | GET | Verify JWT token |
| `/api/auth/password-strength` | POST | Check password strength |

### Blog Management
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/blog-posts` | GET | Fetch all blog posts |
| `/api/blog-posts/:id` | GET | Fetch single blog post |
| `/api/blog-posts` | POST | Create new blog post |
| `/api/blog-posts/:id` | PUT | Update blog post |
| `/api/blog-posts/:id` | DELETE | Delete blog post |

### Projects
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/projects` | GET | Fetch all projects |
| `/api/projects/featured` | GET | Fetch featured projects |
| `/api/projects` | POST | Create new project |
| `/api/projects/:id` | PUT | Update project |
| `/api/projects/:id` | DELETE | Delete project |

### System
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/settings` | GET | Get site settings |
| `/api/settings/:key` | PUT | Update setting |

---

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'admin',
    failed_attempts INTEGER DEFAULT 0,
    locked_until DATETIME NULL,
    last_failed_attempt DATETIME NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Blog Posts Table
```sql
CREATE TABLE blog_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    featured_image TEXT,
    published BOOLEAN DEFAULT 1,
    tags TEXT, -- JSON string
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Projects Table
```sql
CREATE TABLE projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    long_description TEXT,
    technologies TEXT, -- JSON string
    github_url TEXT,
    live_url TEXT,
    image_url TEXT,
    featured BOOLEAN DEFAULT 0,
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🐛 Troubleshooting

### Development Issues

**Port Already in Use:**
```bash
# Kill processes on ports
npx kill-port 3000 5173
# Or manually
lsof -ti:3000 | xargs kill -9
lsof -ti:5173 | xargs kill -9
```

**Module Not Found:**
```bash
# Clear and reinstall
rm -rf node_modules client/node_modules server/node_modules
npm install
cd client && npm install
cd ../server && npm install
```

**Database Issues:**
```bash
# Database is auto-created on first run
# Location: server/database/portfolio.db

# To reset (WARNING: Deletes all data)
rm server/database/portfolio.db
# Restart server to recreate
```

### Production Issues

**PM2 App Won't Start:**
```bash
# Check PM2 logs
pm2 logs portfolio-api

# Check PM2 status
pm2 list

# Try restarting
pm2 restart portfolio-api

# If still failing, delete and restart
pm2 delete portfolio-api
pm2 start ecosystem.config.js
```

**Build Failures:**
```bash
# Clear Vite cache
cd client
rm -rf node_modules/.vite
npm run build
```

**500 Errors:**
```bash
# Check server logs
pm2 logs portfolio-api --lines 50

# Check if database exists
ls -la server/database/

# Check environment variables
cat server/.env
```

**Authentication Not Working:**
```bash
# Verify JWT_SECRET is set
grep JWT_SECRET server/.env

# Check token in browser DevTools > Application > Local Storage

# Unlock account if locked
cd server
node scripts/unlock-admin.js your-username
```

---

## 🚀 Deployment Checklist

### Pre-Deployment

- [ ] Update environment variables in `server/.env`
- [ ] Generate strong JWT secret: `openssl rand -base64 32`
- [ ] Set `NODE_ENV=production`
- [ ] Configure CORS allowed origins
- [ ] Review security settings

### Build & Deploy

- [ ] Pull latest code: `git pull origin main`
- [ ] Install dependencies: `npm install && cd client && npm install && cd ../server && npm install`
- [ ] Build frontend: `cd client && npm run build`
- [ ] Test production build locally
- [ ] Install PM2: `sudo npm install -g pm2`
- [ ] Create `ecosystem.config.js`
- [ ] Start with PM2: `pm2 start ecosystem.config.js`
- [ ] Save PM2 configuration: `pm2 save`
- [ ] Enable startup script: `pm2 startup`

### Post-Deployment

- [ ] Verify app is running: `pm2 list`
- [ ] Check logs: `pm2 logs portfolio-api`
- [ ] Test website in browser
- [ ] Test admin panel login
- [ ] Configure reverse proxy (Caddy/Nginx)
- [ ] Enable SSL/HTTPS
- [ ] Set up monitoring/alerts
- [ ] Configure log rotation
- [ ] Set up backup for database

---

## 🎨 Customization

### Theme Colors
Edit `client/tailwind.config.ts`:

```typescript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: "your-primary-color",
        secondary: "your-secondary-color",
      }
    }
  }
}
```

### Content Sections
Modify components in `client/src/components/`:
- `Hero.tsx` - Update hero text and imagery
- `About.tsx` - Personalize about section
- `Skills.tsx` - Add your skills
- `Projects.tsx` - Showcase projects
- `FAQ.tsx` - Update questions

---

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Express.js Guide](https://expressjs.com/)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/)
- [Vite Documentation](https://vitejs.dev/)

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built with [shadcn/ui](https://ui.shadcn.com/) for beautiful components
- Icons from [Lucide React](https://lucide.dev/)
- Images from [Unsplash](https://unsplash.com/)

---

**Built with ❤️ using modern web technologies**

> A professional portfolio that showcases your work while providing a powerful admin panel for content management. Production-ready with PM2 process management.
