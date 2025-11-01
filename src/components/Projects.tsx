import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import project1 from "@/assets/project-1.png";
import project2 from "@/assets/project-2.png";
import project3 from "@/assets/project-3.png";

const projects = [
  {
    title: "Analytics Dashboard",
    description: "A comprehensive analytics platform with real-time data visualization and insights.",
    image: project1,
    tags: ["React", "TypeScript", "Chart.js"],
  },
  {
    title: "E-Commerce Platform",
    description: "Modern online shopping experience with seamless checkout and inventory management.",
    image: project2,
    tags: ["Next.js", "Tailwind", "Stripe"],
  },
  {
    title: "Portfolio Website",
    description: "Professional portfolio showcasing creative work with smooth animations and interactions.",
    image: project3,
    tags: ["React", "Framer Motion", "Vite"],
  },
];

const Projects = () => {
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
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <Card
              key={index}
              className="group overflow-hidden border-border bg-card hover:shadow-xl transition-all duration-300"
            >
              <div className="overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-xl">{project.title}</CardTitle>
                <CardDescription className="text-muted-foreground">
                  {project.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, tagIndex) => (
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
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
