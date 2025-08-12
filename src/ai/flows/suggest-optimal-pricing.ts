'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting optimal pricing for artisan products.
 *
 * The flow takes into account materials, labor cost, and market demand to suggest a competitive price.
 * It exports the SuggestOptimalPricingInput and SuggestOptimalPricingOutput types, as well as the suggestOptimalPricing function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestOptimalPricingInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  materialsCost: z.number().describe('The cost of materials used in the product.'),
  laborCost: z.number().describe('The cost of labor involved in making the product.'),
  marketDemand: z.string().describe('A description of the current market demand for similar products.'),
  artisanSkillLevel: z.string().describe('The skill level of the artisan (e.g., beginner, intermediate, expert).'),
  productQuality: z.string().describe('The quality of the product (e.g., low, medium, high).'),
});
export type SuggestOptimalPricingInput = z.infer<typeof SuggestOptimalPricingInputSchema>;

const SuggestOptimalPricingOutputSchema = z.object({
  suggestedPrice: z.number().describe('The suggested optimal price for the product.'),
  reasoning: z.string().describe('The reasoning behind the suggested price, considering all input factors.'),
});
export type SuggestOptimalPricingOutput = z.infer<typeof SuggestOptimalPricingOutputSchema>;

export async function suggestOptimalPricing(input: SuggestOptimalPricingInput): Promise<SuggestOptimalPricingOutput> {
  return suggestOptimalPricingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestOptimalPricingPrompt',
  input: {schema: SuggestOptimalPricingInputSchema},
  output: {schema: SuggestOptimalPricingOutputSchema},
  prompt: `You are an expert pricing consultant for handmade artisan goods. Consider the following factors to suggest an optimal price for the product:

Product Name: {{{productName}}}
Materials Cost: {{{materialsCost}}}
Labor Cost: {{{laborCost}}}
Market Demand: {{{marketDemand}}}
Artisan Skill Level: {{{artisanSkillLevel}}}
Product Quality: {{{productQuality}}}

Analyze these factors and provide a suggested price that ensures competitive pricing and maximizes earnings for the artisan. Explain your reasoning for the suggested price.

Considerations:
- Market demand: High demand allows for higher prices.
- Artisan skill level and product quality: Higher skill and quality justify higher prices.
- Materials and labor costs: Ensure these costs are covered with a reasonable profit margin.
`,
});

const suggestOptimalPricingFlow = ai.defineFlow(
  {
    name: 'suggestOptimalPricingFlow',
    inputSchema: SuggestOptimalPricingInputSchema,
    outputSchema: SuggestOptimalPricingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
