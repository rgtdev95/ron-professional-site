import { Mail, Github } from "lucide-react";
import { FaXTwitter, FaThreads } from "react-icons/fa6";
import { Card, CardContent } from "@/components/ui/card";

const contactInfo = [
  {
    icon: Mail,
    title: "Write an email",
    value: "your.email@example.com",
    href: "mailto:your.email@example.com",
  },
  {
    icon: Github,
    title: "GitHub",
    value: "@yourusername",
    href: "https://github.com/yourusername",
  },
  {
    icon: FaXTwitter,
    title: "X (Twitter)",
    value: "@yourusername",
    href: "https://twitter.com/yourusername",
  },
  {
    icon: FaThreads,
    title: "Threads",
    value: "@yourusername",
    href: "https://threads.net/@yourusername",
  },
];

const Contact = () => {
  return (
    <section id="contact" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-4">
              <p className="text-primary text-sm tracking-wide uppercase">Contact me</p>
              <h2 className="text-4xl font-bold">Let's talk!</h2>
              <p className="text-muted-foreground text-lg">
                Feel free to reach out! I'm here to help and will respond within 24 hours. 
                Your questions matter to me!
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-6">
              {contactInfo.map((info, index) => (
                <a
                  key={index}
                  href={info.href}
                  className="block group"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Card className="h-full border-border bg-card hover:border-primary/50 transition-all duration-300">
                    <CardContent className="p-6 text-center space-y-4">
                      <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <info.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">{info.title}</h3>
                        <p className="text-sm text-muted-foreground group-hover:text-primary transition-colors">
                          {info.value}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
