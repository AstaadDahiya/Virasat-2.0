

export type Product = {
  id: string;
  name: string;
  name_hi: string;
  description: string;
  description_hi: string;
  price: number;
  images: string[];
  artisanId: string;
  category: string;
  category_hi: string;
  stock: number;
  materials: string[];
  materials_hi: string[];
};

export type Artisan = {
  id:string;
  name: string;
  name_hi: string;
  bio: string;
  bio_hi: string;
  profileImage: string;
  location: string;
  location_hi: string;
  craft: string;
  craft_hi: string;
};

// This represents the data coming from the form, before it's processed.
export type ProductFormData = Omit<Product, 'id' | 'images' | 'artisanId' | 'materials' | 'materials_hi'> & {
  images: File[];
  materials: string; // Comes as a comma-separated string from the form input
  materials_hi: string; // Comes as a comma-separated string from the form input
}

    
