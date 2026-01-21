# GitHub Repository Update Script

ეს script განაახლებს GitHub repository-ს description-ით და topics-ით.

## გამოყენება

### 1. GitHub Personal Access Token-ის შექმნა

1. გადადი: https://github.com/settings/tokens
2. დააჭირე "Generate new token" → "Generate new token (classic)"
3. Token-ს დაარქვი: `georgia-flow-repo-update`
4. აირჩიე scope: `repo` (Full control of private repositories)
5. დააჭირე "Generate token"
6. **დააკოპირე token** (მხოლოდ ერთხელ იჩვენება!)

### 2. Token-ის დაყენება

**Windows (PowerShell):**
```powershell
$env:GITHUB_TOKEN="your_token_here"
```

**Windows (CMD):**
```cmd
set GITHUB_TOKEN=your_token_here
```

**Linux/Mac:**
```bash
export GITHUB_TOKEN=your_token_here
```

### 3. Script-ის გაშვება

```bash
node scripts/update-github-repo.js
```

## რა განაახლებს

- **Description:** "Tourism discovery platform for Georgia - Discover places, events, and local vibes across Georgia 🇬🇪"
- **Topics:** nextjs, typescript, supabase, tourism, georgia, maps, social-network, react, tailwindcss, vercel
- **Homepage:** https://github.com/rezxzer/georgia-flow

## Alternative: Manual Update

თუ script არ მუშაობს, შეგიძლია ხელით განაახლო:

1. გადადი: https://github.com/rezxzer/georgia-flow/settings
2. "About" სექციაში:
   - Description: `Tourism discovery platform for Georgia - Discover places, events, and local vibes across Georgia 🇬🇪`
   - Topics: `nextjs typescript supabase tourism georgia maps social-network react tailwindcss vercel`
