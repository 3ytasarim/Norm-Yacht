import { Phone, MapPin } from "lucide-react";
import { SiLinkedin, SiInstagram } from "react-icons/si";

export default function FloatingCTA() {
  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-0 rounded-l-xl overflow-hidden shadow-2xl">
      <a
        href="tel:+902165106676"
        data-testid="cta-phone"
        className="flex items-center justify-center w-12 h-12 bg-[#0a1428] text-white hover:bg-[#F5A623] transition-colors"
        title="Call Us"
      >
        <Phone className="w-5 h-5" />
      </a>
      <a
        href="https://www.linkedin.com/company/normyat-m%C3%BChendislik-makina-a-%C5%9F/"
        target="_blank"
        rel="noopener noreferrer"
        data-testid="cta-linkedin"
        className="flex items-center justify-center w-12 h-12 bg-[#0a1428] text-white hover:bg-[#0077B5] transition-colors"
        title="LinkedIn"
      >
        <SiLinkedin className="w-5 h-5" />
      </a>
      <a
        href="https://www.instagram.com/norm_yacht/"
        target="_blank"
        rel="noopener noreferrer"
        data-testid="cta-instagram"
        className="flex items-center justify-center w-12 h-12 bg-[#0a1428] text-white hover:bg-[#E4405F] transition-colors"
        title="Instagram"
      >
        <SiInstagram className="w-5 h-5" />
      </a>
      <a
        href="https://maps.google.com/?q=Norm+Yacht+Tuzla+Istanbul"
        target="_blank"
        rel="noopener noreferrer"
        data-testid="cta-location"
        className="flex items-center justify-center w-12 h-12 bg-[#0a1428] text-white hover:bg-[#F5A623] transition-colors"
        title="Location"
      >
        <MapPin className="w-5 h-5" />
      </a>
    </div>
  );
}
