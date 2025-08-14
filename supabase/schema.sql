--
-- Virasat Application Database Schema
--
-- This script sets up the entire database structure, including tables,
-- storage, row-level security (RLS), and helper functions.
--
-- How to use:
-- 1. Navigate to the SQL Editor in your Supabase project dashboard.
-- 2. Copy and paste the entire content of this file into the editor.
-- 3. Run the query.
--

-- ==== 1. Create Tables ====

-- Artisans Table: Stores information about the artisans.
-- The `id` column is linked to the `auth.users.id` via a foreign key.
CREATE TABLE IF NOT EXISTS public.artisans (
    id uuid NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name text NOT NULL,
    name_hi text,
    bio text,
    bio_hi text,
    "profileImage" text,
    location text,
    location_hi text,
    craft text,
    craft_hi text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);
COMMENT ON TABLE public.artisans IS 'Stores artisan profiles, linked to authenticated users.';

-- Products Table: Stores product information.
-- The `artisanId` column links to the `artisans` table.
CREATE TABLE IF NOT EXISTS public.products (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    "artisanId" uuid NOT NULL REFERENCES public.artisans(id) ON DELETE CASCADE,
    name text NOT NULL,
    name_hi text,
    description text,
    description_hi text,
    price numeric NOT NULL,
    images text[],
    category text,
    category_hi text,
    stock integer NOT NULL,
    materials text[],
    materials_hi text[],
    created_at timestamp with time zone DEFAULT now() NOT NULL
);
COMMENT ON TABLE public.products IS 'Stores products created by artisans.';

-- ==== 2. Set up Storage ====

-- Create a public bucket for product images if it doesn't exist.
-- The app will upload product images here.
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;
COMMENT ON BUCKET "product-images" IS 'Stores public images for products.';


-- ==== 3. Enable Row-Level Security (RLS) ====
-- RLS is a critical security feature that ensures users can only access data they are permitted to.

ALTER TABLE public.artisans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;


-- ==== 4. Create RLS Policies ====

-- Artisans Table Policies
-- Allow public read access to all artisan profiles.
DROP POLICY IF EXISTS "Public can read all artisans" ON public.artisans;
CREATE POLICY "Public can read all artisans" ON public.artisans FOR SELECT USING (true);

-- Allow users to update their own artisan profile.
DROP POLICY IF EXISTS "Users can update their own artisan profile" ON public.artisans;
CREATE POLICY "Users can update their own artisan profile" ON public.artisans FOR UPDATE USING (auth.uid() = id);

-- The `create_artisan_for_new_user` function handles inserts.

-- Products Table Policies
-- Allow public read access to all products.
DROP POLICY IF EXISTS "Public can read all products" ON public.products;
CREATE POLICY "Public can read all products" ON public.products FOR SELECT USING (true);

-- Allow artisans to insert new products for themselves.
DROP POLICY IF EXISTS "Artisans can insert their own products" ON public.products;
CREATE POLICY "Artisans can insert their own products" ON public.products FOR INSERT WITH CHECK (auth.uid() = "artisanId");

-- Allow artisans to update their own products.
DROP POLICY IF EXISTS "Artisans can update their own products" ON public.products;
CREATE POLICY "Artisans can update their own products" ON public.products FOR UPDATE USING (auth.uid() = "artisanId");

-- Allow artisans to delete their own products.
DROP POLICY IF EXISTS "Artisans can delete their own products" ON public.products;
CREATE POLICY "Artisans can delete their own products" ON public.products FOR DELETE USING (auth.uid() = "artisanId");


-- Storage Policies
-- Allow public read access to images in the `product-images` bucket.
DROP POLICY IF EXISTS "Anyone can view product images" on storage.objects;
CREATE POLICY "Anyone can view product images" ON storage.objects FOR SELECT USING ( bucket_id = 'product-images' );

-- Allow authenticated users (artisans) to upload images to the `product-images` bucket.
DROP POLICY IF EXISTS "Authenticated users can upload product images" on storage.objects;
CREATE POLICY "Authenticated users can upload product images" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'product-images' AND auth.role() = 'authenticated' );

-- Allow artisans to update their own images.
DROP POLICY IF EXISTS "Artisans can update their own product images" on storage.objects;
CREATE POLICY "Artisans can update their own product images" ON storage.objects FOR UPDATE with check ( bucket_id = 'product-images' and auth.uid() = owner);

-- Allow artisans to delete their own images.
DROP POLICY IF EXISTS "Artisans can delete their own product images" on storage.objects;
CREATE POLICY "Artisans can delete their own product images" ON storage.objects FOR DELETE with check ( bucket_id = 'product-images' and auth.uid() = owner);


-- ==== 5. Create Helper Function ====

-- This function is called from the application to automatically create
-- an artisan profile when a new user signs up.
CREATE OR REPLACE FUNCTION public.create_artisan_for_new_user(user_id uuid, user_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.artisans (id, name, name_hi, bio, bio_hi, "profileImage", location, location_hi, craft, craft_hi)
  VALUES (
    user_id,
    user_email,
    'नया कारीगर',
    'This is a newly created artisan profile. Please update your details.',
    'यह एक नया बनाया गया कारीगर प्रोफ़ाइल है। कृपया अपना विवरण अपडेट करें।',
    'https://placehold.co/100x100.png',
    'India',
    'भारत',
    'Handicrafts',
    'हस्तशिल्प'
  )
  ON CONFLICT (id) DO NOTHING;
END;
$$;
COMMENT ON FUNCTION public.create_artisan_for_new_user IS 'Creates a new artisan profile for a newly signed-up user.';

-- Grant execute permission on the function to the 'authenticated' role.
GRANT EXECUTE ON FUNCTION public.create_artisan_for_new_user(uuid, text) TO authenticated;

-- Grant permission to the 'postgres' user to run this function.
GRANT EXECUTE ON FUNCTION public.create_artisan_for_new_user(uuid, text) TO postgres;

-- End of script
