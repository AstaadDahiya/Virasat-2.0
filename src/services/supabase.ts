
"use server";

import { supabase } from "@/lib/supabase";
import { Product, ProductFormData, Artisan } from "@/lib/types";
import { products as seedDataProducts, artisans as seedDataArtisans } from "@/lib/data";

let isSeeding = false;
let seedingCompleted = false;

// --- Seeding Function ---
const seedDatabase = async () => {
    // Prevent re-seeding if it's already in progress or completed
    if (seedingCompleted || isSeeding) {
        return;
    }
    
    isSeeding = true;
    console.log("Checking if Supabase seeding is needed...");

    try {
        // Check if products exist
        const { count: productsCount, error: productsCheckError } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true });

        if (productsCheckError) {
             console.error("Error checking for products:", productsCheckError.message);
             // Don't throw here, as it might be an RLS issue on an empty table
             // Allow it to proceed to the seeding check.
        }

        if (productsCount === 0) {
            console.log("Supabase is empty. Seeding products and artisans...");
            
            // Seed Artisans and get their new IDs
            const { data: seededArtisans, error: artisanInsertError } = await supabase
                .from('artisans')
                .insert(seedDataArtisans)
                .select('id');
            
            if (artisanInsertError) {
                console.error("Error seeding artisans:", artisanInsertError);
                throw artisanInsertError;
            }
            console.log("Artisans seeded successfully.");

            // Create a map from temporary IDs to the new UUIDs
            const artisanRefMap = new Map<string, string>();
            seedDataArtisans.forEach((artisan, index) => {
                 const tempId = `artisan-${index + 1}`;
                 if(seededArtisans?.[index]?.id) {
                    artisanRefMap.set(tempId, seededArtisans[index].id);
                 }
            });


            // Prepare Products with the new Artisan IDs
            const productsToInsert = seedDataProducts.map(product => {
                const newArtisanId = artisanRefMap.get(product.artisanId);
                if (newArtisanId) {
                    // Create a new object without the temporary ID
                    const { artisanId, ...rest } = product;
                    return { ...rest, artisanId: newArtisanId };
                }
                console.warn(`Could not find a new ID for temporary artisanId: ${product.artisanId}`);
                return null;
            }).filter((p): p is Omit<typeof seedDataProducts[0], 'artisanId'> & { artisanId: string } => p !== null);

            // Seed Products
            if (productsToInsert.length > 0) {
                const { error: productInsertError } = await supabase.from('products').insert(productsToInsert as any);
                if (productInsertError) {
                    console.error("Error seeding products:", productInsertError);
                    throw productInsertError;
                }
                console.log("Products seeded successfully.");
            }
        } else {
            console.log("Database already contains data. Seeding not required.");
        }
        
        seedingCompleted = true; // Mark seeding as complete for this session
        console.log("Database seeding check complete.");

    } catch (error) {
        console.error("Error during seeding process. Have you created the tables and storage bucket in your Supabase project? See the setup instructions.", error instanceof Error ? error.message : error);
    } finally {
        isSeeding = false; // Always release the lock
    }
};

// --- Data Fetching Functions ---

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
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            throw new Error("You must be logged in to add a product.");
        }

        // The user ID from Supabase Auth should correspond to the artisan's ID in the 'artisans' table.
        const artisanId = user.id;

        const imageUrls = await uploadImages(productData.images);
        
        const { images, ...restOfProductData } = productData;
        
        const productToAdd = {
            ...restOfProductData,
            images: imageUrls,
            artisanId: artisanId,
        };
        
        const { data: newProduct, error } = await supabase
            .from('products')
            .insert([productToAdd])
            .select()
            .single();

        if (error) throw error;
        
        return newProduct.id;
    } catch (e) {
        console.error("Error adding document: ", e);
        throw new Error("Failed to add product");
    }
};

// Initialize seeding on server start
seedDatabase();

// Function to get all products from Supabase
export const getProducts = async (): Promise<Product[]> => {
    try {
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
