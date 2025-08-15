
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
  instagramPost: z.string().describe('A short, engaging Instagram post with relevant emojis and hashtags.'),
  facebookPost: z.string().describe('A slightly more detailed Facebook post that tells a story and encourages engagement.'),
  twitterPost: z.string().describe('A concise and punchy tweet (under 280 characters) with key hashtags.'),
  tiktokPost: z.string().describe('A script idea or caption for a short TikTok video, focusing on visual appeal and trends.'),
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

    Based on the information above, please generate the following six pieces of content, each tailored for its specific platform:
    1.  **Instagram Post**: Make it visually focused, engaging, and include plenty of relevant hashtags and maybe an emoji or two.
    2.  **Facebook Post**: This can be a bit longer. Tell a small story about the product or the artisan. Ask a question to encourage comments.
    3.  **Twitter Post**: Keep it short, punchy, and under 280 characters. Use key hashtags.
    4.  **TikTok Post**: Provide a video idea or a caption for an "unboxing," "behind-the-scenes," or "styling" video.
    5.  **Email Newsletter**: Write a warm, descriptive section for an email that encourages clicks.
    6.  **Ad Copy**: Create a short, persuasive copy suitable for Google or Facebook ads.`,
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
