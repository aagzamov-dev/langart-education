import { getRequestConfig } from 'next-intl/server';
import { cookies, headers } from 'next/headers';

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
  let locale = cookieStore.get('NEXT_LOCALE')?.value as Locale | undefined;

  // If no cookie, try Accept-Language header
  if (!locale || !locales.includes(locale)) {
    const headerStore = await headers();
    const acceptLanguage = headerStore.get('accept-language');
    if (acceptLanguage) {
      const preferred = acceptLanguage.split(',')[0].split('-')[0];
      if (locales.includes(preferred as Locale)) {
        locale = preferred as Locale;
      }
    }
  }

  // Default to 'en' if nothing found
  if (!locale || !locales.includes(locale)) {
    locale = defaultLocale;
  }

  return {
    locale,
    messages: messages[locale],
  };
});
