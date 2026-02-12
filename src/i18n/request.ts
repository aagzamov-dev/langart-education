import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

export const locales = ['en', 'ru', 'uz'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

// Import messages statically to avoid dynamic import issues
import en from '../../messages/en.json';
import ru from '../../messages/ru.json';
import uz from '../../messages/uz.json';

const messages = { en, ru, uz };

export default getRequestConfig(async () => {
    // Try to get locale from cookie first
    const cookieStore = await cookies();
    const cookieLocale = cookieStore.get('NEXT_LOCALE')?.value as Locale | undefined;

    let locale: Locale = defaultLocale;

    if (cookieLocale && locales.includes(cookieLocale)) {
        locale = cookieLocale;
    }

    return {
        locale,
        messages: messages[locale],
    };
});
