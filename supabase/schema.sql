-- Virasat Supabase Schema
-- Version 1.1
--
-- This script sets up the necessary tables, storage, and security policies
-- for the Virasat application.
--
-- To use this script:
-- 1. Navigate to the "SQL Editor" in your Supabase project dashboard.
-- 2. Create a "New query".
-- 3. Copy and paste the entire content of this file into the editor.
-- 4. Click "Run".

-- 1. Create Tables
-- =============================================

-- Artisans table to store information about the craftspeople.
-- The ID is linked to the auth.users table.
CREATE TABLE IF NOT EXISTS public.artisans (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    name_hi TEXT NOT NULL,
    bio TEXT NOT NULL,
    bio_hi TEXT NOT NULL,
    "profileImage" TEXT NOT NULL,
    location TEXT NOT NULL,
    location_hi TEXT NOT NULL,
    craft TEXT NOT NULL,
    craft_hi TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
COMMENT ON TABLE public.artisans IS 'Stores artisan profile information, linked to authenticated users.';

-- Products table to store all product details.
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    name_hi TEXT NOT NULL,
    description TEXT NOT NULL,
    description_hi TEXT NOT NULL,
    price REAL NOT NULL,
    images TEXT[] NOT NULL,
    "artisanId" UUID NOT NULL REFERENCES public.artisans(id) ON DELETE CASCADE,
    category TEXT NOT NULL,
    category_hi TEXT NOT NULL,
    stock INTEGER NOT NULL,
    materials TEXT[] NOT NULL,
    materials_hi TEXT[] NOT NULL,
    "createdAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
COMMENT ON TABLE public.products IS 'Contains all product information, linked to an artisan.';
CREATE INDEX IF NOT EXISTS "idx_products_artisanId" ON public.products("artisanId");


-- 2. Create Storage Bucket
-- =============================================
-- This bucket will store all public images for products.
-- Make sure the bucket name matches the one used in the application code.
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', TRUE)
ON CONFLICT (id) DO NOTHING;


-- 3. Set up Row-Level Security (RLS)
-- =============================================
ALTER TABLE public.artisans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- 4. Define Security Policies
-- =============================================

-- Artisans Table Policies
DROP POLICY IF EXISTS "Public can view all artisans" ON public.artisans;
CREATE POLICY "Public can view all artisans"
ON public.artisans
FOR SELECT USING (true);

DROP POLICY IF EXISTS "Artisans can create their own profile" ON public.artisans;
CREATE POLICY "Artisans can create their own profile"
ON public.artisans
FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Artisans can update their own profile" ON public.artisans;
CREATE POLICY "Artisans can update their own profile"
ON public.artisans
FOR UPDATE USING (auth.uid() = id);

-- Products Table Policies
DROP POLICY IF EXISTS "Public can view all products" ON public.products;
CREATE POLICY "Public can view all products"
ON public.products
FOR SELECT USING (true);

DROP POLICY IF EXISTS "Artisans can add their own products" ON public.products;
CREATE POLICY "Artisans can add their own products"
ON public.products
FOR INSERT WITH CHECK (auth.uid() = "artisanId");

DROP POLICY IF EXISTS "Artisans can update their own products" ON public.products;
CREATE POLICY "Artisans can update their own products"
ON public.products
FOR UPDATE USING (auth.uid() = "artisanId");

DROP POLICY IF EXISTS "Artisans can delete their own products" ON public.products;
CREATE POLICY "Artisans can delete their own products"
ON public.products
FOR DELETE USING (auth.uid() = "artisanId");

-- Storage Policies
DROP POLICY IF EXISTS "Artisans can upload to product-images bucket" ON storage.objects;
CREATE POLICY "Artisans can upload to product-images bucket"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-images');


-- 5. Create Helper Function for New User Onboarding
-- =============================================
-- This function is called by the application to automatically create
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

-- Grant execution rights to the function for authenticated users
GRANT EXECUTE ON FUNCTION public.create_artisan_for_new_user(uuid, text) TO authenticated;
