# Supabase Database Migrations

ეს დირექტორია შეიცავს Supabase database migrations-ს.

## Migration Files

- `001_initial_schema.sql` - Initial database schema with all MVP tables

## როგორ გამოვიყენოთ

### Supabase Dashboard-ში:

1. გადადი Supabase Dashboard → SQL Editor
2. გახსენი `001_initial_schema.sql` ფაილი
3. დააკოპირე მთელი კოდი
4. ჩასვი SQL Editor-ში
5. დააჭირე "Run"

### Supabase CLI-ით (თუ გამოიყენებ):

```bash
supabase db push
```

## Storage Buckets

შექმენი შემდეგი Storage Buckets Supabase Dashboard-ში:

1. **avatars** - Public
   - Policy: Users can upload own avatar, anyone can view

2. **places-media** - Public
   - Policy: Authenticated users can upload, anyone can view

3. **events-media** - Public
   - Policy: Authenticated users can upload, anyone can view

4. **chat-media** - Private
   - Policy: Only sender and receiver can view/upload

5. **ads-media** - Public
   - Policy: Only admins can upload, anyone can view

## RLS Policies

ყველა RLS policy დაყენებულია migration-ში. დამატებითი policies შეიძლება დაემატოს Supabase Dashboard-ში.
