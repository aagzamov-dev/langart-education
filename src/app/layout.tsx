import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import './globals.scss';

export const metadata: Metadata = {
  title: {
    default: 'LangArt Educational Group',
    template: '%s | LangArt',
  },
  description: 'LangArt Educational Group - the ultimate destination for learners committed to mastering the English language. Offering immersive, dynamic, and learner-centered programs.',
  keywords: ['English learning', 'language school', 'IELTS preparation', 'TOEFL', 'business English', 'Tashkent'],
  authors: [{ name: 'LangArt Educational Group' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://langart.uz',
    siteName: 'LangArt Educational Group',
    title: 'LangArt Educational Group',
    description: 'Unlock the Power of Education with LangArt',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
