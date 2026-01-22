import { getNews, getSeoSettingsByPageName } from "@/api/requests";
import Blog from "@/components/blog";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar/navbar";
import Pagination from "@/components/pagination";
import ScrollToTop from "@/components/scroll-to-top";
import Switcher from "@/components/switcher";
import { env } from "@/lib/env";
import { loadPaginationSearchParams } from "@/lib/search-params";
import { SeoSetting as SeoSettingType } from "@/types/type";
import { Metadata } from "next";
import Script from "next/script";

export async function generateMetadata(): Promise<Metadata> {
  let seoData: SeoSettingType | null = null;
  try {
    // Используем НОВУЮ функцию для получения SEO-данных для страницы новостей
    // Передаем 'news' как pageName, так как это страница новостей
    seoData = await getSeoSettingsByPageName("news");
  } catch (error) {
    console.error("Error fetching SEO data for news, using defaults:", error);
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
      title: seoData?.metaTitle || "Новости | Центр «Максимум»", // Используем то же, что и в title
      description:
        seoData?.metaDescription ||
        "Полезные материалы, советы и актуальные новости от спортивно-образовательного центра «Максимум» в Витебске.", // Используем то же, что и в description
      url: `${env.NEXT_PUBLIC_SITE_URL}/news`,
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
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/news`,
    },
  };
}

export const revalidate = 600;

type Props = {
  searchParams: Promise<{ [key: string]: string | string | undefined }>;
};

export default async function NewsPage({ searchParams }: Props) {
  const { page, limit } = await loadPaginationSearchParams(searchParams);

  const status = "published";

  console.log(page, limit);
  const result = await getNews(page, limit, status);

  const blogs = result.items;
  const totalCount = result.total;

  // JSON-LD для списка новостей
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Новости | статьи центра «Максимум»",
    description:
      "Читайте свежие статьи, полезные советы и новости из жизни спортивно-образовательного центра «Максимум» в Витебске.",
    url: `${env.NEXT_PUBLIC_SITE_URL}/news`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: blogs.map((news, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "NewsArticle",
          headline: news.title,
          url: `${env.NEXT_PUBLIC_SITE_URL}/news/${news.url}`,
          datePublished: news.date
            ? new Date(news.date).toISOString()
            : undefined,
          author: {
            "@type": "Person",
            name: news.author?.name || "Центр «Максимум»",
          },
          image: news.image
            ? `${env.NEXT_PUBLIC_API_URL}/${news.image}`
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

      <Navbar navlight={true} />

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

          <Pagination
            pathname="/news"
            searchParams={searchParams}
            totalCount={totalCount}
          />
        </div>
      </section>

      <Footer />

      <ScrollToTop />
      <Switcher />
    </>
  );
}
