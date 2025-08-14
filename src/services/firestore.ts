import { db, storage } from "@/lib/firebase";
import { Product, ProductFormData, Artisan } from "@/lib/types";
import { collection, addDoc, getDocs, doc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { products as seedDataProducts, artisans as seedDataArtisans } from "@/lib/data"; // for seeding

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
        const productToAdd = {
            ...productData,
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
        if (querySnapshot.empty) {
            console.log("No products found, seeding database...");
            await seedProducts();
            const seededSnapshot = await getDocs(collection(db, "products"));
            return seededSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        }
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
         if (querySnapshot.empty) {
            console.log("No artisans found, seeding database...");
            await seedArtisans();
            const seededSnapshot = await getDocs(collection(db, "artisans"));
            return seededSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Artisan));
        }
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


// --- Seeding Functions ---
// These are for populating the database with initial data if it's empty.

const seedProducts = async () => {
    console.log("Seeding products...");
    for (const product of seedDataProducts) {
        try {
            await addDoc(collection(db, "products"), product);
        } catch (error) {
            console.error("Error seeding product:", product.name, error);
        }
    }
    console.log("Product seeding complete.");
};

const seedArtisans = async () => {
    console.log("Seeding artisans...");
    for (const artisan of seedDataArtisans) {
        try {
            // Firestore will auto-generate an ID if we don't specify one
            await addDoc(collection(db, "artisans"), artisan);
        } catch (error) {
            console.error("Error seeding artisan:", artisan.name, error);
        }
    }
     console.log("Artisan seeding complete.");
};
