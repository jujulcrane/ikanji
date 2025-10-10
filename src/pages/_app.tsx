import AuthUserProvider from '@/components/AuthUserProvider';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import localFont from 'next/font/local';
import Head from 'next/head';
import '@fontsource/noto-sans-jp';

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

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <title>I-漢字</title>
      </Head>
      <div
        className={`${geistSans.variable} ${geistMono.variable} font-[family-name:var(--font-geist-sans)]`}
        style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
      >
        <AuthUserProvider>
          <Component {...pageProps} />
        </AuthUserProvider>
      </div>
    </>
  );
}
