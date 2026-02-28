import { useEffect } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/lib/languageContext";
import { useTranslation } from "@/lib/i18n";
import { updateSEO, SEO_DATA } from "@/lib/seo";
import type { NewsItem } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Calendar, User } from "lucide-react";

export default function News() {
  const { language } = useLanguage();
  const t = useTranslation(language);
  const { data: newsItems = [], isLoading } = useQuery<NewsItem[]>({ queryKey: ["/api/news"] });

  useEffect(() => {
    updateSEO(SEO_DATA.news);
  }, []);

  return (
    <div>
      {/* Hero */}
      <div className="bg-[#0a1428] text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-[#F5A623] font-bold text-sm uppercase tracking-widest mb-3">Updates</div>
          <h1 className="text-4xl md:text-5xl font-black mb-4">{t.news.title}</h1>
          <p className="text-gray-400 text-lg max-w-2xl">{t.news.subtitle}</p>
        </div>
      </div>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-80 rounded-lg" />)}
            </div>
          ) : newsItems.length === 0 ? (
            <div className="text-center py-20 text-gray-500">No news articles yet.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {newsItems.map((item) => {
                const title = language === "tr" && item.titleTr ? item.titleTr :
                             language === "ru" && item.titleRu ? item.titleRu : item.title;
                const excerpt = language === "tr" && item.excerptTr ? item.excerptTr :
                                language === "ru" && item.excerptRu ? item.excerptRu : item.excerpt;
                return (
                  <Link key={item.id} href={`/news/${item.slug}`}>
                    <div
                      className="service-card-hover bg-white rounded-lg overflow-hidden border border-gray-100 shadow-sm group cursor-pointer h-full flex flex-col"
                      data-testid={`card-news-${item.id}`}
                    >
                      <div className="relative h-52 overflow-hidden flex-shrink-0">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[#0a1428] to-[#1a3a6b]" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                      </div>
                      <div className="p-5 flex flex-col flex-1">
                        <div className="flex items-center gap-3 mb-3 flex-wrap">
                          <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <Calendar className="w-3.5 h-3.5 text-[#F5A623]" />
                            {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : ""}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <User className="w-3.5 h-3.5 text-[#F5A623]" />
                            {item.author}
                          </div>
                        </div>
                        <h3 className="font-bold text-gray-900 text-base mb-2 group-hover:text-[#F5A623] transition-colors line-clamp-2 flex-shrink-0">{title}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 flex-1">{excerpt}</p>
                        {item.tags && item.tags.length > 0 && (
                          <div className="flex gap-2 mt-3 flex-wrap">
                            {item.tags.slice(0, 3).map((tag, ti) => (
                              <Badge key={ti} className="bg-[#F5A623]/10 text-[#F5A623] text-xs border-0 font-semibold">{tag}</Badge>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center text-[#F5A623] text-sm font-semibold mt-4 border-t border-gray-100 pt-4">
                          {t.news.readMore}
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
    </div>
  );
}
