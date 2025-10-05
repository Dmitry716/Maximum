import React from "react";
import Image from "next/image";
import Navbar from "@/components/navbar/navbar";
import BlogsSidebar from "@/components/blog-sidebar";
import Blog from "@/components/blog";
import Footer from "@/components/footer";
import ScrollToTop from "@/components/scroll-to-top";
import Switcher from "@/components/switcher";
import { getNews, getNewsByUrl } from "@/api/requests";
import { NewsItem } from "@/types/type";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Metadata } from "next";
import { RenderNovel } from "@/components/render-novel";
import { notFound } from "next/navigation";
import Script from "next/script";

export async function generateMetadata({
  params,
}: {
  params: paramsType;
}): Promise<Metadata> {
  const { id } = await params;
  if (!id) return {};
  const news = await getNewsByUrl(id);

  if (!news) return {};

  const imgPath = news.image ? news.image : null;
  const imgUrl = imgPath
    ? `${process.env.NEXT_PUBLIC_API_URL}/${imgPath}`
    : null;

  return {
    title: news.metaTitle || news.title,
    description: news.metaDescription || news.title,
    keywords: news.keywords?.split(",").filter(Boolean) || [],
    openGraph: {
      title: news.metaTitle || news.title,
      description: news.metaDescription || news.title,
      images: imgUrl ? [imgUrl] : [],
      type: "article",
      publishedTime: news.date ? new Date(news.date).toISOString() : undefined,
      modifiedTime: news.updatedAt
        ? new Date(news.updatedAt).toISOString()
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: news.metaTitle || news.title,
      description: news.metaDescription || news.title,
      images: imgUrl ? [imgUrl] : [],
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_API_URL}/news/${id}`,
    },
  };
}

export async function generateStaticParams() {
  const blogs = (await getNews(1, 1000, "published")) as {
    items: NewsItem[];
    total: number;
  };

  return blogs.items.map((blog) => ({
    id: blog.url,
  }));
}

export const revalidate = 600;

export type paramsType = Promise<{ id: string }>;

export default async function Page({ params }: { params: paramsType }) {
  const { id } = await params;

  let blog = null;

  try {
    blog = await getNewsByUrl(id);
  } catch (error: any) {
    if (error.response?.status === 404) return notFound();
    throw error;
  }

  const relatedPosts = (await getNews(
    1,
    3,
    "published",
    blog.category,
    blog.id
  )) as { items: NewsItem[]; total: number };

  const latestPosts = (await getNews(1, 5, "published")) as {
    items: NewsItem[];
    total: number;
  };

  // JSON-LD для отдельной новости
  const newsArticleSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${process.env.NEXT_PUBLIC_API_URL}/news/${blog.url}`,
    },
    headline: blog.title,
    description: blog.metaDescription || blog.title,
    datePublished: blog.date ? new Date(blog.date).toISOString() : undefined,
    dateModified: blog.updatedAt
      ? new Date(blog.updatedAt).toISOString()
      : undefined,
    author: {
      "@type": "Person",
      name: blog.author?.name || "Центр «Максимум»",
    },
    publisher: {
      "@type": "Organization",
      name: "Спортивно-образовательный центр «Максимум»",
      logo: {
        "@type": "ImageObject",
        url: `${process.env.NEXT_PUBLIC_API_URL}/logo.webp`,
      },
    },
    image: blog.image
      ? `${process.env.NEXT_PUBLIC_API_URL}/${blog.image}`
      : undefined,
  };

  return (
    <>
      <Script
        type="application/ld+json"
        id="news-article-schema"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(newsArticleSchema) }}
      />

      <Navbar navlight={true} tagline={false} />

      <section
        className="relative table w-full py-32 lg:py-44 bg-no-repeat bg-center bg-cover"
        style={{ backgroundImage: `url('/images/bg/3.jpg')` }}
      >
        <div className="absolute inset-0 bg-black opacity-80"></div>
        <div className="container relative">
          <div className="grid ProseMirror grid-cols-1 text-center mt-10">
            <h1 className="text-white mb-3">{blog.title}</h1>

            <ul className="list-none mt-6">
              {/* {blog.author && <li className="inline-block text-white/50 mx-5"> <span className="text-white block">Автор:</span> <span className="block">{blog.author.name}</span></li>} */}
              <li className="inline-block text-white/50 mx-5">
                {" "}
                <span className="text-white block">Дата:</span>{" "}
                <span className="block">
                  {format(blog.date, "d MMMM yyyy", { locale: ru })}
                </span>
              </li>
              {/* <li className="inline-block text-white/50 mx-5"> <span className="text-white block">Время:</span> <span className="block"><ReadingTime content={blog.content} /></span></li> */}
            </ul>
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

      <section className="relative md:py-24 py-16">
        <div className="container relative">
          <div className="grid lg:grid-cols-12 md:grid-cols-2 grid-cols-1 gap-6">
            <div className="lg:col-span-8 md:order-1 order-2">
              <div className="relative lg:p-6 md:p-4 p-2 overflow-hidden rounded-xl shadow dark:shadow-gray-800">
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_URL}/${blog?.image}`}
                  width={0}
                  height={0}
                  sizes="100vw"
                  style={{ width: "100%", height: "auto" }}
                  alt=""
                />
                {blog?.content && <RenderNovel contentFromDB={blog?.content} />}
              </div>
            </div>

            {latestPosts.items.filter((post) => post.id !== blog.id).length >
              0 && (
              <div className="lg:col-span-4 md:order-2 order-1">
                {latestPosts && (
                  <BlogsSidebar
                    title={"Недавние посты"}
                    blogRecentPost={latestPosts.items.filter(
                      (post) => post.id !== blog.id
                    )}
                  />
                )}
              </div>
            )}
          </div>
        </div>

        {relatedPosts?.items &&
          relatedPosts?.items?.filter((post) => post.id !== blog.id).length >
            0 && (
            <div className="container relative md:mt-24 mt-16">
              <div className="grid grid-cols-1 pb-6 text-center">
                <h4 className="mb-6 md:text-3xl text-2xl md:leading-normal leading-normal font-semibold">
                  Связанные новости
                </h4>

                <p className="text-slate-400 max-w-xl mx-auto">
                  Откройте для себя мир знаний и возможностей с нашей
                  образовательной онлайн-платформой и начните новую карьеру.
                </p>
              </div>
              <Blog isBlog={false} link={`/news/`} blogs={relatedPosts.items} />
            </div>
          )}
      </section>

      <Footer />
      <ScrollToTop />
      <Switcher />
    </>
  );
}
