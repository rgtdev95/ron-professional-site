import bcrypt from 'bcrypt';
import validator from 'validator';

const SALT_ROUNDS = 12;

/**
 * Password validation requirements:
 * - Minimum 15 characters
 * - At least 2 special characters
 * - At least 2 numbers
 */
export function validatePassword(password) {
    const errors = [];

    // Check minimum length
    if (!password || password.length < 15) {
        errors.push('Password must be at least 15 characters long');
    }

    // Count special characters
    const specialChars = password.match(/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/g);
    if (!specialChars || specialChars.length < 2) {
        errors.push('Password must contain at least 2 special characters (!@#$%^&*()_+-=[]{}|;:,.<>?)');
    }

    // Count numbers
    const numbers = password.match(/\d/g);
    if (!numbers || numbers.length < 2) {
        errors.push('Password must contain at least 2 numbers');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password) {
    try {
        return await bcrypt.hash(password, SALT_ROUNDS);
    } catch (error) {
        throw new Error('Failed to hash password');
    }
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password, hash) {
    try {
        return await bcrypt.compare(password, hash);
    } catch (error) {
        throw new Error('Failed to verify password');
    }
}

/**
 * Validate email format
 */
export function validateEmail(email) {
    if (!email) {
        return { isValid: false, error: 'Email is required' };
    }

    if (!validator.isEmail(email)) {
        return { isValid: false, error: 'Invalid email format' };
    }

    return { isValid: true };
}

/**
 * Validate username
 */
export function validateUsername(username) {
    const errors = [];

    if (!username) {
        errors.push('Username is required');
    } else {
        if (username.length < 3) {
            errors.push('Username must be at least 3 characters long');
        }
        if (username.length > 50) {
            errors.push('Username must not exceed 50 characters');
        }
        if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
            errors.push('Username can only contain letters, numbers, underscores, and hyphens');
        }
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

/**
 * Get password strength score (0-4)
 */
export function getPasswordStrength(password) {
    if (!password) return 0;

    let score = 0;

    // Length check
    if (password.length >= 15) score++;
    if (password.length >= 20) score++;

    // Character variety
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if ((password.match(/\d/g) || []).length >= 2) score++;
    if ((password.match(/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/g) || []).length >= 2) score++;

    return Math.min(score, 4);
}

/**
 * Get password strength label
 */
export function getPasswordStrengthLabel(score) {
    const labels = ['Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];
    return labels[score] || 'Very Weak';
}
