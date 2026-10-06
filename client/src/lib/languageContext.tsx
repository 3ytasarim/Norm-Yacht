import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { Language } from "./i18n";
import { getEquivalentPath, detectLanguageFromPath } from "./routes";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
});

export function LanguageProvider({
  children,
  initialLanguage,
}: {
  children: ReactNode;
  initialLanguage?: Language;
}) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (initialLanguage) return initialLanguage;

    if (typeof window === "undefined") {
      return "en";
    }

    const pathLang = detectLanguageFromPath(window.location.pathname);
    if (pathLang) {
      localStorage.setItem("norm-yacht-lang", pathLang);
      return pathLang;
    }

    const stored = localStorage.getItem("norm-yacht-lang");
    return (stored as Language) || "en";
  });

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);

    if (typeof window === "undefined") return;

    localStorage.setItem("norm-yacht-lang", lang);
    const currentPath = window.location.pathname;
    const newPath = getEquivalentPath(currentPath, lang);
    if (newPath !== currentPath) {
      window.history.replaceState(null, "", newPath);
      window.dispatchEvent(new PopStateEvent("popstate"));
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
