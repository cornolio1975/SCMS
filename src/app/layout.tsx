import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'SCMS — Sports Club Management System | SP SportData Solution',
  description: 'Enterprise multi-club, multi-branch, and sport-neutral Sports Club Management System powered by SP SportData Solution, integrated with KarateTech 3.0.',
  keywords: ['Sports Club Management', 'SCMS', 'SP SportData Solution', 'KarateTech 3.0', 'Multi-tenant'],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#0284C7',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased bg-white text-slate-900">
      <body className="min-h-full flex flex-col font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
