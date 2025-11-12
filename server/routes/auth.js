import express from 'express';
import { UsersModel } from '../models/index.js';
import { validatePassword, validateEmail, validateUsername, hashPassword, verifyPassword, getPasswordStrength, getPasswordStrengthLabel } from '../utils/password.js';
import { generateToken, authenticateToken, rateLimitAuth } from '../middleware/auth.js';

const router = express.Router();

// Check if initial setup is needed
router.get('/setup-status', (req, res) => {
    try {
        const hasUsers = UsersModel.hasAnyUsers();
        res.json({ 
            setup_required: !hasUsers,
            message: hasUsers ? 'Setup already completed' : 'Initial setup required'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Initial admin setup (one-time only)
router.post('/setup', async (req, res) => {
    try {
        // Check if setup is still needed
        if (UsersModel.hasAnyUsers()) {
            return res.status(409).json({ 
                error: 'Setup has already been completed. Admin account exists.',
                code: 'SETUP_ALREADY_COMPLETE'
            });
        }

        const { username, email, password, confirmPassword } = req.body;

        // Validate required fields
        if (!username || !email || !password || !confirmPassword) {
            return res.status(400).json({ 
                error: 'All fields are required',
                code: 'MISSING_FIELDS'
            });
        }

        // Validate password confirmation
        if (password !== confirmPassword) {
            return res.status(400).json({ 
                error: 'Passwords do not match',
                code: 'PASSWORD_MISMATCH'
            });
        }

        // Validate username
        const usernameValidation = validateUsername(username);
        if (!usernameValidation.isValid) {
            return res.status(400).json({ 
                error: 'Invalid username',
                details: usernameValidation.errors,
                code: 'INVALID_USERNAME'
            });
        }

        // Validate email
        const emailValidation = validateEmail(email);
        if (!emailValidation.isValid) {
            return res.status(400).json({ 
                error: emailValidation.error,
                code: 'INVALID_EMAIL'
            });
        }

        // Validate password
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
            return res.status(400).json({ 
                error: 'Password does not meet requirements',
                details: passwordValidation.errors,
                code: 'INVALID_PASSWORD'
            });
        }

        // Hash password
        const passwordHash = await hashPassword(password);

        // Create admin user
        const newUser = UsersModel.create({
            username: username.trim(),
            email: email.trim().toLowerCase(),
            password_hash: passwordHash,
            role: 'admin'
        });

        // Generate token
        const token = generateToken(newUser);

        // Return success with token
        res.status(201).json({
            message: 'Admin account created successfully',
            token,
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role
            }
        });

    } catch (error) {
        console.error('Setup error:', error);
        res.status(500).json({ 
            error: 'Failed to create admin account',
            code: 'SETUP_FAILED'
        });
    }
});

// Login
router.post('/login', rateLimitAuth, async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate required fields
        if (!username || !password) {
            return res.status(400).json({ 
                error: 'Username and password are required',
                code: 'MISSING_CREDENTIALS'
            });
        }

        // Check if user exists
        const user = UsersModel.getByUsername(username);
        if (!user) {
            return res.status(401).json({ 
                error: 'Invalid credentials',
                code: 'INVALID_CREDENTIALS'
            });
        }

        // Check if account is locked
        const lockStatus = UsersModel.isAccountLocked(username);
        if (lockStatus.locked) {
            return res.status(423).json({ 
                error: 'Account is locked due to multiple failed login attempts',
                code: 'ACCOUNT_LOCKED',
                locked_until: lockStatus.locked_until,
                failed_attempts: lockStatus.failed_attempts
            });
        }

        // Verify password
        const isValidPassword = await verifyPassword(password, user.password_hash);
        
        if (!isValidPassword) {
            // Record failed attempt
            UsersModel.recordFailedAttempt(username);
            
            return res.status(401).json({ 
                error: 'Invalid credentials',
                code: 'INVALID_CREDENTIALS'
            });
        }

        // Password is correct - reset failed attempts and generate token
        UsersModel.resetFailedAttempts(username);
        const token = generateToken(user);

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            error: 'Login failed',
            code: 'LOGIN_FAILED'
        });
    }
});

// Verify current token
router.get('/verify', authenticateToken, (req, res) => {
    res.json({
        message: 'Token is valid',
        user: req.user
    });
});

// Logout (client should remove token)
router.post('/logout', (req, res) => {
    res.json({ message: 'Logout successful' });
});


export default router;
