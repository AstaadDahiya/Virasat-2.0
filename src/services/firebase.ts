
"use server";

import { db } from "@/lib/firebase/config";
import { addDoc, collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, writeBatch } from "firebase/firestore";
import { BlobServiceClient } from "@azure/storage-blob";
import type { Artisan, Product, ShipmentData, LogisticsInput, LogisticsOutput } from "@/lib/types";
import type { User } from 'firebase/auth';
import { getLogisticsAdvice as getLogisticsAdviceFlow } from "@/ai/flows/logistics-advisor";
import { products as seedProducts, artisans as seedArtisans } from "@/lib/data";

// Defines the shape of the data coming from the form, excluding fields that are handled separately.
type ProductInsertData = Omit<Product, 'id' | 'images' | 'artisanId' | 'createdAt'>;

const getBlobServiceClient = () => {
    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
    if (!connectionString) {
        throw new Error("Azure Storage connection string is not configured.");
    }
    return BlobServiceClient.fromConnectionString(connectionString);
};

const uploadImages = async (images: File[], artisanId: string): Promise<string[]> => {
    if (!images || images.length === 0) return [];
    
    try {
        const blobServiceClient = getBlobServiceClient();
        const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME || 'images';
        const containerClient = blobServiceClient.getContainerClient(containerName);

        const uploadPromises = images.map(async (file) => {
            const blobName = `${artisanId}-${Date.now()}-${file.name}`;
            const blockBlobClient = containerClient.getBlockBlobClient(blobName);
            const buffer = Buffer.from(await file.arrayBuffer());
            await blockBlobClient.uploadData(buffer, {
                blobHTTPHeaders: { blobContentType: file.type }
            });
            return blockBlobClient.url;
        });

        return await Promise.all(uploadPromises);

    } catch (error) {
        console.error("Error uploading to Azure Blob Storage:", error);
        throw new Error("Failed to upload images.");
    }
};

export const addProduct = async (productData: ProductInsertData, images: File[], artisanId: string): Promise<string> => {
    if (!artisanId) {
        throw new Error("Authentication required. You must be logged in to add a product.");
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
            createdAt: serverTimestamp(),
        };
        
        const docRef = await addDoc(collection(db, "products"), productToAdd);
        return docRef.id;
    } catch (e) {
        console.error("Error in addProduct function: ", e);
        throw e instanceof Error ? e : new Error("Failed to add product due to an unexpected error.");
    }
};


export const getProducts = async (): Promise<Product[]> => {
    try {
        const q = query(collection(db, 'products'));
        const querySnapshot = await getDocs(q);
        const products = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        return products;
    } catch (e) {
        console.error("Error getting documents: ", e);
        throw new Error("Failed to get products");
    }
};

export const getProduct = async (id: string): Promise<Product | null> => {
    try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as Product;
        } else {
            console.log("No such product!");
            return null;
        }
    } catch (e) {
        console.error("Error getting document: ", e);
        return null;
    }
};

export const getArtisans = async (): Promise<Artisan[]> => {
     try {
        const q = query(collection(db, 'artisans'));
        const querySnapshot = await getDocs(q);
        const artisans = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Artisan));
        return artisans;
    } catch (e) {
        console.error("Error getting documents: ", e);
        throw new Error("Failed to get artisans");
    }
};

export const getArtisan = async (id: string): Promise<Artisan | null> => {
     try {
        const docRef = doc(db, 'artisans', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as Artisan;
        } else {
            console.log("No such artisan!");
            return null;
        }
    } catch (e) {
        console.error("Error getting document: ", e);
        return null;
    }
};

export const ensureArtisanProfile = async (user: User): Promise<void> => {
    const artisanRef = doc(db, 'artisans', user.uid);
    const docSnap = await getDoc(artisanRef);

    if (!docSnap.exists()) {
        try {
            await setDoc(artisanRef, {
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
        } catch (error) {
            console.error('Error creating artisan profile:', error);
            throw new Error('Database error creating new user profile.');
        }
    }
};


export const updateArtisanProfile = async (artisanId: string, data: Partial<Artisan>, newImageFile?: File): Promise<string> => {
    const artisanRef = doc(db, 'artisans', artisanId);
    let imageUrl = data.profileImage;

    if (newImageFile) {
        const urls = await uploadImages([newImageFile], artisanId);
        if(urls.length > 0) {
            imageUrl = urls[0];
        }
    }
    
    const updateData = { ...data, profileImage: imageUrl };

    await updateDoc(artisanRef, updateData);
    return imageUrl || "";
}


export async function getLogisticsAdvice(input: LogisticsInput): Promise<LogisticsOutput> {
    return getLogisticsAdviceFlow(input);
}


export const saveShipment = async (shipmentData: ShipmentData, artisanId: string): Promise<void> => {
    if (!artisanId) {
        throw new Error("Authentication required. You must be logged in to save a shipment.");
    }
    
    const trackingNumber = `VRST${Date.now()}`;
    const shippingLabelUrl = `https://api.virasat.com/labels/${trackingNumber}.pdf`;

    const shipmentToSave = {
      artisan_id: artisanId,
      product_id: shipmentData.productId,
      destination: shipmentData.destination,
      package_weight_kg: shipmentData.packageWeightKg,
      package_dimensions_cm: shipmentData.packageDimensionsCm,
      declared_value: shipmentData.declaredValue,
      selected_carrier: shipmentData.selectedCarrier.carrier,
      service_type: shipmentData.selectedCarrier.serviceType,
      shipping_cost: shipmentData.selectedCarrier.totalCost,
      estimated_delivery_date: shipmentData.selectedCarrier.estimatedDeliveryDate,
      tracking_number: trackingNumber,
      shipping_label_url: shippingLabelUrl,
      ai_packaging_advice: shipmentData.aiPackagingAdvice,
      ai_risk_advice: shipmentData.aiRiskAdvice,
      ai_carrier_choice_advice: shipmentData.aiCarrierChoiceAdvice,
      ai_hs_code: shipmentData.aiHsCode,
      ai_customs_declaration: shipmentData.aiCustomsDeclaration,
      createdAt: serverTimestamp(),
    };

    try {
        await addDoc(collection(db, "shipments"), shipmentToSave);
    } catch (error) {
         console.error("Error saving shipment:", error);
        throw new Error(`Failed to save shipment: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
};

export const seedDatabase = async (): Promise<void> => {
    console.log("Checking if database needs seeding...");
    const productsSnapshot = await getDocs(query(collection(db, 'products')));
    if (productsSnapshot.empty) {
        console.log("Database is empty, proceeding with seeding...");
        const batch = writeBatch(db);

        const artisanIdMap = new Map<string, string>();
        for (const artisanData of seedArtisans) {
            const tempId = `artisan-${seedArtisans.indexOf(artisanData) + 1}`;
            const artisanRef = doc(collection(db, 'artisans'));
            batch.set(artisanRef, artisanData);
            artisanIdMap.set(tempId, artisanRef.id);
            console.log(`Staged artisan: ${artisanData.name}`);
        }

        for (const productData of seedProducts) {
            const productRef = doc(collection(db, 'products'));
            const finalArtisanId = artisanIdMap.get(productData.artisanId);
            if (finalArtisanId) {
                const productWithRealArtisanId = { ...productData, artisanId: finalArtisanId, createdAt: serverTimestamp() };
                batch.set(productRef, productWithRealArtisanId);
                console.log(`Staged product: ${productData.name}`);
            } else {
                console.warn(`Could not find artisan for product: ${productData.name}`);
            }
        }
        
        try {
            await batch.commit();
            console.log("Database seeded successfully!");
        } catch (error) {
            console.error("Error seeding database: ", error);
        }
    } else {
        console.log("Database already contains data, skipping seed.");
    }
};
