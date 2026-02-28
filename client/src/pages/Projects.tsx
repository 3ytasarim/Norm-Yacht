import { useEffect, useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/lib/languageContext";
import { useTranslation } from "@/lib/i18n";
import { updateSEO, getSEOData } from "@/lib/seo";
import { getProjectPath } from "@/lib/routes";
import type { Project } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Calendar, User, Tag } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

function stripHtml(html: string | null | undefined): string {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").trim();
}

function ProjectCard({ project, t, language }: { project: Project; t: any; language: string }) {
  const title = language === "tr" && project.titleTr ? project.titleTr :
               language === "ru" && project.titleRu ? project.titleRu : project.title;
  const description = language === "tr" && project.descriptionTr ? project.descriptionTr :
                      language === "ru" && project.descriptionRu ? project.descriptionRu : project.description;

  return (
    <Link href={getProjectPath(project.slug, language as any)}>
      <div
        className="service-card-hover bg-white rounded-lg overflow-hidden border border-gray-100 shadow-sm group cursor-pointer"
        data-testid={`card-project-${project.id}`}
      >
        {/* Image */}
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <Badge
            className={`absolute top-4 left-4 text-white font-bold text-xs ${project.status === "completed" ? "bg-green-600" : "bg-[#F5A623]"}`}
          >
            {project.status === "completed" ? t.projects.statusCompleted : t.projects.statusOngoing}
          </Badge>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="font-bold text-gray-900 text-base mb-3 group-hover:text-[#F5A623] transition-colors line-clamp-2">{title}</h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">{stripHtml(description)}</p>

          <div className="space-y-2 mb-4">
            {project.category && (
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Tag className="w-3.5 h-3.5 text-[#F5A623]" />
                {project.category}
              </div>
            )}
            {project.client && (
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <User className="w-3.5 h-3.5 text-[#F5A623]" />
                {project.client}
              </div>
            )}
            {project.completionDate && (
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Calendar className="w-3.5 h-3.5 text-[#F5A623]" />
                {project.completionDate}
              </div>
            )}
          </div>

          <div className="flex items-center text-[#F5A623] text-sm font-semibold border-t border-gray-100 pt-4">
            {t.projects.viewProject}
            <ArrowRight className="ml-1.5 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function Projects() {
  const { language } = useLanguage();
  const t = useTranslation(language);
  const [tab, setTab] = useState("all");

  const { data: allProjects = [], isLoading } = useQuery<Project[]>({ queryKey: ["/api/projects"] });

  useEffect(() => {
    updateSEO(getSEOData("projects", language));
  }, [language]);

  const completed = allProjects.filter((p) => p.status === "completed");
  const ongoing = allProjects.filter((p) => p.status === "ongoing");
  const displayed = tab === "all" ? allProjects : tab === "completed" ? completed : ongoing;

  return (
    <div>
      {/* Hero */}
      <div className="bg-[#0a1428] text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-[#F5A623] font-bold text-sm uppercase tracking-widest mb-3">{t.projects.label}</div>
          <h1 className="text-4xl md:text-5xl font-black mb-4">{t.projects.title}</h1>
          <p className="text-gray-400 text-lg max-w-2xl">{t.projects.subtitle}</p>
        </div>
      </div>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <Tabs value={tab} onValueChange={setTab}>
            <div className="flex items-center justify-center mb-10">
              <TabsList className="bg-gray-100 p-1 rounded-lg">
                <TabsTrigger value="all" data-testid="tab-all-projects">
                  {t.projects.all} ({allProjects.length})
                </TabsTrigger>
                <TabsTrigger value="completed" data-testid="tab-completed-projects">
                  {t.projects.completed} ({completed.length})
                </TabsTrigger>
                <TabsTrigger value="ongoing" data-testid="tab-ongoing-projects">
                  {t.projects.ongoing} ({ongoing.length})
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value={tab}>
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-80 rounded-lg" />)}
                </div>
              ) : displayed.length === 0 ? (
                <div className="text-center py-20 text-gray-500">
                  {t.projects.noProjects}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayed.map((p) => (
                    <ProjectCard key={p.id} project={p} t={t} language={language} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}
