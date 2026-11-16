export const siteConfig = {
  name: "Gaston Design",
  fullName: "Matheus Gaston da Silva",
  location: "Porto Alegre, RS — Brasil",
  role: "Designer de UI/UX, web e branding",
  description:
    "Matheus Gaston, designer de UI/UX, web e branding em Porto Alegre: interfaces, sites e identidades visuais para pequenos negócios, profissionais autônomos, estúdios e agências.",
  url: "https://mgsgaston.vercel.app",
  email: "matheus.gaston.silva@gmail.com",
  navigation: [
    { label: "Início", href: "/" },
    { label: "Projetos", href: "/projetos" },
    { label: "Sobre", href: "/sobre" },
    { label: "Contato", href: "/#contato" },
  ],
  socials: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/matheus-gaston-da-silva-048005281" },
    { label: "GitHub", href: "https://github.com/GSWGaston" },
    { label: "Behance", href: "https://www.behance.net/matheusgaston" },
    { label: "E-mail", href: "mailto:matheus.gaston.silva@gmail.com" },
    { label: "Currículo PDF", href: "/curriculo-matheus-gaston.pdf" },
  ],
} as const;

export const practiceAreas = [
  {
    number: "01",
    title: "UI/UX & Product Design",
    description: "Interfaces, wireframes, protótipos, sistemas de design e experiências digitais.",
  },
  {
    number: "02",
    title: "Branding & Design Visual",
    description: "Identidades visuais, rebrandings, peças gráficas e design esportivo.",
  },
  {
    number: "03",
    title: "Web & Desenvolvimento",
    description: "Landing pages, aplicações web, experimentos e soluções digitais funcionais.",
  },
] as const;

export const skillGroups = [
  {
    title: "Design",
    items: ["UI/UX", "Product Design", "Web Design", "Branding", "Identidade Visual", "Design esportivo"],
  },
  {
    title: "Desenvolvimento",
    items: ["HTML", "CSS", "JavaScript", "React", "Tailwind CSS", "Python", "FastAPI", "Node.js", "Express", "C#", "SQLite"],
  },
  {
    title: "Tecnologia",
    items: ["Hardware", "Linux", "Ubuntu Server", "Infraestrutura", "Redes", "Troubleshooting", "Automação"],
  },
] as const;

export const toolGroups = [
  { title: "Design", items: ["Figma", "ProtoPie", "UX Pilot", "Illustrator", "Photoshop"] },
  { title: "Audiovisual", items: ["After Effects", "Premiere Pro", "Audition", "Blender"] },
  { title: "Desenvolvimento", items: ["HTML", "CSS", "JavaScript", "React", "Tailwind CSS", "Python", "FastAPI", "Node.js", "Express", "C#", "Unity", "SQLite"] },
  { title: "Infraestrutura", items: ["Windows", "Ubuntu", "Ubuntu Server", "Linux", "FOG Project", "Docker", "CasaOS", "Nginx", "systemd", "UFW", "Mikrotik", "TeamViewer", "NoMachine"] },
  { title: "Produtividade", items: ["Excel — intermediário"] },
] as const;

export const softSkills = [
  "Boa escuta",
  "Trabalho em equipe",
  "Organização",
  "Resolução de problemas",
  "Pensamento crítico",
  "Aprendizado rápido",
  "Criatividade",
  "Autonomia",
  "Paciência",
  "Colaboração",
  "Flexibilidade",
  "Curiosidade",
] as const;
