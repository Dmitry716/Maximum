import {
  getAllCoursesPublic,
  getCategories,
  getCategoryByUrl,
  getSeoSettingsByPageName,
} from "@/api/requests";
import Courses from "@/components/courses/courses";
import CoursesHeader from "@/components/courses/courses-header";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar/navbar";
import ScrollToTop from "@/components/scroll-to-top";
import Switcher from "@/components/switcher";
import { loadCoursesSearchParams } from "@/lib/coursesSearchParams";
import { env } from "@/lib/env";
import { Categories, SeoSetting as SeoSettingType } from "@/types/type";
import { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { SearchParams } from "nuqs/server";
import { FiChevronRight } from "react-icons/fi";

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const coursesSearchParams = await loadCoursesSearchParams(searchParams);
  let category: Categories = { name: "Кружки и секции" } as Categories;
  if (coursesSearchParams.category !== "all") {
    category = await getCategoryByUrl(coursesSearchParams.category);
  }

  const categroyDescription =
    (category.description || category.name) + " в Витебске";
  let seoData: SeoSettingType | null = null;
  try {
    seoData = await getSeoSettingsByPageName("courses");
  } catch (error) {
    console.error(
      "Error fetching SEO data for courses, using defaults:",
      error,
    );
  }

  const title = categroyDescription || seoData?.metaTitle || `Курсы | Maximum`;
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
    ogImageUrl = `${env.NEXT_PUBLIC_API_URL}/og-image.jpg`;
  }

  // Если ogImage начинается с http:// или https:// — оставляем как есть
  // Иначе — добавляем базовый URL (если путь относительный)
  if (
    ogImageUrl &&
    !ogImageUrl.startsWith("http://") &&
    !ogImageUrl.startsWith("https://")
  ) {
    ogImageUrl = `${env.NEXT_PUBLIC_API_URL}${ogImageUrl}`;
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
      url: `${env.NEXT_PUBLIC_SITE_URL}/courses`,
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
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/courses`,
    },
  };
}

export const revalidate = 600;

export default async function CoursesPage({ searchParams }: PageProps) {
  const coursesSearchParams = await loadCoursesSearchParams(searchParams);
  const categories = await getCategories();
  const allCourses = await getAllCoursesPublic(coursesSearchParams);

  // JSON-LD для страницы "все курсы"
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Курсы | Maximum",
    description:
      "Найдите лучшие курсы для вашего ребенка в Maximum. Качественное образование и развитие навыков.",
    url: `${env.NEXT_PUBLIC_SITE_URL}/courses`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: allCourses.items.map((course, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Course",
          name: course.name,
          description: course.description,
          url: `${env.NEXT_PUBLIC_SITE_URL}/${
            course.category && typeof course.category !== "string"
              ? course.category.url
              : "courses"
          }/${course.url}`,
          provider: {
            "@type": "Organization",
            name: "Спортивно-образовательный центр «Максимум»",
            url: env.NEXT_PUBLIC_SITE_URL,
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

      <Navbar navlight={false} />

      {/*  breadcrumb */}
      <section
        id="courses"
        className="relative py-5 bg-slate-50 dark:bg-slate-800 mt-[74px]"
      >
        <div className="container relative">
          <div className="grid md:grid-cols-12 grid-cols-1 gap-2 items-center">
            <CoursesHeader categories={categories} />

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
          <Courses categories={categories} />
        </div>
      </section>

      <Footer />
      <ScrollToTop />
      <Switcher />
    </>
  );
}
