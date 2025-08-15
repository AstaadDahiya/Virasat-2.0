
'use server';

/**
 * @fileOverview This file provides an AI-powered text translation service.
 * It can translate a single string or an array of strings to a target language.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const TranslateTextInputSchema = z.object({
  text: z.union([z.string(), z.array(z.string())]).describe('The text or texts to be translated.'),
  targetLanguage: z.string().describe('The language to translate the text into (e.g., "Hindi", "Bengali").'),
});
export type TranslateTextInput = z.infer<typeof TranslateTextInputSchema>;

const TranslateTextOutputSchema = z.object({
  translatedText: z.union([z.string(), z.array(z.string())]).describe('The translated text or texts.'),
});
export type TranslateTextOutput = z.infer<typeof TranslateTextOutputSchema>;

export async function translateText(input: TranslateTextInput): Promise<TranslateTextOutput> {
  return translateTextFlow(input);
}

const translationPrompt = ai.definePrompt({
  name: 'translationPrompt',
  input: { schema: z.object({ text: z.string(), targetLanguage: z.string() }) },
  prompt: `Translate the following text to {{targetLanguage}}.

Text: {{{text}}}

Return ONLY the translated text. Do not include any preamble, introduction, or quotation marks.`,
});

const translateTextFlow = ai.defineFlow(
  {
    name: 'translateTextFlow',
    inputSchema: TranslateTextInputSchema,
    outputSchema: TranslateTextOutputSchema,
  },
  async (input) => {
    if (Array.isArray(input.text)) {
      const translationPromises = input.text.map(textToTranslate =>
        translationPrompt({ text: textToTranslate, targetLanguage: input.targetLanguage })
      );
      const results = await Promise.all(translationPromises);
      const translatedTexts = results.map(result => result.text);
      return { translatedText: translatedTexts };
    } else {
      const { text } = await translationPrompt({ text: input.text, targetLanguage: input.targetLanguage });
      return { translatedText: text };
    }
  }
);
