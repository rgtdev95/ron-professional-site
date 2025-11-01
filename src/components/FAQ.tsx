import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is your development process?",
    answer:
      "My process involves analyzing requirements, creating wireframes, designing, developing, testing, and deploying. I keep in touch regularly to make sure the project stays aligned with your vision.",
  },
  {
    question: "What technologies do you specialize in?",
    answer:
      "I specialize in modern web technologies including React, TypeScript, Next.js, and Tailwind CSS. I also work with Node.js, Python, and various databases for full-stack development.",
  },
  {
    question: "How long does a typical project take?",
    answer:
      "Project timelines vary based on complexity and scope. A simple website might take 2-4 weeks, while more complex applications can take 2-3 months. I provide detailed timelines during our initial consultation.",
  },
  {
    question: "Do you provide ongoing support and maintenance?",
    answer:
      "Yes! I offer ongoing support and maintenance packages to ensure your project continues to run smoothly. This includes bug fixes, updates, and feature enhancements as needed.",
  },
  {
    question: "Can you work with existing projects?",
    answer:
      "Absolutely! I can work with existing codebases to add new features, optimize performance, fix bugs, or modernize the technology stack.",
  },
];

const FAQ = () => {
  return (
    <section id="faq" className="py-24">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-4xl font-bold">Frequently asked questions</h2>
            <p className="text-muted-foreground text-lg">
              I've gathered the key information to help you. If you can't find what you need, 
              feel free to reach out to me.
            </p>
          </div>
          
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-border rounded-lg px-6 bg-card"
              >
                <AccordionTrigger className="text-left hover:no-underline py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
