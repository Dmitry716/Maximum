import "../assets/scss/custom.scss";
import "./globals.css";
import "./prosemirror.css";
import "katex/dist/katex.min.css";
import "vanilla-cookieconsent/dist/cookieconsent.css";

import { Providers } from "@/components/providers";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { MetadataHead } from "@/components/metadata-head";
import Script from "next/script";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();
  const token = (await cookieStore).get("access_token")?.value;

  let user = null;

  if (token) {
    try {
      user = await verifyToken(token);
    } catch (e) {
      user = null;
    }
  }

  return (
    <html lang="ru" className="scroll-smooth" dir="ltr">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        {/* SVG как основной */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />

        {/* PNG для широкой поддержки */}
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
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
          sizes="96x96"
          href="/favicon-96x96.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/favicon-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="512x512"
          href="/favicon-512x512.png"
        />

        {/* Apple */}
        <link
          rel="apple-touch-icon"
          sizes="120x120"
          href="/favicon-120x120.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/favicon-152x152.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link rel="manifest" href="/site.webmanifest" />

        {/* Google tag (gtag.js) */}
        <Script
          id="google-gtag"
          src="https://www.googletagmanager.com/gtag/js?id=G-72GFKE1XQ2"
          strategy="afterInteractive"
        />
        <Script
          id="google-gtag-config"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-72GFKE1XQ2');
            `,
          }}
        />

        {/* Yandex.Metrika counter */}
        <Script
          id="yandex-metrika"
          type="text/javascript"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(m,e,t,r,i,k,a){
                m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                m[i].l=1*new Date();
                for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
                k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
              })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=104389302', 'ym');

              ym(104389302, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", accurateTrackBounce:true, trackLinks:true});
            `,
          }}
        />

        {/* Google Tag Manager */}
        <Script
          id="google-tag-manager"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-WF993WJT');
            `,
          }}
        />

        {/* Носкрипт для Yandex.Metrika */}
        <noscript>
          <div>
            <img
              src="https://mc.yandex.ru/watch/104389302"
              style={{ position: "absolute", left: "-9999px" }}
              alt=""
            />
          </div>
        </noscript>
      </head>
      <body className={` dark:bg-slate-900`}>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-WF993WJT"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        <MetadataHead />
        <ThemeProvider>
          <Providers token={token} user={user}>
            {children}
          </Providers>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
