# Georgia Flow

აპლიკაცია მთელი საქართველოს ტურიზმის, ადგილების, ივენთებისა და ლოკალური ვაიბების აღმოსაჩენად.

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

## დოკუმენტაცია

- `development-roadmap.md` - განვითარების გეგმა
- `complete-project-vision.md` - სრული პროექტის სპეციფიკაცია
- `cursor-rules.md` - Cursor AI-ის სამუშაო წესები

## License

Private project
