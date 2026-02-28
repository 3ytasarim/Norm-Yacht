export function updateSEO({
  title,
  description,
  keywords,
  ogTitle,
  ogDescription,
  ogImage,
}: {
  title: string;
  description: string;
  keywords: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
}) {
  document.title = title;

  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement("meta");
    metaDesc.setAttribute("name", "description");
    document.head.appendChild(metaDesc);
  }
  metaDesc.setAttribute("content", description);

  let metaKeywords = document.querySelector('meta[name="keywords"]');
  if (!metaKeywords) {
    metaKeywords = document.createElement("meta");
    metaKeywords.setAttribute("name", "keywords");
    document.head.appendChild(metaKeywords);
  }
  metaKeywords.setAttribute("content", keywords);

  let ogTitleTag = document.querySelector('meta[property="og:title"]');
  if (!ogTitleTag) {
    ogTitleTag = document.createElement("meta");
    ogTitleTag.setAttribute("property", "og:title");
    document.head.appendChild(ogTitleTag);
  }
  ogTitleTag.setAttribute("content", ogTitle || title);

  let ogDescTag = document.querySelector('meta[property="og:description"]');
  if (!ogDescTag) {
    ogDescTag = document.createElement("meta");
    ogDescTag.setAttribute("property", "og:description");
    document.head.appendChild(ogDescTag);
  }
  ogDescTag.setAttribute("content", ogDescription || description);

  if (ogImage) {
    let ogImgTag = document.querySelector('meta[property="og:image"]');
    if (!ogImgTag) {
      ogImgTag = document.createElement("meta");
      ogImgTag.setAttribute("property", "og:image");
      document.head.appendChild(ogImgTag);
    }
    ogImgTag.setAttribute("content", ogImage);
  }
}

export const SEO_DATA = {
  home: {
    title: "Norm Yacht | Yacht Stabilizer Systems & Marine Hydraulic Engineering - Tuzla, Istanbul",
    description: "Norm Yacht provides professional superyacht engineering, yacht stabilizer installation, marine hydraulic systems, and turnkey refit solutions. Based in Tuzla, Istanbul — Turkey's leading shipyard hub. Authorized service for Quantum, Koop, Naiad & Wesmar stabilizers.",
    keywords: "yacht stabilizer, yacht stabilizer installation, marine hydraulic systems, superyacht engineering, yacht refit Istanbul, Tuzla shipyard, Quantum stabilizer service, Koop stabilizer, Naiad stabilizer, Wesmar stabilizer, yacht hydraulic repair, marine engineering Turkey, bow thruster installation, yacht deck equipment, stabilizer commissioning, yacht maintenance Istanbul, mega yacht engineering, powerpack systems, PTO pump systems, hydraulic hose fittings, marine hydraulic hose, Parker distributor Turkey, Gates hydraulic hose, Norm Yacht",
  },
  about: {
    title: "About Norm Yacht | Marine Engineering Company in Tuzla, Istanbul",
    description: "Norm Yacht was established in 2019 in Tuzla, Istanbul — Turkey's premier yacht building and refit hub. We deliver high-quality engineering solutions in superyacht stabilization systems, marine hydraulics, and turnkey yacht engineering projects.",
    keywords: "Norm Yacht about, marine engineering company Turkey, yacht engineering Istanbul, Tuzla shipyard company, superyacht engineering firm, yacht stabilizer company, marine hydraulic company Turkey, yacht refit company Istanbul, Turkish maritime industry, yacht building Tuzla",
  },
  services: {
    title: "Marine Engineering Services | Stabilizers, Hydraulics & Yacht Systems - Norm Yacht",
    description: "Comprehensive marine engineering services: yacht stabilizer installation & service, hydraulic system design, bow thruster systems, deck equipment, shaft repair, marine electronics, mechanical services, metal fabrication, and powerpack solutions for superyachts.",
    keywords: "yacht stabilizer service, marine hydraulic systems, bow thruster installation, deck crane service, shaft repair alignment, hydraulic diagnostics, winch windlass service, Muir winch authorized, marine electronics installation, yacht mechanical services, metal fabrication marine, powerpack PTO systems, yacht engineering services, stabilizer maintenance, hydraulic repair marine",
  },
  projects: {
    title: "Marine Engineering Projects | Yacht Refit & Stabilizer Installations - Norm Yacht",
    description: "Explore our completed and ongoing marine engineering projects including yacht stabilizer installations, hydraulic system integrations, bow thruster setups, and comprehensive superyacht refit projects across Turkey and internationally.",
    keywords: "yacht stabilizer project, marine engineering projects, superyacht refit project, yacht hydraulic installation, bow thruster project, stabilizer installation project, yacht engineering portfolio, mega yacht project Turkey, marine refit Istanbul, yacht renovation Tuzla",
  },
  news: {
    title: "Marine Engineering News & Updates | Norm Yacht Blog",
    description: "Latest news, industry insights, and project updates from Norm Yacht — your trusted marine engineering partner in Tuzla, Istanbul. Stay informed about yacht stabilization technology, marine hydraulics, and superyacht engineering trends.",
    keywords: "marine engineering news, yacht industry updates, stabilizer technology news, marine hydraulic blog, superyacht engineering articles, yacht refit news Turkey, maritime industry updates, Norm Yacht news, yacht maintenance tips, marine technology trends",
  },
  contact: {
    title: "Contact Norm Yacht | Marine Engineering Services - Tuzla, Istanbul",
    description: "Contact Norm Yacht for professional marine engineering services, yacht stabilizer installations, and hydraulic solutions. Visit us at İstim Sanayi Sitesi, Tuzla, Istanbul or call +90 216 510 66 76.",
    keywords: "contact Norm Yacht, marine engineering contact, yacht stabilizer service contact, Tuzla Istanbul marine, İstim Sanayi Sitesi, yacht engineering quote, marine hydraulic service contact, superyacht engineering inquiry, Norm Yacht phone, Norm Yacht address",
  },
};
