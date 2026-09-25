export const siteConfig = {
  name: "Matheus Gaston",
  fullName: "Matheus Gaston da Silva",
  location: "Porto Alegre, RS — Brasil",
  role: "Designer multidisciplinar e profissional de tecnologia",
  description:
    "Portfólio de Matheus Gaston: produtos digitais, interfaces, identidades visuais, desenvolvimento web e produção multimídia.",
  url: "https://placeholder.example",
  email: "contato@placeholder.com",
  navigation: [
    { label: "Início", href: "/" },
    { label: "Projetos", href: "/projetos" },
    { label: "Sobre", href: "/sobre" },
    { label: "Contato", href: "/#contato" },
  ],
  socials: [
    { label: "LinkedIn", href: "https://linkedin.com/in/placeholder", placeholder: true },
    { label: "GitHub", href: "https://github.com/placeholder", placeholder: true },
    { label: "Behance", href: "https://behance.net/placeholder", placeholder: true },
    { label: "E-mail", href: "mailto:contato@placeholder.com", placeholder: true },
    { label: "WhatsApp", href: "https://wa.me/5500000000000", placeholder: true },
    { label: "Currículo PDF", href: "/curriculo-placeholder.pdf", placeholder: true },
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
  {
    number: "04",
    title: "Multimídia",
    description: "Vídeo, motion design, edição, áudio, animação e projetos audiovisuais.",
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
    title: "Multimídia",
    items: ["Motion Design", "Audiovisual", "Edição", "Animação", "Áudio", "3D"],
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
