import { useEffect, useState, useRef } from "react";
import { Link, useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/lib/languageContext";
import { useTranslation } from "@/lib/i18n";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, ChevronLeft, ChevronRight, Wrench, Waves, Navigation, Settings, Activity, Gauge, Hammer, Zap, Cog, Anchor } from "lucide-react";
import { Button } from "@/components/ui/button";

const iconMap: Record<string, any> = {
  Waves, Anchor, Navigation, Settings, Activity, Gauge, Hammer, Zap, Cog, Wrench, Crane: Anchor,
};

type ServiceWithImages = {
  id: number;
  title: string;
  titleTr?: string | null;
  titleRu?: string | null;
  slug: string;
  description?: string | null;
  descriptionTr?: string | null;
  descriptionRu?: string | null;
  icon?: string | null;
  order?: number | null;
  active?: boolean | null;
  images: { id: number; imageUrl: string; order: number }[];
};

export default function ServiceDetail() {
  const [, params] = useRoute("/services/:slug");
  const { language } = useLanguage();
  const t = useTranslation(language);
  const [imgIndex, setImgIndex] = useState(0);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { data: service, isLoading, isError } = useQuery<ServiceWithImages>({
    queryKey: ["/api/services", params?.slug],
    enabled: !!params?.slug,
  });

  const imageCount = service?.images?.length || 0;

  useEffect(() => {
    if (imageCount <= 1) return;
    autoRef.current = setInterval(() => {
      setImgIndex((p) => (p + 1) % imageCount);
    }, 4000);
    return () => { if (autoRef.current) clearInterval(autoRef.current); };
  }, [imageCount]);

  const stopAuto = () => { if (autoRef.current) clearInterval(autoRef.current); };

  useEffect(() => {
    if (service) {
      const title = language === "tr" && service.titleTr ? service.titleTr :
                    language === "ru" && service.titleRu ? service.titleRu : service.title;
      document.title = `${title} - Norm Yacht Services`;
    }
  }, [service, language]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <Skeleton className="h-10 w-64 mb-6" />
        <Skeleton className="h-6 w-full mb-4" />
        <Skeleton className="h-6 w-3/4 mb-4" />
        <Skeleton className="h-72 w-full rounded-lg" />
      </div>
    );
  }

  if (isError || !service) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Service not found</h2>
        <Link href="/services">
          <Button variant="outline">Back to Services</Button>
        </Link>
      </div>
    );
  }

  const title = language === "tr" && service.titleTr ? service.titleTr :
               language === "ru" && service.titleRu ? service.titleRu : service.title;
  const description = language === "tr" && service.descriptionTr ? service.descriptionTr :
                      language === "ru" && service.descriptionRu ? service.descriptionRu : service.description;
  const Icon = iconMap[service.icon || "Wrench"] || Wrench;

  return (
    <div>
      {/* Hero */}
      <div className="bg-[#0a1428] text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <Link href="/services">
            <span className="inline-flex items-center gap-2 text-gray-400 hover:text-[#F5A623] mb-6 cursor-pointer transition-colors text-sm font-semibold">
              <ArrowLeft className="w-4 h-4" />
              {t.services.title}
            </span>
          </Link>
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-xl bg-[#F5A623]/20 flex items-center justify-center flex-shrink-0">
              <Icon className="w-8 h-8 text-[#F5A623]" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black">{title}</h1>
          </div>
        </div>
      </div>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Description */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-black text-gray-900 mb-6">About This Service</h2>
              <div
                className="prose prose-lg max-w-none text-gray-600 leading-relaxed prose-headings:font-black prose-headings:text-gray-900 prose-a:text-[#F5A623] prose-li:my-0.5"
                dangerouslySetInnerHTML={{ __html: description || "" }}
              />

              {/* Image gallery */}
              {service.images && service.images.length > 0 && (
                <div className="mt-10">
                  <h3 className="text-xl font-black text-gray-900 mb-5">Gallery</h3>
                  {/* Main image */}
                  <div className="relative rounded-lg overflow-hidden bg-gray-100 mb-4" style={{ height: "500px" }}>
                    <img
                      src={service.images[imgIndex]?.imageUrl}
                      alt={`${title} ${imgIndex + 1}`}
                      className="w-full h-full object-contain"
                    />
                    {service.images.length > 1 && (
                      <>
                        <button
                          onClick={() => { stopAuto(); setImgIndex((prev) => (prev - 1 + service.images.length) % service.images.length); }}
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-[#F5A623] flex items-center justify-center text-white transition-colors"
                          data-testid="button-gallery-prev"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => { stopAuto(); setImgIndex((prev) => (prev + 1) % service.images.length); }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-[#F5A623] flex items-center justify-center text-white transition-colors"
                          data-testid="button-gallery-next"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </div>
                  {/* Thumbnails */}
                  {service.images.length > 1 && (
                    <div className="flex gap-3 flex-wrap">
                      {service.images.map((img, i) => (
                        <button
                          key={img.id}
                          onClick={() => { stopAuto(); setImgIndex(i); }}
                          className={`w-20 h-16 rounded-md overflow-hidden border-2 transition-all ${i === imgIndex ? "border-[#F5A623]" : "border-transparent opacity-70 hover:opacity-100"}`}
                          data-testid={`button-thumbnail-${i}`}
                        >
                          <img src={img.imageUrl} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-100 sticky top-28">
                <h3 className="font-black text-gray-900 text-lg mb-5 pb-4 border-b border-gray-200">Need This Service?</h3>
                <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                  Contact our expert team to discuss your specific requirements and get a personalized quote.
                </p>
                <Link href="/contact">
                  <Button className="w-full bg-[#F5A623] hover:bg-[#e8901a] text-white font-bold" data-testid="button-contact-cta">
                    {t.home.contactBtn}
                  </Button>
                </Link>
                <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="w-2 h-2 bg-[#F5A623] rounded-full" />
                    International Standards
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="w-2 h-2 bg-[#F5A623] rounded-full" />
                    Expert Engineering Team
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="w-2 h-2 bg-[#F5A623] rounded-full" />
                    Tuzla, Istanbul Based
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
