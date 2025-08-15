
'use server';

/**
 * @fileOverview AI-powered logistics advisor for artisans.
 *
 * - getLogisticsAdvice - A function that provides comprehensive shipping advice.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { 
    LogisticsInputSchema, 
    LogisticsOutputSchema, 
    ShippingRateSchema,
    type LogisticsInput,
    type LogisticsOutput,
} from '@/lib/types';


// -------------------
// Mock Shipping API Tool
// -------------------
// In a real application, this tool would make an API call to a shipping aggregator like Shiprocket.
// For this prototype, we simulate the API response.

const getShippingRatesTool = ai.defineTool(
  {
    name: 'getShippingRates',
    description: 'Retrieves a list of available shipping carriers and their real-time rates for a given package.',
    inputSchema: z.object({
      weightKg: z.number(),
      destinationType: z.enum(['metro', 'tier_2_city', 'remote', 'international']),
    }),
    outputSchema: z.array(ShippingRateSchema),
  },
  async (input) => {
    // This is a mock response. A real implementation would call a shipping API.
    const baseRates = [
      { carrier: 'Delhivery', serviceType: 'Express', totalCost: 120, estimatedDeliveryDate: '2-3 days' },
      { carrier: 'Blue Dart', serviceType: 'Standard', totalCost: 110, estimatedDeliveryDate: '3-5 days' },
      { carrier: 'India Post', serviceType: 'Standard', totalCost: 85, estimatedDeliveryDate: '5-7 days' },
    ];
    if (input.destinationType === 'remote') {
        baseRates.push({ carrier: 'India Post', serviceType: 'Express', totalCost: 150, estimatedDeliveryDate: '4-6 days' });
        baseRates[1].totalCost += 40; // Blue Dart more expensive for remote
    }
    if (input.destinationType === 'international') {
       return [
         { carrier: 'DHL', serviceType: 'International Express', totalCost: 2500, estimatedDeliveryDate: '5-8 days' },
         { carrier: 'FedEx', serviceType: 'International Standard', totalCost: 2200, estimatedDeliveryDate: '7-10 days' },
       ]
    }
    return baseRates;
  }
);


// -------------------
// Main Logistics Flow
// -------------------

const logisticsAdvisorPrompt = ai.definePrompt({
    name: 'logisticsAdvisorPrompt',
    input: { schema: LogisticsInputSchema },
    output: { schema: LogisticsOutputSchema },
    tools: [getShippingRatesTool],
    prompt: `You are an expert logistics advisor for Indian artisans. Your goal is to provide clear, actionable advice to help them ship their valuable, handmade products safely and cost-effectively.

Analyze the user's input for the product: {{{productName}}}.

Here are the artisan's shipment details:
- Product Name: {{{productName}}}
- Material: {{{productMaterial}}}
- Weight: {{{packageWeightKg}}} kg
- Dimensions: {{{packageDimensionsCm.length}}}x{{{packageDimensionsCm.width}}}x{{{packageDimensionsCm.height}}} cm
- Destination: {{{destination}}}
- Declared Value: ₹{{{declaredValue}}}

Perform the following steps:

1.  **Determine Destination Type**: Based on the destination, classify it as 'metro', 'tier_2_city', 'remote', or 'international'.

2.  **Fetch Shipping Rates**: Use the 'getShippingRates' tool with the weight and destination type to get available shipping options.

3.  **Analyze and Advise**: Based on all the information (product details AND the shipping options returned by the tool), generate the following four pieces of advice:

    a.  **Packaging Advice**: Based on material and dimensions, give specific packaging instructions. Example: "Use a double-walled corrugated box. Wrap the terracotta item in bubble wrap, and fill all voids with packing peanuts to prevent movement."

    b.  **Customs Advice** (ONLY for international shipments): Identify the most likely 6-digit HS Code for the product. Generate a simple, clear customs declaration text. If the shipment is domestic, DO NOT include this field in the output. Example HS code for handmade pottery: 6912.00.

    c.  **Risk & Insurance Advice**: Analyze the fragility (based on material) and the declared value. Provide a specific recommendation for insurance. Example: "High-value terracotta item. We strongly advise adding shipping insurance. Standard liability only covers ₹1,000." If the item is low value and not fragile, you can advise against it.

    d.  **Carrier Choice Advice**: Provide a short, actionable insight based on the destination and the carrier options returned by the tool. Compare the options. Example: "For remote locations in the Northeast, India Post offers more reliable last-mile delivery. Delhivery is faster for metro cities."

4.  **Format Output**: Return all generated advice and the list of shipping options provided by the tool. The shipping options should be sorted by totalCost, from lowest to highest.
`
});


export async function getLogisticsAdvice(input: LogisticsInput): Promise<LogisticsOutput> {
  return getLogisticsAdviceFlow(input);
}


const getLogisticsAdviceFlow = ai.defineFlow(
  {
    name: 'getLogisticsAdviceFlow',
    inputSchema: LogisticsInputSchema,
    outputSchema: LogisticsOutputSchema,
  },
  async (input) => {
    const { output } = await logisticsAdvisorPrompt(input);
    if (!output) {
      throw new Error("The AI model failed to generate a logistics plan.");
    }
    
    // Ensure shipping options are sorted by price
    output.shippingOptions.sort((a, b) => a.totalCost - b.totalCost);

    return output;
  }
);
