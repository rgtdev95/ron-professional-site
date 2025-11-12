import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useBlogs } from "@/contexts/BlogContext";
import { ExternalLink } from "lucide-react";

const Projects = () => {
  const { blogs } = useBlogs();

  return (
    <section id="projects" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl font-bold">Discover what I've created</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Each piece reflects my passion for innovation and commitment to delivering 
            high-quality results. Feel free to explore and get inspired!
          </p>
        </div>
        
        {blogs.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No blogs yet. Check back soon!
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <a
                key={blog.id}
                href={blog.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <Card className="overflow-hidden border-border bg-card hover:shadow-xl transition-all duration-300 h-full">
                  <div className="overflow-hidden relative">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <ExternalLink className="w-4 h-4" />
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      {blog.title}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {blog.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {blog.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;
