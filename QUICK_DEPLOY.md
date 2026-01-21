# 🚀 Quick Deployment Guide

## Vercel Deployment (5 წუთში)

### ნაბიჯი 1: Vercel Dashboard
1. გადადი: **https://vercel.com**
2. დააჭირე **"Sign Up"** ან **"Login"** (GitHub account-ით)

### ნაბიჯი 2: Import Project
1. დააჭირე **"Add New..."** → **"Project"**
2. აირჩიე **"Import Git Repository"**
3. აირჩიე **`rezxzer/georgia-flow`**
4. დააჭირე **"Import"**

### ნაბიჯი 3: Configure Project
- **Framework Preset:** Next.js (ავტომატურად გამოჩნდება)
- **Root Directory:** `./` (default)
- **Build Command:** `pnpm build` (ან დატოვე default)
- **Output Directory:** `.next` (default)
- **Install Command:** `pnpm install` (ან დატოვე default)

### ნაბიჯი 4: Environment Variables
დააჭირე **"Environment Variables"** და დაამატე:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

**შენიშვნა:** `NEXT_PUBLIC_APP_URL` დაემატება deployment-ის შემდეგ, როცა გაიგებ deployment URL-ს.

### ნაბიჯი 5: Deploy
1. დააჭირე **"Deploy"**
2. დაელოდე build-ის დასრულებას (2-3 წუთი)
3. მიიღებ deployment URL-ს (მაგ: `https://georgia-flow.vercel.app`)

### ნაბიჯი 6: Update Environment Variables
1. გადადი Project Settings → Environment Variables
2. განაახლე `NEXT_PUBLIC_APP_URL` deployment URL-ით
3. დააჭირე **"Redeploy"** (Settings → Deployments → Latest → ⋮ → Redeploy)

---

## ✅ Post-Deployment Checklist

- [ ] Environment variables დაყენებულია
- [ ] Build successful-ია
- [ ] Site მუშაობს deployment URL-ზე
- [ ] Supabase migration გაშვებულია production database-ზე
- [ ] Storage buckets შექმნილია Supabase-ში
- [ ] Google OAuth configured (თუ საჭიროა)

---

## 🔄 Automatic Deployments

Vercel ავტომატურად განაახლებს deployment-ს ყოველ push-ზე `main` branch-ზე GitHub-ზე.

---

## 🆘 Troubleshooting

### Build Fails
- შეამოწმე environment variables
- შეამოწმე build logs Vercel Dashboard-ში
- შეამოწმე რომ `.env.local` არ არის committed

### Database Connection Issues
- შეამოწმე Supabase URL და keys
- შეამოწმე RLS policies
- შეამოწმე network access Supabase Dashboard-ში

### Maps Not Loading
- შეამოწმე Google Maps API key
- შეამოწმე API restrictions Google Cloud Console-ში

---

## 📞 Support

თუ პრობლემა გაქვს:
1. შეამოწმე Vercel Dashboard → Deployments → Logs
2. შეამოწმე GitHub Actions (თუ გამოიყენებ)
3. შეამოწმე [`DEPLOYMENT.md`](./DEPLOYMENT.md) დეტალური instructions-ისთვის
