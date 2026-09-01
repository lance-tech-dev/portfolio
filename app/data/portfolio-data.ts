import {
  MonitorSmartphone,
  ShieldAlert,
  Wrench,
  Terminal,
  Network,
  Code2,
  Sparkles,
  Layout,
  Server,
  Database,
  Cloud,
  Blocks,
} from "lucide-react";
import {
  SiClaude,
  SiClaudecode,
  SiGooglegemini,
  SiHtml5,
  SiJavascript,
  SiTypescript,
  SiCss,
  SiBootstrap,
  SiTailwindcss,
  SiNodedotjs,
  SiPhp,
  SiC,
  SiCplusplus,
  SiXampp,
  SiSupabase,
  SiMongodb,
  SiMysql,
  SiFirebase,
  SiCloudflare,
  SiGithub,
  SiGit,
  SiBitbucket,
  SiDocker,
  SiLinux,
  SiVercel,
  SiNextdotjs,
  SiReact,
  SiAngular,
  SiLaravel,
  SiFlask,
  SiFlutter,
} from "react-icons/si";
import { RiOpenaiFill } from "react-icons/ri";
import { FaJava, FaAws } from "react-icons/fa6";
import { TbBrandCSharp } from "react-icons/tb";
import type { LucideIcon } from "lucide-react";
import type { IconType } from "react-icons";

export type CardSize = "small" | "medium" | "large";

export type BentoCard = {
  type: "card";
  title: string;
  description: string;
  icon: LucideIcon;
  size: CardSize;
  color: string;
};

export type TechStackItem = {
  type: "techstack";
  title: string;
  icon: LucideIcon;
  color: string;
  size: "full";
  categories: {
    name: string;
    icon: LucideIcon;
    color: string;
    tools: { name: string; icon: IconType }[];
  }[];
};

export const portfolioData = {
  header: {
    name: "Lance Achacoso",
    role: "Technical Support Engineer | Full Stack Freelance Developer",
    bio: "I'm a Full-Stack Freelance Developer and Technical Support Engineer with experience in software development, IT operations, cybersecurity, system troubleshooting, and real-world business technology. Whether it's a website, a custom system, an automation, an integration, or a complex technical problem that needs untangling, I bring the technical expertise to turn ideas into reliable, working solutions.",
    socials: {
      email: "mailto:lanceachacoso01@gmail.com",
      github: "https://github.com/lance-tech-dev",
      linkedin: "https://linkedin.com/in/lance-achacoso-035367415",
      facebook: "https://www.facebook.com/lncchcs/",
      instagram: "https://www.instagram.com/lncchcs/",
    }
  },
  bentoItems: [
    {
      type: "techstack",
      title: "Tech Stack",
      icon: Code2,
      color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
      size: "full",
      categories: [
        {
          name: "AI Tools",
          icon: Sparkles,
          color: "bg-violet-500/10 text-violet-500 border-violet-500/20",
          tools: [
            { name: "Claude", icon: SiClaude },
            { name: "Claude Code", icon: SiClaudecode },
            { name: "Gemini", icon: SiGooglegemini },
            { name: "ChatGPT", icon: RiOpenaiFill },
          ],
        },
        {
          name: "Frontend",
          icon: Layout,
          color: "bg-sky-500/10 text-sky-500 border-sky-500/20",
          tools: [
            { name: "HTML5", icon: SiHtml5 },
            { name: "CSS", icon: SiCss },
            { name: "JavaScript", icon: SiJavascript },
            { name: "TypeScript", icon: SiTypescript },
            { name: "Bootstrap", icon: SiBootstrap },
            { name: "Tailwind CSS", icon: SiTailwindcss },
          ],
        },
        {
          name: "Backend",
          icon: Server,
          color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
          tools: [
            { name: "Node.js", icon: SiNodedotjs },
            { name: "PHP", icon: SiPhp },
            { name: "Java", icon: FaJava },
            { name: "C", icon: SiC },
            { name: "C++", icon: SiCplusplus },
            { name: "C#", icon: TbBrandCSharp },
          ],
        },
        {
          name: "Database",
          icon: Database,
          color: "bg-lime-500/10 text-lime-500 border-lime-500/20",
          tools: [
            { name: "XAMPP", icon: SiXampp },
            { name: "MySQL", icon: SiMysql },
            { name: "Supabase", icon: SiSupabase },
            { name: "MongoDB", icon: SiMongodb },
            { name: "Firebase", icon: SiFirebase },
          ],
        },
        {
          name: "Infrastructure",
          icon: Cloud,
          color: "bg-amber-500/10 text-amber-500 border-amber-500/20",
          tools: [
            { name: "GitHub", icon: SiGithub },
            { name: "Git", icon: SiGit },
            { name: "Bitbucket", icon: SiBitbucket },
            { name: "Docker", icon: SiDocker },
            { name: "AWS", icon: FaAws },
            { name: "Cloudflare", icon: SiCloudflare },
            { name: "Linux", icon: SiLinux },
            { name: "Vercel", icon: SiVercel },
          ],
        },
        {
          name: "Frameworks",
          icon: Blocks,
          color: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
          tools: [
            { name: "Next.js", icon: SiNextdotjs },
            { name: "React.js", icon: SiReact },
            { name: "Angular", icon: SiAngular },
            { name: "Laravel", icon: SiLaravel },
            { name: "Flask", icon: SiFlask },
            { name: "Flutter", icon: SiFlutter },
          ],
        },
      ],
    },
    {
      type: "card",
      title: "Cybersecurity | Penetration Testing",
      description: "Two-time participant in DICT technical hacking and cybersecurity competitions.",
      icon: ShieldAlert,
      size: "medium",
      color: "bg-red-500/10 text-red-500 border-red-500/20",
    },
    {
      type: "card",
      title: "API & Log Investigation",
      description: "Deep-dive troubleshooting of API communications, analyzing system logs, and diagnosing complex technical issues.",
      icon: Network,
      size: "medium",
      color: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    },
    {
      type: "card",
      title: "OS Administration",
      description: "Proficient in Linux, macOS, and Windows system environments.",
      icon: Terminal,
      size: "small",
      color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    },
    {
      type: "card",
      title: "Hardware Repair",
      description: "Hands-on component-level diagnostics and repair for laptops and PCs.",
      icon: Wrench,
      size: "small",
      color: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    },
    {
      type: "card",
      title: "Cross-Platform Optimization",
      description: "Ensuring software runs flawlessly regardless of hardware or OS constraints.",
      icon: MonitorSmartphone,
      size: "medium",
      color: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
    },
  ] as (BentoCard | TechStackItem)[],
  experience: [
    {
      role: "Technical Support Engineer",
      company: "QTech Games",
      date: "2026 - Present",
      description: "Investigate and resolve complex technical issues through API communication analysis and detailed log investigation, identifying root causes and ensuring system reliability. Utilize critical thinking and troubleshooting skills to diagnose integration, performance, and application-related problems efficiently.",
    },
    {
      role: "Freelance Full Stack Developer",
      company: "TQ-Devs",
      date: "2024 - Present",
      description: "Designing and building custom web applications for clients, focusing on modern React architectures, responsive design, and seamless user experiences.",
    },
    {
      role: "IT Specialist",
      company: "Manpower Outsourcing Services Inc. / Huawei Technologies Philippines ",
      date: "2025 - 2026",
      description: "Managed IT asset lifecycle processes, including employee onboarding and offboarding, by provisioning, configuring, and decommissioning company devices and user accounts. Provided technical support through hardware troubleshooting, laptop repair, operating system installation, software deployment, system maintenance, and diagnostics to ensure optimal system performance, security, and end-user productivity.",
    },
    {
      role: "Cybersecurity Competitor",
      company: "DICT Hack4Gov 2 & 3 Competition",
      date: "2023 & 2024",
      description: "Competed in two regional technical hacking and penetration testing competitions hosted by the Department of Information and Communications Technology (DICT).",
    }
  ]
};
