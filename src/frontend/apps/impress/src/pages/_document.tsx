import { Head, Html, Main, NextScript } from 'next/document';

export default function RootLayout() {
  return (
    <Html>
      <Head />
      <body suppressHydrationWarning={process.env.NODE_ENV === 'development'}>
        <Main />
        <NextScript />
        <script src="/auto-hide.js" defer></script>
      </body>
    </Html>
  );
}
