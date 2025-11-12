import jwt from 'jsonwebtoken';
import { UsersModel } from '../models/index.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

/**
 * Generate JWT token for user
 */
export function generateToken(user) {
    return jwt.sign(
        {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );
}

/**
 * Verify JWT token
 */
export function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
}

/**
 * Authentication middleware
 * Extracts token from Authorization header or cookies
 */
export function authenticateToken(req, res, next) {
    let token;

    // Try to get token from Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
    }
    
    // Try to get token from cookies if not found in header
    if (!token && req.cookies && req.cookies.auth_token) {
        token = req.cookies.auth_token;
    }

    if (!token) {
        return res.status(401).json({ 
            error: 'Access denied. No token provided.',
            code: 'NO_TOKEN'
        });
    }

    try {
        const decoded = verifyToken(token);
        if (!decoded) {
            return res.status(401).json({ 
                error: 'Invalid token.',
                code: 'INVALID_TOKEN'
            });
        }

        // Verify user still exists in database
        const user = UsersModel.getById(decoded.id);
        if (!user) {
            return res.status(401).json({ 
                error: 'User no longer exists.',
                code: 'USER_NOT_FOUND'
            });
        }

        // Check if user account is locked
        if (user.locked_until) {
            const lockoutExpiry = new Date(user.locked_until);
            if (lockoutExpiry > new Date()) {
                return res.status(423).json({ 
                    error: 'Account is locked due to multiple failed login attempts.',
                    code: 'ACCOUNT_LOCKED',
                    locked_until: user.locked_until
                });
            }
        }

        // Attach user to request
        req.user = {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
        };

        next();
    } catch (error) {
        return res.status(401).json({ 
            error: 'Invalid token.',
            code: 'TOKEN_ERROR'
        });
    }
}

/**
 * Admin role middleware
 * Requires user to be authenticated and have admin role
 */
export function requireAdmin(req, res, next) {
    if (!req.user) {
        return res.status(401).json({ 
            error: 'Authentication required.',
            code: 'AUTH_REQUIRED'
        });
    }

    if (req.user.role !== 'admin') {
        return res.status(403).json({ 
            error: 'Admin access required.',
            code: 'ADMIN_REQUIRED'
        });
    }

    next();
}

/**
 * Optional authentication middleware
 * Does not reject if no token, but populates user if valid token exists
 */
export function optionalAuth(req, res, next) {
    let token;

    // Try to get token from Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
    }
    
    // Try to get token from cookies if not found in header
    if (!token && req.cookies && req.cookies.auth_token) {
        token = req.cookies.auth_token;
    }

    if (!token) {
        // No token provided, continue without authentication
        req.user = null;
        return next();
    }

    try {
        const decoded = verifyToken(token);
        if (decoded) {
            // Verify user still exists in database
            const user = UsersModel.getById(decoded.id);
            if (user) {
                req.user = {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                };
            }
        }
    } catch (error) {
        // Invalid token, continue without authentication
        req.user = null;
    }

    next();
}

/**
 * Rate limiting middleware for authentication endpoints
 */
const loginAttempts = new Map();

export function rateLimitAuth(req, res, next) {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const windowMs = 15 * 60 * 1000; // 15 minutes
    const maxAttempts = 10; // Max 10 attempts per 15 minutes

    if (!loginAttempts.has(ip)) {
        loginAttempts.set(ip, { count: 1, resetTime: now + windowMs });
        return next();
    }

    const attempts = loginAttempts.get(ip);
    
    if (now > attempts.resetTime) {
        // Reset window
        loginAttempts.set(ip, { count: 1, resetTime: now + windowMs });
        return next();
    }

    if (attempts.count >= maxAttempts) {
        return res.status(429).json({
            error: 'Too many authentication attempts. Please try again later.',
            code: 'RATE_LIMITED',
            reset_time: new Date(attempts.resetTime).toISOString()
        });
    }

    attempts.count++;
    loginAttempts.set(ip, attempts);
    next();
}
