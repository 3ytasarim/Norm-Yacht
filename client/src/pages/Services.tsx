import { useEffect } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/lib/languageContext";
import { useTranslation } from "@/lib/i18n";
import type { Service } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight } from "lucide-react";

function stripHtml(html: string | null | undefined): string {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").trim();
}

export default function Services() {
  const { language } = useLanguage();
  const t = useTranslation(language);
  const { data: services = [], isLoading } = useQuery<Service[]>({ queryKey: ["/api/services"] });

  useEffect(() => {
    document.title = "Services - Norm Yacht";
  }, []);

  return (
    <div>
      {/* Hero */}
      <div className="bg-[#0a1428] text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-[#F5A623] font-bold text-sm uppercase tracking-widest mb-3">What We Offer</div>
          <h1 className="text-4xl md:text-5xl font-black mb-4">{t.services.title}</h1>
          <p className="text-gray-400 text-lg max-w-2xl">{t.services.subtitle}</p>
        </div>
      </div>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(9)].map((_, i) => <Skeleton key={i} className="h-56 rounded-lg" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => {
                const title = language === "tr" && service.titleTr ? service.titleTr :
                             language === "ru" && service.titleRu ? service.titleRu : service.title;
                const description = language === "tr" && service.descriptionTr ? service.descriptionTr :
                                    language === "ru" && service.descriptionRu ? service.descriptionRu : service.description;
                return (
                  <Link key={service.id} href={`/services/${service.slug}`}>
                    <div
                      className="service-card-hover bg-white rounded-lg overflow-hidden border border-gray-100 shadow-sm cursor-pointer group h-full flex flex-col"
                      data-testid={`card-service-${service.id}`}
                    >
                      <div className="relative w-full h-56 overflow-hidden flex-shrink-0">
                        <img
                          src={service.image || "https://images.unsplash.com/photo-1605281317010-fe5ffe798166?w=600&h=400&fit=crop"}
                          alt={title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      </div>
                      <div className="p-6 flex flex-col flex-1">
                        <h3 className="font-bold text-gray-900 text-lg mb-3 group-hover:text-[#F5A623] transition-colors">{title}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed flex-1 line-clamp-3">{stripHtml(description)}</p>
                        <div className="mt-5 flex items-center text-[#F5A623] text-sm font-semibold border-t border-gray-100 pt-4">
                          {t.services.viewDetail}
                          <ArrowRight className="ml-1.5 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-4">Need a Custom Solution?</h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            Contact our expert engineering team to discuss your specific requirements and get a tailored solution.
          </p>
          <Link href="/contact">
            <button className="bg-[#F5A623] hover:bg-[#e8901a] text-white font-bold px-8 py-3 rounded-md inline-flex items-center gap-2 transition-colors">
              {t.home.contactBtn} <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
