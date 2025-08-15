
'use server';

/**
 * @fileOverview This file is no longer used for on-the-fly translations in the UI.
 * The new i18n system fetches full translation documents from Firestore.
 * This flow can be kept for potential future use cases, like one-off translations
 * within a form, but it's not part of the main UI rendering path anymore.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const TranslateTextInputSchema = z.object({
  text: z.string().describe('The text to be translated.'),
  targetLanguage: z.enum(['English', 'Hindi']).describe('The language to translate the text into.'),
});
export type TranslateTextInput = z.infer<typeof TranslateTextInputSchema>;

const TranslateTextOutputSchema = z.object({
  translatedText: z.string().describe('The translated text.'),
});
export type TranslateTextOutput = z.infer<typeof TranslateTextOutputSchema>;

export async function translateText(input: TranslateTextInput): Promise<TranslateTextOutput> {
  return translateTextFlow(input);
}

const translationPrompt = ai.definePrompt({
  name: 'translationPrompt',
  input: { schema: TranslateTextInputSchema },
  output: { schema: TranslateTextOutputSchema },
  prompt: `Translate the following text to {{targetLanguage}}.

Text: {{{text}}}

Return ONLY the translated text.`,
});

const translateTextFlow = ai.defineFlow(
  {
    name: 'translateTextFlow',
    inputSchema: TranslateTextInputSchema,
    outputSchema: TranslateTextOutputSchema,
  },
  async (input) => {
    const { output } = await translationPrompt(input);
    return output!;
  }
);
