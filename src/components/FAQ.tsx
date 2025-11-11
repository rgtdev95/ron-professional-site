import { Button } from "@/components/ui/button";
const faqs = [{
  question: "🔧 1. What drives you to build things?",
  answer: "I'm driven by the challenge of creating order out of chaos — transforming complex problems into solutions that feel simple, useful, and meaningful. For me, building isn't just about code or structure; it's about impact and clarity."
}, {
  question: "🧩 2. How do you approach problem-solving?",
  answer: "I start by understanding the real issue — not just the symptoms. From there, I break complexity into smaller, logical parts until the path forward becomes clear. I enjoy the puzzle of figuring things out and making them flow seamlessly."
}, {
  question: "💡 3. What's your favorite part of the development process?",
  answer: "That moment when everything clicks — when a messy concept becomes a clean, working system. It's the blend of logic, creativity, and discovery that keeps me hooked every time."
}, {
  question: "⚙️ 4. What makes your work stand out?",
  answer: "I care deeply about the details — not just how things look, but how they work and feel. My focus is on creating systems that people actually enjoy using, not just ones that function."
}, {
  question: "🚀 5. How do you stay curious and keep learning?",
  answer: "Curiosity drives everything I do. I experiment, break things, rebuild them, and learn from every iteration. Technology evolves fast, and I love the thrill of keeping up by creating, not just consuming."
}, {
  question: "🤝 6. What's it like working with you?",
  answer: "I like to keep things clear, collaborative, and calm. I value honest communication, shared problem-solving, and making sure everyone feels confident about where the project is headed."
}];
const FAQ = () => {
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  return <section id="faq" className="py-24">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-start mb-12 gap-8">
            <div className="space-y-4 max-w-2xl">
              <h2 className="text-4xl font-bold">Get to Know My Work</h2>
              <p className="text-muted-foreground text-lg">I’ve gathered a few questions people often ask about how I work and what drives me. If there’s something you’re still curious about, feel free to reach out — I’d love to chat.</p>
            </div>
            <Button onClick={scrollToContact} variant="secondary" className="flex-shrink-0">
              Contact me
            </Button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
            {faqs.map((faq, index) => <div key={index} className="space-y-3">
                <h3 className="font-semibold text-lg">{faq.question}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </p>
              </div>)}
          </div>
        </div>
      </div>
    </section>;
};
export default FAQ;