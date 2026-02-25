import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSliderItemSchema, insertServiceSchema, insertServiceImageSchema, insertProjectSchema, insertProjectImageSchema, insertNewsItemSchema, insertContactMessageSchema, insertUserSchema } from "@shared/schema";
import { z } from "zod";
import { db } from "./db";
import * as schema from "@shared/schema";
import { eq, sql } from "drizzle-orm";
import bcrypt from "bcryptjs";

async function seedData() {
  try {
    // Check if data already exists
    const existingSliders = await storage.getSliderItems();
    if (existingSliders.length > 0) return;

    // Admin user
    const existingAdmin = await storage.getUserByUsername("admin");
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("normyacht2024", 10);
      await storage.createUser({ username: "admin", password: hashedPassword });
    }

    // Seed slider items
    await storage.createSliderItem({
      title: "Excellence in Marine Engineering",
      titleTr: "Deniz Mühendisliğinde Mükemmellik",
      titleRu: "Превосходство в морской инженерии",
      subtitle: "Specializing in superyacht stabilization systems, hydraulic solutions and turnkey marine engineering projects.",
      subtitleTr: "Süper yat stabilizasyon sistemleri, hidrolik çözümler ve anahtar teslimi deniz mühendisliği projelerinde uzmanlaşıyoruz.",
      subtitleRu: "Специализируемся на системах стабилизации суперяхт, гидравлических решениях и комплексных морских инженерных проектах.",
      buttonText: "Our Services",
      buttonTextTr: "Hizmetlerimiz",
      buttonTextRu: "Наши услуги",
      buttonLink: "/services",
      rightImage: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=800&h=600&fit=crop",
      bgColor: "#0a1428",
      order: 1,
      active: true,
    });

    await storage.createSliderItem({
      title: "Hydraulic Repair Specialists",
      titleTr: "Hidrolik Onarım Uzmanları",
      titleRu: "Специалисты по гидравлическому ремонту",
      subtitle: "Advanced hydraulic system diagnostics, repair and maintenance for superyachts and mega yachts worldwide.",
      subtitleTr: "Dünya genelinde süper yatlar ve mega yatlar için gelişmiş hidrolik sistem tanı, onarım ve bakım hizmetleri.",
      subtitleRu: "Передовая диагностика, ремонт и обслуживание гидравлических систем для суперяхт и мегаяхт по всему миру.",
      buttonText: "View Projects",
      buttonTextTr: "Projeleri Gör",
      buttonTextRu: "Просмотр проектов",
      buttonLink: "/projects",
      rightImage: "https://images.unsplash.com/photo-1504598318550-17eba1008a68?w=800&h=600&fit=crop",
      bgColor: "#0d1a35",
      order: 2,
      active: true,
    });

    await storage.createSliderItem({
      title: "Trusted Since 2019",
      titleTr: "2019'dan Beri Güvenilir",
      titleRu: "Доверие с 2019 года",
      subtitle: "Based in Tuzla, Istanbul — the heart of Turkish maritime industry, serving clients across the globe.",
      subtitleTr: "Türk denizcilik sektörünün kalbi Tuzla, İstanbul'da faaliyet göstererek dünya genelinde müşterilere hizmet veriyoruz.",
      subtitleRu: "Базируемся в Тузла, Стамбул — в центре турецкой морской индустрии, обслуживая клиентов по всему миру.",
      buttonText: "About Us",
      buttonTextTr: "Hakkımızda",
      buttonTextRu: "О нас",
      buttonLink: "/about",
      rightImage: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop",
      bgColor: "#0f1e3a",
      order: 3,
      active: true,
    });

    // Seed services
    const serviceData = [
      { title: "Stabilizers", titleTr: "Stabilizatörler", titleRu: "Стабилизаторы", slug: "stabilizers", description: "Expert installation, commissioning, and maintenance of leading stabilizer brands including Quantum, Koop, Naiad, and Wesmar. We ensure maximum onboard comfort and safety through precision engineering.", descriptionTr: "Quantum, Koop, Naiad ve Wesmar dahil önde gelen stabilizatör markalarının uzman kurulumu, devreye alınması ve bakımı.", descriptionRu: "Экспертная установка, ввод в эксплуатацию и техническое обслуживание ведущих марок стабилизаторов.", icon: "Waves", image: "https://images.unsplash.com/photo-1605281317010-fe5ffe798166?w=600&h=400&fit=crop", order: 1 },
      { title: "Bow Thrusters", titleTr: "Baş Pervane", titleRu: "Носовые подруливающие устройства", slug: "bow-thrusters", description: "Complete bow thruster systems installation, repair, and maintenance services for enhanced maneuverability in all sea conditions.", descriptionTr: "Tüm deniz koşullarında gelişmiş manevra kabiliyeti için kapsamlı baş pervane sistemi kurulum, onarım ve bakım hizmetleri.", descriptionRu: "Полный комплекс услуг по установке, ремонту и обслуживанию носовых подруливающих устройств.", icon: "Navigation", image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&h=400&fit=crop", order: 2 },
      { title: "Cranes & Deck Equipment", titleTr: "Vinçler ve Güverte Ekipmanları", titleRu: "Краны и палубное оборудование", slug: "cranes-deck-equipment", description: "Professional installation and maintenance of deck cranes, davits, and all deck equipment ensuring safe and efficient operations.", descriptionTr: "Güverte vinçleri, borda bottaları ve tüm güverte ekipmanlarının profesyonel kurulum ve bakımı.", descriptionRu: "Профессиональная установка и обслуживание палубных кранов, шлюпбалок и всего палубного оборудования.", icon: "Crane", image: "https://images.unsplash.com/photo-1504598318550-17eba1008a68?w=600&h=400&fit=crop", order: 3 },
      { title: "Shaft Repair", titleTr: "Şaft Onarımı", titleRu: "Ремонт вала", slug: "shaft-repair", description: "Comprehensive shaft repair and alignment services ensuring optimal propulsion performance and minimal vibration for superyachts.", descriptionTr: "Süper yatlar için optimum tahrik performansı ve minimum titreşim sağlayan kapsamlı şaft onarımı ve hizalama hizmetleri.", descriptionRu: "Комплексный ремонт и выравнивание вала, обеспечивающие оптимальную тягу.", icon: "Settings", image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600&h=400&fit=crop", order: 4 },
      { title: "Hydraulic System Diagnostics", titleTr: "Hidrolik Sistem Diagnostiği", titleRu: "Диагностика гидравлических систем", slug: "hydraulic-diagnostics", description: "Full hydraulic system diagnostics using state-of-the-art equipment to identify and resolve issues before they become critical.", descriptionTr: "Sorunları kritik hale gelmeden tespit etmek ve çözmek için son teknoloji ekipman kullanan kapsamlı hidrolik sistem tanısı.", descriptionRu: "Полная диагностика гидравлических систем с использованием современного оборудования.", icon: "Activity", image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&h=400&fit=crop", order: 5 },
      { title: "Muir Winches & Windlasses", titleTr: "Muir Irgat ve Zincir Makineleri", titleRu: "Лебёдки и якорные шпили Muir", slug: "winches-windlasses", description: "Authorized service for Muir winches, windlasses, and anchoring equipment — installation, maintenance, and repair to manufacturer standards.", descriptionTr: "Muir ırgatları, zincir makineleri ve demir teçhizatları için yetkili servis — üretici standartlarında kurulum, bakım ve onarım.", descriptionRu: "Авторизованный сервис лебёдок, якорных шпилей и якорного оборудования Muir.", icon: "Anchor", image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop", order: 6 },
      { title: "Electronics", titleTr: "Elektronik", titleRu: "Электроника", slug: "electronics", description: "Marine electronics installation, repair, and integration services including navigation systems, communication equipment, and onboard automation.", descriptionTr: "Navigasyon sistemleri, iletişim ekipmanları ve gemi otomasyonu dahil deniz elektroniği kurulum, onarım ve entegrasyon hizmetleri.", descriptionRu: "Установка, ремонт и интеграция морской электроники, включая навигационные системы.", icon: "Zap", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop", order: 7 },
      { title: "Mechanics", titleTr: "Mekanik", titleRu: "Механика", slug: "mechanics", description: "Complete mechanical services covering engine systems, gearboxes, pumps, and all mechanical components for optimal vessel performance.", descriptionTr: "Motor sistemleri, dişli kutuları, pompalar ve optimal gemi performansı için tüm mekanik bileşenleri kapsayan kapsamlı mekanik hizmetler.", descriptionRu: "Полный комплекс механических услуг, включая двигательные системы, коробки передач и насосы.", icon: "Cog", image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&h=400&fit=crop", order: 8 },
      { title: "Metal Work & Fabrication", titleTr: "Metal İşleri ve İmalat", titleRu: "Металлообработка и изготовление", slug: "metal-fabrication", description: "Custom metal fabrication, welding, and structural work tailored to the unique requirements of superyachts and marine environments.", descriptionTr: "Süper yatların ve deniz ortamlarının benzersiz gereksinimlerine göre özelleştirilmiş metal imalatı, kaynak ve yapısal işler.", descriptionRu: "Изготовление металлических конструкций, сварка и структурные работы для суперяхт.", icon: "Hammer", image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&h=400&fit=crop", order: 9 },
      { title: "Powerpack & PTO Pumps", titleTr: "Güç Paketi ve PTO Pompaları", titleRu: "Силовые агрегаты и насосы ВОМ", slug: "powerpack-pto", description: "Design, installation, and maintenance of custom powerpack units and PTO pump systems for all marine hydraulic applications.", descriptionTr: "Tüm deniz hidrolik uygulamaları için özel güç paketi üniteleri ve PTO pompa sistemlerinin tasarımı, kurulumu ve bakımı.", descriptionRu: "Проектирование, установка и обслуживание силовых агрегатов и насосов ВОМ.", icon: "Gauge", image: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=600&h=400&fit=crop", order: 10 },
    ];

    for (const svc of serviceData) {
      await storage.createService({ ...svc, active: true });
    }

    // Seed projects
    const projectData = [
      { title: "M/Y Aurora - Stabilizer Installation", titleTr: "M/Y Aurora - Stabilizatör Kurulumu", titleRu: "М/Y Aurora - Установка стабилизатора", slug: "my-aurora-stabilizer", description: "Complete Quantum stabilizer system installation and commissioning on a 55-meter superyacht. Project included full hydraulic system integration and sea trials.", descriptionTr: "55 metrelik bir süper yatta tam Quantum stabilizatör sistemi kurulumu ve devreye alınması.", descriptionRu: "Полная установка системы стабилизатора Quantum и ввод в эксплуатацию на 55-метровой суперяхте.", status: "completed", category: "Stabilizers", client: "Private Owner", completionDate: "2024-03", mainImage: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=600&h=400&fit=crop", order: 1 },
      { title: "M/Y Poseidon - Full Hydraulic Overhaul", titleTr: "M/Y Poseidon - Tam Hidrolik Revizyon", titleRu: "М/Y Посейдон - Полный ремонт гидравлики", slug: "my-poseidon-hydraulic", description: "Complete hydraulic system overhaul for a 72-meter mega yacht including powerpack replacement, all hydraulic lines, and system re-commissioning.", descriptionTr: "72 metrelik bir mega yat için güç paketi değişimi, tüm hidrolik hatlar ve sistem yeniden devreye alımı dahil tam hidrolik sistem revizyonu.", descriptionRu: "Полный капитальный ремонт гидравлической системы 72-метровой мегаяхты.", status: "completed", category: "Hydraulics", client: "Shipyard", completionDate: "2024-01", mainImage: "https://images.unsplash.com/photo-1504598318550-17eba1008a68?w=600&h=400&fit=crop", order: 2 },
      { title: "M/Y Horizon - Bow Thruster Installation", titleTr: "M/Y Horizon - Baş Pervane Kurulumu", titleRu: "М/Y Горизонт - Установка носового подруливающего устройства", slug: "my-horizon-thruster", description: "Dual bow thruster installation on a 45-meter yacht, improving port maneuverability significantly with minimal hull modification.", descriptionTr: "45 metrelik bir yata çift baş pervane kurulumu, minimum tekne modifikasyonu ile liman manevra kabiliyetini önemli ölçüde artırdı.", descriptionRu: "Установка двойных носовых подруливающих устройств на 45-метровую яхту.", status: "completed", category: "Bow Thrusters", client: "Private Owner", completionDate: "2023-11", mainImage: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop", order: 3 },
      { title: "M/Y Neptune - Ongoing Refit", titleTr: "M/Y Neptune - Devam Eden Refit", titleRu: "М/Y Нептун - Текущий рефит", slug: "my-neptune-refit", description: "Major refit project including stabilizer upgrade, complete hydraulic renewal, deck crane installation, and electronics overhaul on a 60-meter vessel.", descriptionTr: "60 metrelik bir gemide stabilizatör yükseltmesi, tam hidrolik yenileme, güverte vinç kurulumu ve elektronik revizyonu dahil büyük refit projesi.", descriptionRu: "Масштабный рефит-проект, включающий модернизацию стабилизатора и обновление гидравлики.", status: "ongoing", category: "Full Refit", client: "Management Company", completionDate: "2025-06", mainImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop", order: 4 },
      { title: "M/Y Selene - Shaft Repair", titleTr: "M/Y Selene - Şaft Onarımı", titleRu: "М/Y Селена - Ремонт вала", slug: "my-selene-shaft", description: "Emergency shaft repair and alignment for a 38-meter motor yacht following vibration issues. Completed within tight timeline to minimize downtime.", descriptionTr: "Titreşim sorunları nedeniyle 38 metrelik bir motor yatı için acil şaft onarımı ve hizalaması.", descriptionRu: "Аварийный ремонт и выравнивание вала 38-метровой моторной яхты.", status: "completed", category: "Shaft Repair", client: "Charter Operator", completionDate: "2023-09", mainImage: "https://images.unsplash.com/photo-1548438294-1ad5d5f4f063?w=600&h=400&fit=crop", order: 5 },
    ];

    for (const proj of projectData) {
      await storage.createProject(proj);
    }

    // Seed news items
    const newsData = [
      {
        title: "Norm Yacht Completes Major Quantum Stabilizer Project",
        titleTr: "Norm Yacht Büyük Quantum Stabilizatör Projesini Tamamladı",
        titleRu: "Norm Yacht завершает крупный проект стабилизатора Quantum",
        slug: "quantum-stabilizer-project-2024",
        content: `<p>We are proud to announce the successful completion of a major Quantum stabilizer installation project on a 55-meter superyacht. This project represented one of our most technically demanding engagements of the year, requiring precise coordination between our engineering teams and the vessel's crew.</p>
<p>The installation included a complete hydraulic integration with the vessel's existing systems, new control panels, and comprehensive sea trials to verify performance. The result was a significant improvement in onboard comfort, particularly in rough sea conditions.</p>
<p>Our team worked around the clock to complete the project within the scheduled timeline, demonstrating our commitment to excellence and client satisfaction. The successful sea trials confirmed that the stabilizer performs above the manufacturer's specifications.</p>
<p>This project further solidifies Norm Yacht's position as a leading marine engineering company in the superyacht sector, capable of handling the most complex technical challenges.</p>`,
        excerpt: "Norm Yacht successfully completes major Quantum stabilizer installation on a 55-meter superyacht, achieving above-spec performance results.",
        author: "Norm Yacht Team",
        tags: ["Stabilizers", "Quantum", "Projects"],
        image: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=800&h=450&fit=crop",
        publishedAt: new Date("2024-11-15"),
      },
      {
        title: "Expanding Our Hydraulic Services in the Mediterranean",
        titleTr: "Akdeniz'deki Hidrolik Hizmetlerimizi Genişletiyoruz",
        titleRu: "Расширяем гидравлические услуги в Средиземноморье",
        slug: "mediterranean-expansion-2024",
        content: `<p>Norm Yacht is excited to announce the expansion of our hydraulic repair and maintenance services to more locations across the Mediterranean. As demand for our expertise continues to grow, we are strengthening our capability to serve superyacht owners and management companies wherever their vessels are located.</p>
<p>Our mobile service teams are now equipped to deploy quickly to major Mediterranean marinas, providing the same high-quality engineering solutions that our clients have come to expect from our Tuzla base of operations.</p>
<p>This expansion is part of our strategic growth plan for 2024-2025, aiming to become the premier marine hydraulic engineering company serving the Mediterranean superyacht market.</p>`,
        excerpt: "Norm Yacht expands its hydraulic repair and maintenance services across the Mediterranean, serving superyacht owners wherever they are.",
        author: "Management",
        tags: ["Expansion", "Mediterranean", "Hydraulics"],
        image: "https://images.unsplash.com/photo-1504598318550-17eba1008a68?w=800&h=450&fit=crop",
        publishedAt: new Date("2024-09-20"),
      },
      {
        title: "Norm Yacht Achieves ISO Certification for Marine Engineering",
        titleTr: "Norm Yacht Deniz Mühendisliği için ISO Sertifikası Aldı",
        titleRu: "Norm Yacht получает сертификат ISO по морской инженерии",
        slug: "iso-certification-2024",
        content: `<p>We are delighted to share that Norm Yacht has received ISO certification for our marine engineering services, confirming our commitment to international quality standards in all our operations.</p>
<p>This achievement reflects the dedication of our entire team to maintaining the highest levels of quality, safety, and professional excellence in every project we undertake.</p>
<p>The certification process involved a comprehensive audit of our quality management systems, technical procedures, documentation practices, and customer service protocols. We are proud that our processes met and exceeded the international standards.</p>
<p>This certification further enhances our credibility with international clients and shipyards, and demonstrates that Norm Yacht's quality management system meets the demands of the global superyacht industry.</p>`,
        excerpt: "Norm Yacht achieves ISO certification, confirming our commitment to international quality standards in marine engineering services.",
        author: "Quality Management",
        tags: ["ISO", "Certification", "Quality"],
        image: "https://images.unsplash.com/photo-1573164574572-cb89e39749b4?w=800&h=450&fit=crop",
        publishedAt: new Date("2024-07-05"),
      },
    ];

    for (const news of newsData) {
      await storage.createNewsItem(news as any);
    }

    console.log("Seed data created successfully");
  } catch (error) {
    console.error("Seed error:", error);
  }
}

export async function registerRoutes(httpServer: any, app: Express): Promise<Server> {
  await seedData();

  // --- AUTH ---
  app.post("/api/auth/login", async (req, res) => {
    const { username, password } = req.body;
    const user = await storage.getUserByUsername(username);
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });
    (req.session as any).userId = user.id;
    (req.session as any).isAdmin = true;
    res.json({ message: "Logged in", username: user.username });
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy(() => {
      res.json({ message: "Logged out" });
    });
  });

  app.get("/api/auth/me", (req, res) => {
    if ((req.session as any).isAdmin) {
      res.json({ isAdmin: true });
    } else {
      res.status(401).json({ message: "Not authenticated" });
    }
  });

  function requireAdmin(req: any, res: any, next: any) {
    if (!(req.session as any).isAdmin) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  }

  // --- SLIDER ---
  app.get("/api/slider", async (req, res) => {
    const items = await storage.getSliderItems();
    res.json(items);
  });

  app.post("/api/slider", requireAdmin, async (req, res) => {
    const data = insertSliderItemSchema.parse(req.body);
    const item = await storage.createSliderItem(data);
    res.json(item);
  });

  app.put("/api/slider/:id", requireAdmin, async (req, res) => {
    const id = parseInt(req.params.id);
    const item = await storage.updateSliderItem(id, req.body);
    res.json(item);
  });

  app.delete("/api/slider/:id", requireAdmin, async (req, res) => {
    await storage.deleteSliderItem(parseInt(req.params.id));
    res.json({ success: true });
  });

  // --- SERVICES ---
  app.get("/api/services", async (req, res) => {
    const items = await storage.getServices();
    res.json(items);
  });

  app.get("/api/services/:slug", async (req, res) => {
    const service = await storage.getServiceBySlug(req.params.slug);
    if (!service) return res.status(404).json({ message: "Not found" });
    const images = await storage.getServiceImages(service.id);
    res.json({ ...service, images });
  });

  app.post("/api/services", requireAdmin, async (req, res) => {
    const data = insertServiceSchema.parse(req.body);
    const item = await storage.createService(data);
    res.json(item);
  });

  app.put("/api/services/:id", requireAdmin, async (req, res) => {
    const id = parseInt(req.params.id);
    const item = await storage.updateService(id, req.body);
    res.json(item);
  });

  app.delete("/api/services/:id", requireAdmin, async (req, res) => {
    await storage.deleteService(parseInt(req.params.id));
    res.json({ success: true });
  });

  app.post("/api/services/:id/images", requireAdmin, async (req, res) => {
    const image = await storage.addServiceImage({ serviceId: parseInt(req.params.id), imageUrl: req.body.imageUrl, order: req.body.order || 0 });
    res.json(image);
  });

  app.delete("/api/service-images/:id", requireAdmin, async (req, res) => {
    await storage.deleteServiceImage(parseInt(req.params.id));
    res.json({ success: true });
  });

  // --- PROJECTS ---
  app.get("/api/projects", async (req, res) => {
    const { status } = req.query;
    const items = status ? await storage.getProjectsByStatus(status as string) : await storage.getProjects();
    res.json(items);
  });

  app.get("/api/projects/:slug", async (req, res) => {
    const project = await storage.getProjectBySlug(req.params.slug);
    if (!project) return res.status(404).json({ message: "Not found" });
    const images = await storage.getProjectImages(project.id);
    res.json({ ...project, images });
  });

  app.post("/api/projects", requireAdmin, async (req, res) => {
    const data = insertProjectSchema.parse(req.body);
    const item = await storage.createProject(data);
    res.json(item);
  });

  app.put("/api/projects/:id", requireAdmin, async (req, res) => {
    const id = parseInt(req.params.id);
    const item = await storage.updateProject(id, req.body);
    res.json(item);
  });

  app.delete("/api/projects/:id", requireAdmin, async (req, res) => {
    await storage.deleteProject(parseInt(req.params.id));
    res.json({ success: true });
  });

  app.post("/api/projects/:id/images", requireAdmin, async (req, res) => {
    const image = await storage.addProjectImage({ projectId: parseInt(req.params.id), imageUrl: req.body.imageUrl, order: req.body.order || 0 });
    res.json(image);
  });

  app.delete("/api/project-images/:id", requireAdmin, async (req, res) => {
    await storage.deleteProjectImage(parseInt(req.params.id));
    res.json({ success: true });
  });

  // --- NEWS ---
  app.get("/api/news", async (req, res) => {
    const items = await storage.getNewsItems();
    res.json(items);
  });

  app.get("/api/news/:slug", async (req, res) => {
    const item = await storage.getNewsItemBySlug(req.params.slug);
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  });

  app.post("/api/news", requireAdmin, async (req, res) => {
    const data = insertNewsItemSchema.parse(req.body);
    const item = await storage.createNewsItem(data);
    res.json(item);
  });

  app.put("/api/news/:id", requireAdmin, async (req, res) => {
    const id = parseInt(req.params.id);
    const item = await storage.updateNewsItem(id, req.body);
    res.json(item);
  });

  app.delete("/api/news/:id", requireAdmin, async (req, res) => {
    await storage.deleteNewsItem(parseInt(req.params.id));
    res.json({ success: true });
  });

  // --- CONTACT ---
  app.post("/api/contact", async (req, res) => {
    const data = insertContactMessageSchema.parse(req.body);
    const msg = await storage.createContactMessage(data);
    res.json({ success: true, id: msg.id });
  });

  app.get("/api/contact/messages", requireAdmin, async (req, res) => {
    const messages = await storage.getContactMessages();
    res.json(messages);
  });

  app.put("/api/contact/messages/:id/read", requireAdmin, async (req, res) => {
    await storage.markContactMessageRead(parseInt(req.params.id));
    res.json({ success: true });
  });

  return httpServer;
}
