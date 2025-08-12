'use server';

/**
 * @fileOverview AI-powered lifestyle mockup generation.
 *
 * - generateLifestyleMockup - A function that creates a lifestyle mockup image for a product.
 * - GenerateLifestyleMockupInput - The input type for the generateLifestyleMockup function.
 * - GenerateLifestyleMockupOutput - The return type for the generateLifestyleMockup function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateLifestyleMockupInputSchema = z.object({
  productImage: z
    .string()
    .describe("A photo of the product, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
  sceneDescription: z.string().describe('A description of the desired lifestyle scene (e.g., on a coffee table in a cozy living room).'),
});
export type GenerateLifestyleMockupInput = z.infer<typeof GenerateLifestyleMockupInputSchema>;

const GenerateLifestyleMockupOutputSchema = z.object({
  mockupImage: z.string().describe('The generated lifestyle mockup image, as a data URI.'),
});
export type GenerateLifestyleMockupOutput = z.infer<typeof GenerateLifestyleMockupOutputSchema>;

export async function generateLifestyleMockup(
  input: GenerateLifestyleMockupInput
): Promise<GenerateLifestyleMockupOutput> {
  return generateLifestyleMockupFlow(input);
}

const generateLifestyleMockupFlow = ai.defineFlow(
  {
    name: 'generateLifestyleMockupFlow',
    inputSchema: GenerateLifestyleMockupInputSchema,
    outputSchema: GenerateLifestyleMockupOutputSchema,
  },
  async (input) => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: [
        {media: {url: input.productImage}},
        {text: `Place the product from the image into a realistic lifestyle photo based on the following scene description: "${input.sceneDescription}". The product should be the main focus. The resulting image should be photorealistic.`},
      ],
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media || !media.url) {
      throw new Error('Failed to generate image.');
    }
    
    return {
      mockupImage: media.url,
    };
  }
);
