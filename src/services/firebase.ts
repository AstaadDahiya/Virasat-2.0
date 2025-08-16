

"use server";

import { db } from "@/lib/firebase/config";
import { addDoc, collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, writeBatch, Timestamp, deleteDoc, where, orderBy, limit } from "firebase/firestore";
import type { Artisan, Product, ShipmentData, LogisticsInput, LogisticsOutput, ProductFormData, Shipment } from "@/lib/types";
import type { User } from 'firebase/auth';
import { getLogisticsAdvice as getLogisticsAdviceFlow } from "@/ai/flows/logistics-advisor";
import { BlobServiceClient } from "@azure/storage-blob";
import { v4 as uuidv4 } from 'uuid';

// --- Azure Blob Storage Logic ---

const getBlobServiceClient = () => {
    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
    if (!connectionString) {
        throw new Error("Azure Storage connection string is not configured.");
    }
    return BlobServiceClient.fromConnectionString(connectionString);
};

const getContainerClient = () => {
    const containerName = "images";
    if (!containerName) {
        throw new Error("Azure Storage container name is not configured.");
    }
    const blobServiceClient = getBlobServiceClient();
    return blobServiceClient.getContainerClient(containerName);
}

const uploadImageToAzure = async (image: File, folder: string, artisanId: string): Promise<string> => {
    try {
        const containerClient = getContainerClient();
        await containerClient.createIfNotExists({ access: 'blob' });

        const blobName = `${folder}/${artisanId}/${uuidv4()}-${image.name}`;
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
        
        const arrayBuffer = await image.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        await blockBlobClient.uploadData(buffer, {
            blobHTTPHeaders: { blobContentType: image.type }
        });
        return blockBlobClient.url;
    } catch (error) {
        console.error(`Error uploading to Azure Blob Storage in folder ${folder}:`, error);
        throw new Error(`Failed to upload image to Azure.`);
    }
};


const uploadImagesToAzure = async (images: File[], artisanId: string): Promise<string[]> => {
    if (!images || images.length === 0) return [];
    const uploadPromises = images.map(file => uploadImageToAzure(file, 'products', artisanId));
    return await Promise.all(uploadPromises);
};

const deleteImageFromAzure = async (imageUrl: string) => {
    if (!imageUrl || !imageUrl.includes('.blob.core.windows.net')) {
        console.log("Skipping deletion of non-Azure image URL:", imageUrl);
        return;
    }

    try {
        const containerClient = getContainerClient();
        const url = new URL(imageUrl);
        const blobName = url.pathname.substring(containerClient.containerName.length + 2); //  /containerName/blobName
        
        if (!blobName) {
            console.warn("Could not determine blob name from URL:", imageUrl);
            return;
        }

        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
        await blockBlobClient.deleteIfExists();
    } catch (error) {
        console.error(`Failed to delete image from Azure: ${imageUrl}. Error:`, error);
        // Do not re-throw, just log the error. We don't want to fail the whole operation if a single image deletion fails.
    }
};


// --- Product Logic ---

export const addProduct = async (productData: Omit<Product, 'id' | 'images' | 'artisanId' | 'createdAt'>, images: File[], artisanId: string): Promise<string> => {
    if (!artisanId) {
        throw new Error("Authentication required. You must be logged in to add a product.");
    }
    if (!images || images.length === 0) {
        throw new Error("At least one image is required to add a product.");
    }
    
    try {
        const imageUrls = await uploadImagesToAzure(images, artisanId);
        
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
    const newImageUrls = newImageFiles.length > 0 ? await uploadImagesToAzure(newImageFiles, artisanId) : [];

    const finalImageUrls = productData.images.filter(img => typeof img === 'string') as string[];
    const imagesToDelete = initialImageUrls.filter(url => !finalImageUrls.includes(url));
    
    if (imagesToDelete.length > 0) {
        await Promise.all(imagesToDelete.map(url => deleteImageFromAzure(url)));
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
            const deletePromises = product.images.map(url => deleteImageFromAzure(url));
            await Promise.all(deletePromises);
        }

        await deleteDoc(productRef);
    } catch (e) {
        console.error("Error deleting product: ", e);
        throw e instanceof Error ? e : new Error("Failed to delete product due to an unexpected error.");
    }
};

export const getProducts = async (queryLimit?: number): Promise<Product[]> => {
    try {
        let q;
        if (queryLimit) {
            q = query(collection(db, 'products'), orderBy('createdAt', 'desc'), limit(queryLimit));
        } else {
            q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
        }
        
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


// --- Artisan Logic ---

export const getArtisans = async (queryLimit?: number): Promise<Artisan[]> => {
     try {
        let q;
        if (queryLimit) {
            q = query(collection(db, 'artisans'), limit(queryLimit));
        } else {
            q = query(collection(db, 'artisans'));
        }

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
                bio: 'Welcome to Virasat! Please update your bio.',
                craft: 'Not specified',
                location: 'Not specified',
                profileImage: `https://placehold.co/100x100.png`,
            });
        } catch (error) {
            console.error('Error creating artisan profile:', error);
            throw new Error('Database error creating new user profile.');
        }
    }
};

export const updateArtisanProfile = async (
    artisanId: string, 
    data: Omit<Artisan, 'id' | 'profileImage'>, 
    newImageFile?: File,
    existingImageUrl?: string | null
): Promise<void> => {
    const artisanRef = doc(db, 'artisans', artisanId);
    let updateData: { [key: string]: any } = { ...data };
    let newImageUrl: string | null = null;

    try {
        // Step 1: Upload a new image if one is provided
        if (newImageFile) {
            newImageUrl = await uploadImageToAzure(newImageFile, 'profileImages', artisanId);
            updateData.profileImage = newImageUrl;
        }

        // Step 2: Update the Firestore document
        await setDoc(artisanRef, updateData, { merge: true });

        // Step 3: Delete the old image from Azure ONLY IF a new one was uploaded and the DB was updated successfully
        if (newImageUrl && existingImageUrl) {
             // Don't delete the placeholder image
            if (!existingImageUrl.startsWith("https://placehold.co")) {
                await deleteImageFromAzure(existingImageUrl);
            }
        }
    } catch (error) {
        console.error("Error updating artisan profile:", error);
        
        // If profile update fails, and we uploaded a new image, try to delete the newly uploaded image to prevent orphans.
        if (newImageUrl) {
            console.log("Attempting to clean up newly uploaded image due to profile update failure...");
            await deleteImageFromAzure(newImageUrl);
        }
        
        throw new Error(`Failed to update profile: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
}


// --- AI and Logistics Logic ---

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

