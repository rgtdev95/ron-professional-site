import { Button } from "@/components/ui/button";

const faqs = [
  {
    question: "How can I request an invoice?",
    answer:
      "Once your payment is processed, you'll get an email with your invoice. You can also download invoices in your account's billing section. For custom invoices, contact support.",
  },
  {
    question: "What technologies do you use for web development?",
    answer:
      "I specialize in modern web technologies like HTML, CSS, and JavaScript frameworks such as React and Vue. I also use Node.js, Python with Django, and PHP with Laravel, along with databases like MySQL.",
  },
  {
    question: "How long does it take to process a refund?",
    answer:
      "I usually process refunds within 5 to 10 business days, depending on your payment provider. If you haven't seen your refund by then, feel free to reach out to me.",
  },
  {
    question: "How does the development process work?",
    answer:
      "My process involves analyzing requirements, creating wireframes, designing, developing, testing, and deploying. I keep in touch regularly to make sure the project stays in line with your vision.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "I accept bank transfers exclusively. Once your payment is completed, please confirm with me so I can begin your project.",
  },
  {
    question: "Can you work with an existing website and make improvements?",
    answer:
      "Absolutely! I can help you optimize, redesign, or expand your existing website, whether it's created with a CMS like WordPress or a custom framework.",
  },
];

const FAQ = () => {
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="faq" className="py-24">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-start mb-12 gap-8">
            <div className="space-y-4 max-w-2xl">
              <h2 className="text-4xl font-bold">Frequently asked questions</h2>
              <p className="text-muted-foreground text-lg">
                I've gathered the key information to help you make the most of your experience. If you can't find what you need, feel free to reach out to me.
              </p>
            </div>
            <Button 
              onClick={scrollToContact}
              variant="secondary"
              className="flex-shrink-0"
            >
              Contact me
            </Button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
            {faqs.map((faq, index) => (
              <div key={index} className="space-y-3">
                <h3 className="font-semibold text-lg">{faq.question}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
