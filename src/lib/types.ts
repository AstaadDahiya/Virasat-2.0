

import { z } from 'zod';

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

// Schemas and Types for Logistics Hub
export const ShippingRateSchema = z.object({
    carrier: z.string().describe('Name of the shipping carrier (e.g., "Delhivery", "Blue Dart", "India Post").'),
    serviceType: z.string().describe('Type of service (e.g., "Standard", "Express").'),
    totalCost: z.number().describe('Total shipping cost in INR.'),
    estimatedDeliveryDate: z.string().describe('Estimated delivery date (e.g., "2024-12-25").'),
});
export type ShippingRate = z.infer<typeof ShippingRateSchema>;

export const LogisticsInputSchema = z.object({
  productName: z.string().describe("The name of the product being shipped."),
  productMaterial: z.string().describe("The primary material of the product (e.g., 'Terracotta', 'Silk', 'Wood')."),
  packageWeightKg: z.number().describe("The total weight of the package in kilograms."),
  packageDimensionsCm: z.object({
    length: z.number(),
    width: z.number(),
    height: z.number(),
  }).describe("The package dimensions in centimeters."),
  destination: z.string().describe("The destination city and country (e.g., 'Mumbai, India', 'New York, USA')."),
  declaredValue: z.number().describe("The declared value of the item in INR for insurance and customs purposes."),
});
export type LogisticsInput = z.infer<typeof LogisticsInputSchema>;


export const LogisticsOutputSchema = z.object({
  packagingAdvice: z.string().describe("Precise instructions on box type, cushioning, and handling to prevent damage."),
  customsAdvice: z.object({
    hsCode: z.string().describe("The suggested Harmonized System (HS) code for international customs."),
    declarationText: z.string().describe("The suggested text for the customs declaration form."),
  }).optional(),
  riskAndInsuranceAdvice: z.string().describe("A specific recommendation on whether to add shipping insurance, based on the item's value and fragility."),
  carrierChoiceAdvice: z.string().describe("An actionable insight to help the artisan choose between the available shipping options, considering factors like destination reliability and speed."),
  shippingOptions: z.array(ShippingRateSchema).describe("A list of available shipping options with their costs and delivery estimates, sorted from cheapest to most expensive."),
});
export type LogisticsOutput = z.infer<typeof LogisticsOutputSchema>;
    
