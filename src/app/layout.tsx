import type { Metadata } from 'next';
import localFont from 'next/font/local';
import '../styles/global.scss';
import 'react-loading-skeleton/dist/skeleton.css';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import RecoilContextProvider from '@/providers/recoil-provider';
import { WalletConnectProvider } from '@/providers';
import { AuthProvider } from '@/providers/auth-provider';
import { Suspense } from 'react';
import { Loader } from '@/providers/auth-provider/loader';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'Decentralized Identification Management',
  description: 'Decentralized Identification Management Comission',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Titillium+Web&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter&family=Noto+Sans&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Familjen+Grotesk:wght@400;500;600;700&display=swap"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Toaster />
        <RecoilContextProvider>
          <WalletConnectProvider>
            <Suspense fallback={<Loader />}>
              <AuthProvider>{children}</AuthProvider>
            </Suspense>
          </WalletConnectProvider>
        </RecoilContextProvider>
      </body>
    </html>
  );
}
