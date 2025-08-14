
"use server";

import { supabase } from "@/lib/supabase";
import { Product, ProductFormData, Artisan } from "@/lib/types";
import { products as seedDataProducts, artisans as seedDataArtisans } from "@/lib/data";

let seedingPromise: Promise<void> | null = null;

// --- Seeding Function ---
const seedDatabase = async () => {
    console.log("Checking if Supabase seeding is needed...");

    try {
        const { count: productsCount, error: productsCheckError } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true });

        if (productsCheckError) {
             console.error("Error checking for products:", productsCheckError.message);
             // Don't proceed if we can't even check the table
             return;
        }

        if (productsCount === 0) {
            console.log("Supabase is empty. Seeding products and artisans...");
            
            const { data: seededArtisans, error: artisanInsertError } = await supabase
                .from('artisans')
                .insert(seedDataArtisans.map(a => ({...a, id: undefined})))
                .select('id, name');
            
            if (artisanInsertError) {
                console.error("Error seeding artisans:", artisanInsertError);
                throw artisanInsertError;
            }
            console.log("Artisans seeded successfully.");
            
            const artisanRefMap = new Map<string, string>();
             seedDataArtisans.forEach((artisan, index) => {
                 const seeded = seededArtisans?.find(sa => sa.name === artisan.name);
                 if (seeded?.id) {
                    const tempId = `artisan-${index + 1}`;
                    artisanRefMap.set(tempId, seeded.id);
                 }
            });


            const productsToInsert = seedDataProducts.map(product => {
                const newArtisanId = artisanRefMap.get(product.artisanId);
                if (newArtisanId) {
                    const { artisanId, ...rest } = product;
                    return { ...rest, artisanId: newArtisanId };
                }
                console.warn(`Could not find a new ID for temporary artisanId: ${product.artisanId}`);
                return null;
            }).filter((p): p is Omit<typeof seedDataProducts[0], 'artisanId'> & { artisanId: string } => p !== null);

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
        
        console.log("Database seeding check complete.");

    } catch (error) {
        console.error("Error during seeding process. Have you created the tables and storage bucket in your Supabase project? See the setup instructions.", error instanceof Error ? error.message : error);
    }
};


// Initialize seeding and ensure it only runs once.
const ensureSeeded = async () => {
    if (!seedingPromise) {
        seedingPromise = seedDatabase();
    }
    await seedingPromise;
};


// --- Data Fetching Functions ---

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

export const addProduct = async (productData: ProductFormData): Promise<string> => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            throw new Error("You must be logged in to add a product.");
        }
        
        const { data: artisan, error: artisanError } = await supabase
            .from('artisans')
            .select('id')
            .eq('id', user.id)
            .single();

        if (artisanError || !artisan) {
            console.log("No artisan profile found for user, creating one...");
             const { error: rpcError } = await supabase.rpc('create_artisan_for_new_user', {
                user_id: user.id,
                user_email: user.email
            });

            if (rpcError) {
                 console.error("Error creating artisan via RPC:", rpcError);
                 throw new Error("Could not find or create a matching artisan for the logged-in user.");
            }
        }
        
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


export const getProducts = async (): Promise<Product[]> => {
    await ensureSeeded();
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
    await ensureSeeded();
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
    await ensureSeeded();
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
    await ensureSeeded();
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
