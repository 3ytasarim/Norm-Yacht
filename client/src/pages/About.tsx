import { useEffect } from "react";
import { useLanguage } from "@/lib/languageContext";
import { useTranslation } from "@/lib/i18n";
import { updateSEO, getSEOData } from "@/lib/seo";
import { CheckCircle, Target, Eye } from "lucide-react";
import aboutImage from "@assets/about_1772246089936.webp";

export default function About() {
  const { language } = useLanguage();
  const t = useTranslation(language);

  useEffect(() => {
    updateSEO({ ...getSEOData("about", language), language });
  }, [language]);

  const missionPoints = t.about.missionPoints;

  return (
    <div>
      <div className="bg-[#0a1428] text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-[#F5A623] font-bold text-sm uppercase tracking-widest mb-3">{t.about.label}</div>
          <h1 className="text-4xl md:text-5xl font-black mb-4">{t.about.title}</h1>
          <p className="text-gray-400 text-lg max-w-2xl">{t.about.subtitle}</p>
        </div>
      </div>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-6">Norm Yat</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>{t.about.aboutText1}</p>
                <p>{t.about.aboutText2}</p>
                <p>{t.about.aboutText3}</p>
                <p>{t.about.aboutText4}</p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="rounded-lg overflow-hidden shadow-lg">
                <img
                  src={aboutImage}
                  alt="Norm Yacht workshop - Tuzla, Istanbul"
                  width={1200}
                  height={900}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-auto"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: "2019", label: t.about.stats.founded },
                  { value: "100+", label: t.about.stats.projects },
                  { value: "5+", label: t.about.stats.experience },
                  { value: "50+", label: t.about.stats.clients },
                ].map((stat, i) => (
                  <div key={i} className="bg-gray-50 border border-gray-100 rounded-lg p-5 text-center">
                    <div className="text-3xl font-black text-[#F5A623] mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-8 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-[#F5A623]/10 flex items-center justify-center flex-shrink-0">
                  <Eye className="w-6 h-6 text-[#F5A623]" />
                </div>
                <h3 className="text-xl font-black text-gray-900">{t.about.visionTitle}</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">{t.about.visionText}</p>
            </div>

            <div className="bg-[#0a1428] rounded-lg p-8 text-white">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-[#F5A623]/20 flex items-center justify-center flex-shrink-0">
                  <Target className="w-6 h-6 text-[#F5A623]" />
                </div>
                <h3 className="text-xl font-black">{t.about.missionTitle}</h3>
              </div>
              <ul className="space-y-3">
                {missionPoints.map((point, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-300 text-sm leading-relaxed">
                    <CheckCircle className="w-4 h-4 text-[#F5A623] flex-shrink-0 mt-0.5" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-4">{t.about.locationTitle}</h2>
            <p className="text-gray-600">{t.about.locationSubtitle}</p>
          </div>
          <div className="rounded-lg overflow-hidden shadow-lg aspect-video max-w-4xl mx-auto">
            <iframe
              src="https://maps.google.com/maps?q=%C4%B0stim+Sanayi+Sitesi+Tuzla+%C4%B0stanbul&t=&z=16&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Norm Yacht Location"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
