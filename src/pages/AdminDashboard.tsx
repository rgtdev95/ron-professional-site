import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBlogs, Blog, Testimonial } from '@/contexts/BlogContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Pencil, Trash2, ExternalLink, LogOut } from 'lucide-react';

const AdminDashboard = () => {
  const { 
    blogs, 
    addBlog, 
    updateBlog, 
    deleteBlog, 
    testimonials,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,
    isAuthenticated, 
    logout 
  } = useBlogs();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isEditingBlog, setIsEditingBlog] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [blogFormData, setBlogFormData] = useState({
    title: '',
    description: '',
    image: '',
    tags: '',
    externalUrl: '',
  });

  const [isEditingTestimonial, setIsEditingTestimonial] = useState(false);
  const [editingTestimonialId, setEditingTestimonialId] = useState<string | null>(null);
  const [testimonialFormData, setTestimonialFormData] = useState({
    quote: '',
    highlightedWords: '',
    author: '',
    role: '',
    avatar: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  // Blog handlers
  const handleBlogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const blogData = {
      ...blogFormData,
      tags: blogFormData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
    };

    if (editingBlogId) {
      updateBlog(editingBlogId, blogData);
      toast({ title: 'Blog updated successfully' });
    } else {
      addBlog(blogData);
      toast({ title: 'Blog added successfully' });
    }

    resetBlogForm();
  };

  const handleBlogEdit = (blog: Blog) => {
    setIsEditingBlog(true);
    setEditingBlogId(blog.id);
    setBlogFormData({
      title: blog.title,
      description: blog.description,
      image: blog.image,
      tags: blog.tags.join(', '),
      externalUrl: blog.externalUrl,
    });
  };

  const handleBlogDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this blog?')) {
      deleteBlog(id);
      toast({ title: 'Blog deleted successfully' });
    }
  };

  const resetBlogForm = () => {
    setIsEditingBlog(false);
    setEditingBlogId(null);
    setBlogFormData({
      title: '',
      description: '',
      image: '',
      tags: '',
      externalUrl: '',
    });
  };

  // Testimonial handlers
  const handleTestimonialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const testimonialData = {
      ...testimonialFormData,
      highlightedWords: testimonialFormData.highlightedWords.split(',').map(word => word.trim()).filter(Boolean),
    };

    if (editingTestimonialId) {
      updateTestimonial(editingTestimonialId, testimonialData);
      toast({ title: 'Testimonial updated successfully' });
    } else {
      addTestimonial(testimonialData);
      toast({ title: 'Testimonial added successfully' });
    }

    resetTestimonialForm();
  };

  const handleTestimonialEdit = (testimonial: Testimonial) => {
    setIsEditingTestimonial(true);
    setEditingTestimonialId(testimonial.id);
    setTestimonialFormData({
      quote: testimonial.quote,
      highlightedWords: testimonial.highlightedWords.join(', '),
      author: testimonial.author,
      role: testimonial.role,
      avatar: testimonial.avatar,
    });
  };

  const handleTestimonialDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this testimonial?')) {
      deleteTestimonial(id);
      toast({ title: 'Testimonial deleted successfully' });
    }
  };

  const resetTestimonialForm = () => {
    setIsEditingTestimonial(false);
    setEditingTestimonialId(null);
    setTestimonialFormData({
      quote: '',
      highlightedWords: '',
      author: '',
      role: '',
      avatar: '',
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast({ title: 'Logged out successfully' });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        <Tabs defaultValue="blogs" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
            <TabsTrigger value="blogs">Blogs</TabsTrigger>
            <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
          </TabsList>

          <TabsContent value="blogs">
            <div className="grid lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>{isEditingBlog ? 'Edit Blog' : 'Add New Blog'}</CardTitle>
                  <CardDescription>
                    {isEditingBlog ? 'Update the blog details' : 'Create a new blog post'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleBlogSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={blogFormData.title}
                        onChange={(e) => setBlogFormData({ ...blogFormData, title: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={blogFormData.description}
                        onChange={(e) => setBlogFormData({ ...blogFormData, description: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="image">Image URL</Label>
                      <Input
                        id="image"
                        type="url"
                        value={blogFormData.image}
                        onChange={(e) => setBlogFormData({ ...blogFormData, image: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tags">Tags (comma separated)</Label>
                      <Input
                        id="tags"
                        value={blogFormData.tags}
                        onChange={(e) => setBlogFormData({ ...blogFormData, tags: e.target.value })}
                        placeholder="React, Next.js, TypeScript"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="externalUrl">External Blog URL</Label>
                      <Input
                        id="externalUrl"
                        type="url"
                        value={blogFormData.externalUrl}
                        onChange={(e) => setBlogFormData({ ...blogFormData, externalUrl: e.target.value })}
                        placeholder="https://yourblog.com/post"
                        required
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button type="submit">
                        {isEditingBlog ? 'Update Blog' : 'Add Blog'}
                      </Button>
                      {isEditingBlog && (
                        <Button type="button" variant="outline" onClick={resetBlogForm}>
                          Cancel
                        </Button>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Manage Blogs</h2>
                {blogs.length === 0 ? (
                  <Card>
                    <CardContent className="py-8 text-center text-muted-foreground">
                      No blogs yet. Add your first blog!
                    </CardContent>
                  </Card>
                ) : (
                  blogs.map((blog) => (
                    <Card key={blog.id}>
                      <CardHeader>
                        <CardTitle className="flex justify-between items-start">
                          {blog.title}
                          <div className="flex gap-2">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => window.open(blog.externalUrl, '_blank')}
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleBlogEdit(blog)}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleBlogDelete(blog.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardTitle>
                        <CardDescription>{blog.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {blog.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="testimonials">
            <div className="grid lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>{isEditingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}</CardTitle>
                  <CardDescription>
                    {isEditingTestimonial ? 'Update the testimonial details' : 'Create a new testimonial'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleTestimonialSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="quote">Quote</Label>
                      <Textarea
                        id="quote"
                        value={testimonialFormData.quote}
                        onChange={(e) => setTestimonialFormData({ ...testimonialFormData, quote: e.target.value })}
                        rows={4}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="highlightedWords">Highlighted Words (comma separated)</Label>
                      <Input
                        id="highlightedWords"
                        value={testimonialFormData.highlightedWords}
                        onChange={(e) => setTestimonialFormData({ ...testimonialFormData, highlightedWords: e.target.value })}
                        placeholder="outstanding developer, exceeded expectations"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="author">Author Name</Label>
                      <Input
                        id="author"
                        value={testimonialFormData.author}
                        onChange={(e) => setTestimonialFormData({ ...testimonialFormData, author: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Input
                        id="role"
                        value={testimonialFormData.role}
                        onChange={(e) => setTestimonialFormData({ ...testimonialFormData, role: e.target.value })}
                        placeholder="Founder at Company"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="avatar">Avatar URL</Label>
                      <Input
                        id="avatar"
                        type="url"
                        value={testimonialFormData.avatar}
                        onChange={(e) => setTestimonialFormData({ ...testimonialFormData, avatar: e.target.value })}
                        placeholder="https://api.dicebear.com/7.x/avataaars/svg?seed=Name"
                        required
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button type="submit">
                        {isEditingTestimonial ? 'Update Testimonial' : 'Add Testimonial'}
                      </Button>
                      {isEditingTestimonial && (
                        <Button type="button" variant="outline" onClick={resetTestimonialForm}>
                          Cancel
                        </Button>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Manage Testimonials</h2>
                {testimonials.length === 0 ? (
                  <Card>
                    <CardContent className="py-8 text-center text-muted-foreground">
                      No testimonials yet. Add your first testimonial!
                    </CardContent>
                  </Card>
                ) : (
                  testimonials.map((testimonial) => (
                    <Card key={testimonial.id}>
                      <CardHeader>
                        <CardTitle className="flex justify-between items-start">
                          {testimonial.author}
                          <div className="flex gap-2">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleTestimonialEdit(testimonial)}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleTestimonialDelete(testimonial.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardTitle>
                        <CardDescription>{testimonial.role}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {testimonial.quote}
                        </p>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
