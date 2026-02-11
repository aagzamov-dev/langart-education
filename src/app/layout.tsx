import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages, getTranslations } from 'next-intl/server';
import { ToastProvider } from '@/components/ui/Toast/ToastContext';
import { SiteConfigProvider } from '@/context/SiteConfigContext';
// import { prisma } from '@/lib/prisma';
import './globals.scss';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'seo' });

  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords').split(',').map((k) => k.trim()),
    authors: [{ name: 'LangArt Educational Group' }],
    manifest: '/manifest.json',
    appleWebApp: {
      title: 'LangArt',
      statusBarStyle: 'default',
    },
    openGraph: {
      type: 'website',
      locale: locale === 'ru' ? 'ru_RU' : locale === 'uz' ? 'uz_UZ' : 'en_US',
      url: 'https://langart.uz',
      siteName: 'LangArt Educational Group',
      title: t('title'),
      description: t('description'),
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  // Fetch site config directly from DB (Server Component)
  // We use upsert to ensure it exists
  // const siteConfig = await prisma.siteConfig.upsert({
  //   where: { id: 1 },
  //   update: {},
  //   create: {
  //     phoneNumber: '+998 90 123 45 67',
  //     email: 'info@langart.uz',
  //     locations: ['Tashkent, Uzbekistan'],
  //     workingHours: '09:00 - 18:00',
  //     facebook: '',
  //     instagram: '',
  //     telegram: '',
  //   },
  // });

  // Transform to match interface if needed, or pass directly if matches
  const config = {
    phoneNumber: '+998 90 123 45 67', // siteConfig.phoneNumber,
    email: 'info@langart.uz', // siteConfig.email,
    locations: ['Tashkent, Uzbekistan'], // siteConfig.locations,
    workingHours: '09:00 - 18:00', // siteConfig.workingHours,
    facebook: '', // siteConfig.facebook,
    instagram: '', // siteConfig.instagram,
    telegram: '', // siteConfig.telegram,
  };

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <SiteConfigProvider config={config}>
            <ToastProvider>
              {children}
            </ToastProvider>
          </SiteConfigProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
