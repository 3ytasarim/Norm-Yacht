import type { Language } from "./i18n";

const SITE_URL = "https://normyacht.com";

const OG_LOCALES: Record<Language, string> = {
  en: "en_US",
  tr: "tr_TR",
  ru: "ru_RU",
};

const STATIC_PATHS: Record<
  string,
  Partial<Record<Language, string>>
> = {
  about: {
    en: "/about",
    tr: "/hakkimizda",
    ru: "/o-nas",
  },
  services: {
    en: "/services",
    tr: "/hizmetler",
    ru: "/uslugi",
  },
  projects: {
    en: "/projects",
    tr: "/projeler",
    ru: "/proekty",
  },
  news: {
    en: "/news",
    tr: "/haberler",
    ru: "/novosti",
  },
  contact: {
    en: "/contact",
    tr: "/iletisim",
    ru: "/kontakty",
  },
};

function absoluteUrl(pathname: string) {
  return `${SITE_URL}${pathname === "/" ? "/" : pathname.replace(/\/$/, "")}`;
}

function setMeta(selector: string, attribute: string, value: string) {
  let element = document.querySelector<HTMLMetaElement>(selector);

  if (!element) {
    element = document.createElement("meta");

    if (selector.includes("property=")) {
      const match = selector.match(/property="([^"]+)"/);
      if (match) element.setAttribute("property", match[1]);
    } else {
      const match = selector.match(/name="([^"]+)"/);
      if (match) element.setAttribute("name", match[1]);
    }

    document.head.appendChild(element);
  }

  element.setAttribute(attribute, value);
}

function updateClientTechnicalSEO(
  language: Language,
  availableLanguages?: Language[],
) {
  const pathname = window.location.pathname;
  const canonical = absoluteUrl(pathname);

  let canonicalTag =
    document.querySelector<HTMLLinkElement>('link[rel="canonical"]');

  if (!canonicalTag) {
    canonicalTag = document.createElement("link");
    canonicalTag.rel = "canonical";
    document.head.appendChild(canonicalTag);
  }

  canonicalTag.href = canonical;

  setMeta('meta[property="og:url"]', "content", canonical);
  setMeta(
    'meta[property="og:locale"]',
    "content",
    OG_LOCALES[language],
  );

  document
    .querySelectorAll('meta[property="og:locale:alternate"]')
    .forEach((element) => element.remove());

  for (const locale of ["en_US", "tr_TR", "ru_RU"]) {
    if (locale === OG_LOCALES[language]) continue;

    const element = document.createElement("meta");
    element.setAttribute("property", "og:locale:alternate");
    element.setAttribute("content", locale);
    document.head.appendChild(element);
  }

  document
    .querySelectorAll('link[rel="alternate"][hreflang]')
    .forEach((element) => element.remove());

  let paths: Partial<Record<Language, string>> = {};

  if (pathname === "/") {
    paths = { en: "/" };
  } else {
    const staticEntry = Object.values(STATIC_PATHS).find(
      (entry) => Object.values(entry).includes(pathname),
    );

    if (staticEntry) {
      paths = staticEntry;
    } else {
      const detailMatch = pathname.match(
        /^\/(services|hizmetler|uslugi|projects|projeler|proekty)\/([^/]+)\/?$/,
      );

      if (detailMatch) {
        const [, prefix, slug] = detailMatch;

        if (["services", "hizmetler", "uslugi"].includes(prefix)) {
          paths = {
            en: `/services/${slug}`,
            tr: `/hizmetler/${slug}`,
            ru: `/uslugi/${slug}`,
          };
        } else {
          paths = {
            en: `/projects/${slug}`,
            tr: `/projeler/${slug}`,
            ru: `/proekty/${slug}`,
          };
        }
      }

      const newsMatch = pathname.match(
        /^\/(news|haberler|novosti)\/([^/]+)\/?$/,
      );

      if (newsMatch) {
        const slug = newsMatch[2];

        // News body translations do not currently exist.
        paths = {
          en: `/news/${slug}`,
        };
      }
    }
  }

  if (availableLanguages) {
    paths = Object.fromEntries(
      Object.entries(paths).filter(([lang]) =>
        availableLanguages.includes(lang as Language),
      ),
    ) as Partial<Record<Language, string>>;
  }

  for (const lang of ["en", "tr", "ru"] as const) {
    const href = paths[lang];
    if (!href) continue;

    const link = document.createElement("link");
    link.rel = "alternate";
    link.hreflang = lang;
    link.href = absoluteUrl(href);
    document.head.appendChild(link);
  }

  if (paths.en) {
    const link = document.createElement("link");
    link.rel = "alternate";
    link.hreflang = "x-default";
    link.href = absoluteUrl(paths.en);
    document.head.appendChild(link);
  }
}

export function updateSEO({
  title,
  description,
  keywords,
  ogTitle,
  ogDescription,
  ogImage,
  language,
  availableLanguages,
}: {
  title: string;
  description: string;
  keywords: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  language?: Language;
  availableLanguages?: Language[];
}) {
  document.title = title;

  if (language) {
    updateClientTechnicalSEO(language, availableLanguages);
  }

  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement("meta");
    metaDesc.setAttribute("name", "description");
    document.head.appendChild(metaDesc);
  }
  metaDesc.setAttribute("content", description);

  let metaKeywords = document.querySelector('meta[name="keywords"]');
  if (!metaKeywords) {
    metaKeywords = document.createElement("meta");
    metaKeywords.setAttribute("name", "keywords");
    document.head.appendChild(metaKeywords);
  }
  metaKeywords.setAttribute("content", keywords);

  let ogTitleTag = document.querySelector('meta[property="og:title"]');
  if (!ogTitleTag) {
    ogTitleTag = document.createElement("meta");
    ogTitleTag.setAttribute("property", "og:title");
    document.head.appendChild(ogTitleTag);
  }
  ogTitleTag.setAttribute("content", ogTitle || title);

  let ogDescTag = document.querySelector('meta[property="og:description"]');
  if (!ogDescTag) {
    ogDescTag = document.createElement("meta");
    ogDescTag.setAttribute("property", "og:description");
    document.head.appendChild(ogDescTag);
  }
  ogDescTag.setAttribute("content", ogDescription || description);

  if (ogImage) {
    let ogImgTag = document.querySelector('meta[property="og:image"]');
    if (!ogImgTag) {
      ogImgTag = document.createElement("meta");
      ogImgTag.setAttribute("property", "og:image");
      document.head.appendChild(ogImgTag);
    }
    ogImgTag.setAttribute("content", ogImage);
  }
}

type SEOEntry = {
  title: string;
  description: string;
  keywords: string;
};

type SEODataMap = Record<string, SEOEntry>;

const SEO_DATA_EN: SEODataMap = {
  home: {
    title: "NormYacht",
    description: "Norm Yacht provides professional superyacht engineering, yacht stabilizer installation, marine hydraulic systems, and turnkey refit solutions. Based in Tuzla, Istanbul — Turkey's leading shipyard hub.",
    keywords: "yacht stabilizer, yacht stabilizer installation, marine hydraulic systems, superyacht engineering, yacht refit Istanbul, Tuzla shipyard, Quantum stabilizer service, Norm Yacht",
  },
  about: {
    title: "About Norm Yacht | Marine Engineering Company in Tuzla, Istanbul",
    description: "Norm Yacht was established in 2019 in Tuzla, Istanbul. We deliver high-quality engineering solutions in superyacht stabilization systems, marine hydraulics, and turnkey yacht engineering projects.",
    keywords: "Norm Yacht about, marine engineering company Turkey, yacht engineering Istanbul, Tuzla shipyard company, superyacht engineering firm",
  },
  services: {
    title: "Marine Engineering Services | Stabilizers, Hydraulics & Yacht Systems - Norm Yacht",
    description: "Comprehensive marine engineering services: yacht stabilizer installation & service, hydraulic system design, bow thruster systems, deck equipment, shaft repair, and powerpack solutions for superyachts.",
    keywords: "yacht stabilizer service, marine hydraulic systems, bow thruster installation, deck crane service, shaft repair, hydraulic diagnostics, winch windlass service, Norm Yacht",
  },
  projects: {
    title: "Marine Engineering Projects | Yacht Refit & Stabilizer Installations - Norm Yacht",
    description: "Explore our completed and ongoing marine engineering projects including yacht stabilizer installations, hydraulic system integrations, bow thruster setups, and comprehensive superyacht refit projects.",
    keywords: "yacht stabilizer project, marine engineering projects, superyacht refit, yacht hydraulic installation, bow thruster project, Norm Yacht",
  },
  news: {
    title: "Marine Engineering News & Updates | Norm Yacht Blog",
    description: "Latest news, industry insights, and project updates from Norm Yacht — your trusted marine engineering partner in Tuzla, Istanbul.",
    keywords: "marine engineering news, yacht industry updates, stabilizer technology news, Norm Yacht news, yacht maintenance tips",
  },
  contact: {
    title: "Contact Norm Yacht | Marine Engineering Services - Tuzla, Istanbul",
    description: "Contact Norm Yacht for professional marine engineering services, yacht stabilizer installations, and hydraulic solutions. Visit us at İstim Sanayi Sitesi, Tuzla, Istanbul or call +90 216 510 66 76.",
    keywords: "contact Norm Yacht, marine engineering contact, yacht stabilizer service contact, Tuzla Istanbul marine",
  },
};

const SEO_DATA_TR: SEODataMap = {
  home: {
    title: "NormYacht",
    description: "Norm Yacht, profesyonel süper yat mühendisliği, yat stabilizatör kurulumu, deniz hidrolik sistemleri ve anahtar teslimi refit çözümleri sunmaktadır. Türkiye'nin önde gelen tersane merkezi Tuzla, İstanbul'da.",
    keywords: "yat stabilizatör, yat stabilizatör kurulumu, deniz hidrolik sistemleri, süper yat mühendisliği, yat refit İstanbul, Tuzla tersane, Quantum stabilizatör servis, Norm Yacht",
  },
  about: {
    title: "Hakkımızda | Norm Yacht - Tuzla, İstanbul Deniz Mühendisliği Şirketi",
    description: "Norm Yacht, 2019 yılında Tuzla, İstanbul'da kurulmuştur. Süper yat stabilizasyon sistemleri, deniz hidroliği ve anahtar teslimi yat mühendisliği projelerinde yüksek kaliteli çözümler sunuyoruz.",
    keywords: "Norm Yacht hakkında, deniz mühendisliği şirketi Türkiye, yat mühendisliği İstanbul, Tuzla tersane şirketi",
  },
  services: {
    title: "Deniz Mühendisliği Hizmetleri | Stabilizatörler, Hidrolik ve Yat Sistemleri - Norm Yacht",
    description: "Kapsamlı deniz mühendisliği hizmetleri: yat stabilizatör kurulum ve servis, hidrolik sistem tasarımı, baş pervane sistemleri, güverte ekipmanları, şaft onarımı ve güç paketi çözümleri.",
    keywords: "yat stabilizatör servis, deniz hidrolik sistemleri, baş pervane kurulumu, güverte vinç servisi, şaft onarım, Norm Yacht",
  },
  projects: {
    title: "Deniz Mühendisliği Projeleri | Yat Refit ve Stabilizatör Kurulumları - Norm Yacht",
    description: "Tamamlanan ve devam eden deniz mühendisliği projelerimizi keşfedin: yat stabilizatör kurulumları, hidrolik sistem entegrasyonları, baş pervane kurulumları ve kapsamlı süper yat refit projeleri.",
    keywords: "yat stabilizatör projesi, deniz mühendisliği projeleri, süper yat refit, yat hidrolik kurulum, Norm Yacht",
  },
  news: {
    title: "Deniz Mühendisliği Haberleri ve Güncellemeler | Norm Yacht Blog",
    description: "Norm Yacht'tan en son haberler, sektör bilgileri ve proje güncellemeleri — Tuzla, İstanbul'daki güvenilir deniz mühendisliği ortağınız.",
    keywords: "deniz mühendisliği haberleri, yat sektörü güncellemeleri, stabilizatör teknolojisi, Norm Yacht haberler",
  },
  contact: {
    title: "İletişim | Norm Yacht - Deniz Mühendisliği Hizmetleri - Tuzla, İstanbul",
    description: "Profesyonel deniz mühendisliği hizmetleri, yat stabilizatör kurulumları ve hidrolik çözümler için Norm Yacht ile iletişime geçin. Adres: İstim Sanayi Sitesi, Tuzla, İstanbul. Tel: 0216 510 66 76.",
    keywords: "Norm Yacht iletişim, deniz mühendisliği iletişim, yat stabilizatör servis, Tuzla İstanbul",
  },
};

const SEO_DATA_RU: SEODataMap = {
  home: {
    title: "NormYacht",
    description: "Norm Yacht предоставляет профессиональные услуги инженерии суперяхт, установку стабилизаторов яхт, морские гидравлические системы и комплексные решения для рефита. Тузла, Стамбул — ведущий судостроительный центр Турции.",
    keywords: "стабилизатор яхты, установка стабилизатора яхты, морские гидравлические системы, инженерия суперяхт, рефит яхт Стамбул, верфь Тузла, Norm Yacht",
  },
  about: {
    title: "О нас | Norm Yacht - Морская инженерная компания в Тузла, Стамбул",
    description: "Norm Yacht была основана в 2019 году в Тузле, Стамбул. Мы предоставляем высококачественные инженерные решения в области систем стабилизации суперяхт, морской гидравлики и комплексных яхтенных проектов.",
    keywords: "Norm Yacht о компании, морская инженерная компания Турция, яхтенная инженерия Стамбул, верфь Тузла",
  },
  services: {
    title: "Услуги морской инженерии | Стабилизаторы, гидравлика и яхтенные системы - Norm Yacht",
    description: "Комплексные услуги морской инженерии: установка и обслуживание стабилизаторов яхт, проектирование гидравлических систем, носовые подруливающие устройства, палубное оборудование, ремонт вала и силовые агрегаты.",
    keywords: "сервис стабилизатора яхт, морские гидравлические системы, установка носового подруливающего, палубный кран, ремонт вала, Norm Yacht",
  },
  projects: {
    title: "Проекты морской инженерии | Рефит яхт и установка стабилизаторов - Norm Yacht",
    description: "Ознакомьтесь с нашими завершёнными и текущими проектами морской инженерии: установка стабилизаторов яхт, интеграция гидравлических систем, рефит суперяхт.",
    keywords: "проект стабилизатора яхты, проекты морской инженерии, рефит суперяхт, Norm Yacht",
  },
  news: {
    title: "Новости морской инженерии и обновления | Блог Norm Yacht",
    description: "Последние новости, отраслевые обзоры и обновления проектов от Norm Yacht — вашего надёжного партнёра в морской инженерии в Тузле, Стамбул.",
    keywords: "новости морской инженерии, обновления яхтенной отрасли, технологии стабилизации, новости Norm Yacht",
  },
  contact: {
    title: "Контакты | Norm Yacht - Услуги морской инженерии - Тузла, Стамбул",
    description: "Свяжитесь с Norm Yacht для получения профессиональных услуг морской инженерии, установки стабилизаторов и гидравлических решений. Адрес: İstim Sanayi Sitesi, Тузла, Стамбул. Тел: +90 216 510 66 76.",
    keywords: "контакты Norm Yacht, связаться морская инженерия, сервис стабилизатора яхт, Тузла Стамбул",
  },
};

const SEO_BY_LANG: Record<Language, SEODataMap> = {
  en: SEO_DATA_EN,
  tr: SEO_DATA_TR,
  ru: SEO_DATA_RU,
};

export function getSEOData(page: string, language: Language): SEOEntry {
  return SEO_BY_LANG[language]?.[page] || SEO_DATA_EN[page];
}

export const SEO_DATA = SEO_DATA_EN;
