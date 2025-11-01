import { Button } from "@/components/ui/button";

const About = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="about" className="py-24">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-primary text-sm tracking-wide uppercase">About</p>
              <h2 className="text-4xl font-bold">Professional who loves to build solutions</h2>
            </div>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Hello! I'm a passionate professional who thrives on creating innovative 
                solutions that tackle complex challenges.
              </p>
              <p>
                My attention to detail allows me to enhance every interaction, ensuring 
                it not only boosts productivity but also elevates user satisfaction.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 pt-4">
              <Button
                onClick={() => scrollToSection("contact")}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Contact me
              </Button>
              <Button
                variant="secondary"
                onClick={() => scrollToSection("projects")}
                className="bg-secondary text-secondary-foreground hover:bg-secondary/80"
              >
                View projects
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="h-32 bg-primary/10 rounded-lg" />
                <div className="h-48 bg-primary/20 rounded-lg" />
              </div>
              <div className="space-y-4 pt-12">
                <div className="h-48 bg-primary/20 rounded-lg" />
                <div className="h-32 bg-primary/10 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
