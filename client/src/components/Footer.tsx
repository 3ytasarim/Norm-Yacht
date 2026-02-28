import { Link } from "wouter";
import { useLanguage } from "@/lib/languageContext";
import { useTranslation } from "@/lib/i18n";
import { getPath, getServicePath } from "@/lib/routes";
import { useQuery } from "@tanstack/react-query";
import type { Service } from "@shared/schema";
import logoWhitePath from "@assets/logo-white.png";
import { MapPin, Phone, Mail, Youtube, Instagram, Linkedin, Clock } from "lucide-react";

export default function Footer() {
  const { language } = useLanguage();
  const t = useTranslation(language);
  const { data: services = [] } = useQuery<Service[]>({ queryKey: ["/api/services"] });

  const topServices = services.slice(0, 5);

  return (
    <footer className="bg-[#0a1428] text-white">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/">
              <img src={logoWhitePath} alt="Norm Yacht" className="h-14 w-auto object-contain mb-5 cursor-pointer" />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              {t.footer.description}
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#F5A623] transition-colors"
                data-testid="footer-link-youtube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/norm_yacht/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#F5A623] transition-colors"
                data-testid="footer-link-instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#F5A623] transition-colors"
                data-testid="footer-link-linkedin"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-[#F5A623] font-bold text-sm uppercase tracking-wider mb-5">{t.footer.quickLinks}</h3>
            <ul className="space-y-2.5">
              {[
                { href: "/", label: t.nav.home },
                { href: getPath("about", language), label: t.nav.about },
                { href: getPath("projects", language), label: t.nav.projects },
                { href: getPath("news", language), label: t.nav.news },
                { href: getPath("contact", language), label: t.nav.contact },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <span className="text-gray-400 hover:text-[#F5A623] text-sm transition-colors cursor-pointer flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#F5A623] rounded-full flex-shrink-0" />
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-[#F5A623] font-bold text-sm uppercase tracking-wider mb-5">{t.footer.services}</h3>
            <ul className="space-y-2.5">
              {topServices.map((s) => (
                <li key={s.id}>
                  <Link href={getServicePath(s.slug, language)}>
                    <span className="text-gray-400 hover:text-[#F5A623] text-sm transition-colors cursor-pointer flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#F5A623] rounded-full flex-shrink-0" />
                      {language === "tr" && s.titleTr ? s.titleTr : language === "ru" && s.titleRu ? s.titleRu : s.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h3 className="text-[#F5A623] font-bold text-sm uppercase tracking-wider mb-5">{t.footer.contact}</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#F5A623] flex-shrink-0 mt-0.5" />
                <span className="text-gray-400 text-sm leading-relaxed">
                  İstasyon Mahallesi Yarış Çıkmazı Sokak, İstim Sanayi Sitesi No 17/153, Tuzla, İstanbul
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#F5A623] flex-shrink-0" />
                <a href="tel:+902165106676" className="text-gray-400 text-sm hover:text-[#F5A623] transition-colors">
                  0216 510 66 76
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#F5A623] flex-shrink-0" />
                <a href="mailto:info@normyacht.com.tr" className="text-gray-400 text-sm hover:text-[#F5A623] transition-colors">
                  info@normyacht.com.tr
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-[#F5A623] flex-shrink-0" />
                <span className="text-gray-400 text-sm">{t.contact.workingHoursValue}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Norm Yacht. {t.footer.rights}
          </p>
          <div className="group flex items-center gap-1.5 text-xs text-gray-600">
            <span>Design by</span>
            <span className="relative inline-block font-bold text-[#F5A623] animate-pulse-slow">
              <span className="inline-block transition-all duration-500 group-hover:scale-110 group-hover:text-white">
                3Y Tasarım & Yazılım Hizmetleri
              </span>
              <span className="absolute -bottom-0.5 left-0 w-0 h-[1px] bg-[#F5A623] transition-all duration-500 group-hover:w-full" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
