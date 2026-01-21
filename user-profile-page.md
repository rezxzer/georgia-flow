# Georgia Flow – უსერის პროფილის გვერდი (User Profile)

## მიზანი
- პერსონალური სივრცე, სადაც უსერი ხედავს თავის აქტივობას, მეგობრებს, საჩუქრებს, მესიჯებს
- სოციალური და მოტივაციური ელემენტი (badges, სტატისტიკა)
- მობილური/დესკტოპისთვის responsive, Tailwind CSS-ით

## გვერდის ლოკაცია
- /profile ან /profile/[username] (საკუთარი და სხვისი პროფილის ნახვა)
- Header-ში პროფილის იკონაზე კლიკი → /profile (საკუთარი)
- სხვისი პროფილზე გადასვლა: username-ზე კლიკი feed-ში ან მეგობრების ლისტში

## ლეიაუთი (ზემოდან ქვემოთ)
1. **Header Section** (ზედა ნაწილი, ფიქსირებული ან sticky მობილურზე)
   - Background: subtle gradient (მწვანე-ლურჯი) ან უსერის ატვირთული cover photo (მომავალში)
   - ავატარი: დიდი წრიული (120x120px), border ნარინჯისფერი თუ premium
   - სახელი/Username: დიდი ტექსტი (bold, 24-32px)
   - ბიო: მოკლე აღწერა (textarea-ით რედაქტირებადი საკუთარ პროფილზე)
   - სტატისტიკა (horizontal row):
     - ადგილები დამატებული: 42
     - ივენთები: 15
     - მეგობრები: 128
     - Badges: 7 (ლინკი badges ტაბზე)

2. **Action Buttons** (ავატარის ქვემოთ ან მარჯვნივ)
   - საკუთარ პროფილზე:
     - "პროფილის რედაქტირება" (ნარინჯისფერი ღილაკი) → modal ან გვერდი
     - "პარამეტრები" (gear icon) → settings page
   - სხვის პროფილზე:
     - "მეგობრად დამატება" / "მეგობრობის გაუქმება" (ღილაკი)
     - "შეტყობინების გაგზავნა" (chat icon)
     - "Report" (თუ საჭირო)

3. **Tabs / Sections** (ტაბები ან accordion მობილურზე)
   - **ჩემი ადგილები / My Places** (default tab)
     - Grid ან list: უსერის მიერ დამატებული ადგილები/ივენთები
     - თითო კარტი: ფოტო, სახელი, რეიტინგი, edit/delete buttons (საკუთარ პროფილზე)
     - Pagination ან infinite scroll

   - **ივენთები / My Events**
     - მსგავსი grid: დამატებული ან RSVP-ებული ივენთები
     - Calendar view option (optional, FullCalendar ბიბლიოთეკა)

   - **მეგობრები / Friends**
     - Grid ავატარებით + username
     - საკუთარ პროფილზე: "დამატება" button + search bar
     - თითო მეგობარი: ავატარი, სახელი, "წაშლა" button, "შეტყობინება"
     - Pending requests section (თუ არსებობს)

   - **შეტყობინებები / Messages**
     - Chat list: მეგობრების ლისტი ბოლო მესიჯით + unread count
     - კლიკზე გადადის full chat view (ან modal მობილურზე)
     - Realtime: ახალი მესიჯისას auto-refresh

   - **საჩუქრები / Rewards & Badges**
     - Grid badges-ებით (იქონები + სახელი + აღწერა)
     - მაგალითები:
       - "Explorer Level 1" – 5 ადგილი დამატებული
       - "Photo Master" – 20 ფოტო ატვირთული
       - "Festival Fan" – 10 ივენთზე RSVP
     - Progress bar level-ისთვის
     - Premium badge highlight (თუ გამოწერილია)

4. **Footer / Additional**
   - "ჩემი რჩეულები" quick link (favorites list)
   - Logout button ქვედა მარჯვნივ

## ტექნიკური დეტალები
- Data Fetching: Supabase queries
  - profiles table-დან: username, avatar_url, bio
  - places/events tables-დან: where user_id = current_user.id
  - friends: junction table (user_friends: user_id, friend_id)
  - badges: user_badges table
- Realtime: subscribe friends list-ზე ან messages-ზე
- Edit Mode: Modal ან separate page რედაქტირებისთვის (avatar upload, bio)
- Privacy: საკუთარი პროფილი სრული, სხვისი – limited (მეგობრობის სტატუსის მიხედვით)

## პრიორიტეტი Cursor-ში
1. შექმენი /profile page component
2. დაამატე tabs (e.g. Headless UI Tabs ან shadcn/ui)
3. Fetch data Supabase-დან (useSupabaseClient ან @supabase/ssr)
4. დაამატე Friends list + add/remove logic
5. Messages preview + navigation to chat

