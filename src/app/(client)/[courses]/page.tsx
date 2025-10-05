import React from "react";
import Link from "next/link";
import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer";
import ScrollToTop from "@/components/scroll-to-top";
import Switcher from "@/components/switcher";
import { FiChevronRight } from "react-icons/fi";
import Courses from "@/components/courses/courses";
import { getAllAges, getCategories } from "@/api/requests";
import { getSeoSettingsByPageName } from "@/api/requests";
import { SeoSetting as SeoSettingType } from "@/types/type";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata(): Promise<Metadata> {
  let seoData: SeoSettingType | null = null;
  try {
    // Используем НОВУЮ функцию для получения SEO-данных для общей страницы
    // Передаем 'home' как pageName, так как это главная страница
    seoData = await getSeoSettingsByPageName("courses");
  } catch (error) {
    console.error(
      "Error fetching SEO data for courses, using defaults:",
      error
    );
    // Просто продолжаем, seoData останется null
  }

  // Определяем значения: из API (из BlogPost) или дефолтные
  const title = seoData?.metaTitle || `Курсы | Maximum`;
  const description =
    seoData?.metaDescription ||
    `Найдите лучшие курсы для вашего ребенка в Maximum. Качественное образование и развитие навыков.`;
  const keywords = seoData?.keywords
    ? seoData.keywords.split(",").filter(Boolean)
    : ["курсы", "образование", "дети", "развитие"];

  return {
    title,
    description,
    keywords,
    openGraph: {
      title: seoData?.metaTitle || `Курсы | Maximum`,
      description:
        seoData?.metaDescription ||
        `Найдите лучшие курсы для вашего ребенка в Maximum.`,
      type: "website",
      url: `${process.env.NEXT_PUBLIC_API_URL}/courses`,
    },
    twitter: {
      card: "summary_large_image",
      title: seoData?.metaTitle || `Курсы | Maximum`,
      description:
        seoData?.metaDescription ||
        `Найдите лучшие курсы для вашего ребенка в Maximum.`,
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_API_URL}/courses`,
    },
  };
}

export const revalidate = 600;

export type paramsType = Promise<{ courses: string }>;

export default async function Page(props: { params: paramsType }) {
  const { courses } = await props.params;
  const ages = await getAllAges();
  const categories = await getCategories();
  const categoryExists = categories.some((cat) => cat.id === courses);

  if (!categoryExists) {
    notFound();
  }

  return (
    <>
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
          <Courses ages={ages} categories={categories} ctg={courses} />
        </div>
      </section>

      <Footer />
      <ScrollToTop />
      <Switcher />
    </>
  );
}
