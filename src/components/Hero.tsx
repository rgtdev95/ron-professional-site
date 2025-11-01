import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-illustration.png";

const Hero = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="min-h-screen flex items-center pt-20">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-muted-foreground text-sm tracking-wide">Your Name</p>
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Your go-to professional for{" "}
                <span className="text-primary">innovative projects</span>
              </h1>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Bringing your ideas to life with clean, efficient, and scalable solutions. 
              Whether it's building applications, optimizing performance, or solving 
              complex challenges.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Button
                size="lg"
                onClick={() => scrollToSection("contact")}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Contact me
              </Button>
              <Button
                size="lg"
                variant="secondary"
                onClick={() => scrollToSection("projects")}
                className="bg-secondary text-secondary-foreground hover:bg-secondary/80"
              >
                View projects
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full" />
            <img
              src={heroImage}
              alt="Professional workspace"
              className="relative rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
