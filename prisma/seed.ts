import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const settings = {
  logoText: "MS", greeting: "Hey there, I'm", name: "Muhammad Sheraz.",
  headline: "Full Stack Engineer & Automation Specialist", location: "Jeddah, Saudi Arabia",
  heroDescription: "Full Stack Software Engineer with 7+ years in mission-critical IT operations and hands-on experience in React.js, Node.js, and workflow automation with n8n & Pipedream. I build reliable, scalable systems that bridge IT infrastructure and modern web applications.",
  aboutTitle: "About Me",
  aboutParagraphs: [
    "My journey started in 2015 with Pre-Engineering studies and a district-level gold medal in Urdu Essay Writing.",
    "I then served for seven years as an IT Assistant in the Pakistan Air Force, supporting enterprise systems, secure networks, data centers, Active Directory, DHCP, and CCTV infrastructure.",
    "After transitioning into software development and completing the IBM Full Stack JavaScript Professional Developer Certificate, I built RAG products, SaaS dashboards, customer portals, and workflow automations for international clients.",
    "Today, I focus on modern, scalable web applications and practical automation that makes a measurable difference.",
  ],
  contactTitle: "Let's Work Together",
  contactText: "I'm based in Jeddah, Saudi Arabia and open to Frontend, Full Stack, IT Operations, Cloud, and remote opportunities. If you think we could build something great together, let's connect!",
  email: "muhammadsheraz13@outlook.com", phone: "+966 57 923 2598",
  profileImageUrl: "/profile_pic.png", resumeUrl: "/resume.pdf", footerText: "Built by Muhammad Sheraz",
};

const projects = [
  ["BoostyTube", "Client-facing SaaS analytics platform with responsive dashboards, authentication flows, reusable UI, and API-driven data layers.", "/boostytube.png", ["React.js", "TypeScript", "Tailwind CSS", "React Query", "REST APIs"], null, "https://boostytube.com", true, "company"],
  ["ParkMyPhone – Customer Portal", "Customer portal frontend for a US client with AWS Cognito authentication, dashboards, messaging, and Pipedream automation.", "/parkmyphone.png", ["React.js", "TypeScript", "AWS Cognito", "Pipedream"], null, "https://parkmyphone.com", true, "company"],
  ["Undesked", "Dashboard SaaS platform with authentication, analytics, rich text editing, PDF reports, and responsive UI.", "/undesked.png", ["React.js", "TypeScript", "Tailwind CSS", "REST APIs"], null, "https://undesked.com", true, "company"],
  ["New City Bhera – Real Estate Platform", "Responsive real estate platform for residential plots and investment opportunities in Bhera, Pakistan.", "/newcitybhera.png", ["React.js", "Tailwind CSS", "Vercel", "SEO"], "https://github.com/sm718036/sargodha-realty-hub", "https://newcitybhera.com", true, "personal"],
  ["Virsagam – Full-Stack Fashion Platform", "Full-stack fashion commerce platform with a storefront and role-based admin panel.", "/virsagam.png", ["React.js", "TypeScript", "Node.js", "Express", "MongoDB"], null, "https://virsagam.vercel.app", true, "personal"],
  ["GiftLink", "Gift management and wishlist platform with authentication, CRUD, image uploads, and status tracking.", "/giftlink.png", ["React.js", "Node.js", "Express", "MongoDB", "JWT"], "https://github.com/sm718036/giftlinkfrontend", "https://giftlinkfrontend.vercel.app", true, "personal"],
  ["Weather Forecast App", "Responsive frontend displaying real-time weather data through a public API.", "/weatherapp.png", ["HTML", "CSS", "JavaScript", "Weather API"], "https://github.com/sm718036/coursera-guided-weather-app", "https://coursera-guided-weather-app.vercel.app", true, "personal"],
] as const;

async function main() {
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required for seeding");
  const email = process.env.ADMIN_EMAIL.toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  await prisma.admin.upsert({ where: { email }, update: { passwordHash: await bcrypt.hash(password, 12) }, create: { email, passwordHash: await bcrypt.hash(password, 12) } });
  await prisma.siteSettings.upsert({ where: { id: "main" }, update: settings, create: { id: "main", ...settings } });
  if (await prisma.socialLink.count() === 0) await prisma.socialLink.createMany({ data: [
    { label: "GitHub", url: "https://github.com/sm718036", icon: "github", sortOrder: 0 },
    { label: "LinkedIn", url: "https://linkedin.com/in/muhammadsheraz-gforcode", icon: "linkedin", sortOrder: 1 },
    { label: "Email", url: "mailto:muhammadsheraz13@outlook.com", icon: "mail", sortOrder: 2 },
  ] });
  if (await prisma.skillCategory.count() === 0) await Promise.all([
    ["Frontend / Full Stack", "code", ["React.js", "TypeScript", "JavaScript (ES6+)", "HTML5 & CSS3", "Tailwind CSS", "REST API Integration"]],
    ["Backend / Automation", "server", ["Node.js", "Express.js", "PostgreSQL", "AWS Cognito", "n8n Workflows", "Pipedream SDK", "RAG Systems"]],
    ["IT & Infrastructure", "wrench", ["Enterprise IT Support", "Active Directory", "DHCP & DNS", "Data Center Operations", "CCTV Systems", "Windows Administration"]],
    ["Soft Skills", "users", ["Remote Collaboration", "Client Communication", "Problem Solving", "Adaptability", "Technical Documentation"]],
  ].map(([title, icon, skills], i) => prisma.skillCategory.create({ data: { title: title as string, icon: icon as string, skills: skills as string[], sortOrder: i } })));
  if (await prisma.experience.count() === 0) await prisma.experience.createMany({ data: [
    { company: "Teraception", title: "Associate Software Engineer", period: "Apr 2025 — Nov 2025", location: "Lahore, Pakistan", points: ["Built production React and TypeScript applications for client products.", "Developed SaaS dashboards and workflow automations for US clients."], sortOrder: 0 },
    { company: "Pakistan Air Force", title: "IT Assistant", period: "Jan 2018 — Sep 2024", location: "Pakistan", points: ["Supported 2,500+ PCs and 1,200+ network users in a secure environment.", "Administered Active Directory, DHCP, data center operations, and CCTV systems."], sortOrder: 1 },
  ] });
  let company = await prisma.projectCategory.upsert({ where: { slug: "company" }, update: {}, create: { name: "Company Projects", slug: "company", sortOrder: 0 } });
  let personal = await prisma.projectCategory.upsert({ where: { slug: "personal" }, update: {}, create: { name: "Personal Projects", slug: "personal", sortOrder: 1 } });
  if (await prisma.project.count() === 0) await Promise.all(projects.map((p, i) => prisma.project.create({ data: { title: p[0], description: p[1], imageUrl: p[2], technologies: [...p[3]], githubUrl: p[4], liveUrl: p[5], featured: p[6], categoryId: p[7] === "company" ? company.id : personal.id, sortOrder: i } })));
  if (await prisma.certification.count() === 0) await prisma.certification.create({ data: { title: "IBM Full Stack JavaScript Professional Developer Certificate", issuer: "Coursera", period: "Feb 2025", description: "Full-stack development covering React, Node.js, Express, MongoDB, and deployment." } });
  if (await prisma.education.count() === 0) await prisma.education.create({ data: { degree: "Intermediate (F.Sc Pre-Engineering)", institution: "Superior College, Sargodha", period: "2015 – 2017", highlight: "Gold Medal in Urdu Essay Writing Competition at District Level" } });
  console.log(`Seed complete. Admin: ${email}`);
}
main().finally(() => prisma.$disconnect());
