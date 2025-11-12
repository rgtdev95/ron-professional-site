import { Mail, Github } from "lucide-react";
import { FaXTwitter, FaThreads } from "react-icons/fa6";
import { Card, CardContent } from "@/components/ui/card";
import { FaBlog } from "react-icons/fa";

const contactInfo = [
  {
    icon: Mail,
    title: "Write an email",
    value: "rgtprofessional95@gmail.com",
    href: "mailto:rgtprofessional95@gmail.com",
  },
  {
    icon: Github,
    title: "GitHub",
    value: "@rgtdev95",
    href: "https://github.com/rgtdev95",
  },
  {
    icon: FaXTwitter,
    title: "X",
    value: "@Ron912957596957",
    href: "https://x.com/Ron912957596957",
  },
  {
    icon: FaBlog,
    title: "Blog",
    value: "My Personal Blog",
    href: "https://ron-blog.rtg-homelabs.tech/",
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
            
            <Card className="border-border bg-card">
              <CardContent className="p-8">
                <div className="grid sm:grid-cols-2 gap-6">
                  {contactInfo.map((info, index) => (
                    <a
                      key={index}
                      href={info.href}
                      className="flex items-center gap-3 group"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors flex-shrink-0">
                        <info.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-sm mb-1">{info.title}</h3>
                        <p className="text-xs text-muted-foreground group-hover:text-primary transition-colors">
                          {info.value}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
