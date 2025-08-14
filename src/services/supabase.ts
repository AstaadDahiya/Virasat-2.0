"use server";

import { supabase } from "@/lib/supabase";
import { Product, ProductFormData, Artisan } from "@/lib/types";
import { products as seedDataProducts, artisans as seedDataArtisans } from "@/lib/data";

let isSeeding = false;
let seedingCompleted = false;

// --- Seeding Function ---
const seedDatabase = async () => {
    if (isSeeding || seedingCompleted) return;
    isSeeding = true;
    console.log("Checking if Supabase seeding is needed...");

    try {
        const { count: productsCount, error: productsError } = await supabase.from('products').select('*', { count: 'exact', head: true });
        if (productsError) throw productsError;

        if (productsCount === 0) {
            console.log("Supabase is empty. Seeding products and artisans...");
            
            // Seed Artisans and get their new IDs
            const { data: seededArtisans, error: artisanInsertError } = await supabase
                .from('artisans')
                .insert(seedDataArtisans)
                .select();
            
            if (artisanInsertError) throw artisanInsertError;
            console.log("Artisans seeded.");

            const artisanRefMap = new Map<string, string>();
            seedDataArtisans.forEach((artisan, index) => {
                 const tempId = `artisan-${index + 1}`;
                 if(seededArtisans?.[index]?.id) {
                    artisanRefMap.set(tempId, seededArtisans[index].id);
                 }
            });


            // Seed Products with the new Artisan IDs
            const productsToInsert = seedDataProducts.map(product => {
                const newArtisanId = artisanRefMap.get(product.artisanId);
                if (newArtisanId) {
                    return { ...product, artisanId: newArtisanId };
                }
                return null;
            }).filter(p => p !== null);

            if (productsToInsert.length > 0) {
                const { error: productInsertError } = await supabase.from('products').insert(productsToInsert as any);
                if (productInsertError) throw productInsertError;
                console.log("Products seeded.");
            }
            seedingCompleted = true;
            console.log("Database seeding complete.");
        } else {
            console.log("Database already contains data. Seeding not required.");
            seedingCompleted = true;
        }
    } catch (error) {
        console.error("Error during seeding process. Have you created the tables and storage bucket in your Supabase project? See the setup instructions.", error);
    } finally {
        isSeeding = false;
    }
};

// Function to upload images to Supabase Storage and get their URLs
const uploadImages = async (images: File[]): Promise<string[]> => {
    const imageUrls: string[] = [];
    for (const image of images) {
        const filePath = `public/${Date.now()}-${image.name}`;
        const { error: uploadError } = await supabase.storage
            .from('product-images')
            .upload(filePath, image);
        
        if (uploadError) {
            console.error('Error uploading image:', uploadError);
            throw uploadError;
        }

        const { data } = supabase.storage
            .from('product-images')
            .getPublicUrl(filePath);
        
        imageUrls.push(data.publicUrl);
    }
    return imageUrls;
};


// Function to add a new product to Supabase
export const addProduct = async (productData: ProductFormData): Promise<string> => {
    try {
        const imageUrls = await uploadImages(productData.images);
        
        // In a real app, you would get the logged-in user's artisan ID.
        // For now, we fetch the first artisan to associate the product with.
        const { data: artisans, error: artisanError } = await supabase.from('artisans').select('id').limit(1);
        if (artisanError || !artisans || artisans.length === 0) throw new Error("Could not find an artisan to associate the product with.");

        const productToAdd = {
            name: productData.name,
            name_hi: productData.name_hi,
            description: productData.description,
            description_hi: productData.description_hi,
            price: productData.price,
            stock: productData.stock,
            category: productData.category,
            category_hi: productData.category_hi,
            materials: productData.materials,
            materials_hi: productData.materials_hi,
            images: imageUrls,
            artisanId: artisans[0].id
        };
        
        const { data, error } = await supabase
            .from('products')
            .insert([productToAdd])
            .select()
            .single();

        if (error) throw error;
        
        return data.id;
    } catch (e) {
        console.error("Error adding document: ", e);
        throw new Error("Failed to add product");
    }
};

// Function to get all products from Supabase
export const getProducts = async (): Promise<Product[]> => {
    try {
        await seedDatabase(); // Ensure seeding is checked before fetching
        const { data, error } = await supabase.from('products').select('*').order('createdAt', { ascending: false });
        if (error) throw error;
        return data || [];
    } catch (e) {
        console.error("Error getting documents: ", e);
        throw new Error("Failed to get products");
    }
};

// Function to get a single product by ID
export const getProduct = async (id: string): Promise<Product | null> => {
    try {
        const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
        if (error) {
             if (error.code === 'PGRST116') { // PostgREST error for no rows found
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

// Function to get all artisans from Supabase
export const getArtisans = async (): Promise<Artisan[]> => {
    try {
        await seedDatabase(); // Ensure seeding is checked before fetching
        const { data, error } = await supabase.from('artisans').select('*').order('createdAt', { ascending: false });
        if (error) throw error;
        return data || [];
    } catch (e) {
        console.error("Error getting documents: ", e);
        throw new Error("Failed to get artisans");
    }
};


// Function to get a single artisan by ID
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