# Deployment Guide

## Vercel Deployment (Recommended)

### Automatic Deployment via GitHub

1. **Vercel Account Setup:**
   - გადადი: https://vercel.com
   - Sign up / Login (GitHub account-ით)
   - დააჭირე "New Project"

2. **Import GitHub Repository:**
   - აირჩიე "Import Git Repository"
   - აირჩიე `rezxzer/georgia-flow`
   - დააჭირე "Import"

3. **Configure Project:**
   - **Framework Preset:** Next.js
   - **Root Directory:** `./` (default)
   - **Build Command:** `pnpm build`
   - **Output Directory:** `.next` (default)
   - **Install Command:** `pnpm install`

4. **Environment Variables:**
   დაუმატე Vercel Dashboard-ში (Settings → Environment Variables):
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
   ```

5. **Deploy:**
   - დააჭირე "Deploy"
   - Vercel ავტომატურად განაახლებს deployment-ს ყოველ push-ზე main branch-ზე

### Manual Deployment via Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

4. **Deploy to Production:**
   ```bash
   vercel --prod
   ```

---

## GitHub Actions Deployment

თუ გსურს GitHub Actions-ით deployment:

1. **Vercel Secrets Setup:**
   - გადადი: https://github.com/rezxzer/georgia-flow/settings/secrets/actions
   - დაამატე Secrets:
     - `VERCEL_TOKEN` - Vercel Account Token
     - `VERCEL_ORG_ID` - Vercel Organization ID
     - `VERCEL_PROJECT_ID` - Vercel Project ID
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
     - `NEXT_PUBLIC_APP_URL`

2. **Get Vercel Tokens:**
   - Vercel Dashboard → Settings → Tokens
   - Create new token
   - Vercel Dashboard → Project Settings → General → Project ID & Organization ID

3. **Workflow:**
   - GitHub Actions workflow უკვე შექმნილია: `.github/workflows/deploy.yml`
   - ის ავტომატურად გაეშვება ყოველ push-ზე main branch-ზე

---

## Post-Deployment Checklist

- [ ] Environment variables დაყენებულია Vercel-ზე
- [ ] Supabase migration გაშვებულია production database-ზე
- [ ] Storage buckets შექმნილია Supabase-ში
- [ ] Google OAuth configured (თუ საჭიროა)
- [ ] Domain configured (optional)
- [ ] Analytics enabled (optional)

---

## Troubleshooting

### Build Fails
- შეამოწმე environment variables Vercel Dashboard-ში
- შეამოწმე build logs Vercel-ზე
- შეამოწმე `.env.local` არ არის committed (უნდა იყოს .gitignore-ში)

### Database Connection Issues
- შეამოწმე Supabase URL და keys
- შეამოწმე RLS policies
- შეამოწმე network access Supabase Dashboard-ში

### Maps Not Loading
- შეამოწმე Google Maps API key
- შეამოწმე API restrictions Google Cloud Console-ში
