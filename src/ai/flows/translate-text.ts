
'use server';

/**
 * @fileOverview This file provides an AI-powered text translation service using Azure Translator.
 * It can translate a single string or an array of strings to a target language.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import {
  TranslatorClient,
  isUnexpected,
} from '@azure/ai-translation-text';
import { AzureKeyCredential } from '@azure/core-auth';


const TranslateTextInputSchema = z.object({
  text: z.union([z.string(), z.array(z.string())]).describe('The text or texts to be translated.'),
  targetLanguage: z.string().describe('The language to translate the text into (e.g., "hi", "bn", "ta").'),
});
export type TranslateTextInput = z.infer<typeof TranslateTextInputSchema>;

const TranslateTextOutputSchema = z.object({
  translatedText: z.union([z.string(), z.array(z.string())]).describe('The translated text or texts.'),
});
export type TranslateTextOutput = z.infer<typeof TranslateTextOutputSchema>;

export async function translateText(input: TranslateTextInput): Promise<TranslateTextOutput> {
  return translateTextFlow(input);
}


const translateTextFlow = ai.defineFlow(
  {
    name: 'translateTextFlow',
    inputSchema: TranslateTextInputSchema,
    outputSchema: TranslateTextOutputSchema,
  },
  async (input) => {
    const key = process.env.AZURE_TRANSLATOR_KEY;
    const endpoint = process.env.AZURE_TRANSLATOR_ENDPOINT;
    const region = process.env.AZURE_TRANSLATOR_REGION;

    if (!key || !endpoint || !region) {
      throw new Error("Azure Translator credentials are not configured in the environment variables.");
    }
    
    const translateCredential = new AzureKeyCredential(key);
    const translationClient = new TranslatorClient(endpoint, translateCredential, {
        region,
    });
    
    const textToTranslate = Array.isArray(input.text) ? input.text : [input.text];

    try {
        const translatedResult = await translationClient.path("/translate").post({
            body: textToTranslate.map(t => ({text: t})),
            queryParameters: {
                to: input.targetLanguage,
                from: "en",
            }
        });

        if(isUnexpected(translatedResult)) {
            throw new Error(`Azure translation failed: ${translatedResult.body.error.message}`);
        }
        
        const translatedTexts = translatedResult.body.map(item => item.translations[0].text);

        if (Array.isArray(input.text)) {
            return { translatedText: translatedTexts };
        } else {
            return { translatedText: translatedTexts[0] || "" };
        }

    } catch (error) {
        console.error("Error calling Azure Translator API:", error);
        // On error, return original text to prevent crashes
        return { translatedText: input.text };
    }
  }
);
