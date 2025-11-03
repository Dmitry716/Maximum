import React from "react";
import Link from "next/link";
import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer";
import ScrollToTop from "@/components/scroll-to-top";
import Switcher from "@/components/switcher";
import { getNews } from "@/api/requests";
import Blog from "@/components/blog";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Metadata } from "next";
import { getSeoSettingsByPageName } from "@/api/requests";
import { SeoSetting as SeoSettingType } from "@/types/type";
import Script from "next/script";

export async function generateMetadata(): Promise<Metadata> {
  let seoData: SeoSettingType | null = null;
  try {
    // Используем НОВУЮ функцию для получения SEO-данных для страницы новостей
    // Передаем 'news' как pageName, так как это страница новостей
    seoData = await getSeoSettingsByPageName("news");
  } catch (error) {
    console.error(
      "Error fetching SEO data for news, using defaults:",
      error
    );
    // Просто продолжаем, seoData останется null
  }

  // Определяем значения: из API (из BlogPost) или дефолтные
  const title =
    seoData?.metaTitle || "Новости | статьи центра «Максимум» в Витебске";
  const description =
    seoData?.metaDescription ||
    "Читайте свежие статьи, полезные советы и новости из жизни спортивно-образовательного центра «Максимум» в Витебске. Будьте в курсе событий и достижений!";
  const keywords = seoData?.keywords
    ? seoData.keywords.split(",").filter(Boolean)
    : [
        "Новости Максимум",
        "статьи",
        "новости центра",
        "советы",
        "спорт и образование",
        "Витебск",
        "мероприятия",
        "достижения",
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

  return {
    title,
    description,
    keywords,
    openGraph: {
      title: seoData?.metaTitle || "Новости | Центр «Максимум»", // Используем то же, что и в title
      description:
        seoData?.metaDescription ||
        "Полезные материалы, советы и актуальные новости от спортивно-образовательного центра «Максимум» в Витебске.", // Используем то же, что и в description
      url: `${process.env.NEXT_PUBLIC_API_URL}/news`,
      siteName: "Максимум",
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
      title: seoData?.metaTitle || "Новости | Центр «Максимум»", // Используем то же, что и в title
      description:
        seoData?.metaDescription ||
        "Полезные материалы, советы и актуальные новости от спортивно-образовательного центра «Максимум» в Витебске.", // Используем то же, что и в description
      images: [ogImageUrl],
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_API_URL}/news`,
    },
  };
}

export const revalidate = 600;

type Props = {
  searchParams: Promise<{ [key: string]: string | string | undefined }>;
};

export default async function NewsPage({ searchParams }: Props) {
  const { page } = await searchParams;
  const currentPage = parseInt(page || "1");

  const limit = 2;
  const status = "published";

  const result = await getNews(currentPage, limit, status);

  const blogs = result.items;
  const totalCount = result.total;
  const totalPages = Math.ceil(totalCount / limit);

  // JSON-LD для списка новостей
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Новости | статьи центра «Максимум»",
    description:
      "Читайте свежие статьи, полезные советы и новости из жизни спортивно-образовательного центра «Максимум» в Витебске.",
    url: `${process.env.NEXT_PUBLIC_API_URL}/news`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: blogs.map((news, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "NewsArticle",
          headline: news.title,
          url: `${process.env.NEXT_PUBLIC_API_URL}/news/${news.url}`,
          datePublished: news.date
            ? new Date(news.date).toISOString()
            : undefined,
          author: {
            "@type": "Person",
            name: news.author?.name || "Центр «Максимум»",
          },
          image: news.image
            ? `${process.env.NEXT_PUBLIC_API_URL}/${news.image}`
            : undefined,
        },
      })),
    },
  };

  return (
    <>
      <Script
        type="application/ld+json"
        id="news-collection-schema"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      <Navbar navlight={true} tagline={false} />

      <section
        className="relative table w-full py-32 lg:py-64 bg-no-repeat bg-center bg-cover"
        style={{ backgroundImage: `url('/images/course/4.jpg')` }}
      >
        <div className="absolute inset-0 bg-black opacity-80"></div>
        <div className="container relative">
          <div className="grid ProseMirror grid-cols-1 text-center mt-10">
            <h1 className=" text-white">Новости</h1>
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

      <section id="blogs" className="relative md:py-24 py-16">
        <div className="container relative">
          {/* Blogs */}
          <Blog isBlog={false} link={`/news/`} blogs={blogs} />

          {/* Pagination */}
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-12 grid-cols-1 mt-6">
              <div className="md:col-span-12 text-center">
                <nav>
                  <ul className="inline-flex items-center -space-x-px">
                    <li>
                      {currentPage > 1 ? (
                        <Link
                          href={`/news?page=${currentPage - 1}#news`}
                          className="size-8 inline-flex justify-center items-center mx-1 rounded-full text-slate-400 bg-white hover:text-white shadow-sm hover:bg-violet-600"
                        >
                          <FiChevronLeft
                            className="text-gray-400 text-sm flex-shrink-0 min-w-[0.875rem]"
                            aria-hidden="true"
                          />
                        </Link>
                      ) : (
                        <span className="size-8 inline-flex justify-center items-center mx-1 rounded-full text-gray-300 bg-gray-100 cursor-not-allowed">
                          <FiChevronLeft
                            className="text-gray-400 text-sm flex-shrink-0 min-w-[0.875rem]"
                            aria-hidden="true"
                          />
                        </span>
                      )}
                    </li>
                    {/* Sahifa raqamlari */}
                    {Array.from({ length: totalPages }).map((_, idx) => {
                      const pageNum = idx + 1;
                      return (
                        <li key={pageNum}>
                          <Link
                            href={`/news?page=${pageNum}#news`}
                            className={`size-8 inline-flex justify-center items-center mx-1 rounded-full ${
                              pageNum === currentPage
                                ? "bg-violet-600 text-white"
                                : "bg-white text-slate-400 hover:bg-violet-600 hover:text-white shadow-sm"
                            }`}
                          >
                            {pageNum}
                          </Link>
                        </li>
                      );
                    })}
                    <li>
                      {currentPage < totalPages ? (
                        <Link
                          href={`/news?page=${currentPage + 1}`}
                          className="size-8 inline-flex justify-center items-center mx-1 rounded-full text-slate-400 bg-white hover:text-white shadow-sm hover:bg-violet-600"
                        >
                          <FiChevronRight
                            className="text-gray-400 text-sm flex-shrink-0 min-w-[0.875rem]"
                            aria-hidden="true"
                          />
                        </Link>
                      ) : (
                        <span className="size-8 inline-flex justify-center items-center mx-1 rounded-full text-gray-300 bg-gray-100 cursor-not-allowed">
                          <FiChevronRight
                            className="text-gray-400 text-sm flex-shrink-0 min-w-[0.875rem]"
                            aria-hidden="true"
                          />
                        </span>
                      )}
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <ScrollToTop />
      <Switcher />
    </>
  );
}
