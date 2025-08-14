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
