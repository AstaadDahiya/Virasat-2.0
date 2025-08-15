export type TranslationKey = string;

// The large static translations object has been removed.
// The new system uses dynamic, on-the-fly translation via an AI flow.

type InterpolationValues = { [key: string]: string | number };

/**
 * A simple string interpolation function.
 * It's kept for utility, though the primary translation mechanism has changed.
 * @param text The text with placeholders like {{placeholder}}.
 * @param lang The target language (currently unused in this function but kept for signature consistency).
 * @param values The values to interpolate.
 * @returns The interpolated string.
 */
export function translate(text: string, lang: 'en' | 'hi', values?: InterpolationValues): string {
  let result = text;
  
  if (values) {
    Object.entries(values).forEach(([placeholder, value]) => {
      result = result.replace(new RegExp(`{{\\s*${placeholder}\\s*}}`, 'g'), String(value));
    });
  }
  
  return result;
}
