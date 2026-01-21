# Georgia Flow – პროექტის მიმოხილვა და სრული დიზაინის აღწერა

## პროექტის სახელი
**Georgia Flow**  
(ქართულად: საქართველოს ნაკადი / Georgia Flow)  
აპლიკაცია მთელი საქართველოს ტურიზმის, ადგილების, ივენთებისა და ლოკალური ვაიბების აღმოსაჩენად.  
მიზანი: დაეხმაროს როგორც ლოკალებს, ისე ტურისტებს აღმოაჩინონ ფარული ადგილები, ივენთები, რესტორნები, ბუნება მთელ ქვეყანაში (თბილისი, ბათუმი, ქუთაისი, სვანეთი, კახეთი და ა.შ.).

## ტექნოლოგიური სტეკი (რეკომენდებული)
- Frontend: Next.js 14+ (App Router) ან React
- Styling: Tailwind CSS
- Backend / Database: Supabase (Auth, PostgreSQL, Realtime, Storage)
- Maps: Google Maps API (უფასო tier)
- Internationalization: i18next (ენები: ქართული, ინგლისური, რუსული)
- Animations: Framer Motion (მარტივი)
- Admin Panel: Custom components ან React Admin
- Deployment: Vercel
- Version Control: GitHub

## ფერების პალიტრა
- Primary Accent: #FF9800 (ნარინჯისფერი – ღილაკები, call-to-action)
- Secondary: #2196F3 (ლურჯი – ბანერები, ლინკები, რუკა)
- Success/Green: #4CAF50 (ლაიქები, წარმატება)
- Background: #FFFFFF (თეთრი) + subtle gradient მწვანე-ლურჯი
- Text: #333333 (მუქი)
- Ads Banner: მუქი ლურჯი gradient (#0D47A1 to #1976D2)

## გლობალური ლეიაუთი
- Header: ლოგო მარცხნივ ("Georgia Flow"), ძებნის ბარი ცენტრში, მენიუ მარჯვნივ (რუკა, ივენთები, პროფილი, შეტყობინებები, ენის სვიჩერი KA/EN/RU)
- Footer (მობილურზე bottom nav): Home, Map, Events, Chat, Profile
- Background: subtle ტურისტული იმიჯები საქართველოდან (მთები, მდინარეები, ღვინის ვენახები, opacity 0.1–0.2)

## მთავარი გვერდები და ელემენტები
1. **Home Page**
   - Carousel: პოპულარული ადგილები/ივენთები
   - Feed: კარდები (ფოტო/ვიდეო, აღწერა, რეიტინგი, ლაიქი, კომენტარები)
   - AI რეკომენდაცია: "შენთვის შერჩეული მარშრუტი" (მომავალში OpenAI)
   
2. **Place / Event Detail Page**
   - დიდი ფოტო/ვიდეო გალერეა (უსერის ატვირთული)
   - აღწერა (მრავალენოვანი)
   - რეიტინგი + შეფასების ფორმა (1-5 stars + emoji)
   - კომენტარების სექცია + add comment
   - Google Maps embed
   - AR preview button (მომავალში)
   - Add to favorites

3. **User Profile**
   - ავატარი, სახელი, ბიო
   - ტაბები: My Places/Events, Friends, Messages, Rewards/Badges
   - Rewards: badges აქტიურობისთვის (ფასიანი premium badges მომავალში)

4. **Friends & Messages**
   - Add/Remove friend (ძებნა username-ით)
   - Realtime chat (Supabase Realtime): ბუბლები, emoji, ფოტო/ვიდეო attach

5. **Admin Dashboard** (მხოლოდ ადმინისთვის – role: 'admin')
   - Sidebar: Dashboard, Users, Content, Events, Ads, Analytics, Settings
   - Users: ლისტი, role change, block/unblock, delete
   - Content: moderate places/events/comments/ratings, approve/delete
   - Ads: add/edit/delete banners/sponsored cards, statistics
   - Analytics: charts (users growth, popular places, ad performance)
   - Settings: manage translations, API keys, premium features

## რეკლამის ბლოკები
- Banner: ჰორიზონტალური, მუქი ლურჯი gradient
- Sponsored Card: ჰომზე ყოველ 3-5 კარდში
- Position: home feed, place detail bottom
- Admin-ის მეშვეობით მართვა (upload image/text, dates, position)

## დამატებითი ფუნქციები
- Multi-language: ქართული (default), ინგლისური, რუსული (i18next)
- Media Upload: Supabase Storage (ფოტო/ვიდეო ადგილების/კომენტარებისთვის)
- Realtime: Supabase Realtime (ახალი კომენტარები, მესიჯები, ივენთები)
- Rewards System: badges for activity (unlock premium in future via Stripe)

## MVP Scope (პირველი ვერსია)
1. Auth & Profile
2. Add/View Places & Events
3. Comments, Ratings, Likes
4. Map Integration
5. Realtime Chat & Friends
6. Basic Admin Panel
7. Multi-language support
8. Ads placeholders

შემდეგი ეტაპები: AI recommendations, AR, Premium subscription, Analytics dashboard.

დაიწყე ამ სპეციფიკაციით პროექტის სტრუქტურის შექმნა.