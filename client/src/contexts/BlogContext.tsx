import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Blog {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  externalUrl: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  highlightedWords: string[];
  author: string;
  role: string;
  avatar: string;
}

interface BlogContextType {
  blogs: Blog[];
  addBlog: (blog: Omit<Blog, 'id'>) => Promise<void>;
  updateBlog: (id: string, blog: Omit<Blog, 'id'>) => Promise<void>;
  deleteBlog: (id: string) => Promise<void>;
  testimonials: Testimonial[];
  addTestimonial: (testimonial: Omit<Testimonial, 'id'>) => void;
  updateTestimonial: (id: string, testimonial: Omit<Testimonial, 'id'>) => void;
  deleteTestimonial: (id: string) => void;
  loading: boolean;
  error: string | null;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

const TESTIMONIALS_KEY = 'portfolio_testimonials';

// API Base URL - adjust this to match your server
const API_BASE = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api`
  : import.meta.env.PROD 
    ? '/api' 
    : 'http://localhost:3000/api';

// API helper function
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

export const BlogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load data on component mount
  useEffect(() => {
    loadBlogs();
    loadTestimonials();
  }, []);

  // Load blogs from database
  const loadBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiCall('/blog-posts');
      
      // Map server data structure to client interface
      const mappedBlogs: Blog[] = data.map((post: any) => ({
        id: post.id.toString(),
        title: post.title,
        description: post.content || post.excerpt || '',
        image: post.featured_image || '',
        tags: post.tags || [],
        externalUrl: '' // Database doesn't support external URLs yet
      }));
      
      setBlogs(mappedBlogs);
    } catch (error) {
      console.error('Failed to load blogs:', error);
      // Fallback to localStorage if API fails
      loadBlogsFromLocalStorage();
    } finally {
      setLoading(false);
    }
  };

  // Fallback to localStorage if API is not available
  const loadBlogsFromLocalStorage = () => {
    const sampleBlogs: Blog[] = [
      {
        id: '1',
        title: 'Building Modern Web Apps with React',
        description: 'A comprehensive guide to creating scalable and performant React applications using modern best practices.',
        image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop',
        tags: ['React', 'TypeScript', 'Web Development'],
        externalUrl: 'https://example.com/blog/modern-react',
      },
      {
        id: '2',
        title: 'Mastering TypeScript: From Basics to Advanced',
        description: 'Deep dive into TypeScript features, type systems, and how to write type-safe code for large-scale applications.',
        image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&auto=format&fit=crop',
        tags: ['TypeScript', 'JavaScript', 'Programming'],
        externalUrl: 'https://example.com/blog/typescript-guide',
      },
    ];
    setBlogs(sampleBlogs);
    setError('Using offline data - server connection failed');
  };

  const loadTestimonials = () => {
    const storedTestimonials = localStorage.getItem(TESTIMONIALS_KEY);
    if (storedTestimonials) {
      setTestimonials(JSON.parse(storedTestimonials));
    } else {
      const sampleTestimonials: Testimonial[] = [
        {
          id: '1',
          quote: "Alicia Smith is an outstanding developer. She understood our needs right away and delivered a website that exceeded expectations. Great communication, attention to detail, and top-notch skills. Highly recommended!",
          highlightedWords: ["outstanding developer", "exceeded expectations"],
          author: "Peter Norris",
          role: "Founder at Acme Inc.",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Peter",
        },
        {
          id: '2',
          quote: "Alicia Smith is a fantastic developer. She understood our needs and delivered a website that exceeded expectations. Her communication and attention to detail are outstanding. I highly recommend her!",
          highlightedWords: ["exceeded expectations", "outstanding"],
          author: "Ann Helfer",
          role: "Founder at Design Stars",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ann",
        },
      ];
      setTestimonials(sampleTestimonials);
      localStorage.setItem(TESTIMONIALS_KEY, JSON.stringify(sampleTestimonials));
    }
  };

  // Blog CRUD operations using server API
  const addBlog = async (blog: Omit<Blog, 'id'>) => {
    try {
      setLoading(true);
      setError(null);
      
      // Map client interface to server structure (matching BlogPostsModel.create expectations)
      const serverData = {
        title: blog.title,
        slug: blog.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        content: blog.description, // Full description as content
        excerpt: blog.description.substring(0, 200), // First 200 chars as excerpt
        featured_image: blog.image,
        published: true,
        tags: blog.tags
      };

      const newPost = await apiCall('/blog-posts', {
        method: 'POST',
        body: JSON.stringify(serverData),
      });

      // Map back to client interface
      const newBlog: Blog = {
        id: newPost.id.toString(),
        title: newPost.title,
        description: newPost.content || newPost.excerpt || '',
        image: newPost.featured_image || '',
        tags: newPost.tags || [],
        externalUrl: blog.externalUrl // Store externally since DB doesn't support it yet
      };

      setBlogs([...blogs, newBlog]);
    } catch (error) {
      setError('Failed to add blog post');
      console.error('Add blog error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateBlog = async (id: string, blog: Omit<Blog, 'id'>) => {
    try {
      setLoading(true);
      setError(null);

      // Map client interface to server structure (matching BlogPostsModel.update expectations)
      const serverData = {
        title: blog.title,
        slug: blog.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        content: blog.description, // Full description as content
        excerpt: blog.description.substring(0, 200), // First 200 chars as excerpt
        featured_image: blog.image,
        published: true,
        tags: blog.tags
      };

      const updatedPost = await apiCall(`/blog-posts/${id}`, {
        method: 'PUT',
        body: JSON.stringify(serverData),
      });

      const updatedBlog: Blog = {
        id: updatedPost.id.toString(),
        title: updatedPost.title,
        description: updatedPost.content || updatedPost.excerpt || '',
        image: updatedPost.featured_image || '',
        tags: updatedPost.tags || [],
        externalUrl: blog.externalUrl // Keep external URL from client data
      };

      setBlogs(blogs.map(b => b.id === id ? updatedBlog : b));
    } catch (error) {
      setError('Failed to update blog post');
      console.error('Update blog error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteBlog = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      await apiCall(`/blog-posts/${id}`, {
        method: 'DELETE',
      });

      setBlogs(blogs.filter(b => b.id !== id));
    } catch (error) {
      setError('Failed to delete blog post');
      console.error('Delete blog error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Testimonial operations (still using localStorage for now)
  const saveTestimonials = (newTestimonials: Testimonial[]) => {
    setTestimonials(newTestimonials);
    localStorage.setItem(TESTIMONIALS_KEY, JSON.stringify(newTestimonials));
  };

  const addTestimonial = (testimonial: Omit<Testimonial, 'id'>) => {
    const newTestimonial = { ...testimonial, id: Date.now().toString() };
    saveTestimonials([...testimonials, newTestimonial]);
  };

  const updateTestimonial = (id: string, testimonial: Omit<Testimonial, 'id'>) => {
    const updatedTestimonials = testimonials.map(t => t.id === id ? { ...testimonial, id } : t);
    saveTestimonials(updatedTestimonials);
  };

  const deleteTestimonial = (id: string) => {
    saveTestimonials(testimonials.filter(t => t.id !== id));
  };

  return (
    <BlogContext.Provider value={{ 
      blogs, 
      addBlog, 
      updateBlog, 
      deleteBlog, 
      testimonials, 
      addTestimonial, 
      updateTestimonial, 
      deleteTestimonial, 
      loading,
      error
    }}>
      {children}
    </BlogContext.Provider>
  );
};

export const useBlogs = () => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error('useBlogs must be used within BlogProvider');
  }
  return context;
};
