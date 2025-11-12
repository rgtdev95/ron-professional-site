# 🚀 Professional Portfolio Website

A modern, full-stack portfolio website built with React, TypeScript, and Express.js. Features a beautiful responsive design, secure admin panel, and dynamic blog management system.

![Portfolio Preview](https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80)

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
- **Testimonial Management** - Add, edit, and delete client testimonials
- **Real-time Updates** - Changes reflect immediately on the portfolio
- **Loading States** - Smooth UX with loading indicators and error handling

### 🛡️ **Security Features**
- JWT token-based authentication
- Password strength validation
- Account lockout after failed attempts
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
   cp server/.env.example server/.env
   ```

4. **Start development servers:**
   ```bash
   # Starts both frontend (port 5173) and backend (port 3000)
   npm run dev
   ```

5. **Access your portfolio:**
   - **Portfolio**: http://localhost:5173
   - **Admin Panel**: http://localhost:5173/admin
   - **API**: http://localhost:3000/api

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
│   │   │   └── SetupWizard.tsx # First-time setup
│   │   ├── pages/            # Page components
│   │   │   ├── Index.tsx     # Main portfolio page
│   │   │   ├── AdminDashboard.tsx # Admin panel
│   │   │   └── NotFound.tsx  # 404 page
│   │   ├── contexts/         # React contexts
│   │   │   └── BlogContext.tsx # Blog state management
│   │   ├── hooks/            # Custom hooks
│   │   │   └── useAuth.tsx   # Authentication hook
│   │   └── lib/              # Utilities and helpers
│   └── package.json          # Frontend dependencies
├── server/                   # Express.js Backend
│   ├── routes/              # API routes
│   │   ├── api.js           # Main API endpoints
│   │   └── auth.js          # Authentication routes
│   ├── models/              # Database models
│   ├── middleware/          # Express middleware
│   │   └── auth.js          # JWT authentication
│   ├── database/            # Database files
│   │   ├── schema.sql       # Database schema
│   │   └── portfolio.db     # SQLite database
│   ├── config/              # Configuration files
│   ├── utils/               # Utility functions
│   └── index.js             # Server entry point
└── package.json             # Root package.json
```

## 🔧 Development Workflow

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both frontend and backend in development mode |
| `npm run dev:client` | Start only React development server |
| `npm run dev:server` | Start only Express server with auto-reload |
| `npm run build` | Build React app for production |
| `npm start` | Start production server |

### Development URLs

- **Frontend Dev Server**: http://localhost:5173 (Vite)
- **Backend API**: http://localhost:3000
- **Admin Panel**: http://localhost:5173/admin

## 🔐 Admin Panel Guide

### First-Time Setup
1. Visit `/admin` on your portfolio website
2. If no admin account exists, you'll see the setup wizard
3. Create your admin account with:
   - Username (3+ characters)
   - Valid email address
   - Strong password (8+ chars, mixed case, numbers, symbols)
4. Complete setup to access the admin dashboard

### Managing Content

**Blog Posts:**
- Create new blog posts with title, description, image, and tags
- Edit existing posts inline
- Delete posts with confirmation
- All changes save to database immediately

**Testimonials:**
- Add client testimonials with quotes and highlighted words
- Include author information and avatars
- Edit or delete existing testimonials
- Currently stored in localStorage (database migration planned)

### Security Features
- JWT token authentication
- Automatic logout on token expiry
- Account lockout after 3 failed login attempts (12-hour lock)
- Rate limiting on authentication endpoints

## 📡 API Endpoints

### Authentication
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/setup-status` | GET | Check if admin account exists |
| `/api/auth/setup` | POST | Create initial admin account |
| `/api/auth/login` | POST | Admin login |
| `/api/auth/verify` | GET | Verify JWT token |
| `/api/auth/logout` | POST | Logout (client removes token) |

### Blog Management
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/blog-posts` | GET | Fetch all blog posts |
| `/api/blog-posts/:id` | GET | Fetch single blog post |
| `/api/blog-posts` | POST | Create new blog post |
| `/api/blog-posts/:id` | PUT | Update blog post |
| `/api/blog-posts/:id` | DELETE | Delete blog post |

### Projects (Future Enhancement)
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
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
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

## 🚀 Deployment

### Production Architecture

In production, Express serves **both** the API and the React build files from a single server:

- **Portfolio & Admin**: `http://your-domain.com/` → React SPA
- **API Endpoints**: `http://your-domain.com/api/*` → Express handlers
- **Single Server**: One Express.js process handles everything

### Build for Production

### Environment Variables

Create `server/.env`:
```env
NODE_ENV=production
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-here
DB_PATH=./database/portfolio.db
```

1. **Build the React frontend:**
   ```bash
   cd client && npm run build
   # Creates optimized build in client/dist/
   ```

2. **Copy build files to server:**
   ```bash
   # The server expects build files in ../dist/ relative to server/
   cp -r client/dist/* ./dist/
   # Or configure your deployment to handle this automatically
   ```

3. **Start production server:**
   ```bash
   cd server && npm start
   # Single server on port 3000 serves both React app and API
   ```

### Production URLs

After deployment, everything runs from one domain:

- **Portfolio**: `https://your-domain.com/`
- **Admin Panel**: `https://your-domain.com/admin`
- **API**: `https://your-domain.com/api/*`


### Deployment Platforms

**Recommended platforms for full-stack deployment:**

- **Railway** - Automatic builds, supports Node.js + SQLite
- **DigitalOcean App Platform** - Managed hosting with database
- **Render** - Free tier available, easy Node.js deployment
- **Heroku** - Classic PaaS (Note: SQLite files don't persist on Heroku)

### Platform-Specific Notes

**Railway/Render:**
- ✅ SQLite files persist between deployments
- ✅ Zero-config Node.js deployment
- ✅ Automatic HTTPS

**Vercel:**
- ⚠️ Requires serverless functions setup
- ⚠️ SQLite persistence issues (consider PostgreSQL)

**Heroku:**
- ⚠️ SQLite files reset on restart (use PostgreSQL add-on)
- ✅ Easy deployment with git push

## 🎨 Customization

### Theme Colors
Edit `client/tailwind.config.ts` to customize the color scheme:

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
Modify React components in `client/src/components/` to update:
- Hero section text and imagery
- About section content
- Skills and technologies
- FAQ questions
- Contact information

## 🐛 Troubleshooting

### Common Issues

**Port Already in Use:**
```bash
# Kill processes on ports
npx kill-port 3000 5173
```

**Database Issues:**
```bash
# Database is auto-created
# Check server/database/portfolio.db
```

**Authentication Problems:**
```bash
# Reset admin account (deletes all data)
rm server/database/portfolio.db
# Restart server to recreate database
```

**Build Failures:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules client/node_modules server/node_modules
npm install
cd client && npm install
cd ../server && npm install
```

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Express.js Guide](https://expressjs.com/)
- [Vite Documentation](https://vitejs.dev/)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [shadcn/ui](https://ui.shadcn.com/) for beautiful components
- Icons from [Lucide React](https://lucide.dev/)
- Images from [Unsplash](https://unsplash.com/)
- Inspiration from modern portfolio designs

---

**Built with ❤️ using modern web technologies**

> A professional portfolio that showcases your work while providing a powerful admin panel for content management.
