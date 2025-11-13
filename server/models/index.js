import { getDatabase } from '../config/database.js';

// Projects model
export class ProjectsModel {
    static getAll() {
        const db = getDatabase();
        return db.prepare('SELECT * FROM projects ORDER BY created_at DESC').all();
    }

    static getById(id) {
        const db = getDatabase();
        return db.prepare('SELECT * FROM projects WHERE id = ?').get(id);
    }

    static getFeatured() {
        const db = getDatabase();
        return db.prepare('SELECT * FROM projects WHERE featured = 1 ORDER BY created_at DESC').all();
    }

    static create(project) {
        const db = getDatabase();
        const stmt = db.prepare(`
            INSERT INTO projects (title, description, long_description, technologies, github_url, live_url, image_url, featured, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        
        const result = stmt.run(
            project.title,
            project.description,
            project.long_description,
            JSON.stringify(project.technologies),
            project.github_url,
            project.live_url,
            project.image_url,
            project.featured ? 1 : 0,
            project.status || 'active'
        );
        
        return this.getById(result.lastInsertRowid);
    }

    static update(id, project) {
        const db = getDatabase();
        const stmt = db.prepare(`
            UPDATE projects 
            SET title = ?, description = ?, long_description = ?, technologies = ?, 
                github_url = ?, live_url = ?, image_url = ?, featured = ?, status = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `);
        
        stmt.run(
            project.title,
            project.description,
            project.long_description,
            JSON.stringify(project.technologies),
            project.github_url,
            project.live_url,
            project.image_url,
            project.featured ? 1 : 0,
            project.status,
            id
        );
        
        return this.getById(id);
    }

    static delete(id) {
        const db = getDatabase();
        return db.prepare('DELETE FROM projects WHERE id = ?').run(id);
    }
}

// Contact Messages model
export class ContactMessagesModel {
    static getAll() {
        const db = getDatabase();
        return db.prepare('SELECT * FROM contact_messages ORDER BY created_at DESC').all();
    }

    static getById(id) {
        const db = getDatabase();
        return db.prepare('SELECT * FROM contact_messages WHERE id = ?').get(id);
    }

    static getUnread() {
        const db = getDatabase();
        return db.prepare('SELECT * FROM contact_messages WHERE status = "unread" ORDER BY created_at DESC').all();
    }

    static create(message) {
        const db = getDatabase();
        const stmt = db.prepare(`
            INSERT INTO contact_messages (name, email, subject, message)
            VALUES (?, ?, ?, ?)
        `);
        
        const result = stmt.run(
            message.name,
            message.email,
            message.subject,
            message.message
        );
        
        return this.getById(result.lastInsertRowid);
    }

    static updateStatus(id, status) {
        const db = getDatabase();
        const stmt = db.prepare('UPDATE contact_messages SET status = ? WHERE id = ?');
        stmt.run(status, id);
        return this.getById(id);
    }

    static delete(id) {
        const db = getDatabase();
        return db.prepare('DELETE FROM contact_messages WHERE id = ?').run(id);
    }
}

// Users model (for admin authentication)
export class UsersModel {
    static getAll() {
        const db = getDatabase();
        return db.prepare('SELECT id, username, email, role, created_at FROM users').all();
    }

    static getById(id) {
        const db = getDatabase();
        return db.prepare('SELECT id, username, email, role, created_at FROM users WHERE id = ?').get(id);
    }

    static getByUsername(username) {
        const db = getDatabase();
        return db.prepare('SELECT * FROM users WHERE username = ?').get(username);
    }

    static getByEmail(email) {
        const db = getDatabase();
        return db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    }

    static create(user) {
        const db = getDatabase();
        const stmt = db.prepare(`
            INSERT INTO users (username, email, password_hash, role)
            VALUES (?, ?, ?, ?)
        `);
        
        const result = stmt.run(
            user.username,
            user.email,
            user.password_hash,
            user.role || 'admin'
        );
        
        return this.getById(result.lastInsertRowid);
    }

    static update(id, user) {
        const db = getDatabase();
        const stmt = db.prepare(`
            UPDATE users 
            SET username = ?, email = ?, role = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `);
        
        stmt.run(user.username, user.email, user.role, id);
        return this.getById(id);
    }

    static delete(id) {
        const db = getDatabase();
        return db.prepare('DELETE FROM users WHERE id = ?').run(id);
    }

    // Account lockout methods
    static recordFailedAttempt(username) {
        const db = getDatabase();
        const user = this.getByUsername(username);
        
        if (!user) return null;

        const now = new Date().toISOString();
        const failedAttempts = (user.failed_attempts || 0) + 1;
        
        let lockedUntil = null;
        if (failedAttempts >= 3) {
            // Lock account for 12 hours
            const lockoutTime = new Date();
            lockoutTime.setHours(lockoutTime.getHours() + 12);
            lockedUntil = lockoutTime.toISOString();
        }

        const stmt = db.prepare(`
            UPDATE users 
            SET failed_attempts = ?, last_failed_attempt = ?, locked_until = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `);

        stmt.run(failedAttempts, now, lockedUntil, user.id);
        return this.getById(user.id);
    }

    static resetFailedAttempts(username) {
        const db = getDatabase();
        const user = this.getByUsername(username);
        
        if (!user) return null;

        const stmt = db.prepare(`
            UPDATE users 
            SET failed_attempts = 0, locked_until = NULL, last_failed_attempt = NULL, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `);

        stmt.run(user.id);
        return this.getById(user.id);
    }

    static isAccountLocked(username) {
        const user = this.getByUsername(username);
        
        if (!user || !user.locked_until) {
            return { locked: false };
        }

        const lockoutExpiry = new Date(user.locked_until);
        const now = new Date();

        if (lockoutExpiry > now) {
            return {
                locked: true,
                locked_until: user.locked_until,
                failed_attempts: user.failed_attempts
            };
        } else {
            // Lockout has expired, reset it
            this.resetFailedAttempts(username);
            return { locked: false };
        }
    }

    static unlockAccount(username) {
        const db = getDatabase();
        const user = this.getByUsername(username);
        
        if (!user) return null;

        const stmt = db.prepare(`
            UPDATE users 
            SET failed_attempts = 0, locked_until = NULL, last_failed_attempt = NULL, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `);

        stmt.run(user.id);
        return this.getById(user.id);
    }

    static hasAnyUsers() {
        const db = getDatabase();
        const result = db.prepare('SELECT COUNT(*) as count FROM users').get();
        return result.count > 0;
    }
}

// Site Settings model
export class SiteSettingsModel {
    static getAll() {
        const db = getDatabase();
        return db.prepare('SELECT * FROM site_settings ORDER BY setting_key').all();
    }

    static getByKey(key) {
        const db = getDatabase();
        return db.prepare('SELECT * FROM site_settings WHERE setting_key = ?').get(key);
    }

    static getValue(key) {
        const setting = this.getByKey(key);
        return setting ? setting.setting_value : null;
    }

    static update(key, value) {
        const db = getDatabase();
        const stmt = db.prepare(`
            INSERT OR REPLACE INTO site_settings (setting_key, setting_value, updated_at)
            VALUES (?, ?, CURRENT_TIMESTAMP)
        `);
        
        stmt.run(key, value);
        return this.getByKey(key);
    }

    static delete(key) {
        const db = getDatabase();
        return db.prepare('DELETE FROM site_settings WHERE setting_key = ?').run(key);
    }
}

// Blog Posts model (optional)
export class BlogPostsModel {
    static getAll() {
        const db = getDatabase();
        return db.prepare('SELECT * FROM blog_posts ORDER BY created_at DESC').all();
    }

    static getPublished() {
        const db = getDatabase();
        return db.prepare('SELECT * FROM blog_posts WHERE published = 1 ORDER BY published_at DESC').all();
    }

    static getById(id) {
        const db = getDatabase();
        return db.prepare('SELECT * FROM blog_posts WHERE id = ?').get(id);
    }

    static getBySlug(slug) {
        const db = getDatabase();
        return db.prepare('SELECT * FROM blog_posts WHERE slug = ?').get(slug);
    }

    static create(post) {
        const db = getDatabase();
        const stmt = db.prepare(`
            INSERT INTO blog_posts (title, slug, content, excerpt, featured_image, published, tags)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `);
        
        const result = stmt.run(
            post.title,
            post.slug,
            post.content,
            post.excerpt,
            post.featured_image,
            post.published ? 1 : 0,
            JSON.stringify(post.tags || [])
        );
        
        return this.getById(result.lastInsertRowid);
    }

    static update(id, post) {
        const db = getDatabase();
        
        // Get existing post to merge with updates
        const existing = this.getById(id);
        if (!existing) {
            return null;
        }
        
        // Merge existing data with updates, ensuring no undefined values
        const updatedPost = {
            title: post.title !== undefined ? post.title : existing.title,
            slug: post.slug !== undefined ? post.slug : existing.slug,
            content: post.content !== undefined ? post.content : existing.content,
            excerpt: post.excerpt !== undefined ? post.excerpt : existing.excerpt,
            featured_image: post.featured_image !== undefined ? post.featured_image : existing.featured_image,
            published: post.published !== undefined ? (post.published ? 1 : 0) : existing.published,
            tags: post.tags !== undefined ? JSON.stringify(post.tags) : existing.tags
        };
        
        const stmt = db.prepare(`
            UPDATE blog_posts 
            SET title = ?, slug = ?, content = ?, excerpt = ?, featured_image = ?, 
                published = ?, tags = ?, updated_at = CURRENT_TIMESTAMP,
                published_at = CASE WHEN ? = 1 AND published = 0 THEN CURRENT_TIMESTAMP ELSE published_at END
            WHERE id = ?
        `);
        
        stmt.run(
            updatedPost.title,
            updatedPost.slug,
            updatedPost.content,
            updatedPost.excerpt,
            updatedPost.featured_image,
            updatedPost.published,
            updatedPost.tags,
            updatedPost.published,
            id
        );
        
        return this.getById(id);
    }

    static delete(id) {
        const db = getDatabase();
        return db.prepare('DELETE FROM blog_posts WHERE id = ?').run(id);
    }
}
