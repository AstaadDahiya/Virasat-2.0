'use server';

/**
 * @fileOverview AI-powered trend analysis for artisan products.
 *
 * - harmonizeTrends - A function that analyzes market trends and provides suggestions.
 * - HarmonizeTrendsInput - The input type for the harmonizeTrends function.
 * - HarmonizeTrendsOutput - The return type for the harmonizeTrends function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HarmonizeTrendsInputSchema = z.object({
  productCategory: z.string().describe('The category of the product (e.g., Ceramics, Textiles).'),
  productDescription: z.string().describe('A description of the product.'),
});
export type HarmonizeTrendsInput = z.infer<typeof HarmonizeTrendsInputSchema>;

const HarmonizeTrendsOutputSchema = z.object({
  trendAnalysis: z.string().describe('A summary of current market trends relevant to the product category.'),
  suggestions: z.string().describe('Actionable suggestions for the artisan to adapt their product to trends without compromising authenticity.'),
});
export type HarmonizeTrendsOutput = z.infer<typeof HarmonizeTrendsOutputSchema>;

export async function harmonizeTrends(input: HarmonizeTrendsInput): Promise<HarmonizeTrendsOutput> {
  return harmonizeTrendsFlow(input);
}

const trendHarmonizerPrompt = ai.definePrompt({
    name: 'trendHarmonizerPrompt',
    input: { schema: HarmonizeTrendsInputSchema },
    output: { schema: HarmonizeTrendsOutputSchema },
    prompt: `You are a market trend analyst specializing in the artisan and handmade goods sector. 
    Your task is to provide trend analysis and actionable suggestions for an artisan based on their product.

    Product Category: {{{productCategory}}}
    Product Description: {{{productDescription}}}

    Based on the information above, please generate the following:
    1.  A "Trend Analysis" that summarizes current market trends relevant to the product's category (e.g., popular colors, patterns, styles, materials).
    2.  A list of "Actionable Suggestions" on how the artisan could adapt their work to these trends while maintaining their unique, authentic style. The suggestions should be simple and practical.`,
});


const harmonizeTrendsFlow = ai.defineFlow(
  {
    name: 'harmonizeTrendsFlow',
    inputSchema: HarmonizeTrendsInputSchema,
    outputSchema: HarmonizeTrendsOutputSchema,
  },
  async (input) => {
    const {output} = await trendHarmonizerPrompt(input);
    return output!;
  }
);
