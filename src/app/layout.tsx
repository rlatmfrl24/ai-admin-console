import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { Roboto } from 'next/font/google';
import { ThemeProvider } from '@mui/material/styles';

import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap이 없다면 설치 필요
import '@formio/js/dist/formio.full.min.css';
import './globals.css';
import AppShell from '../components/AppShell';

import type { Metadata } from 'next';

import theme from '@/lib/theme';

const roboto = Roboto({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
});

export const metadata: Metadata = {
  title: 'AI Admin Console',
  description: 'AI Admin Console',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <AppShell>{children}</AppShell>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
