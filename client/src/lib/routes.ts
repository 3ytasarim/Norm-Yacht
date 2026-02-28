import type { Language } from "./i18n";

const localizedPaths: Record<string, Record<Language, string>> = {
  about: { en: "/about", tr: "/hakkimizda", ru: "/o-nas" },
  services: { en: "/services", tr: "/hizmetler", ru: "/uslugi" },
  projects: { en: "/projects", tr: "/projeler", ru: "/proekty" },
  news: { en: "/news", tr: "/haberler", ru: "/novosti" },
  contact: { en: "/contact", tr: "/iletisim", ru: "/kontakty" },
};

export function getPath(page: string, language: Language): string {
  return localizedPaths[page]?.[language] || `/${page}`;
}

export function getServicePath(slug: string, language: Language): string {
  return `${getPath("services", language)}/${slug}`;
}

export function getProjectPath(slug: string, language: Language): string {
  return `${getPath("projects", language)}/${slug}`;
}

export function getNewsPath(slug: string, language: Language): string {
  return `${getPath("news", language)}/${slug}`;
}

export function getAllRoutePaths(page: string): string[] {
  const paths = localizedPaths[page];
  if (!paths) return [`/${page}`];
  return Object.values(paths);
}

export function detectLanguageFromPath(path: string): Language | null {
  for (const [, langs] of Object.entries(localizedPaths)) {
    for (const [lang, p] of Object.entries(langs)) {
      if (path === p || path.startsWith(p + "/")) {
        return lang as Language;
      }
    }
  }
  return null;
}

export function getCurrentPageFromPath(path: string): string | null {
  for (const [page, langs] of Object.entries(localizedPaths)) {
    for (const p of Object.values(langs)) {
      if (path === p || path.startsWith(p + "/")) {
        return page;
      }
    }
  }
  return null;
}

export function getEquivalentPath(currentPath: string, newLanguage: Language): string {
  for (const [page, langs] of Object.entries(localizedPaths)) {
    for (const p of Object.values(langs)) {
      if (currentPath === p) {
        return langs[newLanguage];
      }
      if (currentPath.startsWith(p + "/")) {
        const slug = currentPath.slice(p.length + 1);
        return langs[newLanguage] + "/" + slug;
      }
    }
  }
  return currentPath;
}
