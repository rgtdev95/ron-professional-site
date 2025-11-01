import { Mail, Phone, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const contactInfo = [
  {
    icon: Phone,
    title: "Call me",
    value: "+1 (555) 123-4567",
    href: "tel:+15551234567",
  },
  {
    icon: Mail,
    title: "Write an email",
    value: "your.email@example.com",
    href: "mailto:your.email@example.com",
  },
  {
    icon: MapPin,
    title: "Visit my office",
    value: "Your City, Your Country",
    href: "#",
  },
];

const Contact = () => {
  return (
    <section id="contact" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <p className="text-primary text-sm tracking-wide uppercase">Contact me</p>
            <h2 className="text-4xl font-bold">Let's talk!</h2>
            <p className="text-muted-foreground text-lg">
              Feel free to reach out! I'm here to help and will respond within 24 hours. 
              Your questions matter to me!
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {contactInfo.map((info, index) => (
              <a
                key={index}
                href={info.href}
                className="block group"
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
    </section>
  );
};

export default Contact;
