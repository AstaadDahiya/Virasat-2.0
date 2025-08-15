

"use server";

import { db } from "@/lib/firebase/config";
import { addDoc, collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, writeBatch, Timestamp, deleteDoc, where, orderBy } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import type { Artisan, Product, ShipmentData, LogisticsInput, LogisticsOutput, ProductFormData, Shipment } from "@/lib/types";
import type { User } from 'firebase/auth';
import { getLogisticsAdvice as getLogisticsAdviceFlow } from "@/ai/flows/logistics-advisor";
import { products as seedProducts, artisans as seedArtisans } from "@/lib/data";
import { translations as i18nSeed } from "@/lib/i18n";
import { languages } from "@/context/language-context";

// Defines the shape of the data coming from the form, excluding fields that are handled separately.
type ProductInsertData = Omit<Product, 'id' | 'images' | 'artisanId' | 'createdAt'>;

const storage = getStorage();

const deleteImage = async (imageUrl: string) => {
    if (!imageUrl || imageUrl.includes('placehold.co')) return;
    try {
        const imageRef = ref(storage, imageUrl);
        await deleteObject(imageRef);
        console.log(`Deleted image: ${imageUrl}`);
    } catch (error: any) {
        if (error.code !== 'storage/object-not-found') {
            console.error("Error deleting image from Firebase Storage:", error);
        }
    }
}

const uploadImages = async (images: File[], artisanId: string): Promise<string[]> => {
    if (!images || images.length === 0) return [];
    
    try {
        const uploadPromises = images.map(async (file) => {
            const imageRef = ref(storage, `products/${artisanId}/${Date.now()}-${file.name}`);
            const snapshot = await uploadBytes(imageRef, file);
            return await getDownloadURL(snapshot.ref);
        });

        return await Promise.all(uploadPromises);
    } catch (error) {
        console.error("Error uploading to Firebase Storage:", error);
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

export const updateProduct = async (productId: string, productData: ProductFormData, newImageFiles: File[], initialImageUrls: string[]) => {
    const productRef = doc(db, 'products', productId);
    
    const docSnap = await getDoc(productRef);
    if (!docSnap.exists()) {
        throw new Error("Product not found");
    }
    const existingProduct = docSnap.data() as Product;

    const artisanId = existingProduct.artisanId || "unknown-artisan";
    const newImageUrls = newImageFiles.length > 0 ? await uploadImages(newImageFiles, artisanId) : [];

    const finalImageUrls = productData.images.filter(img => typeof img === 'string') as string[];
    const imagesToDelete = initialImageUrls.filter(url => !finalImageUrls.includes(url));
    
    if (imagesToDelete.length > 0) {
        await Promise.all(imagesToDelete.map(url => deleteImage(url)));
    }

    const allImageUrls = [...finalImageUrls, ...newImageUrls];

    const { images, ...restOfProductData } = productData;
    const dataToUpdate = {
        ...restOfProductData,
        images: allImageUrls,
    };

    await updateDoc(productRef, dataToUpdate);
}


export const deleteProduct = async (productId: string): Promise<void> => {
    try {
        const productRef = doc(db, 'products', productId);
        const productSnap = await getDoc(productRef);

        if (!productSnap.exists()) {
            throw new Error("Product not found.");
        }

        const product = productSnap.data() as Product;
        
        if (product.images && product.images.length > 0) {
            const deletePromises = product.images.map(url => deleteImage(url));
            await Promise.all(deletePromises);
        }

        await deleteDoc(productRef);

    } catch (e) {
        console.error("Error deleting product: ", e);
        throw e instanceof Error ? e : new Error("Failed to delete product due to an unexpected error.");
    }
};


export const getProducts = async (): Promise<Product[]> => {
    try {
        const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const products = querySnapshot.docs.map(doc => {
            const data = doc.data();
            if (data.createdAt && data.createdAt instanceof Timestamp) {
                data.createdAt = data.createdAt.toMillis();
            }
            return { id: doc.id, ...data } as Product;
        });
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
            const data = docSnap.data();
            if (data.createdAt && data.createdAt instanceof Timestamp) {
                data.createdAt = data.createdAt.toMillis();
            }
            return { id: docSnap.id, ...data } as Product;
        } else {
            console.log("No such product!");
            return null;
        }
    } catch (e) {
        console.error("Error getting document: ", e);
        throw new Error("Failed to get product.");
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


export const updateArtisanProfile = async (artisanId: string, data: Partial<Omit<Artisan, 'id' | 'profileImage'>>, newImageFile?: File): Promise<string> => {
    const artisanRef = doc(db, 'artisans', artisanId);
    let imageUrl: string | undefined = undefined;

    const docSnap = await getDoc(artisanRef);
    if(docSnap.exists()) {
        imageUrl = docSnap.data().profileImage;
    }

    if (newImageFile) {
        const urls = await uploadImages([newImageFile], artisanId);
        if(urls.length > 0) {
            if(imageUrl) {
                await deleteImage(imageUrl);
            }
            imageUrl = urls[0];
        }
    }
    
    const updateData: Partial<Artisan> = { ...data };
    if (imageUrl) {
        updateData.profileImage = imageUrl;
    }

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

    const shipmentToSave: { [key: string]: any } = {
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
      createdAt: serverTimestamp(),
    };
    
    if (shipmentData.aiHsCode) {
        shipmentToSave.ai_hs_code = shipmentData.aiHsCode;
    }
    if (shipmentData.aiCustomsDeclaration) {
        shipmentToSave.ai_customs_declaration = shipmentData.aiCustomsDeclaration;
    }


    try {
        await addDoc(collection(db, "shipments"), shipmentToSave);
    } catch (error) {
         console.error("Error saving shipment:", error);
        throw new Error(`Failed to save shipment: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
};

export const getShipments = async (artisanId: string): Promise<Shipment[]> => {
    if (!artisanId) {
        return [];
    }
    try {
        const q = query(
            collection(db, 'shipments'), 
            where('artisan_id', '==', artisanId),
            orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const shipments = querySnapshot.docs.map(doc => {
            const data = doc.data();
            if (data.createdAt && data.createdAt instanceof Timestamp) {
                data.createdAt = data.createdAt.toMillis();
            }
            return { id: doc.id, ...data } as Shipment;
        });
        return shipments;
    } catch (e: any) {
        if (e.code === 'failed-precondition') {
          console.error("Firestore index missing for getShipments query. Please create a composite index for the 'shipments' collection on 'artisan_id' (ascending) and 'createdAt' (descending).");
          return [];
        }
        console.error("Error getting shipments: ", e);
        throw new Error("Failed to get shipments");
    }
}

export const getTranslations = async (lang: string): Promise<{ [key: string]: string }> => {
    try {
        const docRef = doc(db, 'translations', lang);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data() as { [key: string]: string };
        } else {
            console.warn(`No translation document for language: ${lang}, falling back to English.`);
            const enDocRef = doc(db, 'translations', 'en');
            const enDocSnap = await getDoc(enDocRef);
            if(enDocSnap.exists()) {
                return enDocSnap.data() as { [key: string]: string };
            }
            return {};
        }
    } catch(e) {
        console.error("Error getting translations: ", e);
        throw new Error("Failed to get translations.");
    }
};


export const seedDatabase = async (): Promise<void> => {
    console.log("Checking if database needs seeding...");
    const enTransRef = doc(db, 'translations', 'en');
    const enTransSnap = await getDoc(enTransRef);

    if (enTransSnap.exists()) {
        console.log("English translations exist, skipping seed.");
        return;
    }

    console.log("Database needs seeding, proceeding...");
    const batch = writeBatch(db);
    
    // Seed Artisans and Products
    const artisanIdMap = new Map<string, string>();
    for (const artisanData of seedArtisans) {
        const tempId = `artisan-${seedArtisans.indexOf(artisanData) + 1}`;
        const artisanRef = doc(collection(db, 'artisans'));
        batch.set(artisanRef, artisanData);
        artisanIdMap.set(tempId, artisanRef.id);
    }

    for (const productData of seedProducts) {
        const productRef = doc(collection(db, 'products'));
        const finalArtisanId = artisanIdMap.get(productData.artisanId);
        if (finalArtisanId) {
            const productWithRealArtisanId = { ...productData, artisanId: finalArtisanId, createdAt: serverTimestamp() };
            batch.set(productRef, productWithRealArtisanId);
        }
    }
    
    // Seed the translations
    for (const lang of languages) {
        const langCode = lang.code;
        const transRef = doc(db, 'translations', langCode);
        const translationsToSeed = (i18nSeed as any)[langCode] || {};
        if (Object.keys(translationsToSeed).length > 0) {
            batch.set(transRef, translationsToSeed);
        }
    }
    
    try {
        await batch.commit();
        console.log("Database seeding complete for all data!");
    } catch (error) {
        console.error("Error committing the seed data: ", error);
        throw new Error("Failed to seed database.");
    }
};
