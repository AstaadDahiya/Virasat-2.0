
import { db, storage } from "@/lib/firebase";
import { Product, ProductFormData, Artisan } from "@/lib/types";
import { collection, addDoc, getDocs, doc, getDoc, writeBatch } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { products as seedDataProducts, artisans as seedDataArtisans } from "@/lib/data"; // for seeding

let isSeeding = false;

// --- Seeding Function ---
// This is for populating the database with initial data if it's empty.
const seedDatabase = async () => {
    if (isSeeding) return;
    isSeeding = true;
    console.log("Checking if seeding is needed...");

    try {
        const productsSnapshot = await getDocs(collection(db, "products"));
        const artisansSnapshot = await getDocs(collection(db, "artisans"));

        if (productsSnapshot.empty && artisansSnapshot.empty) {
            console.log("Database is empty. Seeding products and artisans...");
            const batch = writeBatch(db);
            const artisanRefMap = new Map<string, string>();

            // Seed Artisans and get their new IDs
            for (let i = 0; i < seedDataArtisans.length; i++) {
                const artisanData = seedDataArtisans[i];
                const tempId = `artisan-${i + 1}`;
                const artisanRef = doc(collection(db, "artisans"));
                batch.set(artisanRef, artisanData);
                artisanRefMap.set(tempId, artisanRef.id);
            }
            console.log("Artisans queued for batch write.");


            // Seed Products with the new Artisan IDs
            for (const product of seedDataProducts) {
                 const newArtisanId = artisanRefMap.get(product.artisanId);
                 if (newArtisanId) {
                    const productRef = doc(collection(db, "products"));
                    batch.set(productRef, { ...product, artisanId: newArtisanId });
                 }
            }
            console.log("Products queued for batch write.");

            await batch.commit();
            console.log("Database seeding complete.");
        } else {
            console.log("Database already contains data. Seeding not required.");
        }
    } catch (error) {
        console.error("Error during seeding process:", error);
    } finally {
        isSeeding = false;
    }
};


// Function to upload images to Firebase Storage and get their URLs
const uploadImages = async (images: File[]): Promise<string[]> => {
    const imageUrls: string[] = [];
    for (const image of images) {
        const storageRef = ref(storage, `products/${Date.now()}-${image.name}`);
        await uploadBytes(storageRef, image);
        const imageUrl = await getDownloadURL(storageRef);
        imageUrls.push(imageUrl);
    }
    return imageUrls;
};

// Function to add a new product to Firestore
export const addProduct = async (productData: ProductFormData): Promise<string> => {
    try {
        const imageUrls = await uploadImages(productData.images);
        const { images, ...restOfProductData } = productData;
        const productToAdd = {
            ...restOfProductData,
            images: imageUrls,
            artisanId: 'artisan-1' // Hardcoded for now, replace with actual artisan ID
        };
        const docRef = await addDoc(collection(db, "products"), productToAdd);
        return docRef.id;
    } catch (e) {
        console.error("Error adding document: ", e);
        throw new Error("Failed to add product");
    }
};

// Function to get all products from Firestore
export const getProducts = async (): Promise<Product[]> => {
    try {
        const querySnapshot = await getDocs(collection(db, "products"));
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
    } catch (e) {
        console.error("Error getting documents: ", e);
        throw new Error("Failed to get products");
    }
};

// Function to get a single product by ID
export const getProduct = async (id: string): Promise<Product | null> => {
    try {
        const docRef = doc(db, "products", id);
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

// Function to get all artisans from Firestore
export const getArtisans = async (): Promise<Artisan[]> => {
    try {
        const querySnapshot = await getDocs(collection(db, "artisans"));
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Artisan));
    } catch (e) {
        console.error("Error getting documents: ", e);
        throw new Error("Failed to get artisans");
    }
};


// Function to get a single artisan by ID
export const getArtisan = async (id: string): Promise<Artisan | null> => {
    try {
        const docRef = doc(db, "artisans", id);
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

// Initialize and seed the database
seedDatabase();
