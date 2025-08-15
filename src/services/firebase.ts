
"use server";

import { db, storage } from "@/lib/firebase/config";
import { addDoc, collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import type { Artisan, Product, ShipmentData, LogisticsInput, LogisticsOutput } from "@/lib/types";
import type { User } from 'firebase/auth';
import { getLogisticsAdvice as getLogisticsAdviceFlow } from "@/ai/flows/logistics-advisor";

// Defines the shape of the data coming from the form, excluding fields that are handled separately.
type ProductInsertData = Omit<Product, 'id' | 'images' | 'artisanId' | 'createdAt'>;


const uploadImages = async (images: File[], artisanId: string): Promise<string[]> => {
    const imageUrls: string[] = [];
    for (const image of images) {
        const filePath = `product-images/${artisanId}/${Date.now()}-${image.name}`;
        const storageRef = ref(storage, filePath);
        await uploadBytes(storageRef, image);
        const downloadUrl = await getDownloadURL(storageRef);
        imageUrls.push(downloadUrl);
    }
    return imageUrls;
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
                id: user.uid,
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
        const filePath = `profile-images/${artisanId}/${Date.now()}-${newImageFile.name}`;
        const storageRef = ref(storage, filePath);
        await uploadBytes(storageRef, newImageFile);
        imageUrl = await getDownloadURL(storageRef);
    }
    
    await updateDoc(artisanRef, {...data, profileImage: imageUrl});
    return imageUrl || "";
}


export async function getLogisticsAdvice(input: LogisticsInput): Promise<LogisticsOutput> {
    return getLogisticsAdviceFlow(input);
}


export const saveShipment = async (shipmentData: ShipmentData, artisanId: string): Promise<void> => {
    if (!artisanId) {
        throw new Error("Authentication required. You must be logged in to save a shipment.");
    }
    
    // Simulate label generation and tracking number
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
