
"use server";

import { supabase } from "@/lib/supabase";
import { Product, Artisan } from "@/lib/types";
import { User } from "@supabase/supabase-js";

// This is the type of data coming from the form, simplified for insertion.
type ProductInsertData = Omit<Product, 'id' | 'images' | 'artisanId'>;

const uploadImages = async (images: File[], artisanId: string): Promise<string[]> => {
    const imageUrls: string[] = [];
    for (const image of images) {
        // Create a more organized file path
        const filePath = `${artisanId}/${Date.now()}-${image.name}`;
        const { error: uploadError } = await supabase.storage
            .from('product-images')
            .upload(filePath, image);
        
        if (uploadError) {
            console.error('Error uploading image:', uploadError);
            throw new Error(`Failed to upload image: ${image.name}`);
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
        await ensureArtisanProfile({ id: artisanId }); // Ensure profile exists before adding product
        const imageUrls = await uploadImages(images, artisanId);
        
        const productToAdd = {
            ...productData,
            images: imageUrls,
            artisanId: artisanId,
        };
        
        const { data: newProduct, error } = await supabase
            .from('products')
            .insert(productToAdd)
            .select('id')
            .single();

        if (error) {
            console.error("Supabase insert error:", error);
            throw new Error(`Database error: ${error.message}`);
        }
        
        return newProduct.id;
    } catch (e) {
        console.error("Error adding product: ", e);
        // Re-throw the original error if it's specific, otherwise a generic one
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

export const ensureArtisanProfile = async (user: { id: string; email?: string }): Promise<void> => {
    const { data: artisan, error } = await supabase
      .from('artisans')
      .select('id')
      .eq('id', user.id)
      .single();

    if (error && error.code === 'PGRST116') {
      // Profile does not exist, so create it
      const { error: createError } = await supabase.from('artisans').insert({
        id: user.id,
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

      if (createError) {
        console.error('Error creating artisan profile on sign up:', createError);
        throw createError;
      }
    } else if (error) {
        // Another error occurred
        console.error('Error checking for artisan profile:', error);
        throw error;
    }
};
