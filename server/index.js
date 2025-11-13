import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';
import { initializeDatabase } from './config/database.js';
import apiRoutes from './routes/api.js';
import authRoutes from './routes/auth.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Initialize database
try {
    initializeDatabase();
} catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
}

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https:"],
            scriptSrc: ["'self'"],
        },
    },
    crossOriginEmbedderPolicy: false
}));

// CORS configuration
const corsOptions = {
    origin: NODE_ENV === 'development' 
        ? ['http://localhost:8080', 'http://localhost:3000', 'http://127.0.0.1:8080','http://10.0.0.105:3000']
        : false, // Disable CORS in production (same-origin deployment)
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware (development only)
if (NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
        next();
    });
}

// API routes
app.use('/api', apiRoutes);
app.use('/api/auth', authRoutes);

// Static file serving for production
if (NODE_ENV === 'production') {
    const distPath = join(__dirname, '../dist');
    
    // Serve static files from the React app build directory
    app.use(express.static(distPath));
    
    // Handle React routing - send all non-API requests to index.html
    app.get('*', (req, res) => {
        res.sendFile(join(distPath, 'index.html'));
    });
} else {
    // Development mode - just show API info
    app.get('/', (req, res) => {
        res.json({
            message: 'Portfolio API Server',
            environment: NODE_ENV,
            port: PORT,
            endpoints: {
                health: '/api/health',
                projects: '/api/projects',
                contact: '/api/contact',
                settings: '/api/settings',
                blog: '/api/blog-posts'
            },
            frontend: NODE_ENV === 'development' 
                ? 'Running separately on http://localhost:8080' 
                : 'Served from /dist'
        });
    });
}

// 404 handler for API routes
app.use('/api/*', (req, res) => {
    res.status(404).json({ 
        error: 'API endpoint not found',
        path: req.path,
        method: req.method
    });
});

// Global error handler
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    
    res.status(500).json({
        error: NODE_ENV === 'development' ? error.message : 'Internal server error',
        ...(NODE_ENV === 'development' && { stack: error.stack })
    });
});

// Start server
const HOST = '0.0.0.0';
app.listen(PORT, HOST, () => {
    console.log(`
🚀 Portfolio Server Started Successfully!

📍 Server Details:
   • Environment: ${NODE_ENV}
   • Port: ${PORT}
   • URL: http://${HOST}:${PORT}

🔗 API Endpoints:
   • Health Check: http://${HOST}:${PORT}/api/health
   • Projects: http://${HOST}:${PORT}/api/projects
   • Contact: http://${HOST}:${PORT}/api/contact
   • Settings: http://${HOST}:${PORT}/api/settings

${NODE_ENV === 'development' 
    ? '⚡ Development Mode: Frontend should be running on http://localhost:8080' 
    : '📦 Production Mode: Serving static files from /dist'
}

💾 Database: SQLite (${join(__dirname, 'database/portfolio.db')})
    `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT received. Shutting down gracefully...');
    process.exit(0);
});
