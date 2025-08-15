

import { z } from 'zod';

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
  createdAt?: number; // Changed to number to store milliseconds
};

export type Artisan = {
  id:string;
  name: string;
  bio: string;
  profileImage: string;
  location: string;
  craft: string;
};

// This represents the data coming from the form, before it's processed.
export type ProductFormData = Omit<Product, 'id' | 'images' | 'artisanId' | 'materials' | 'createdAt'> & {
  images: (File | string)[]; // Can be existing URL strings or new File objects
  materials: string; // Comes as a comma-separated string from the form input
}

// Schemas and Types for Logistics Hub
export const ShippingRateSchema = z.object({
    carrier: z.string().describe('Name of the shipping carrier (e.g., "Delhivery", "Blue Dart", "India Post").'),
    serviceType: z.string().describe('Type of service (e.g., "Standard", "Express").'),
    totalCost: z.number().describe('Total shipping cost in INR.'),
    estimatedDeliveryDate: z.string().describe('Estimated delivery date or range (e.g., "3-5 days").'),
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

export type ShipmentData = {
    productId: string;
    destination: string;
    packageWeightKg: number;
    packageDimensionsCm: {
        length: number;
        width: number;
        height: number;
    };
    declaredValue: number;
    selectedCarrier: ShippingRate;
    aiPackagingAdvice: string;
    aiRiskAdvice: string;
    aiCarrierChoiceAdvice: string;
    aiHsCode?: string;
    aiCustomsDeclaration?: string;
};

export type Shipment = {
  id: string;
  artisan_id: string;
  product_id: string;
  destination: string;
  package_weight_kg: number;
  package_dimensions_cm: {
    length: number;
    width: number;
    height: number;
  };
  declared_value: number;
  selected_carrier: string;
  service_type: string;
  shipping_cost: number;
  estimated_delivery_date: string;
  tracking_number: string;
  shipping_label_url: string;
  ai_packaging_advice: string;
  ai_risk_advice: string;
  ai_carrier_choice_advice: string;
  ai_hs_code?: string;
  ai_customs_declaration?: string;
  createdAt: number; 
};
