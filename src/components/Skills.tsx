import { 
  SiReact, 
  SiTypescript, 
  SiTailwindcss, 
  SiNextdotjs, 
  SiVuedotjs,
  SiNodedotjs,
  SiPython,
  SiPostgresql,
  SiMongodb,
  SiGit,
  SiDocker,
  SiFigma,
} from "react-icons/si";
import { FaCode, FaServer, FaAws } from "react-icons/fa";

const skills = [
  { name: "React", icon: SiReact },
  { name: "TypeScript", icon: SiTypescript },
  { name: "Tailwind CSS", icon: SiTailwindcss },
  { name: "Next.js", icon: SiNextdotjs },
  { name: "Vue.js", icon: SiVuedotjs },
  { name: "Node.js", icon: SiNodedotjs },
  { name: "Python", icon: SiPython },
  { name: "PostgreSQL", icon: SiPostgresql },
  { name: "MongoDB", icon: SiMongodb },
  { name: "REST APIs", icon: FaServer },
  { name: "Git", icon: SiGit },
  { name: "Docker", icon: SiDocker },
  { name: "AWS", icon: FaAws },
  { name: "Figma", icon: SiFigma },
  { name: "CI/CD", icon: FaCode },
];

const Skills = () => {
  return (
    <section id="skills" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl font-bold">Skills & Expertise</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Technologies and tools I use to bring ideas to life
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4 max-w-5xl mx-auto">
          {skills.map((skill, index) => {
            const Icon = skill.icon;
            return (
              <div
                key={index}
                className="flex items-center gap-2 px-4 py-3 rounded-md bg-card border border-border hover:border-primary/50 transition-colors"
                title={skill.name}
              >
                <Icon className="w-5 h-5 text-primary" />
                <span className="text-sm text-foreground">{skill.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Skills;
