import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    quote: "Alicia Smith is an outstanding developer. She understood our needs right away and delivered a website that exceeded expectations. Great communication, attention to detail, and top-notch skills. Highly recommended!",
    highlightedWords: ["outstanding developer", "exceeded expectations"],
    author: "Peter Norris",
    role: "Founder at Acme Inc.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Peter",
  },
  {
    quote: "Alicia Smith is a fantastic developer. She understood our needs and delivered a website that exceeded expectations. Her communication and attention to detail are outstanding. I highly recommend her!",
    highlightedWords: ["exceeded expectations", "outstanding"],
    author: "Ann Helfer",
    role: "Founder at Design Stars",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ann",
  },
];

const Testimonials = () => {
  const highlightText = (text: string, wordsToHighlight: string[]) => {
    let result = text;
    const parts: { text: string; highlighted: boolean }[] = [];
    let currentIndex = 0;

    wordsToHighlight.forEach((phrase) => {
      const index = result.toLowerCase().indexOf(phrase.toLowerCase(), currentIndex);
      if (index !== -1) {
        if (index > currentIndex) {
          parts.push({ text: result.substring(currentIndex, index), highlighted: false });
        }
        parts.push({ text: result.substring(index, index + phrase.length), highlighted: true });
        currentIndex = index + phrase.length;
      }
    });

    if (currentIndex < result.length) {
      parts.push({ text: result.substring(currentIndex), highlighted: false });
    }

    return parts.length > 0 ? parts : [{ text: result, highlighted: false }];
  };

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="space-y-4 mb-12">
            <p className="text-muted-foreground text-sm tracking-widest uppercase">Testimonials</p>
            <h2 className="text-4xl font-bold">What my clients say</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="space-y-6">
                <p className="text-foreground leading-relaxed text-lg">
                  {highlightText(testimonial.quote, testimonial.highlightedWords).map(
                    (part, i) =>
                      part.highlighted ? (
                        <span key={i} className="bg-muted px-1">
                          {part.text}
                        </span>
                      ) : (
                        <span key={i}>{part.text}</span>
                      )
                  )}
                </p>

                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.author} />
                    <AvatarFallback>
                      {testimonial.author
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
