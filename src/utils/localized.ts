import { LocalizedContent } from '@/types/admin';

/**
 * Safely renders localized content based on the current locale or fallback precedence.
 * @param content The content to check (string, localized object, or null/undefined)
 * @param locale The preferred locale code (e.g. 'en', 'ru', 'uz')
 * @returns The best available string content
 */
export const getLocalizedContent = (
    content: LocalizedContent | string | null | undefined | any,
    locale: string = 'en'
): string => {
    if (!content) return '';
    if (typeof content === 'string') return content;
    
    // Try to get content for current locale, fallback to english, then others
    return content[locale] || content['en'] || content['uz'] || content['ru'] || '';
};
