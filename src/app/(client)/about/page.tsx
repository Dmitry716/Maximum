import React from "react";
import Navbar from "@/components/navbar/navbar";
import AboutOne from "@/components/about-one";
import Features from "@/components/features";
import Cta from "@/components/cta";
import GetInTouch from "@/components/get-in-touch";
import Footer from "@/components/footer";
import ScrollToTop from "@/components/scroll-to-top";
import Switcher from "@/components/switcher";
import { Metadata } from "next";
import { getSeoSettingsByPageNameServer } from "@/api/server-requests";
import { SeoSetting as SeoSettingType } from "@/types/type";
import Script from "next/script";

export async function generateMetadata(): Promise<Metadata> {
  let seoData: SeoSettingType | null = null;
  try {
    // Используем НОВУЮ функцию для получения SEO-данных для общей страницы
    // Передаем 'home' как pageName, так как это главная страница
    seoData = await getSeoSettingsByPageNameServer("about");
  } catch (error) {
    console.error("Error fetching SEO data for about, using defaults:", error);
    // Просто продолжаем, seoData останется null
  }

  // Определяем значения: из API (из BlogPost) или дефолтные
  const title =
    seoData?.metaTitle ||
    "О нас | Спортивно-образовательный центр «Максимум» в Витебске";
  const description =
    seoData?.metaDescription ||
    "Спортивно-образовательный центр «Максимум» в Витебске — это профессиональные преподаватели, современные программы и индивидуальный подход. Узнайте о нашей миссии и достижениях!";
  const keywords = seoData?.keywords
    ? seoData.keywords.split(",").filter(Boolean)
    : [
        "о нас",
        "спортивный центр Витебск",
        "преподаватели",
        "наши достижения",
        "миссия центра",
        "о Максимуме",
      ];

  // Получаем ogImage из SEO-данных
  let ogImageUrl = seoData?.ogImage;

  // Если ogImage не задан — используем дефолтное изображение
  if (!ogImageUrl) {
    ogImageUrl = `${process.env.NEXT_PUBLIC_API_URL}/og-image.jpg`;
  }

  // Если ogImage начинается с http:// или https:// — оставляем как есть
  // Иначе — добавляем базовый URL (если путь относительный)
  if (
    ogImageUrl &&
    !ogImageUrl.startsWith("http://") &&
    !ogImageUrl.startsWith("https://")
  ) {
    ogImageUrl = `${process.env.NEXT_PUBLIC_API_URL}${ogImageUrl}`;
  }
  // Опционально: Используем изображение из SEO-данных, если оно есть, иначе дефолтное

  return {
    title,
    description,
    keywords,
    openGraph: {
      title:
        seoData?.metaTitle || "О нас | Спортивный центр «Максимум» в Витебске", // Используем то же, что и в title
      description:
        seoData?.metaDescription ||
        "Узнайте о нашем центре, о преподавателях и уникальных программах занятий в Витебске!", // Используем то же, что и в description
      url: `${process.env.NEXT_PUBLIC_API_URL}/about`,
      type: "website",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "ru_RU",
    },
    twitter: {
      card: "summary_large_image",
      title:
        seoData?.metaTitle || "О нас | Спортивный центр «Максимум» в Витебске", // Используем то же, что и в title
      description:
        seoData?.metaDescription ||
        "Узнайте о нашем центре, о преподавателях и уникальных программах занятий в Витебске!", // Используем то же, что и в description
      images: [ogImageUrl],
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_API_URL}/about`,
    },
  };
}

export default function Page() {
  // JSON-LD для страницы "О нас"
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Спортивно-образовательный центр «Максимум»",
    alternateName: "Максимум",
    url: `${process.env.NEXT_PUBLIC_API_URL}`,
    logo: `${process.env.NEXT_PUBLIC_API_URL}/logo.webp`,
    description:
      "Спортивно-образовательный центр «Максимум» в Витебске — это профессиональные преподаватели, современные программы и индивидуальный подход.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Витебск",
      addressCountry: "BY",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+375297800008",
      contactType: "customer service",
      availableLanguage: "ru",
    },
    sameAs: [
      "https://www.facebook.com/maximus-center",
      "https://www.instagram.com/maximus_center",
    ],
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "О нас | Спортивно-образовательный центр «Максимум»",
    url: `${process.env.NEXT_PUBLIC_API_URL}/about`,
    description:
      "Узнайте о нашем центре, о преподавателях и уникальных программах занятий в Витебске!",
    about: organizationSchema,
  };

  return (
    <>
      <Script
        type="application/ld+json"
        id="organization-about-schema"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <Script
        type="application/ld+json"
        id="webpage-about-schema"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />

      <Navbar navlight={true} tagline={false} />

      <section
        className="relative table w-full py-32 lg:py-72 bg-no-repeat bg-center bg-cover"
        style={{ backgroundImage: `url('/images/course/4.jpg')` }}
      >
        <div className="absolute inset-0 bg-black opacity-80"></div>
        <div className="container relative">
          <div className="grid grid-cols-1 text-center mt-10">
            <h3 className="md:text-3xl text-2xl md:leading-normal leading-normal font-semibold text-white">
              О Нас
            </h3>
          </div>
        </div>
      </section>

      <div className="relative">
        <div className="shape overflow-hidden z-1 text-white dark:text-slate-900">
          <svg
            viewBox="0 0 2880 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 48H1437.5H2880V0H2160C1442.5 52 720 0 720 0H0V48Z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
      </div>
      <section className="relative lg:py-24 py-16">
        <div className="container relative">
          <AboutOne title={false} />
        </div>

        <div className="container relative lg:mt-24 mt-16">
          <div className="grid grid-cols-1 pb-6 text-center">
            <h4 className="mb-6 md:text-3xl text-2xl md:leading-normal leading-normal font-semibold">
              Последние добавленные курсы
            </h4>

            <p className="text-slate-400 max-w-xl mx-auto">
              Ознакомьтесь с новыми предложениями и возможностями для обучения и
              развития.
            </p>
          </div>
          <Features />
        </div>
      </section>

      <Cta />

      <section className="relative lg:py-24 py-16">
        <div className="container relative lg:mt-24 mt-16">
          <GetInTouch />
        </div>
      </section>
      <Footer />
      <ScrollToTop />
      <Switcher />
    </>
  );
}
