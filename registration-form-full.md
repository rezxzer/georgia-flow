# Georgia Flow – სრული რეგისტრაციის / ლოგინის ფორმა

## მიზანი
- მარტივი, სწრაფი და უსაფრთხო რეგისტრაცია/ლოგინი
- Supabase Auth-ის გამოყენება (email/password + OAuth)
- მრავალენოვანი (KA/EN/RU)
- მობილურ-ფრენდლი, responsive

## ძირითადი ფორმები (ორი ცალკე გვერდი ან ტაბები ერთ გვერდზე)

### 1. რეგისტრაციის ფორმა (Sign Up)
გვერდი: /signup  
UI: ცენტრში კარტა (მაქს. სიგანე 400px), თეთრი ფონი, ნარინჯისფერი accent ღილაკები

#### ველები (თანმიმდევრობით):
1. **Username** (required, unique)
   - Placeholder: "შენი სახელი ან nickname"
   - Validation: 3-20 სიმბოლო, მხოლოდ letters, numbers, underscore
   - Error: "ეს username უკვე დაკავებულია" (real-time check Supabase-ით)

2. **Email** (required)
   - Placeholder: "email@example.com"
   - Validation: valid email format
   - Error: "არასწორი email"

3. **Password** (required)
   - Placeholder: "მინიმუმ 8 სიმბოლო"
   - Type: password (eye icon toggle)
   - Validation: min 8 chars, at least 1 uppercase, 1 number
   - Strength indicator (weak/medium/strong – progress bar)

4. **Confirm Password** (required)
   - Match with Password
   - Error: "პაროლები არ ემთხვევა"

5. **Language Preference** (optional, default browser locale)
   - Select: ქართული / English / Русский

#### დამატებითი ელემენტები:
- Checkbox: "ვეთანხმები წესებსა და პირობებს" (ლინკი Terms & Privacy-ზე)
- Social login buttons:
  - "გაგრძელება Google-ით" (Google OAuth)
  - (მომავალში: Facebook)
- ლინკი ქვედა: "უკვე გაქვს ანგარიში? შესვლა" → /login

#### Submit Button:
- "რეგისტრაცია" (ნარინჯისფერი, full width)
- Loading state: spinner + "იწყება..."

### 2. ლოგინის ფორმა (Login)
გვერდი: /login  
იგივე სტილი, რეგისტრაციის მსგავსი

#### ველები:
1. **Email or Username**
   - Placeholder: "Email ან username"
   - Validation: required

2. **Password**
   - იგივე როგორც ზემოთ

#### დამატებითი:
- "პაროლი დაგავიწყდა?" ლინკი → /forgot-password (Supabase reset flow)
- Social login: Google
- ლინკი: "არ გაქვს ანგარიში? რეგისტრაცია" → /signup

### ტექნიკური იმპლემენტაცია (Supabase + Next.js)
- Supabase Client: supabase.auth.signUp / signInWithPassword / signInWithOAuth
- Form Library: React Hook Form + Zod validation (რეკომენდებული)
- Real-time username check: useEffect-ით supabase.from('profiles').select('username').eq('username', value)
- After sign up: 
  - ავტომატური profile insert Supabase-ში (trigger ან client-side)
  - Redirect to /home ან /onboarding (პირველადი პროფილის შევსება)

#### Supabase Tables (რეგისტრაციასთან დაკავშირებული)
- auth.users (ავტომატური Supabase-ის)
- public.profiles (დამატებითი):
  ```sql
  create table profiles (
    id uuid references auth.users not null primary key,
    username text unique,
    avatar_url text,
    bio text,
    preferred_language text default 'ka',
    created_at timestamp with time zone default now()
  );