import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/lib/languageContext";
import { useTranslation } from "@/lib/i18n";
import type { SliderItem, Service, Project, NewsItem } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, ArrowRight, Anchor, Waves, Award, Users, Calendar, Wrench, Navigation, Settings, Activity, Gauge, Hammer, Zap, Cog } from "lucide-react";
import aboutYachtImage from "@assets/image_1772245620349.png";
import workshopImage from "@assets/image_1772245774774.png";
import { Skeleton } from "@/components/ui/skeleton";

const iconMap: Record<string, any> = {
  Waves, Anchor, Navigation, Settings, Activity, Gauge, Hammer, Zap, Cog, Wrench,
  Crane: Anchor,
};

function getIcon(iconName: string) {
  return iconMap[iconName] || Wrench;
}

function HeroSlider() {
  const { language } = useLanguage();
  const t = useTranslation(language);
  const { data: slides = [], isLoading } = useQuery<SliderItem[]>({ queryKey: ["/api/slider"] });
  const activeSlides = slides.filter((s) => s.active);
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (activeSlides.length <= 1) return;
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % activeSlides.length);
    }, 5500);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [activeSlides.length]);

  const prev = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setCurrent((p) => (p - 1 + activeSlides.length) % activeSlides.length);
  };

  const next = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setCurrent((p) => (p + 1) % activeSlides.length);
  };

  const getTitle = (slide: SliderItem) =>
    language === "tr" && slide.titleTr ? slide.titleTr :
    language === "ru" && slide.titleRu ? slide.titleRu : slide.title;

  const getSubtitle = (slide: SliderItem) =>
    language === "tr" && slide.subtitleTr ? slide.subtitleTr :
    language === "ru" && slide.subtitleRu ? slide.subtitleRu : slide.subtitle;

  const getButtonText = (slide: SliderItem) =>
    language === "tr" && slide.buttonTextTr ? slide.buttonTextTr :
    language === "ru" && slide.buttonTextRu ? slide.buttonTextRu : slide.buttonText;

  if (isLoading) {
    return <div className="h-[600px] bg-[#0a1428] animate-pulse" />;
  }

  if (!activeSlides.length) return null;

  const slide = activeSlides[current];

  return (
    <div className="relative h-[600px] md:h-[680px] overflow-hidden" data-testid="hero-slider">
      {/* Left background */}
      <div
        className="absolute inset-y-0 left-0 w-full md:w-1/2 transition-all duration-700"
        style={{ backgroundColor: slide.bgColor || "#0a1428" }}
      >
        {slide.bgImage && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{ backgroundImage: `url(${slide.bgImage})` }}
          />
        )}
        <div className="absolute inset-0 flex items-center">
          <div className="px-8 md:px-12 lg:px-16 max-w-xl animate-slide-in-left">
            <div className="w-12 h-1 bg-[#F5A623] mb-6 rounded-full" />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight mb-5">
              {getTitle(slide)}
            </h1>
            {getSubtitle(slide) && (
              <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-8">
                {getSubtitle(slide)}
              </p>
            )}
            {slide.buttonText && slide.buttonLink && (
              <Link href={slide.buttonLink}>
                <Button
                  size="lg"
                  className="bg-[#F5A623] hover:bg-[#e8901a] text-white font-bold px-8 py-3 rounded-md group"
                  data-testid="button-hero-cta"
                >
                  {getButtonText(slide)}
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Right image */}
      <div className="hidden md:block absolute inset-y-0 right-0 w-1/2 overflow-hidden">
        {slide.rightImage ? (
          <img
            src={slide.rightImage}
            alt={getTitle(slide)}
            className="w-full h-full object-cover animate-slide-in-right"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#1a3a6b] to-[#0a1428]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1428] via-transparent to-transparent opacity-40" />
      </div>

      {/* Navigation arrows */}
      {activeSlides.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/15 hover:bg-[#F5A623] flex items-center justify-center transition-colors z-20 text-white"
            data-testid="button-slider-prev"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-4 md:right-[calc(50%+1rem)] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/15 hover:bg-[#F5A623] flex items-center justify-center transition-colors z-20 text-white"
            data-testid="button-slider-next"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Dots */}
      {activeSlides.length > 1 && (
        <div className="absolute bottom-6 left-8 md:left-12 flex gap-2 z-20">
          {activeSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`slider-dot h-1.5 rounded-full transition-all ${i === current ? "w-8 bg-[#F5A623]" : "w-3 bg-white/40 hover:bg-white/60"}`}
              data-testid={`button-slider-dot-${i}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function StatsBar() {
  const stats = [
    { icon: Calendar, label: "Founded", value: "2019" },
    { icon: Wrench, label: "Projects Completed", value: "100+" },
    { icon: Users, label: "Expert Engineers", value: "15+" },
    { icon: Award, label: "Years Experience", value: "5+" },
  ];
  return (
    <div className="bg-[#0a1428] text-white">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x md:divide-white/10">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="flex flex-col items-center text-center px-6">
                <div className="w-12 h-12 rounded-full bg-[#F5A623]/10 flex items-center justify-center mb-3">
                  <Icon className="w-6 h-6 text-[#F5A623]" />
                </div>
                <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function AboutSection() {
  const { language } = useLanguage();
  const t = useTranslation(language);
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div>
            <div className="text-[#F5A623] font-bold text-sm uppercase tracking-widest mb-3">About Us</div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6 leading-tight">
              {t.home.aboutTitle}
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Norm Yat was established in 2019 in Istanbul Tuzla, Türkiye's leading hub for yacht building and refit operations. Since its foundation, the company has been delivering high-quality engineering solutions in the fields of superyacht engineering, yacht stabilization systems, and marine hydraulic systems.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              Operating from Tuzla, at the heart of the Turkish maritime industry, Norm Yat provides comprehensive engineering services to yacht owners, shipyards, and project managers. The company specializes in the design, integration, installation, commissioning, and maintenance of advanced stabilizer systems, custom hydraulic solutions, and complete turnkey yacht engineering projects.
            </p>
            <Link href="/about">
              <Button className="bg-[#F5A623] hover:bg-[#e8901a] text-white font-bold group">
                {t.home.learnMore}
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <img
                src={workshopImage}
                alt="Norm Yacht workshop - Tuzla, Istanbul"
                className="w-full h-auto rounded-2xl"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-[#F5A623] text-white p-6 rounded-lg shadow-xl">
              <div className="text-3xl font-black">2019</div>
              <div className="text-sm font-semibold mt-1">Since Tuzla, Istanbul</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ServicesSection() {
  const { language } = useLanguage();
  const t = useTranslation(language);
  const { data: services = [], isLoading } = useQuery<Service[]>({ queryKey: ["/api/services"] });
  const displayServices = services.slice(0, 6);

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-14">
          <div className="text-[#F5A623] font-bold text-sm uppercase tracking-widest mb-3">What We Do</div>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">{t.home.servicesTitle}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{t.home.servicesSubtitle}</p>
          <div className="section-divider w-20 mx-auto mt-6" />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-48 rounded-lg" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayServices.map((service) => {
              const title = language === "tr" && service.titleTr ? service.titleTr :
                           language === "ru" && service.titleRu ? service.titleRu : service.title;
              const description = language === "tr" && service.descriptionTr ? service.descriptionTr :
                                  language === "ru" && service.descriptionRu ? service.descriptionRu : service.description;
              return (
                <Link key={service.id} href={`/services/${service.slug}`}>
                  <div className="service-card-hover bg-white rounded-lg overflow-hidden border border-gray-100 shadow-sm cursor-pointer group" data-testid={`card-service-${service.id}`}>
                    <div className="relative w-full h-44 overflow-hidden">
                      <img
                        src={service.image || "https://images.unsplash.com/photo-1605281317010-fe5ffe798166?w=600&h=400&fit=crop"}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-[#F5A623] transition-colors">{title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">{description}</p>
                      <div className="mt-4 flex items-center text-[#F5A623] text-sm font-semibold">
                        {t.services.viewDetail} <ArrowRight className="ml-1.5 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <div className="text-center mt-10">
          <Link href="/services">
            <Button variant="outline" className="border-[#F5A623] text-[#F5A623] font-bold group">
              {t.home.viewAll} <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function ProjectsSection() {
  const { language } = useLanguage();
  const t = useTranslation(language);
  const { data: projects = [], isLoading } = useQuery<Project[]>({ queryKey: ["/api/projects"] });
  const displayProjects = projects.slice(0, 3);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-14">
          <div className="text-[#F5A623] font-bold text-sm uppercase tracking-widest mb-3">Our Work</div>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">{t.home.projectsTitle}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{t.home.projectsSubtitle}</p>
          <div className="section-divider w-20 mx-auto mt-6" />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-72 rounded-lg" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayProjects.map((project) => {
              const title = language === "tr" && project.titleTr ? project.titleTr :
                           language === "ru" && project.titleRu ? project.titleRu : project.title;
              const description = language === "tr" && project.descriptionTr ? project.descriptionTr :
                                  language === "ru" && project.descriptionRu ? project.descriptionRu : project.description;
              return (
                <Link key={project.id} href={`/projects/${project.slug}`}>
                  <div className="service-card-hover rounded-lg overflow-hidden border border-gray-100 shadow-sm group cursor-pointer" data-testid={`card-project-${project.id}`}>
                    <div className="relative h-52 overflow-hidden">
                      {project.mainImage ? (
                        <img
                          src={project.mainImage}
                          alt={title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#0a1428] to-[#1a3a6b]" />
                      )}
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                      <Badge
                        className={`absolute top-4 left-4 text-white text-xs font-bold ${project.status === "completed" ? "bg-green-600" : "bg-[#F5A623]"}`}
                      >
                        {project.status === "completed" ? t.projects.completed.split(" ")[0] : "Ongoing"}
                      </Badge>
                    </div>
                    <div className="p-5 bg-white">
                      <h3 className="font-bold text-gray-900 text-base mb-2 group-hover:text-[#F5A623] transition-colors line-clamp-2">{title}</h3>
                      {project.category && (
                        <div className="text-sm text-gray-500 mb-2">{project.category}</div>
                      )}
                      <div className="flex items-center text-[#F5A623] text-sm font-semibold mt-3">
                        {t.projects.viewProject} <ArrowRight className="ml-1.5 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <div className="text-center mt-10">
          <Link href="/projects">
            <Button variant="outline" className="border-[#F5A623] text-[#F5A623] font-bold group">
              {t.home.viewAll} <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function NewsSection() {
  const { language } = useLanguage();
  const t = useTranslation(language);
  const { data: newsItems = [], isLoading } = useQuery<NewsItem[]>({ queryKey: ["/api/news"] });
  const displayNews = newsItems.slice(0, 3);

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-14">
          <div className="text-[#F5A623] font-bold text-sm uppercase tracking-widest mb-3">Latest</div>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">{t.home.newsTitle}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{t.home.newsSubtitle}</p>
          <div className="section-divider w-20 mx-auto mt-6" />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-72 rounded-lg" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayNews.map((item) => {
              const title = language === "tr" && item.titleTr ? item.titleTr :
                           language === "ru" && item.titleRu ? item.titleRu : item.title;
              const excerpt = language === "tr" && item.excerptTr ? item.excerptTr :
                              language === "ru" && item.excerptRu ? item.excerptRu : item.excerpt;
              return (
                <Link key={item.id} href={`/news/${item.slug}`}>
                  <div className="service-card-hover rounded-lg overflow-hidden bg-white border border-gray-100 shadow-sm group cursor-pointer" data-testid={`card-news-${item.id}`}>
                    <div className="relative h-48 overflow-hidden">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#0a1428] to-[#1a3a6b]" />
                      )}
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-xs text-gray-500">
                          {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : ""}
                        </span>
                        {item.tags && item.tags[0] && (
                          <Badge className="bg-[#F5A623]/10 text-[#F5A623] text-xs border-0 font-semibold">{item.tags[0]}</Badge>
                        )}
                      </div>
                      <h3 className="font-bold text-gray-900 text-base mb-2 group-hover:text-[#F5A623] transition-colors line-clamp-2">{title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">{excerpt}</p>
                      <div className="flex items-center text-[#F5A623] text-sm font-semibold mt-4">
                        {t.home.readMore} <ArrowRight className="ml-1.5 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <div className="text-center mt-10">
          <Link href="/news">
            <Button variant="outline" className="border-[#F5A623] text-[#F5A623] font-bold group">
              {t.home.viewAll} <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function ContactCta() {
  const { language } = useLanguage();
  const t = useTranslation(language);
  return (
    <section className="py-20 bg-[#0a1428] relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#F5A623] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#F5A623] rounded-full translate-y-1/2 -translate-x-1/2" />
      </div>
      <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
        <div className="text-[#F5A623] font-bold text-sm uppercase tracking-widest mb-4">Get In Touch</div>
        <h2 className="text-3xl md:text-4xl font-black text-white mb-4">{t.home.contactCta}</h2>
        <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">{t.home.contactCtaText}</p>
        <Link href="/contact">
          <Button size="lg" className="bg-[#F5A623] hover:bg-[#e8901a] text-white font-bold px-10 group">
            {t.home.contactBtn}
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
    </section>
  );
}

export default function Home() {
  useEffect(() => {
    document.title = "Norm Yacht - Hydraulic Repair & Marine Engineering";
  }, []);

  return (
    <div>
      <HeroSlider />
      <StatsBar />
      <AboutSection />
      <ServicesSection />
      <ProjectsSection />
      <NewsSection />
      <ContactCta />
    </div>
  );
}
