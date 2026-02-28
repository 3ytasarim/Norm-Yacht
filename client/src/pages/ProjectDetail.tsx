import { useEffect, useState, useRef } from "react";
import { Link, useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/lib/languageContext";
import { useTranslation } from "@/lib/i18n";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User, Tag, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import ImageLightbox from "@/components/ImageLightbox";

type ProjectWithImages = {
  id: number;
  title: string;
  titleTr?: string | null;
  titleRu?: string | null;
  slug: string;
  description?: string | null;
  descriptionTr?: string | null;
  descriptionRu?: string | null;
  status: string;
  category?: string | null;
  client?: string | null;
  completionDate?: string | null;
  mainImage?: string | null;
  images: { id: number; imageUrl: string; order: number }[];
};

export default function ProjectDetail() {
  const [, params] = useRoute("/projects/:slug");
  const { language } = useLanguage();
  const t = useTranslation(language);
  const [mainImgIndex, setMainImgIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { data: project, isLoading, isError } = useQuery<ProjectWithImages>({
    queryKey: ["/api/projects", params?.slug],
    enabled: !!params?.slug,
  });

  const allImages = project ? [
    ...(project.mainImage ? [{ id: 0, imageUrl: project.mainImage, order: -1 }] : []),
    ...(project.images || []),
  ] : [];

  useEffect(() => {
    if (allImages.length <= 1) return;
    autoRef.current = setInterval(() => {
      setMainImgIndex((p) => (p + 1) % allImages.length);
    }, 4000);
    return () => { if (autoRef.current) clearInterval(autoRef.current); };
  }, [allImages.length]);

  useEffect(() => {
    if (project) {
      const title = language === "tr" && project.titleTr ? project.titleTr :
                    language === "ru" && project.titleRu ? project.titleRu : project.title;
      document.title = `${title} - Norm Yacht Projects`;
    }
  }, [project, language]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <Skeleton className="h-10 w-64 mb-6" />
        <Skeleton className="h-96 w-full rounded-lg mb-6" />
        <Skeleton className="h-6 w-full mb-3" />
        <Skeleton className="h-6 w-3/4" />
      </div>
    );
  }

  if (isError || !project) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Project not found</h2>
        <Link href="/projects">
          <Button variant="outline">Back to Projects</Button>
        </Link>
      </div>
    );
  }

  const title = language === "tr" && project.titleTr ? project.titleTr :
               language === "ru" && project.titleRu ? project.titleRu : project.title;
  const description = language === "tr" && project.descriptionTr ? project.descriptionTr :
                      language === "ru" && project.descriptionRu ? project.descriptionRu : project.description;

  return (
    <div>
      {/* Hero */}
      <div className="bg-[#0a1428] text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <Link href="/projects">
            <span className="inline-flex items-center gap-2 text-gray-400 hover:text-[#F5A623] mb-6 cursor-pointer transition-colors text-sm font-semibold">
              <ArrowLeft className="w-4 h-4" />
              {t.projects.backToProjects}
            </span>
          </Link>
          <div className="flex flex-wrap items-center gap-4">
            <h1 className="text-3xl md:text-4xl font-black">{title}</h1>
            <Badge className={`text-white font-bold ${project.status === "completed" ? "bg-green-600" : "bg-[#F5A623]"}`}>
              {project.status === "completed" ? "Completed" : "Ongoing"}
            </Badge>
          </div>
        </div>
      </div>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left: images + description */}
            <div className="lg:col-span-2">
              {/* Main image carousel */}
              {allImages.length > 0 && (
                <div className="mb-6">
                  <div className="relative rounded-lg overflow-hidden bg-gray-100 group cursor-pointer" style={{ height: "500px" }} onClick={() => { if (autoRef.current) clearInterval(autoRef.current); setLightboxOpen(true); }}>
                    <img
                      src={allImages[mainImgIndex]?.imageUrl}
                      alt={title}
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <ZoomIn className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
                    </div>
                    {allImages.length > 1 && (
                      <>
                        <button
                          onClick={(e) => { e.stopPropagation(); if (autoRef.current) clearInterval(autoRef.current); setMainImgIndex((p) => (p - 1 + allImages.length) % allImages.length); }}
                          className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/40 hover:bg-[#F5A623] flex items-center justify-center text-white transition-colors"
                          data-testid="button-img-prev"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); if (autoRef.current) clearInterval(autoRef.current); setMainImgIndex((p) => (p + 1) % allImages.length); }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/40 hover:bg-[#F5A623] flex items-center justify-center text-white transition-colors"
                          data-testid="button-img-next"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                          {allImages.map((_, i) => (
                            <button
                              key={i}
                              onClick={() => { if (autoRef.current) clearInterval(autoRef.current); setMainImgIndex(i); }}
                              className={`h-1.5 rounded-full transition-all ${i === mainImgIndex ? "w-6 bg-[#F5A623]" : "w-2 bg-white/50"}`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                  {/* Thumbnails */}
                  {allImages.length > 1 && (
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {allImages.map((img, i) => (
                        <button
                          key={i}
                          onClick={() => { if (autoRef.current) clearInterval(autoRef.current); setMainImgIndex(i); }}
                          className={`w-20 h-14 rounded-md overflow-hidden border-2 transition-all ${i === mainImgIndex ? "border-[#F5A623]" : "border-transparent opacity-70 hover:opacity-100"}`}
                          data-testid={`button-thumb-${i}`}
                        >
                          <img src={img.imageUrl} alt={`Thumb ${i + 1}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <h2 className="text-2xl font-black text-gray-900 mb-5">Project Description</h2>
              <div
                className="prose prose-lg max-w-none text-gray-600 leading-relaxed prose-headings:font-black prose-headings:text-gray-900 prose-a:text-[#F5A623] prose-li:my-0.5"
                dangerouslySetInnerHTML={{ __html: description || "" }}
              />
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-100 sticky top-28">
                <h3 className="font-black text-gray-900 text-lg mb-5 pb-4 border-b border-gray-200">Project Details</h3>
                <div className="space-y-4">
                  {project.category && (
                    <div>
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 text-[#F5A623]" /> {t.projects.category}
                      </div>
                      <div className="text-gray-800 font-medium">{project.category}</div>
                    </div>
                  )}
                  {project.client && (
                    <div>
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-[#F5A623]" /> {t.projects.client}
                      </div>
                      <div className="text-gray-800 font-medium">{project.client}</div>
                    </div>
                  )}
                  {project.completionDate && (
                    <div>
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#F5A623]" /> {t.projects.completionDate}
                      </div>
                      <div className="text-gray-800 font-medium">{project.completionDate}</div>
                    </div>
                  )}
                  <div>
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Status</div>
                    <Badge className={`${project.status === "completed" ? "bg-green-600" : "bg-[#F5A623]"} text-white font-bold`}>
                      {project.status === "completed" ? "Completed" : "Ongoing"}
                    </Badge>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <Link href="/contact">
                    <Button className="w-full bg-[#F5A623] hover:bg-[#e8901a] text-white font-bold">
                      Discuss a Similar Project
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {lightboxOpen && allImages.length > 0 && (
        <ImageLightbox
          images={allImages}
          currentIndex={mainImgIndex}
          onClose={() => setLightboxOpen(false)}
          onNavigate={(i) => setMainImgIndex(i)}
        />
      )}
    </div>
  );
}
