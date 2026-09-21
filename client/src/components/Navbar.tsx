import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/lib/languageContext";
import { useTranslation } from "@/lib/i18n";
import type { Service } from "@shared/schema";
import { getPath, getServicePath } from "@/lib/routes";
import logoPath from "@assets/logo-transparent.png";
import { Menu, X, ChevronDown, Youtube, Instagram, Linkedin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

function FlagGB({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
      <path fill="#012169" d="M0 0h640v480H0z"/>
      <path fill="#FFF" d="m75 0 244 181L562 0h78v62L400 241l240 178v61h-80L320 302 82 480H0v-60l239-178L0 64V0z"/>
      <path fill="#C8102E" d="m424 281 216 159v40L369 281zm-184 20 6 35L54 480H0zM640 0v3L391 191l2-44L590 0zM0 0l239 176h-60L0 42z"/>
      <path fill="#FFF" d="M241 0v480h160V0zM0 160v160h640V160z"/>
      <path fill="#C8102E" d="M0 193v96h640v-96zM273 0v480h96V0z"/>
    </svg>
  );
}

function FlagTR({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
      <path fill="#E30A17" d="M0 0h640v480H0z"/>
      <circle cx="260" cy="240" r="120" fill="#fff"/>
      <circle cx="288" cy="240" r="96" fill="#E30A17"/>
      <path fill="#fff" d="m384 180 16 50-42-30h52l-42 30z" transform="translate(-12 60) scale(1.4)"/>
    </svg>
  );
}

function FlagRU({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
      <path fill="#fff" d="M0 0h640v160H0z"/>
      <path fill="#0039A6" d="M0 160h640v160H0z"/>
      <path fill="#D52B1E" d="M0 320h640v160H0z"/>
    </svg>
  );
}

const languageConfig: Record<string, { Flag: typeof FlagGB; label: string; short: string }> = {
  en: { Flag: FlagGB, label: "EN", short: "EN" },
  tr: { Flag: FlagTR, label: "TR", short: "TR" },
  ru: { Flag: FlagRU, label: "RU", short: "RU" },
};

export default function Navbar() {
  const [location] = useLocation();
  const { language, setLanguage } = useLanguage();
  const t = useTranslation(language);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

  const { data: services = [] } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setServicesOpen(false);
    setLangOpen(false);
  }, [location]);

  const isActive = (path: string) => location === path || location.startsWith(path + "/");

  const navLinks = [
    { href: "/", label: t.nav.home },
    { href: getPath("about", language), label: t.nav.about },
    { href: getPath("services", language), label: t.nav.services, hasDropdown: true },
  ];

  const navLinksRight = [
    { href: getPath("projects", language), label: t.nav.projects },
    { href: getPath("news", language), label: t.nav.news },
    { href: getPath("contact", language), label: t.nav.contact },
  ];

  return (
    <>
      {/* Top bar */}
      <div className="bg-[#0a1428] text-white py-2 px-4 text-sm hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="tel:+902165106676" className="flex items-center gap-1.5 hover:text-[#F5A623] transition-colors">
              <Phone className="w-3.5 h-3.5" />
              <span>0216 510 66 76</span>
            </a>
            <a href="mailto:info@normyacht.com.tr" className="hover:text-[#F5A623] transition-colors">
              info@normyacht.com.tr
            </a>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#F5A623] transition-colors"
              data-testid="link-youtube"
              aria-label="YouTube"
            >
              <Youtube className="w-4 h-4" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#F5A623] transition-colors"
              data-testid="link-instagram"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#F5A623] transition-colors"
              data-testid="link-linkedin"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 bg-white ${
          scrolled
            ? "shadow-md border-b border-gray-100"
            : "shadow-sm border-b border-gray-100"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Left nav */}
            <div className="hidden lg:flex items-center gap-8 flex-1">
              {navLinks.map((link) =>
                link.hasDropdown ? (
                  <div
                    key={link.href}
                    className="relative"
                    onMouseEnter={() => setServicesOpen(true)}
                    onMouseLeave={() => setServicesOpen(false)}
                  >
                    <Link href={link.href}>
                      <span
                        className={`nav-link flex items-center gap-1 text-sm font-semibold uppercase tracking-wide cursor-pointer transition-colors ${
                          isActive(getPath("services", language))
                            ? "text-[#F5A623] active"
                            : "text-gray-700 hover:text-[#F5A623]"
                        }`}
                        data-testid={`nav-${link.href.slice(1) || "home"}`}
                      >
                        {link.label}
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${servicesOpen ? "rotate-180" : ""}`} />
                      </span>
                    </Link>
                    {servicesOpen && services.length > 0 && (
                      <div className="absolute top-full left-0 w-64 bg-white shadow-xl border border-gray-100 rounded-md py-2 z-50">
                        {services.map((s) => (
                          <Link key={s.id} href={getServicePath(s.slug, language)}>
                            <div className="px-4 py-2.5 text-sm text-gray-700 hover:text-[#F5A623] hover:bg-orange-50 cursor-pointer transition-colors">
                              {language === "tr" && s.titleTr ? s.titleTr : language === "ru" && s.titleRu ? s.titleRu : s.title}
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link key={link.href} href={link.href}>
                    <span
                      className={`nav-link text-sm font-semibold uppercase tracking-wide cursor-pointer transition-colors ${
                        isActive(link.href)
                          ? "text-[#F5A623] active"
                          : "text-gray-700 hover:text-[#F5A623]"
                      }`}
                      data-testid={`nav-${link.href.slice(1) || "home"}`}
                    >
                      {link.label}
                    </span>
                  </Link>
                )
              )}
            </div>

            {/* Logo center */}
            <div className="flex-shrink-0">
              <Link href="/">
                <img
                  src={logoPath}
                  alt="Norm Yacht"
                  className="h-14 w-auto object-contain cursor-pointer"
                  data-testid="logo-main"
                />
              </Link>
            </div>

            {/* Right nav */}
            <div className="hidden lg:flex items-center gap-8 flex-1 justify-end">
              {navLinksRight.map((link) => (
                <Link key={link.href} href={link.href}>
                  <span
                    className={`nav-link text-sm font-semibold uppercase tracking-wide cursor-pointer transition-colors ${
                      isActive(link.href)
                        ? "text-[#F5A623] active"
                        : "text-gray-700 hover:text-[#F5A623]"
                    }`}
                    data-testid={`nav-${link.href.slice(1)}`}
                  >
                    {link.label}
                  </span>
                </Link>
              ))}

              {/* Language selector */}
              <div className="relative" onMouseLeave={() => setLangOpen(false)}>
                <button
                  className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 hover:text-[#F5A623] transition-colors"
                  onMouseEnter={() => setLangOpen(true)}
                  data-testid="button-language-selector"
                >
                  {(() => { const { Flag, short } = languageConfig[language]; return <><Flag className="w-5 h-4 rounded-sm border border-gray-200 shadow-sm" /><span>{short}</span></>; })()}
                  <ChevronDown className={`w-3 h-3 transition-transform ${langOpen ? "rotate-180" : ""}`} />
                </button>
                {langOpen && (
                  <div className="absolute right-0 top-full w-32 bg-white shadow-xl border border-gray-100 rounded-md py-1 z-50">
                    {(["en", "tr", "ru"] as const).map((lang) => {
                      const { Flag, short } = languageConfig[lang];
                      return (
                        <button
                          key={lang}
                          className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm hover:bg-orange-50 hover:text-[#F5A623] transition-colors ${language === lang ? "text-[#F5A623] font-semibold bg-orange-50/50" : "text-gray-700"}`}
                          onClick={() => { setLanguage(lang); setLangOpen(false); }}
                          data-testid={`button-lang-${lang}`}
                        >
                          <Flag className="w-5 h-4 rounded-sm border border-gray-200 shadow-sm flex-shrink-0" />
                          <span>{short}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Mobile hamburger */}
            <div className="lg:hidden flex items-center gap-3">
              {/* Mobile language */}
              <div className="relative">
                <button
                  className="flex items-center gap-1.5 text-sm font-semibold text-gray-700"
                  onClick={() => setLangOpen(!langOpen)}
                  data-testid="button-mobile-lang"
                >
                  {(() => { const { Flag, short } = languageConfig[language]; return <><Flag className="w-5 h-4 rounded-sm border border-gray-200 shadow-sm" /><span>{short}</span></>; })()}
                </button>
                {langOpen && (
                  <div className="absolute right-0 top-full w-32 bg-white shadow-xl border border-gray-100 rounded-md py-1 z-50">
                    {(["en", "tr", "ru"] as const).map((lang) => {
                      const { Flag, short } = languageConfig[lang];
                      return (
                        <button
                          key={lang}
                          className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm hover:bg-orange-50 hover:text-[#F5A623] transition-colors ${language === lang ? "text-[#F5A623] font-semibold bg-orange-50/50" : "text-gray-700"}`}
                          onClick={() => { setLanguage(lang); setLangOpen(false); }}
                        >
                          <Flag className="w-5 h-4 rounded-sm border border-gray-200 shadow-sm flex-shrink-0" />
                          <span>{short}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="text-gray-700 p-1"
                data-testid="button-mobile-menu"
              >
                {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
            <div className="px-4 py-4 space-y-1">
              {[...navLinks, ...navLinksRight].map((link) =>
                ("hasDropdown" in link && link.hasDropdown) ? (
                  <div key={link.href}>
                    <button
                      className="w-full flex items-center justify-between py-3 px-3 text-sm font-semibold uppercase tracking-wide text-gray-700 hover:text-[#F5A623] hover:bg-orange-50 rounded-md transition-colors"
                      onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                    >
                      {link.label}
                      <ChevronDown className={`w-4 h-4 transition-transform ${mobileServicesOpen ? "rotate-180" : ""}`} />
                    </button>
                    {mobileServicesOpen && (
                      <div className="ml-4 mt-1 space-y-1">
                        <Link href={getPath("services", language)}>
                          <div className="py-2 px-3 text-sm text-gray-600 hover:text-[#F5A623] cursor-pointer">
                            {t.services.title}
                          </div>
                        </Link>
                        {services.map((s) => (
                          <Link key={s.id} href={getServicePath(s.slug, language)}>
                            <div className="py-2 px-3 text-sm text-gray-600 hover:text-[#F5A623] cursor-pointer transition-colors">
                              {language === "tr" && s.titleTr ? s.titleTr : language === "ru" && s.titleRu ? s.titleRu : s.title}
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link key={link.href} href={link.href}>
                    <div
                      className={`py-3 px-3 text-sm font-semibold uppercase tracking-wide rounded-md cursor-pointer transition-colors ${
                        isActive(link.href)
                          ? "text-[#F5A623] bg-orange-50"
                          : "text-gray-700 hover:text-[#F5A623] hover:bg-orange-50"
                      }`}
                    >
                      {link.label}
                    </div>
                  </Link>
                )
              )}
              {/* Mobile social */}
              <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                <a href="tel:+902165106676" className="text-sm text-gray-600 hover:text-[#F5A623] transition-colors flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" />
                  0216 510 66 76
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
