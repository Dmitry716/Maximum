import React from "react";
import Link from "next/link";
import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer";
import ScrollToTop from "@/components/scroll-to-top";
import Switcher from "@/components/switcher";
import { FiChevronRight } from "react-icons/fi";
import Courses from "@/components/courses/courses";
import { getAllAges, getAllCoursesPublic, getCategories } from "@/api/requests";
import { getSeoSettingsByPageName } from "@/api/requests";
import { SeoSetting as SeoSettingType } from "@/types/type";
import { Metadata } from "next";
import Script from "next/script";

export async function generateMetadata(): Promise<Metadata> {
  let seoData: SeoSettingType | null = null;
  try {
    seoData = await getSeoSettingsByPageName("courses");
  } catch (error) {
    console.error(
      "Error fetching SEO data for courses, using defaults:",
      error
    );
  }

  const title = seoData?.metaTitle || `Курсы | Maximum`;
  const description =
    seoData?.metaDescription ||
    `Найдите лучшие курсы для вашего ребенка в Maximum. Качественное образование и развитие навыков.`;
  const keywords = seoData?.keywords
    ? seoData.keywords.split(",").filter(Boolean)
    : ["курсы", "образование", "дети", "развитие"];

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

  return {
    title,
    description,
    keywords,
    openGraph: {
      title: seoData?.metaTitle || `Курсы | Maximum`,
      description:
        seoData?.metaDescription ||
        `Найдите лучшие курсы для вашего ребенка в Maximum.`,
      url: `${process.env.NEXT_PUBLIC_API_URL}/courses`,
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
      title: seoData?.metaTitle || `Курсы | Maximum`,
      description:
        seoData?.metaDescription ||
        `Найдите лучшие курсы для вашего ребенка в Maximum.`,
      images: [ogImageUrl],
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_API_URL}/courses`,
    },
  };
}

export const revalidate = 600;

export default async function CoursesPage() {
  const ages = await getAllAges();
  const categories = await getCategories();
  const allCourses = await getAllCoursesPublic({ limit: 1000, page: 1 });

  // JSON-LD для страницы "все курсы"
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Курсы | Maximum",
    description:
      "Найдите лучшие курсы для вашего ребенка в Maximum. Качественное образование и развитие навыков.",
    url: `${process.env.NEXT_PUBLIC_API_URL}/courses`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: allCourses.items.map((course, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Course",
          name: course.name,
          description: course.description,
          url: `${process.env.NEXT_PUBLIC_API_URL}/${
            course.category && typeof course.category !== "string"
              ? course.category.url
              : "courses"
          }/${course.url}`,
          provider: {
            "@type": "Organization",
            name: "Спортивно-образовательный центр «Максимум»",
            url: process.env.NEXT_PUBLIC_API_URL,
          },
        },
      })),
    },
  };

  return (
    <>
      <Script
        type="application/ld+json"
        id="courses-collection-schema"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      <Navbar navlight={false} tagline={false} />

      {/*  breadcrumb */}
      <section
        id="courses"
        className="relative py-5 bg-slate-50 dark:bg-slate-800 mt-[74px]"
      >
        <div className="container relative">
          <div className="grid md:grid-cols-12 grid-cols-1 gap-2 items-center">
            <div className="lg:col-span-5 md:col-span-4">
              <h3 className="text-2xl md:leading-normal leading-normal font-semibold">
                Кружки и секции
              </h3>
            </div>

            <div className="lg:col-span-7 md:col-span-8 md:text-end">
              <ul className="tracking-[0.5px] mb-0 inline-flex items-center">
                <li className="inline-block text-slate-400 dark:text-white/60 duration-500 ease-in-out hover:text-violet-600 dark:hover:text-white">
                  <Link href="/">Главная</Link>
                </li>
                <li className="inline-block text-slate-500 dark:text-white/60 mx-0.5 ltr:rotate-0 rtl:rotate-180">
                  <FiChevronRight className="align-middle" />
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-12">
        <div className="container relative">
          <Courses ages={ages} categories={categories} ctg="" />
        </div>
      </section>

      <Footer />
      <ScrollToTop />
      <Switcher />
    </>
  );
}