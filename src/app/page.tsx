import React from "react";
import Link from "next/link";
import Navbar from "@/components/navbar/navbar";
import HeroSlider from "@/components/hero-slider";
import AboutOne from "@/components/about-one";
import Features from "@/components/features";
import CoursesTwo from "@/components/courses/courses-two";
import Cta from "@/components/cta";
import GetInTouch from "@/components/get-in-touch";
import Footer from "@/components/footer";
import ScrollToTop from "@/components/scroll-to-top";
import Switcher from "@/components/switcher";
import { Metadata } from "next";
import { SeoSetting as SeoSettingType } from "@/types/type";
import { getSeoSettingsByPageNameServer } from "@/api/server-requests";
import Script from "next/script";
import { getSeoFallback } from "@/lib/seo-fallback";

export async function generateMetadata(): Promise<Metadata> {
  let seoData: SeoSettingType | null = null;
  try {
    // Используем НОВУЮ функцию для получения SEO-данных для общей страницы
    seoData = await getSeoSettingsByPageNameServer("home");
  } catch (error) {
    // Ошибки уже обрабатываются в getSeoSettingsByPageNameServer
    // Просто продолжаем, seoData останется null
  }

  // Если данные не получены, используем fallback
  const fallback = getSeoFallback("home");

  // Определяем значения: из API или из fallback
  const title = seoData?.metaTitle || fallback.metaTitle;
  const description = seoData?.metaDescription || fallback.metaDescription;
  const keywords = seoData?.keywords
    ? seoData.keywords.split(",").filter(Boolean)
    : fallback.keywords.split(",").filter(Boolean);

  // Получаем ogImage из SEO-данных или fallback
  let ogImageUrl = seoData?.ogImage || fallback.ogImage;

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

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: "website",
      url: `${process.env.NEXT_PUBLIC_API_URL}/`, // URL главной страницы
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
      title,
      description,
      images: [ogImageUrl],
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_API_URL}/`, // Canonical для главной страницы
    },
  };
}

export default function Page() {
  // JSON-LD данные
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Спортивно-образовательный центр «Максимум»",
    alternateName: "Максимум",
    url: `${process.env.NEXT_PUBLIC_API_URL}`,
    logo: `${process.env.NEXT_PUBLIC_API_URL}/logo.webp`,
    description:
      "Добро пожаловать в спортивно-образовательный центр «Максимум» в Витебске. Профессиональные преподаватели, современные программы и индивидуальный подход для вашего ребенка.",
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

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Спортивно-образовательный центр «Максимум»",
    url: `${process.env.NEXT_PUBLIC_API_URL}/`,
    potentialAction: {
      "@type": "SearchAction",
      target: `${process.env.NEXT_PUBLIC_API_URL}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      {/* JSON-LD через Script */}
      <Script
        type="application/ld+json"
        id="organization-schema"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <Script
        type="application/ld+json"
        id="website-schema"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
      {/* <Tagline /> */}

      <Navbar navlight={true} tagline={true} />

      <HeroSlider />

      <section className="relative lg:py-24 py-16">
        <div className="container relative">
          <AboutOne title={false} />
        </div>

        <div className="container relative lg:mt-24 mt-16">
          <div className="grid grid-cols-1 pb-6 text-center">
            <h4 className="mb-6 md:text-3xl text-2xl md:leading-normal leading-normal font-semibold">
              Откройте для себя мир знаний и возможностей <br />с нашим
              спортивно-образовательным центром «Максимум»
            </h4>
          </div>

          <Features />
        </div>

        <div className="container relative lg:mt-24 mt-16">
          <div className="grid grid-cols-1 pb-6 text-center">
            <h4 className="mb-6 md:text-3xl text-2xl md:leading-normal leading-normal font-semibold">
              Последние добавленные курсы
            </h4>

            <p className="text-slate-400 max-w-xl mx-auto">
              Ознакомьтесь с новыми предложениями и возможностями <br /> для
              обучения и развития.
            </p>
          </div>

          <CoursesTwo />

          <div className="grid md:grid-cols-12 grid-cols-1 mt-6">
            <div className="md:col-span-12 text-center">
              <Link
                href="/courses"
                className="text-slate-400 hover:text-violet-600 duration-500 ease-in-out"
              >
                Посмотреть больше курсов{" "}
                <i className="mdi mdi-arrow-right align-middle"></i>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Cta />

      {/* Instruktors */}
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
