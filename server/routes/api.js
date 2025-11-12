import express from 'express';
import { 
    ProjectsModel, 
    SiteSettingsModel, 
    BlogPostsModel 
} from '../models/index.js';

const router = express.Router();

// Projects Routes
router.get('/projects', (req, res) => {
    try {
        const projects = ProjectsModel.getAll();
        // Parse technologies JSON for each project
        const parsedProjects = projects.map(project => ({
            ...project,
            technologies: project.technologies ? JSON.parse(project.technologies) : [],
            featured: Boolean(project.featured)
        }));
        res.json(parsedProjects);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/projects/featured', (req, res) => {
    try {
        const projects = ProjectsModel.getFeatured();
        const parsedProjects = projects.map(project => ({
            ...project,
            technologies: project.technologies ? JSON.parse(project.technologies) : [],
            featured: Boolean(project.featured)
        }));
        res.json(parsedProjects);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/projects/:id', (req, res) => {
    try {
        const project = ProjectsModel.getById(req.params.id);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        const parsedProject = {
            ...project,
            technologies: project.technologies ? JSON.parse(project.technologies) : [],
            featured: Boolean(project.featured)
        };
        res.json(parsedProject);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/projects', (req, res) => {
    try {
        const project = ProjectsModel.create(req.body);
        const parsedProject = {
            ...project,
            technologies: project.technologies ? JSON.parse(project.technologies) : [],
            featured: Boolean(project.featured)
        };
        res.status(201).json(parsedProject);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/projects/:id', (req, res) => {
    try {
        const project = ProjectsModel.update(req.params.id, req.body);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        const parsedProject = {
            ...project,
            technologies: project.technologies ? JSON.parse(project.technologies) : [],
            featured: Boolean(project.featured)
        };
        res.json(parsedProject);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/projects/:id', (req, res) => {
    try {
        const result = ProjectsModel.delete(req.params.id);
        if (result.changes === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Site Settings Routes
router.get('/settings', (req, res) => {
    try {
        const settings = SiteSettingsModel.getAll();
        res.json(settings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/settings/:key', (req, res) => {
    try {
        const setting = SiteSettingsModel.getByKey(req.params.key);
        if (!setting) {
            return res.status(404).json({ error: 'Setting not found' });
        }
        res.json(setting);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/settings/:key', (req, res) => {
    try {
        const { value } = req.body;
        const setting = SiteSettingsModel.update(req.params.key, value);
        res.json(setting);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Blog Posts Routes (optional)
router.get('/blog-posts', (req, res) => {
    try {
        const posts = BlogPostsModel.getAll();
        const parsedPosts = posts.map(post => ({
            ...post,
            tags: post.tags ? JSON.parse(post.tags) : [],
            published: Boolean(post.published)
        }));
        res.json(parsedPosts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/blog-posts/:id', (req, res) => {
    try {
        const post = BlogPostsModel.getById(req.params.id);
        if (!post) {
            return res.status(404).json({ error: 'Blog post not found' });
        }
        const parsedPost = {
            ...post,
            tags: post.tags ? JSON.parse(post.tags) : [],
            published: Boolean(post.published)
        };
        res.json(parsedPost);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/blog-posts', (req, res) => {
    try {
        const post = BlogPostsModel.create(req.body);
        const parsedPost = {
            ...post,
            tags: post.tags ? JSON.parse(post.tags) : [],
            published: Boolean(post.published)
        };
        res.status(201).json(parsedPost);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/blog-posts/:id', (req, res) => {
    try {
        const post = BlogPostsModel.update(req.params.id, req.body);
        if (!post) {
            return res.status(404).json({ error: 'Blog post not found' });
        }
        const parsedPost = {
            ...post,
            tags: post.tags ? JSON.parse(post.tags) : [],
            published: Boolean(post.published)
        };
        res.json(parsedPost);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/blog-posts/:id', (req, res) => {
    try {
        const result = BlogPostsModel.delete(req.params.id);
        if (result.changes === 0) {
            return res.status(404).json({ error: 'Blog post not found' });
        }
        res.json({ message: 'Blog post deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Health check endpoint
router.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Portfolio API is running',
        timestamp: new Date().toISOString()
    });
});

export default router;
