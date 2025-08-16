

// This file is now used for seeding the database only.
// The application fetches data from Firestore.

import type { Artisan, Product } from './types';

// The ID property is not needed here as Firestore will generate it.
// However, to maintain the relationship, we use a temporary, predictable ID
// that will be replaced during the actual seeding process in firestore.ts.
export const artisans: Omit<Artisan, 'id'>[] = [
  {
    name: 'Priya Sharma',
    bio: 'Priya is a third-generation block-printer from Jaipur, a city renowned for its vibrant textiles. She finds inspiration in the intricate patterns of Rajasthani architecture and nature. Each piece is a testament to the timeless tradition of Sanganeri block-printing, crafted with passion and precision.',
    profileImage: 'https://image2url.com/images/1755014190052-e7330edb-abfe-45c3-af51-543a4ea9fddf.png',
    location: 'Jaipur, Rajasthan',
    craft: 'Block-Printing',
  },
  {
    name: 'Rohan Mehra',
    bio: 'From his workshop in Saharanpur, Rohan Mehra practices the art of wood carving, a skill passed down through generations. He specializes in creating intricate home goods from Sheesham wood, using traditional techniques. His philosophy is to let the natural beauty of the wood speak for itself.',
    profileImage: 'https://image2url.com/images/1755015058938-f2672261-043e-4567-ba9e-d3104222a788.png',
    location: 'Saharanpur, Uttar Pradesh',
    craft: 'Wood Carving',
  },
  {
    name: 'Aisha Begum',
    bio: 'Aisha is a master of Chikankari embroidery from Lucknow. Her delicate and precise needlework brings traditional Mughal-era designs to life on fine fabrics. Each garment tells a story, stitched with threads of history and culture.',
    profileImage: 'https://image2url.com/images/1755015144032-3afa0c70-9c71-45f2-aefa-784b813d46a6.png',
    location: 'Lucknow, Uttar Pradesh',
    craft: 'Embroidery',
  },
];

export const products: Omit<Product, 'id' | 'createdAt'>[] = [
  {
    name: 'Hand-Blocked Table Runner',
    description: 'A beautifully handcrafted table runner, perfect for adding a touch of Rajasthani elegance to your dining table. Features a classic floral motif in indigo and white.',
    price: 2500.0,
    images: ['https://image2url.com/images/1755012548151-37da720e-1283-4244-8dca-c47b3c720224.webp', 'https://placehold.co/600x600.png', 'https://placehold.co/600x600.png'],
    artisanId: 'artisan-1', // This will be replaced with real ID after seeding
    category: 'Block-Printing',
    stock: 15,
    materials: ['Cotton Canvas', 'Natural Dyes'],
  },
  {
    name: 'Sheesham Wood Spice Box',
    description: 'An intricately carved "masala dabba" made from durable Sheesham wood. It features multiple compartments and a small spoon for your essential spices.',
    price: 3200.0,
    images: ['https://image2url.com/images/1755012697263-f3ecde05-3747-4697-81f3-54a09b3f9fc6.png', 'https://placehold.co/600x600.png'],
    artisanId: 'artisan-2',
    category: 'Wood Carving',
    stock: 8,
    materials: ['Sheesham (Indian Rosewood)', 'Brass Inlay'],
  },
  {
    name: 'Chikankari Cotton Kurta',
    description: 'A luxuriously soft cotton kurta featuring delicate Chikankari embroidery. The timeless floral patterns make it a versatile piece for any occasion.',
    price: 4500.0,
    images: ['https://image2url.com/images/1755012612654-0119e2d3-3168-4b58-800f-e27475e1889a.jpg'],
    artisanId: 'artisan-3',
    category: 'Embroidery',
    stock: 5,
    materials: ['Mulmul Cotton', 'Cotton Thread'],
  },
  {
    name: 'Sanganeri Print Cushion Covers',
    description: 'Set of two cotton cushion covers with a traditional Sanganeri bootis (small floral motif) print. Brightens up any living space instantly.',
    price: 1800.0,
    images: ['https://image2url.com/images/1755012784019-66a06b22-a636-4237-9af6-6be22db539c4.jpg'],
    artisanId: 'artisan-1',
    category: 'Block-Printing',
    stock: 25,
    materials: ['Cotton Duck Fabric', 'Natural Dyes'],
  },
  {
    name: 'Hand-Carved Elephant Figurine',
    description: 'A symbol of wisdom and strength, this elegant elephant figurine is hand-carved from a single block of wood with remarkable detail.',
    price: 2800.0,
    images: ['https://image2url.com/images/1755015650198-5f686942-17c1-43a9-9cda-25f82ea6756a.jpg'],
    artisanId: 'artisan-2',
    category: 'Wood Carving',
    stock: 12,
    materials: ['Acacia Wood', 'Beeswax Finish'],
  },
  {
    name: 'Embroidered Silk Potli Bag',
    description: 'A vibrant silk potli (drawstring) bag, exquisitely embroidered with Zardozi work. The perfect accessory for weddings and festive occasions.',
    price: 2200.0,
    images: ['https://image2url.com/images/1755015552322-cc35871d-e350-4d58-ade2-4ef746cfe6d2.jpg'],
    artisanId: 'artisan-3',
    category: 'Embroidery',
    stock: 20,
    materials: ['Raw Silk', 'Zari Thread', 'Beads'],
  },
   {
    name: 'Jaipuri Blue Pottery Vase',
    description: 'A classic blue pottery vase from Jaipur, featuring a traditional peacock design. Does not use regular clay, but a mix of quartz stone powder, powdered glass, and other materials.',
    price: 3500.0,
    images: ['https://image2url.com/images/1755015513823-5d8c1f61-2e1d-4788-91e6-8983754627f2.jpg'],
    artisanId: 'artisan-1',
    category: 'Pottery',
    stock: 10,
    materials: ['Quartz Powder', 'Lead-free Glaze'],
  },
  {
    name: 'Wooden Jharokha Wall Decor',
    description: 'A miniature, intricately carved "jharokha" (ornate window) that brings a piece of Rajasthani palaces to your wall. A stunning piece of craftsmanship.',
    price: 7500.0,
    images: ['https://image2url.com/images/1755015585603-2034804a-c6fc-4547-8bfe-659efb18f352.jpg'],
    artisanId: 'artisan-2',
    category: 'Wood Carving',
    stock: 7,
    materials: ['Mango Wood', 'Natural Varnish'],
  },
];
