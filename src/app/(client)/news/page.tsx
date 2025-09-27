import React from 'react'
import Link from 'next/link';
import Navbar from '@/components/navbar/navbar'
import Footer from '@/components/footer';
import ScrollToTop from '@/components/scroll-to-top';
import Switcher from '@/components/switcher';
import { getNews } from '@/api/requests';
import Blog from '@/components/blog';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Metadata } from 'next';

type Props = {
  searchParams: Promise<{ [key: string]: string | string | undefined }>
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Новости | статьи центра «Максимум» в Витебске",
    description: "Читайте свежие статьи, полезные советы и новости из жизни спортивно-образовательного центра «Максимум» в Витебске. Будьте в курсе событий и достижений!",
    keywords: ["Новости Максимум", "статьи", "новости центра", "советы", "спорт и образование", "Витебск", "мероприятия", "достижения"],
    openGraph: {
      title: "Новости | Центр «Максимум»",
      description: "Полезные материалы, советы и актуальные новости от спортивно-образовательного центра «Максимум» в Витебске.",
      url: `${process.env.NEXT_PUBLIC_API_URL}/news`,
      siteName: "Максимум",
      type: "website",
      locale: "ru_RU",
    },
    twitter: {
      card: "summary_large_image",
      title: "Новости | Центр «Максимум»",
      description: "Полезные материалы, советы и актуальные новости от спортивно-образовательного центра «Максимум» в Витебске.",
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_API_URL}/news`,
    },
  };
}

export const revalidate = 600

export default async function NewsPage({ searchParams }: Props) {
  const { page } = await searchParams
  const currentPage = parseInt(page || '1');

  const limit = 2;
  const status = 'published';

  const result = await getNews(currentPage, limit, status);

  const blogs = result.items;
  const totalCount = result.total;
  const totalPages = Math.ceil(totalCount / limit);

  return (
    <>
      <Navbar navlight={true} tagline={false} />

      <section className="relative table w-full py-32 lg:py-64 bg-no-repeat bg-center bg-cover" style={{ backgroundImage: `url('/images/course/4.jpg')` }}>
        <div className="absolute inset-0 bg-black opacity-80"></div>
        <div className="container relative">
          <div className="grid ProseMirror grid-cols-1 text-center mt-10">
            <h1 className=" text-white">Новости</h1>
          </div>
        </div>
      </section>
      <div className="relative">
        <div className="shape overflow-hidden z-1 text-white dark:text-slate-900">
          <svg viewBox="0 0 2880 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 48H1437.5H2880V0H2160C1442.5 52 720 0 720 0H0V48Z" fill="currentColor"></path>
          </svg>
        </div>
      </div>

      <section id='blogs' className="relative md:py-24 py-16">
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
                            className={`size-8 inline-flex justify-center items-center mx-1 rounded-full ${pageNum === currentPage
                              ? 'bg-violet-600 text-white'
                              : 'bg-white text-slate-400 hover:bg-violet-600 hover:text-white shadow-sm'
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
  )
}
