import type { Metadata } from "next";
import '../assets/scss/custom.scss'
import "./globals.css"
import "./prosemirror.css"
import 'katex/dist/katex.min.css';
import "vanilla-cookieconsent/dist/cookieconsent.css";

import { Providers } from "@/components/providers";
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";
import Head from "next/head";

export const metadata: Metadata = {
  title: "Спортивно-образовательный центр «Максимум» в Витебске | Тренировки, секции, обучение",
  description: "Спортивно-образовательный центр «Максимум» в Витебске предлагает профессиональные тренировки, секции для детей, образовательные программы. Запишитесь онлайн на занятия!",
  keywords: "спортивный центр Витебск, детские секции, тренировки для детей, образовательные программы, спорт в Витебске, Максимум Витебск",
  openGraph: {
    title: "Спортивно-образовательный центр «Максимум» | Витебск",
    description: "Профессиональные тренировки и образовательные программы в Витебске. Присоединяйтесь к нам!",
    type: "website",
    url: `${process.env.NEXT_PUBLIC_API_URL}`,
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_API_URL}/images/og/og.jpg`,
        width: 800,
        height: 600,
        alt: "Спортивно-образовательный центр «Максимум» в Витебске",
      },
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Спортивно-образовательный центр «Максимум» | Витебск",
    description: "Профессиональные тренировки и образовательные программы в Витебске. Присоединяйтесь к нам!",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_API_URL}/images/og/og.jpg`,
        width: 800,
        height: 600,
        alt: "Спортивно-образовательный центр «Максимум» в Витебске",
      },
    ]
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const cookieStore = cookies()
  const token = (await cookieStore).get('access_token')?.value

  let user = null

  if (token) {
    try {
      user = await verifyToken(token)
    } catch (e) {
      user = null
    }
  }

  return (
    <html lang="ru" className="scroll-smooth" dir="ltr">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <body
        className={` dark:bg-slate-900`}
      >
        <ThemeProvider>
          <Providers token={token} user={user}>{children}</Providers>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
