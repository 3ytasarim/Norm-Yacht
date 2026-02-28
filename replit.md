# Norm Yacht - Corporate Website

## Overview
Full-featured multilingual corporate website for Norm Yat, a marine engineering company based in Tuzla, Istanbul. Built with React + TypeScript + Express + PostgreSQL + Drizzle ORM + Tailwind CSS + shadcn/ui.

## Brand
- Primary color: Orange `#F5A623`
- Background/dark: Navy `#0a1428`
- Font: Montserrat (black/bold weights)
- Logo: `attached_assets/43219e59-fadc-46c1-b45c-d18f3e4cce0a_1772014162879.jpg`

## Languages
- English (default), Turkish, Russian — full i18n coverage across all pages
- Language stored in `localStorage` key `"norm-yacht-lang"`
- Hook: `useLanguage()` from `@/lib/languageContext`
- Translations: `useTranslation(language)` from `@/lib/i18n`
- All UI strings are translated: labels, headings, descriptions, form validation, toasts, status badges, error messages, date formatting
- Date locale adapts per language (en-GB, tr-TR, ru-RU)
- Localized URL routing via `@/lib/routes.ts`:
  - EN: /about, /services, /projects, /news, /contact
  - TR: /hakkimizda, /hizmetler, /projeler, /haberler, /iletisim
  - RU: /o-nas, /uslugi, /proekty, /novosti, /kontakty
- URL auto-updates on language switch; direct URL access auto-detects language

## Architecture
- **Frontend**: React + TypeScript + Vite at `client/`
- **Backend**: Express.js at `server/`
- **Database**: PostgreSQL via Drizzle ORM
- **Schema**: `shared/schema.ts`
- **Storage**: `server/storage.ts` (IStorage interface + DatabaseStorage impl)
- **Routes**: `server/routes.ts`

## Database Tables
1. `users` - Admin authentication (bcryptjs)
2. `slider_items` - Hero slider with multilingual fields
3. `services` - Services with slugs, icons, images
4. `service_images` - Gallery images per service
5. `projects` - Projects with status (completed/ongoing), client, category
6. `project_images` - Gallery images per project
7. `news_items` - Blog articles with HTML content support
8. `contact_messages` - Form submissions

## Admin
- Login: `/admin` | username: `admin` | password: `normyacht2024`
- Dashboard: `/admin/dashboard` with 5 tabs: Slider, Services, Projects, News, Messages
- Session-based auth via `express-session`

## Pages
- `/` — Home (hero slider, stats, about, services, projects, news, CTA)
- `/about` — About page with vision/mission
- `/services` — Services grid
- `/services/:slug` — Service detail with image gallery
- `/projects` — Projects with All/Completed/Ongoing tabs
- `/projects/:slug` — Project detail with image carousel
- `/news` — News articles grid
- `/news/:slug` — News detail (HTML content)
- `/contact` — Contact form + Google Maps embed

## Contact Info
- Address: İstasyon Mahallesi Yarış Çıkmazı Sokak, İstim Sanayi Sitesi No 17/153, Tuzla, İstanbul
- Phone: 0216 510 66 76
- Email: info@normyacht.com.tr

## Seed Data
- 3 hero slider items
- 10 services (Stabilizers, Bow Thrusters, Cranes, Shaft Repair, Hydraulics, Muir Winches, Electronics, Mechanics, Metal Work, Powerpack)
- 5 projects (4 completed, 1 ongoing)
- 3 news articles
- 1 admin user

## Image Upload
- Backend: `multer` for file upload, stored in `/uploads/` directory
- API: `POST /api/upload` (single file) and `POST /api/upload/multiple` (multiple files)
- Static serving: `/uploads/` directory served via express.static
- Admin panel uses `ImageUpload` and `MultiImageUpload` components for all image fields
- Max file size: 10MB, allowed: jpg, jpeg, png, gif, webp, svg, avif

## Language Selector
- SVG flag components (FlagGB, FlagTR, FlagRU) in Navbar — not emoji flags
- Shows flag + language code (EN, TR, RU)

## Key Dependencies
- `drizzle-orm` + `drizzle-zod` for schema/validation
- `@tanstack/react-query` v5 for data fetching
- `wouter` for routing
- `shadcn/ui` components
- `express-session` + `bcryptjs` for auth
- `react-hook-form` + `zod` for forms
- `lucide-react` for icons
- `multer` for file upload
