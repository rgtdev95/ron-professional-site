import { 
  SiPython,
  SiJavascript,
  SiGo,
  SiGit,
  SiGithub,
  SiDocker,
  SiKubernetes,
  SiTerraform,
  SiAnsible,
  SiGitea,
  SiPostgresql,
  SiMysql,
  SiPrometheus,
  SiGrafana,
  SiLinux,
  SiVmware,
} from "react-icons/si";
import { FaCode, FaServer, FaAws, FaTerminal, FaWindows, FaCloud } from "react-icons/fa";

const skills = [
  { name: "Python", icon: SiPython },
  { name: "Javascript", icon: SiJavascript },
  { name: "Go Lang", icon: SiGo },
  { name: "Git", icon: SiGit },
  { name: "Github", icon: SiGithub },
  { name: "Docker", icon: SiDocker },
  { name: "Kubernetes", icon: SiKubernetes },
  { name: "CI/CD", icon: FaCode },
  { name: "Terraform", icon: SiTerraform },
  { name: "Ansible", icon: SiAnsible },
  { name: "Forgejo", icon: SiGitea },
  { name: "WoodpeckerCI", icon: FaCode },
  { name: "PostgreSQL", icon: SiPostgresql },
  { name: "MySQL", icon: SiMysql },
  { name: "Powershell", icon: FaTerminal },
  { name: "Azure", icon: FaCloud },
  { name: "AWS", icon: FaAws },
  { name: "Prometheus", icon: SiPrometheus },
  { name: "Grafana", icon: SiGrafana },
  { name: "Windows", icon: FaWindows },
  { name: "Linux", icon: SiLinux },
  { name: "Proxmox", icon: FaServer },
  { name: "Vmware Esxi", icon: SiVmware },
  { name: "System Administration", icon: FaServer },
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
