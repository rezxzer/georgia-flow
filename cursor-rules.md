# Cursor AI Assistant – სამუშაო წესები (Working Rules)

ეს დოკუმენტი აღწერს წესებს და მიდგომებს, რომლებიც Cursor AI Assistant-მა უნდა დაიცვას Georgia Flow პროექტზე მუშაობისას.

---

## 1. კომუნიკაცია და ენა

### 1.1 ენა
- **ყოველთვის პასუხობ ქართულად** ჩატში (user-თან კომუნიკაცია)
- **კოდი, კომენტარები, commit messages** – **ინგლისურად**
- **ფაილების სახელები, ცვლადები, ფუნქციები** – **ინგლისურად** (camelCase ან kebab-case)
- **SQL queries, database schemas** – **ინგლისურად**

### 1.2 კომუნიკაციის სტილი
- იყავი მოკლე და ზუსტი
- გამოიყენე bullet points დიდი ინფორმაციისთვის
- აუცილებლად ახსენი რა შეცვლილია და რატომ
- თუ რაიმე გაურკვეველია, კითხვა დაუსვი

---

## 2. Supabase Database – კოდის გაგზავნა

### 2.1 Supabase-ში გასაგზავნი კოდის ფორმატი
- **ყოველთვის** მიუთითე რა კოდი უნდა გაიგზავნოს Supabase-ში
- გამოიყენე მკაფიო ფორმატი:
  ```
  ## ეს კოდი ჩასასმელია Supabase-ში
  
  ```sql
  -- კონკრეტული SQL კოდი აქ
  ```
  ```
- თუ რამდენიმე ნაბიჯია, დანომრე ისინი თანმიმდევრობით

### 2.2 თანმიმდევრობა Supabase-ში
- **ყოველთვის დაიცავი თანმიმდევრობა** Supabase-ში კოდის გაგზავნისას:
  1. **ჯერ** შექმენი/განაახლე **tables** (CREATE TABLE ან ALTER TABLE)
  2. **შემდეგ** დაამატე **RLS policies** (Row Level Security)
  3. **შემდეგ** დაამატე **triggers** (თუ საჭიროა)
  4. **ბოლოს** დაამატე **functions** (თუ საჭიროა)
- თუ რამე დამოკიდებულია სხვაზე, აუცილებლად მიუთითე

### 2.3 Idempotent SQL
- **ყოველთვის** იწერე idempotent SQL (რომელიც შეიძლება რამდენჯერმე გაეშვას):
  ```sql
  -- ✅ სწორი
  CREATE TABLE IF NOT EXISTS profiles (...);
  
  -- ❌ არასწორი
  CREATE TABLE profiles (...);
  ```
- გამოიყენე `IF NOT EXISTS`, `IF EXISTS`, `OR REPLACE` სადაც შესაძლებელია

### 2.4 Storage Buckets
- თუ საჭიროა Storage bucket-ის შექმნა, მიუთითე:
  - Bucket-ის სახელი
  - Public/Private სტატუსი
  - Storage policies (RLS)

---

## 3. სამუშაოს დასრულების სტატუსი

### 3.1 სტატუსის მონიშვნა
ყოველთვის მიუთითე სამუშაოს სტატუსი:

- ✅ **შესრულებული** – სრულად დასრულებული და ტესტირებული
- 🟡 **ნახევრად შესრულებული** – ძირითადი ფუნქციონალი მუშაობს, მაგრამ არის დასამატებელი/გასაუმჯობესებელი
- 🔴 **სამომავლოდ დასასრულებელი** – დაწყებულია, მაგრამ არ არის დასრულებული (მიუთითე რა დარჩა)

### 3.2 სტატუსის მიზეზი
თუ სამუშაო არ არის სრულად შესრულებული, აუცილებლად მიუთითე:
- რა დარჩა გასაკეთებელი
- რატომ არ დასრულდა (დამოკიდებულება, ტექნიკური პრობლემა, და ა.შ.)
- როდის/როგორ შეიძლება დასრულდეს

---

## 4. ხარისხის კონტროლი

### 4.1 დუბლირებული ფაილების შემოწმება
- **ყოველთვის** შეამოწმე რომ:
  - არ იყოს დუბლირებული ფაილები (იგივე კონტენტით სხვადასხვა ლოკაციაზე)
  - არ იყოს დუბლირებული ფოლდერები
  - არ იყოს კონფლიქტური ფაილების სახელები
- თუ აღმოაჩენ დუბლირებას, მიუთითე და შესთავაზე გადაწყვეტა

### 4.2 ბაგების შემოწმება
- **ყოველთვის** შეამოწმე:
  - TypeScript/JavaScript errors
  - Linter errors
  - Console errors (თუ შესაძლებელია)
  - Logic errors (მაგ. undefined checks, null checks)
- თუ აღმოაჩენ ბაგს, მიუთითე და შესთავაზე fix

### 4.3 კოდის რევიუ
- შეამოწმე რომ:
  - კოდი მიჰყვება პროექტის სტანდარტებს
  - არ არის hardcoded values (გამოიყენე environment variables)
  - არის proper error handling
  - არის proper TypeScript types

---

## 5. არსებული ფუნქციების შენარჩუნება

### 5.1 უკვე მომუშავე კოდის შეცვლა
- **არასდროს** ნუ შეცვლი უკვე არსებულ, მომუშავე ფუნქციებს **ისე რომ:**
  - მისი შეცვლა არ მოითხოვდეს **აუცილებლობას**
  - არ დაარღვიოს არსებული ფუნქციონალი
  - არ შექმნას breaking changes

### 5.2 როდის შეიძლება შეცვლა
შეიძლება შეცვლა მხოლოდ თუ:
- User-მა **პირდაპირ** მოითხოვა
- არის **კრიტიკული ბაგი** რომელიც უნდა გამოსწორდეს
- არის **სექურიტის პრობლემა**
- არის **პერფორმანსის პრობლემა**

### 5.3 Refactoring
- თუ საჭიროა refactoring, **პირველად** მიუთითე:
  - რატომ არის საჭირო
  - რა შეიცვლება
  - რა რისკები არის
- დაელოდე user-ის დადასტურებას

---

## 6. ფაილების და სტრუქტურის მართვა

### 6.1 ახალი ფაილების შექმნა
- შექმენი ფაილები **ლოგიკურ ადგილას**:
  - Components → `components/`
  - Pages → `app/` (Next.js App Router)
  - Utils → `lib/` ან `utils/`
  - Types → `types/` ან `@/types`
  - SQL migrations → `supabase/migrations/` ან `db/schema/`

### 6.2 ფაილების სახელები
- გამოიყენე **ინგლისური** სახელები
- გამოიყენე **kebab-case** ფაილებისთვის: `user-profile.tsx`
- გამოიყენე **PascalCase** კომპონენტებისთვის: `UserProfile.tsx`
- გამოიყენე **camelCase** utilities-ისთვის: `formatDate.ts`

### 6.3 ფოლდერების სტრუქტურა
- დაიცავი პროექტის არსებული სტრუქტურა
- თუ ახალი ფოლდერი საჭიროა, პირველად მიუთითე რატომ

---

## 7. Git და Version Control

### 7.1 Commit Messages
- Commit messages **ინგლისურად**
- გამოიყენე **conventional commits** ფორმატი:
  ```
  feat: add user profile page
  fix: resolve authentication bug
  refactor: improve database queries
  docs: update README
  ```
- Commit messages უნდა იყოს **მოკლე და აღწერითი**

### 7.2 Atomic Commits
- გააკეთე **atomic commits** (ერთი ლოგიკური ცვლილება თითო commit-ში)
- თუ რამდენიმე ფაილი შეიცვალა, დაჯგუფე ლოგიკურად

---

## 8. Testing და Validation

### 8.1 კოდის ტესტირება
- **ყოველთვის** შეამოწმე რომ:
  - კოდი კომპილირდება (TypeScript errors არ არის)
  - Linter errors არ არის
  - Basic functionality მუშაობს (თუ შესაძლებელია manual testing)

### 8.2 Error Handling
- **ყოველთვის** დაამატე proper error handling:
  - Try-catch blocks
  - Error boundaries (React-ში)
  - User-friendly error messages
  - Logging (console.error ან proper logger)

---

## 9. დოკუმენტაცია

### 9.1 კოდის კომენტარები
- დაამატე კომენტარები **რთული ლოგიკისთვის**
- კომენტარები **ინგლისურად**
- გამოიყენე JSDoc ფუნქციებისთვის:
  ```typescript
  /**
   * Calculates the average rating for a place
   * @param ratings - Array of rating values
   * @returns Average rating rounded to 1 decimal place
   */
  function calculateAverageRating(ratings: number[]): number {
    // ...
  }
  ```

### 9.2 README და დოკუმენტაცია
- თუ ახალი feature-ი დაემატა, განაახლე:
  - README.md (თუ საჭიროა)
  - Feature-specific documentation
  - API documentation (თუ API endpoints დაემატა)

---

## 10. პროექტის სპეციფიკაციების დაცვა

### 10.1 დიზაინის სპეციფიკაციები
- **ყოველთვის** დაიცავი დიზაინის სპეციფიკაციები:
  - ფერების პალიტრა (`#FF9800` ნარინჯისფერი, `#2196F3` ლურჯი, და ა.შ.)
  - Layout structure (Header, Footer, Navigation)
  - Component styles (Tailwind CSS)
  - Responsive design (mobile-first)

### 10.2 ფუნქციონალური მოთხოვნები
- **ყოველთვის** დაიცავი ფუნქციონალური მოთხოვნები:
  - Multi-language support (KA/EN/RU)
  - Realtime features (Supabase Realtime)
  - Admin role-based access
  - User permissions

---

## 11. პრიორიტეტები და დამოკიდებულებები

### 11.1 პრიორიტეტების დაცვა
- **ყოველთვის** დაიცავი პრიორიტეტების თანმიმდევრობა:
  1. **კრიტიკული** – MVP-სთვის აუცილებელი
  2. **მაღალი** – MVP-სთვის სასურველი
  3. **საშუალო** – Phase 2-ისთვის
  4. **დაბალი** – მომავალში

### 11.2 დამოკიდებულებების შემოწმება
- **ყოველთვის** შეამოწმე დამოკიდებულებები:
  - რა უნდა დასრულდეს სანამ ამ feature-ზე დაიწყებ
  - რა ფაილები/კომპონენტები არის საჭირო
  - რა database tables/functions არის საჭირო

---

## 12. Security და Best Practices

### 12.1 Security
- **ყოველთვის** დაიცავი security best practices:
  - RLS policies Supabase-ში
  - Input validation (client-side და server-side)
  - Authentication checks
  - SQL injection prevention (Supabase-ი ამას აკეთებს, მაგრამ შეამოწმე)
  - XSS prevention (React-ი ამას აკეთებს, მაგრამ შეამოწმე)

### 12.2 Performance
- **ყოველთვის** გაითვალისწინე performance:
  - Image optimization
  - Code splitting (Next.js automatic)
  - Lazy loading (თუ საჭიროა)
  - Database query optimization

---

## 13. User Experience (UX)

### 13.1 Loading States
- **ყოველთვის** დაამატე loading states:
  - Skeleton loaders
  - Spinners
  - Progress indicators

### 13.2 Error Messages
- **ყოველთვის** დაამატე user-friendly error messages:
  - ქართულად (user-ისთვის)
  - მკაფიო და გასაგები
  - Actionable (რა უნდა გაკეთდეს)

### 13.3 Empty States
- **ყოველთვის** დაამატე empty states:
  - "No places found" messages
  - "No friends yet" messages
  - Helpful suggestions

---

## 14. რეკომენდაციები და Best Practices

### 14.1 კოდის ორგანიზაცია
- გამოიყენე **modular approach** (პატარა, reusable components)
- გამოიყენე **custom hooks** (React) დუბლირებული ლოგიკისთვის
- გამოიყენე **utility functions** საერთო ფუნქციებისთვის

### 14.2 TypeScript
- **ყოველთვის** გამოიყენე TypeScript types
- არ გამოიყენო `any` (გამონაკლისი: third-party libraries)
- გამოიყენე interfaces/types shared types-ისთვის

### 14.3 Environment Variables
- **არასდროს** ნუ hardcode-ავ secrets ან API keys
- გამოიყენე `.env.local` (local development)
- დაამატე `.env.example` (documentation)

---

## 15. კომუნიკაცია User-თან

### 15.1 სამუშაოს დასრულების შემდეგ
ყოველთვის მიუთითე:
- ✅ რა დასრულდა
- 🔴 რა დარჩა (თუ რამე დარჩა)
- 📝 რა უნდა გაკეთდეს შემდეგ (next steps)
- ⚠️ რაიმე განსაკუთრებული შენიშვნა (warnings, important notes)

### 15.2 კითხვები
- თუ რამე გაურკვეველია, **კითხვა დაუსვი** user-ს
- არ გააკეთო assumptions კრიტიკული რამეების შესახებ
- თუ რამდენიმე ვარიანტია, შესთავაზე და მოითხოვე არჩევანი

---

## 16. Checklist ყოველი Task-ის შემდეგ

ყოველთვის შეამოწმე:

- [ ] კოდი კომპილირდება (TypeScript errors არ არის)
- [ ] Linter errors არ არის
- [ ] დუბლირებული ფაილები არ არის
- [ ] არსებული ფუნქციები არ დაირღვა
- [ ] Error handling დამატებულია
- [ ] Loading states დამატებულია (თუ საჭიროა)
- [ ] Supabase კოდი მოწოდებულია (თუ საჭიროა)
- [ ] სტატუსი მითითებულია (✅/🟡/🔴)
- [ ] User-ს ახსნილია რა გაკეთდა

---

## 17. სპეციალური შემთხვევები

### 17.1 Database Migrations
- **ყოველთვის** შექმენი ახალი migration file თუ database-ში ცვლილება საჭიროა:
  - Supabase-ზე გვაქვს მხოლოდ ერთი მიგრაცია (`001_initial_schema.sql`)
  - **ყოველი ახალი ცვლილებისთვის** შექმენი ახალი migration file
  - Migration files-ის naming: `002_description.sql`, `003_description.sql`, და ა.შ. (თანმიმდევრული ნომრებით)
  - Migration file-ში ჩასვი **მხოლოდ ახალი ცვლილებები** (არ გაიმეორო არსებული კოდი)
- Migration file-ის სტრუქტურა:
  - დაწერე idempotent SQL (`IF NOT EXISTS`, `IF EXISTS`, `OR REPLACE`)
  - დაიცავი თანმიმდევრობა: Tables → RLS → Triggers → Functions
  - მიუთითე რა ცვლილებები მოხდა (კომენტარებში)
  - მიუთითე rollback strategy (თუ შესაძლებელია)
- Migration file-ის მდებარეობა:
  - `supabase/migrations/` დირექტორიაში
  - ან `db/migrations/` (თუ ასეთი სტრუქტურა გვაქვს)
- **ყოველთვის** მიუთითე user-ს:
  - რა migration file შექმნილია
  - რა ცვლილებები შედის მასში
  - როგორ უნდა გაეშვას Supabase-ში

### 17.2 Breaking Changes
- თუ breaking change საჭიროა:
  - **პირველად** მიუთითე user-ს
  - ახსენი რატომ არის საჭირო
  - შესთავაზე migration path
  - დაელოდე user-ის დადასტურებას

### 17.3 Third-party Integrations
- თუ third-party service (Stripe, Google Maps, და ა.შ.) საჭიროა:
  - მიუთითე რა API keys საჭიროა
  - მიუთითე რა permissions/scope საჭიროა
  - მიუთითე რა configuration საჭიროა

---

## 18. პროექტის სპეციფიკური მოთხოვნები

### 18.1 Georgia Flow სპეციფიკაციები
- **ყოველთვის** დაიცავი:
  - `complete-project-vision.md` – სრული დიზაინი
  - `development-roadmap.md` – განვითარების გეგმა
  - `features-full-list.md` – ფუნქციების სია
  - სხვა სპეციფიკაციების ფაილები

### 18.2 ტექნოლოგიური სტეკი
- **ყოველთვის** გამოიყენე:
  - Next.js 14+ (App Router)
  - TypeScript
  - Tailwind CSS
  - Supabase (Auth, Database, Storage, Realtime)
  - i18next (multi-language)

---

## 19. რეგულარული შემოწმებები

### 19.1 პერიოდული შემოწმებები
ყოველ რამდენიმე task-ში შეამოწმე:
- [ ] პროექტის სტრუქტურა ლოგიკურია
- [ ] კოდის ხარისხი კარგია
- [ ] დოკუმენტაცია განახლებულია
- [ ] არ არის technical debt

---

## 20. დასკვნა

ეს წესები შექმნილია რათა:
- ✅ სამუშაო იყოს ეფექტური და ორგანიზებული
- ✅ კოდის ხარისხი იყოს მაღალი
- ✅ User-ს ჰქონდეს სრული კონტროლი
- ✅ პროექტი განვითარდეს სწორი მიმართულებით

**ყოველთვის** დაიცავი ეს წესები და თუ რამე გაურკვეველია, კითხვა დაუსვი user-ს.

---

*ეს დოკუმენტი არის ცოცხალი – განაახლე როგორც საჭიროა.*
