
"use server";

import { supabase } from "@/lib/supabase";
import type { Artisan, Product } from "@/lib/types";
import type { User } from '@supabase/supabase-js';

// Defines the shape of the data coming from the form, excluding fields that are handled separately.
type ProductInsertData = Omit<Product, 'id' | 'images' | 'artisanId'>;


const uploadImages = async (images: File[], artisanId: string): Promise<string[]> => {
    const imageUrls: string[] = [];
    for (const image of images) {
        const filePath = `${artisanId}/${Date.now()}-${image.name}`;
        const { error: uploadError } = await supabase.storage
            .from('product-images')
            .upload(filePath, image);
        
        if (uploadError) {
            console.error('Error uploading image:', uploadError);
            if (uploadError.message.includes('permission') || uploadError.message.includes('policy')) {
                 throw new Error(`Storage permission error. Please check that your 'product-images' bucket in Supabase allows public inserts. Original error: ${uploadError.message}`);
            }
            throw new Error(`Failed to upload image: ${image.name}. Reason: ${uploadError.message}`);
        }

        const { data } = supabase.storage
            .from('product-images')
            .getPublicUrl(filePath);
        
        imageUrls.push(data.publicUrl);
    }
    return imageUrls;
};


export const addProduct = async (productData: ProductInsertData, images: File[], artisanId: string): Promise<string> => {
    if (!artisanId) {
        throw new Error("You must be logged in to add a product.");
    }
    if (!images || images.length === 0) {
        throw new Error("At least one image is required to add a product.");
    }
    
    try {
        const imageUrls = await uploadImages(images, artisanId);
        
        const productToAdd = {
            ...productData,
            images: imageUrls,
            artisanId: artisanId,
        };
        
        const { data: newProduct, error } = await supabase
            .from('products')
            .insert([productToAdd])
            .select()
            .single();

        if (error) {
            console.error("Supabase insert error:", error);
            throw new Error(`Database error: ${error.message}`);
        }
        
        if (!newProduct) {
             throw new Error("Product creation failed, no data returned from database.");
        }
        
        return newProduct.id;
    } catch (e) {
        console.error("Error adding product: ", e);
        throw e instanceof Error ? e : new Error("Failed to add product due to an unexpected error.");
    }
};


export const getProducts = async (): Promise<Product[]> => {
    try {
        const { data, error } = await supabase.from('products').select('*').order('name', { ascending: true });
        if (error) throw error;
        return data || [];
    } catch (e) {
        console.error("Error getting documents: ", e);
        throw new Error("Failed to get products");
    }
};

export const getProduct = async (id: string): Promise<Product | null> => {
    try {
        const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
        if (error) {
             if (error.code === 'PGRST116') { 
                console.log("No such product!");
                return null;
            }
            throw error;
        }
        return data;
    } catch (e) {
        console.error("Error getting document: ", e);
        return null;
    }
};

export const getArtisans = async (): Promise<Artisan[]> => {
    try {
        const { data, error } = await supabase.from('artisans').select('*').order('name', { ascending: true });
        if (error) throw error;
        return data || [];
    } catch (e) {
        console.error("Error getting documents: ", e);
        throw new Error("Failed to get artisans");
    }
};

export const getArtisan = async (id: string): Promise<Artisan | null> => {
    try {
        const { data, error } = await supabase.from('artisans').select('*').eq('id', id).single();
        if (error) {
            if (error.code === 'PGRST116') {
                console.log("No such artisan!");
                return null;
            }
            throw error;
        }
        return data;
    } catch (e) {
        console.error("Error getting document: ", e);
        return null;
    }
};

export const ensureArtisanProfile = async (user: User): Promise<void> => {
    // First, check if a profile already exists.
    const { data: existingProfile, error: selectError } = await supabase
      .from('artisans')
      .select('id')
      .eq('id', user.id)
      .single();

    // If no profile exists (PGRST116: PostgREST error for "exactly one row" not found) and we have a user object, create one.
    if (selectError && selectError.code === 'PGRST116') {
      const { error: insertError } = await supabase.from('artisans').insert({
        id: user.id, // Explicitly set the ID to the user's UID
        name: user.email?.split('@')[0] || 'New Artisan',
        name_hi: 'नया कारीगर',
        bio: 'Welcome to Virasat! Please update your bio.',
        bio_hi: 'विरासत में आपका स्वागत है! कृपया अपनी जीवनी अपडेट करें।',
        craft: 'Not specified',
        craft_hi: 'निर्दिष्ट नहीं है',
      location: 'Not specified',
        location_hi: 'निर्दिष्ट नहीं है',
        profileImage: `https://placehold.co/100x100.png`
      });

      if (insertError) {
        console.error('Error creating artisan profile:', insertError);
        // Check for specific RLS violation error
        if (insertError.code === '42501') {
            throw new Error("Database permission denied. Please ensure Row Level Security (RLS) is enabled on the 'artisans' table and that a policy allows authenticated users to insert their own profile.");
        }
        throw new Error('Database error creating new user');
      }
    } else if (selectError) {
      // Handle other potential errors during the select query
      console.error('Error checking for artisan profile:', selectError);
      throw new Error('Could not verify user profile.');
    }
    // If a profile already exists (existingProfile is not null), do nothing.
};
