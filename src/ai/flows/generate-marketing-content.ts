'use server';

/**
 * @fileOverview AI-powered marketing content generation.
 *
 * - generateMarketingContent - A function that creates marketing materials for a product.
 * - GenerateMarketingContentInput - The input type for the generateMarketingContent function.
 * - GenerateMarketingContentOutput - The return type for the generateMarketingContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMarketingContentInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  productDescription: z.string().describe('A detailed description of the product.'),
  targetAudience: z
    .string()
    .describe('The target audience for the marketing content (e.g., young professionals, eco-conscious buyers).'),
});
export type GenerateMarketingContentInput = z.infer<typeof GenerateMarketingContentInputSchema>;

const GenerateMarketingContentOutputSchema = z.object({
  socialMediaPost: z.string().describe('A short, engaging social media post for platforms like Instagram or Facebook.'),
  emailNewsletter: z.string().describe('A friendly and descriptive email newsletter section highlighting the product.'),
  adCopy: z.string().describe('A concise and persuasive ad copy for online advertising.'),
});
export type GenerateMarketingContentOutput = z.infer<typeof GenerateMarketingContentOutputSchema>;


const marketingContentPrompt = ai.definePrompt({
    name: 'marketingContentPrompt',
    input: { schema: GenerateMarketingContentInputSchema },
    output: { schema: GenerateMarketingContentOutputSchema },
    prompt: `You are a marketing expert for a platform that sells handmade goods from artisans. 
    Your task is to generate a variety of marketing content for a specific product.

    Product Name: {{{productName}}}
    Description: {{{productDescription}}}
    Target Audience: {{{targetAudience}}}

    Based on the information above, please generate the following:
    1.  A social media post (for Instagram/Facebook) that is engaging and includes relevant hashtags.
    2.  An email newsletter section that is warm, descriptive, and encourages clicks.
    3.  A short, punchy ad copy suitable for Google or Facebook ads.`,
});


export async function generateMarketingContent(
  input: GenerateMarketingContentInput
): Promise<GenerateMarketingContentOutput> {
  return generateMarketingContentFlow(input);
}

const generateMarketingContentFlow = ai.defineFlow(
  {
    name: 'generateMarketingContentFlow',
    inputSchema: GenerateMarketingContentInputSchema,
    outputSchema: GenerateMarketingContentOutputSchema,
  },
  async (input) => {
    const {output} = await marketingContentPrompt(input);
    return output!;
  }
);
