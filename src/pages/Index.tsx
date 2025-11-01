import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { Separator } from "@/components/ui/separator";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <Hero />
      <Projects />
      <About />
      <Skills />
      <Testimonials />
      <div className="container mx-auto px-6">
        <Separator className="opacity-50" />
      </div>
      <FAQ />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
