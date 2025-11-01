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
  addBlog: (blog: Omit<Blog, 'id'>) => void;
  updateBlog: (id: string, blog: Omit<Blog, 'id'>) => void;
  deleteBlog: (id: string) => void;
  testimonials: Testimonial[];
  addTestimonial: (testimonial: Omit<Testimonial, 'id'>) => void;
  updateTestimonial: (id: string, testimonial: Omit<Testimonial, 'id'>) => void;
  deleteTestimonial: (id: string) => void;
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

const ADMIN_PASSWORD = 'admin123'; // Change this password
const STORAGE_KEY = 'portfolio_blogs';
const TESTIMONIALS_KEY = 'portfolio_testimonials';
const AUTH_KEY = 'portfolio_auth';

export const BlogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedBlogs = localStorage.getItem(STORAGE_KEY);
    if (storedBlogs) {
      setBlogs(JSON.parse(storedBlogs));
    } else {
      // Add sample blogs if none exist
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
        {
          id: '3',
          title: 'CSS Grid & Flexbox: Complete Layout Guide',
          description: 'Master modern CSS layouts with practical examples and real-world use cases for responsive design.',
          image: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800&auto=format&fit=crop',
          tags: ['CSS', 'Web Design', 'Frontend'],
          externalUrl: 'https://example.com/blog/css-layouts',
        },
      ];
      setBlogs(sampleBlogs);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleBlogs));
    }

    const storedTestimonials = localStorage.getItem(TESTIMONIALS_KEY);
    if (storedTestimonials) {
      setTestimonials(JSON.parse(storedTestimonials));
    } else {
      // Add sample testimonials if none exist
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
    
    const authStatus = localStorage.getItem(AUTH_KEY);
    setIsAuthenticated(authStatus === 'true');
  }, []);

  const saveBlogs = (newBlogs: Blog[]) => {
    setBlogs(newBlogs);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newBlogs));
  };

  const saveTestimonials = (newTestimonials: Testimonial[]) => {
    setTestimonials(newTestimonials);
    localStorage.setItem(TESTIMONIALS_KEY, JSON.stringify(newTestimonials));
  };

  const addBlog = (blog: Omit<Blog, 'id'>) => {
    const newBlog = { ...blog, id: Date.now().toString() };
    saveBlogs([...blogs, newBlog]);
  };

  const updateBlog = (id: string, blog: Omit<Blog, 'id'>) => {
    const updatedBlogs = blogs.map(b => b.id === id ? { ...blog, id } : b);
    saveBlogs(updatedBlogs);
  };

  const deleteBlog = (id: string) => {
    saveBlogs(blogs.filter(b => b.id !== id));
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

  const login = (password: string) => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem(AUTH_KEY, 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem(AUTH_KEY);
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
      isAuthenticated, 
      login, 
      logout 
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
