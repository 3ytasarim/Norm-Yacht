import { useEffect } from "react";
import { Link, useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/lib/languageContext";
import { useTranslation } from "@/lib/i18n";
import type { NewsItem } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";

export default function NewsDetail() {
  const [, params] = useRoute("/news/:slug");
  const { language } = useLanguage();
  const t = useTranslation(language);

  const { data: item, isLoading, isError } = useQuery<NewsItem>({
    queryKey: ["/api/news", params?.slug],
    enabled: !!params?.slug,
  });

  useEffect(() => {
    if (item) {
      const title = language === "tr" && item.titleTr ? item.titleTr :
                    language === "ru" && item.titleRu ? item.titleRu : item.title;
      document.title = `${title} - Norm Yacht News`;
    }
  }, [item, language]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <Skeleton className="h-10 w-64 mb-6" />
        <Skeleton className="h-72 w-full rounded-lg mb-6" />
        <Skeleton className="h-6 w-full mb-3" />
        <Skeleton className="h-6 w-3/4" />
      </div>
    );
  }

  if (isError || !item) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Article not found</h2>
        <Link href="/news">
          <Button variant="outline">Back to News</Button>
        </Link>
      </div>
    );
  }

  const title = language === "tr" && item.titleTr ? item.titleTr :
               language === "ru" && item.titleRu ? item.titleRu : item.title;
  const content = language === "tr" && item.contentTr ? item.contentTr :
                  language === "ru" && item.contentRu ? item.contentRu : item.content;

  return (
    <div>
      {/* Hero image */}
      <div className="relative h-80 md:h-[450px] overflow-hidden">
        {item.image ? (
          <img src={item.image} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#0a1428] to-[#1a3a6b]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-4xl mx-auto">
            <Link href="/news">
              <span className="inline-flex items-center gap-2 text-white/70 hover:text-[#F5A623] mb-4 cursor-pointer transition-colors text-sm font-semibold">
                <ArrowLeft className="w-4 h-4" />
                {t.news.backToNews}
              </span>
            </Link>
            <h1 className="text-2xl md:text-4xl font-black text-white leading-tight">{title}</h1>
          </div>
        </div>
      </div>

      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-4 mb-8 pb-8 border-b border-gray-100">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4 text-[#F5A623]" />
              <span>{t.news.publishedAt}:</span>
              <span className="font-medium text-gray-700">
                {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : ""}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <User className="w-4 h-4 text-[#F5A623]" />
              <span>{t.news.author}:</span>
              <span className="font-medium text-gray-700">{item.author}</span>
            </div>
            {item.tags && item.tags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <Tag className="w-4 h-4 text-[#F5A623]" />
                {item.tags.map((tag, i) => (
                  <Badge key={i} className="bg-[#F5A623]/10 text-[#F5A623] border-0 text-xs font-semibold">{tag}</Badge>
                ))}
              </div>
            )}
          </div>

          {/* Content */}
          <div
            className="prose prose-lg max-w-none text-gray-700 leading-relaxed prose-headings:font-black prose-headings:text-gray-900 prose-a:text-[#F5A623]"
            dangerouslySetInnerHTML={{ __html: content || "" }}
          />

          {/* Back button */}
          <div className="mt-12 pt-8 border-t border-gray-100">
            <Link href="/news">
              <Button variant="outline" className="border-[#F5A623] text-[#F5A623] font-bold group">
                <ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                {t.news.backToNews}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
