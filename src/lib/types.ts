export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  artisanId: string;
  category: string;
  stock: number;
  materials: string[];
};

export type Artisan = {
  id:string;
  name: string;
  bio: string;
  profileImage: string;
  location: string;
  craft: string;
};
