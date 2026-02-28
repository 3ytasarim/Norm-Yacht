import { useEffect } from "react";
import { useLanguage } from "@/lib/languageContext";
import { useTranslation } from "@/lib/i18n";
import { updateSEO, SEO_DATA } from "@/lib/seo";
import { CheckCircle, Target, Eye } from "lucide-react";
import aboutImage from "@assets/about_1772246089936.jpg";

export default function About() {
  const { language } = useLanguage();
  const t = useTranslation(language);

  useEffect(() => {
    updateSEO(SEO_DATA.about);
  }, []);

  const missionPoints = [
    "To provide reliable and high-quality engineering solutions for superyachts and yacht projects",
    "To design and integrate advanced stabilization and hydraulic systems that maximize safety and onboard comfort",
    "To deliver turnkey marine engineering services in compliance with international standards",
    "To build long-term partnerships based on technical excellence, transparency, and trust",
    "To contribute to the advancement of the maritime sector through innovation and continuous improvement",
  ];

  const missionPointsTr = [
    "Süper yatlar ve yat projeleri için güvenilir ve yüksek kaliteli mühendislik çözümleri sunmak",
    "Güvenliği ve gemi içi konforu maksimize eden gelişmiş stabilizasyon ve hidrolik sistemler tasarlamak ve entegre etmek",
    "Uluslararası standartlara uygun anahtar teslimi deniz mühendisliği hizmetleri sunmak",
    "Teknik mükemmellik, şeffaflık ve güven temelinde uzun vadeli ortaklıklar kurmak",
    "İnovasyon ve sürekli gelişim yoluyla denizcilik sektörünün ilerlemesine katkıda bulunmak",
  ];

  const missionPointsRu = [
    "Предоставлять надёжные и высококачественные инженерные решения для суперяхт и яхтенных проектов",
    "Проектировать и интегрировать передовые системы стабилизации и гидравлики для максимальной безопасности",
    "Предоставлять комплексные морские инженерные услуги в соответствии с международными стандартами",
    "Строить долгосрочные партнёрства на основе технического совершенства, прозрачности и доверия",
    "Содействовать развитию морской отрасли посредством инноваций и постоянного совершенствования",
  ];

  const getMissionPoints = () => {
    if (language === "tr") return missionPointsTr;
    if (language === "ru") return missionPointsRu;
    return missionPoints;
  };

  return (
    <div>
      {/* Hero */}
      <div className="bg-[#0a1428] text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-[#F5A623] font-bold text-sm uppercase tracking-widest mb-3">Who We Are</div>
          <h1 className="text-4xl md:text-5xl font-black mb-4">{t.about.title}</h1>
          <p className="text-gray-400 text-lg max-w-2xl">{t.about.subtitle}</p>
        </div>
      </div>

      {/* Main content */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-6">Norm Yat</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Norm Yat was established in 2019 in Istanbul Tuzla, Türkiye's leading hub for yacht building and refit operations. Since its foundation, the company has been delivering high-quality engineering solutions in the fields of superyacht engineering, yacht stabilization systems, and marine hydraulic systems.
                </p>
                <p>
                  Operating from Tuzla, at the heart of the Turkish maritime industry, Norm Yat provides comprehensive engineering services to yacht owners, shipyards, and project managers. The company specializes in the design, integration, installation, commissioning, and maintenance of advanced stabilizer systems, custom hydraulic solutions, and complete turnkey yacht engineering projects.
                </p>
                <p>
                  With a strong technical background and hands-on field experience, Norm Yat ensures that every project meets international marine standards, performance expectations, and safety requirements. The company's systematic approach combines precision engineering, operational efficiency, and long-term reliability.
                </p>
                <p>
                  Through continuous investment in technology, technical expertise, and quality management, Norm Yat has positioned itself as a trusted engineering partner within the superyacht and mega yacht sector. The company remains committed to delivering sustainable, performance-driven solutions that enhance onboard comfort, safety, and operational excellence.
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="rounded-lg overflow-hidden shadow-lg">
                <img
                  src={aboutImage}
                  alt="Norm Yacht workshop - Tuzla, Istanbul"
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

      {/* Vision */}
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
              <p className="text-gray-600 leading-relaxed">
                {language === "tr"
                  ? "Stabilizasyon ve deniz hidrolik sistemleri alanında uzmanlaşmış, yenilikçi, yüksek performanslı ve geleceğe yönelik çözümler sunarak süper yat sektöründe lider ve uluslararası tanınmış bir mühendislik şirketi olmak."
                  : language === "ru"
                  ? "Стать ведущей и международно признанной инженерной компанией в индустрии суперяхт, специализирующейся на системах стабилизации и морских гидравлических системах."
                  : "To become a leading and internationally recognized engineering company in the superyacht industry, specializing in stabilization and marine hydraulic systems, by delivering innovative, high-performance, and future-oriented solutions."}
              </p>
            </div>

            <div className="bg-[#0a1428] rounded-lg p-8 text-white">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-[#F5A623]/20 flex items-center justify-center flex-shrink-0">
                  <Target className="w-6 h-6 text-[#F5A623]" />
                </div>
                <h3 className="text-xl font-black">{t.about.missionTitle}</h3>
              </div>
              <ul className="space-y-3">
                {getMissionPoints().map((point, i) => (
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

      {/* Location */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-4">Our Location</h2>
            <p className="text-gray-600">Based in Tuzla, Istanbul — The heart of the Turkish maritime industry</p>
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
