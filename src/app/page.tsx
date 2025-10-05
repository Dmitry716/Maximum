import React from 'react'
import Link from 'next/link'
import Navbar from '@/components/navbar/navbar'
import HeroSlider from '@/components/hero-slider'
import AboutOne from '@/components/about-one'
import Features from '@/components/features'
import CoursesTwo from '@/components/courses/courses-two'
import Cta from '@/components/cta'
import GetInTouch from '@/components/get-in-touch'
import Footer from '@/components/footer'
import ScrollToTop from '@/components/scroll-to-top'
import Switcher from '@/components/switcher'
import { Metadata } from 'next'
import { SeoSetting as SeoSettingType } from '@/types/type'
import { getSeoSettingsByPageName } from '@/api/requests'

export async function generateMetadata(): Promise<Metadata> {
  let seoData: SeoSettingType | null = null;
  try {
    // Используем НОВУЮ функцию для получения SEO-данных для общей страницы
    // Передаем 'home' как pageName, так как это главная страница
    seoData = await getSeoSettingsByPageName('home');
  } catch (error) {
    console.error("Error fetching SEO data for homepage, using defaults:", error);
    // Просто продолжаем, seoData останется null
  }

  // Определяем значения: из API (из BlogPost) или дефолтные
  const title = seoData?.metaTitle || "Спортивно-образовательный центр «Максимум» в Витебске";
  const description = seoData?.metaDescription || "Добро пожаловать в спортивно-образовательный центр «Максимум» в Витебске. Профессиональные преподаватели, современные программы и индивидуальный подход для вашего ребенка.";
  const keywords = seoData?.keywords ? seoData.keywords.split(",").filter(Boolean) : [
    "спортивный центр Витебск",
    "образовательный центр Максимум",
    "детские курсы Витебск",
    "развитие детей Витебск",
    "спорт и образование"
  ];

  // Получаем ogImage из SEO-данных
  let ogImageUrl = seoData?.ogImage;

  // Если ogImage не задан — используем дефолтное изображение
  if (!ogImageUrl) {
    ogImageUrl = `${process.env.NEXT_PUBLIC_API_URL}/og-image.jpg`;
  }

  // Если ogImage начинается с http:// или https:// — оставляем как есть
  // Иначе — добавляем базовый URL (если путь относительный)
  if (ogImageUrl && !ogImageUrl.startsWith('http://') && !ogImageUrl.startsWith('https://')) {
    ogImageUrl = `${process.env.NEXT_PUBLIC_API_URL}${ogImageUrl}`;
  }

  return {
    title,
    description,
    keywords,
    openGraph: {
      title: seoData?.metaTitle || "Спортивно-образовательный центр «Максимум» в Витебске",
      description: seoData?.metaDescription || "Добро пожаловать в спортивно-образовательный центр «Максимум» в Витебске. Профессиональные преподаватели, современные программы и индивидуальный подход для вашего ребенка.",
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
      locale: "ru_RU"
    },
    twitter: {
      card: "summary_large_image",
      title: seoData?.metaTitle || "Спортивно-образовательный центр «Максимум» в Витебске",
      description: seoData?.metaDescription || "Добро пожаловать в спортивно-образовательный центр «Максимум» в Витебске.",
      images: [ogImageUrl],
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_API_URL}/`, // Canonical для главной страницы
    },
  };
}

export default function Page() {
  return (
    <>
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
              Откройте для себя мир знаний и возможностей <br />
              с нашим спортивно-образовательным центром «Максимум»
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
              Ознакомьтесь с новыми предложениями и возможностями <br /> для обучения и развития.
            </p>
          </div>

          <CoursesTwo />

          <div className="grid md:grid-cols-12 grid-cols-1 mt-6">
            <div className="md:col-span-12 text-center">
              <Link href="/courses" className="text-slate-400 hover:text-violet-600 duration-500 ease-in-out">Посмотреть больше курсов <i className="mdi mdi-arrow-right align-middle"></i></Link>
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
  )
}
