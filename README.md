# 🇬🇪 Georgia Flow

აპლიკაცია მთელი საქართველოს ტურიზმის, ადგილების, ივენთებისა და ლოკალური ვაიბების აღმოსაჩენად.

[![GitHub](https://img.shields.io/badge/GitHub-rezxzer%2Fgeorgia--flow-blue)](https://github.com/rezxzer/georgia-flow)
[![Next.js](https://img.shields.io/badge/Next.js-14+-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-green)](https://supabase.com/)

## ტექნოლოგიური სტეკი

- **Frontend:** Next.js 14+ (App Router), TypeScript, Tailwind CSS
- **Backend:** Supabase (Auth, PostgreSQL, Realtime, Storage)
- **Maps:** Google Maps API
- **Internationalization:** i18next (KA/EN/RU)
- **Animations:** Framer Motion
- **Deployment:** Vercel

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy `.env.example` to `.env.local` and fill in your keys:
```bash
cp .env.example .env.local
```

3. Run development server:
```bash
npm run dev
```

## პროექტის სტრუქტურა

- `app/` - Next.js App Router pages and layouts
- `components/` - React components
- `lib/` - Utility functions and Supabase client
- `types/` - TypeScript type definitions
- `public/` - Static assets

## Features

### ✅ MVP (Phase 1) - დასრულებული
- 🔐 Authentication & User Profiles
- 📍 Places & Events CRUD
- 💬 Comments, Ratings, Likes
- 👥 Friends & Real-time Messaging
- 🗺️ Google Maps Integration
- ⚙️ Admin Dashboard
- 📢 Ads System (Sponsored Cards & Banners)

### 🚧 Phase 2 - გეგმაში
- 🏆 Rewards & Badges System
- 🤖 AI Recommendations
- 💳 Premium Subscription
- 🔔 Push Notifications

## დოკუმენტაცია

- [`development-roadmap.md`](./development-roadmap.md) - განვითარების გეგმა
- [`complete-project-vision.md`](./complete-project-vision.md) - სრული პროექტის სპეციფიკაცია
- [`cursor-rules.md`](./cursor-rules.md) - Cursor AI-ის სამუშაო წესები
- [`PROGRESS.md`](./PROGRESS.md) - Development Progress

## Environment Variables

Create `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Database Setup

1. Run Supabase migration:
   ```bash
   # Apply migration from supabase/migrations/001_initial_schema.sql
   ```

2. Create Storage Buckets in Supabase Dashboard:
   - `avatars`
   - `places-media`
   - `events-media`
   - `chat-media`
   - `ads-media`

3. Enable Google OAuth (optional):
   - Supabase Dashboard → Authentication → Providers → Google

## License

Private project
