import fs from "fs/promises";
import path from "path";
import { pathToFileURL } from "url";

import { storage } from "./storage";
import {
  detectLanguageFromPath,
  getCurrentPageFromPath,
} from "../client/src/lib/routes";
import { getSEOData } from "../client/src/lib/seo";
import type { Language } from "../client/src/lib/i18n";

type RenderResult = {
  html: string;
  dehydratedState: unknown;
};

type SSRModule = {
  render(options: {
    path: string;
    language: Language;
    prefetch?: Record<string, unknown>;
  }): RenderResult;
};

type SEOAlternate = {
  hreflang: "en" | "tr" | "ru" | "x-default";
  href: string;
};

type SEOResult = {
  title: string;
  description: string;
  keywords: string;
  canonical: string;
  ogImage: string;
  ogLocale: "en_US" | "tr_TR" | "ru_RU";
  alternates: SEOAlternate[];
};

const SITE_URL = "https://normyacht.com";

const OG_LOCALES: Record<Language, "en_US" | "tr_TR" | "ru_RU"> = {
  en: "en_US",
  tr: "tr_TR",
  ru: "ru_RU",
};

const STATIC_ALTERNATE_PATHS: Record<
  string,
  Record<Language, string>
> = {
  home: {
    en: "/",
    tr: "",
    ru: "",
  },
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

function absoluteUrl(pathname: string): string {
  return `${SITE_URL}${pathname === "/" ? "/" : pathname.replace(/\/$/, "")}`;
}

function buildAlternates(
  paths: Partial<Record<Language, string>>,
): SEOAlternate[] {
  const result: SEOAlternate[] = [];

  for (const language of ["en", "tr", "ru"] as const) {
    const pathname = paths[language];
    if (!pathname) continue;

    result.push({
      hreflang: language,
      href: absoluteUrl(pathname),
    });
  }

  const defaultPath = paths.en;

  if (defaultPath) {
    result.push({
      hreflang: "x-default",
      href: absoluteUrl(defaultPath),
    });
  }

  return result;
}

function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function stripHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function truncate(value: string, length = 160): string {
  if (value.length <= length) return value;
  return `${value.slice(0, length - 1).trimEnd()}…`;
}

function safeJson(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

function localizedField(
  item: any,
  field: string,
  language: Language,
): string {
  if (language === "tr") {
    return item?.[`${field}Tr`] || item?.[field] || "";
  }

  if (language === "ru") {
    return item?.[`${field}Ru`] || item?.[field] || "";
  }

  return item?.[field] || "";
}

async function loadRenderer(): Promise<SSRModule> {
  const rendererPath = path.resolve(__dirname, "ssr", "entry-server.mjs");

  const moduleUrl =
    pathToFileURL(rendererPath).href +
    `?v=${process.env.NODE_ENV === "production" ? "prod" : Date.now()}`;

  return import(moduleUrl) as Promise<SSRModule>;
}

function getBaseSEO(pathname: string, language: Language): SEOResult {
  const page = pathname === "/"
    ? "home"
    : getCurrentPageFromPath(pathname) || "home";

  const data = getSEOData(page, language);

  const alternatePaths =
    STATIC_ALTERNATE_PATHS[page] || {
      [language]: pathname,
    };

  return {
    title: data.title,
    description: data.description,
    keywords: data.keywords,
    canonical: absoluteUrl(pathname),
    ogImage: `${SITE_URL}/og-image.jpg`,
    ogLocale: OG_LOCALES[language],
    alternates: buildAlternates(alternatePaths),
  };
}

export async function renderPublicPage(pathname: string) {
  const language = detectLanguageFromPath(pathname) || "en";
  const page = pathname === "/"
    ? "home"
    : getCurrentPageFromPath(pathname);

  const prefetch: Record<string, unknown> = {};
  let seo = getBaseSEO(pathname, language);

  // Navbar and Footer use the services query on every public page.
  const services = await storage.getServices();
  prefetch.services = services;

  if (pathname === "/") {
    const [slider, projects, news] = await Promise.all([
      storage.getSliderItems(),
      storage.getProjects(),
      storage.getNewsItems(),
    ]);

    prefetch.slider = slider;
    prefetch.projects = projects;
    prefetch.news = news;
  } else if (page === "services") {
    const match = pathname.match(
      /^\/(?:services|hizmetler|uslugi)\/([^/]+)\/?$/,
    );

    if (match) {
      const slug = decodeURIComponent(match[1]);
      const service = await storage.getServiceBySlug(slug);

      if (!service) {
        return null;
      }

      const images = await storage.getServiceImages(service.id);
      const data = { ...service, images };

      prefetch.service = { slug, data };

      const title = localizedField(service, "title", language);
      const description = truncate(
        stripHtml(localizedField(service, "description", language)),
      );

      const serviceAlternatePaths: Partial<Record<Language, string>> = {
        en: `/services/${slug}`,
        tr: service.titleTr && service.descriptionTr
          ? `/hizmetler/${slug}`
          : undefined,
        ru: service.titleRu && service.descriptionRu
          ? `/uslugi/${slug}`
          : undefined,
      };

      seo = {
        ...seo,
        title: `${title} | NormYacht`,
        description: description || seo.description,
        alternates: buildAlternates(serviceAlternatePaths),
        ogImage: service.image
          ? service.image.startsWith("http")
            ? service.image
            : `${SITE_URL}${service.image.startsWith("/") ? "" : "/"}${service.image}`
          : seo.ogImage,
      };
    }
  } else if (page === "projects") {
    const match = pathname.match(
      /^\/(?:projects|projeler|proekty)\/([^/]+)\/?$/,
    );

    if (match) {
      const slug = decodeURIComponent(match[1]);
      const project = await storage.getProjectBySlug(slug);

      if (!project) {
        return null;
      }

      const images = await storage.getProjectImages(project.id);
      const data = { ...project, images };

      prefetch.project = { slug, data };

      const title = localizedField(project, "title", language);
      const description = truncate(
        stripHtml(localizedField(project, "description", language)),
      );

      const projectAlternatePaths: Partial<Record<Language, string>> = {
        en: `/projects/${slug}`,
        tr: project.titleTr && project.descriptionTr
          ? `/projeler/${slug}`
          : undefined,
        ru: project.titleRu && project.descriptionRu
          ? `/proekty/${slug}`
          : undefined,
      };

      seo = {
        ...seo,
        title: `${title} | NormYacht`,
        description: description || seo.description,
        alternates: buildAlternates(projectAlternatePaths),
        ogImage: project.mainImage
          ? project.mainImage.startsWith("http")
            ? project.mainImage
            : `${SITE_URL}${project.mainImage.startsWith("/") ? "" : "/"}${project.mainImage}`
          : seo.ogImage,
      };
    } else {
      prefetch.projects = await storage.getProjects();
    }
  } else if (page === "news") {
    const match = pathname.match(
      /^\/(?:news|haberler|novosti)\/([^/]+)\/?$/,
    );

    if (match) {
      const slug = decodeURIComponent(match[1]);
      const item = await storage.getNewsItemBySlug(slug);

      if (!item) {
        return null;
      }

      prefetch.newsItem = { slug, data: item };

      const title = localizedField(item, "title", language);
      const excerpt =
        localizedField(item, "excerpt", language) ||
        localizedField(item, "content", language);

      const newsAlternatePaths: Partial<Record<Language, string>> = {
        en: `/news/${slug}`,
        tr: item.titleTr && item.contentTr
          ? `/haberler/${slug}`
          : undefined,
        ru: item.titleRu && item.contentRu
          ? `/novosti/${slug}`
          : undefined,
      };

      seo = {
        ...seo,
        title: `${title} | NormYacht`,
        description: truncate(stripHtml(excerpt)) || seo.description,
        alternates: buildAlternates(newsAlternatePaths),
        ogImage: item.image
          ? item.image.startsWith("http")
            ? item.image
            : `${SITE_URL}${item.image.startsWith("/") ? "" : "/"}${item.image}`
          : seo.ogImage,
      };
    } else {
      prefetch.news = await storage.getNewsItems();
    }
  }

  const renderer = await loadRenderer();

  const rendered = renderer.render({
    path: pathname,
    language,
    prefetch,
  });

  const templatePath = path.resolve(__dirname, "public", "index.html");
  let template = await fs.readFile(templatePath, "utf8");

  template = template.replace(
    /<html lang="[^"]*">/,
    `<html lang="${language}">`,
  );

  template = template.replace(
    /<title>[\s\S]*?<\/title>/,
    `<title>${escapeHtml(seo.title)}</title>`,
  );

  template = template.replace(
    /<meta name="description" content="[^"]*" \/>/,
    `<meta name="description" content="${escapeHtml(seo.description)}" />`,
  );

  template = template.replace(
    /<meta name="keywords" content="[^"]*" \/>/,
    `<meta name="keywords" content="${escapeHtml(seo.keywords)}" />`,
  );

  template = template.replace(
    /<meta property="og:title" content="[^"]*" \/>/,
    `<meta property="og:title" content="${escapeHtml(seo.title)}" />`,
  );

  template = template.replace(
    /<meta property="og:description" content="[^"]*" \/>/,
    `<meta property="og:description" content="${escapeHtml(seo.description)}" />`,
  );

  template = template.replace(
    /<meta property="og:url" content="[^"]*" \/>/,
    `<meta property="og:url" content="${escapeHtml(seo.canonical)}" />`,
  );

  template = template.replace(
    /<meta property="og:locale" content="[^"]*" \/>/,
    `<meta property="og:locale" content="${escapeHtml(seo.ogLocale)}" />`,
  );

  template = template.replace(
    /\s*<meta property="og:locale:alternate" content="[^"]*" \/>/g,
    "",
  );

  const alternateLocales = (
    ["en_US", "tr_TR", "ru_RU"] as const
  ).filter((locale) => locale !== seo.ogLocale);

  const alternateLocaleTags = alternateLocales
    .map(
      (locale) =>
        `    <meta property="og:locale:alternate" content="${locale}" />`,
    )
    .join("\n");

  template = template.replace(
    /(<meta property="og:locale" content="[^"]*" \/>)/,
    `$1\n${alternateLocaleTags}`,
  );

  template = template.replace(
    /<meta property="og:image" content="[^"]*" \/>/,
    `<meta property="og:image" content="${escapeHtml(seo.ogImage)}" />`,
  );

  template = template.replace(
    /<meta name="twitter:title" content="[^"]*" \/>/,
    `<meta name="twitter:title" content="${escapeHtml(seo.title)}" />`,
  );

  template = template.replace(
    /<meta name="twitter:description" content="[^"]*" \/>/,
    `<meta name="twitter:description" content="${escapeHtml(seo.description)}" />`,
  );

  template = template.replace(
    /<meta name="twitter:image" content="[^"]*" \/>/,
    `<meta name="twitter:image" content="${escapeHtml(seo.ogImage)}" />`,
  );

  template = template.replace(
    /<link rel="canonical" href="[^"]*" \/>/,
    `<link rel="canonical" href="${escapeHtml(seo.canonical)}" />`,
  );

  template = template.replace(
    /\s*<link rel="alternate" hreflang="[^"]+" href="[^"]+" \/>/g,
    "",
  );

  const hreflangTags = seo.alternates
    .map(
      ({ hreflang, href }) =>
        `    <link rel="alternate" hreflang="${hreflang}" href="${escapeHtml(href)}" />`,
    )
    .join("\n");

  template = template.replace(
    /(<link rel="canonical" href="[^"]*" \/>)/,
    `$1\n${hreflangTags}`,
  );

  const stateScript =
    `<script>window.__NORMYACHT_SSR__=${safeJson({
      language,
      dehydratedState: rendered.dehydratedState,
    })};</script>`;

  template = template.replace(
    '<div id="root"></div>',
    `<div id="root">${rendered.html}</div>${stateScript}`,
  );

  return {
    html: template,
    language,
    seo,
  };
}
