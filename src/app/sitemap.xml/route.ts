import { getAllCoursesPublic } from "@/api/requests";
import { getAllBlogsPublic } from "@/api/requests";
import { getAllNewsPublic } from "@/api/requests";
import { getServerSideSitemap, ISitemapField } from "next-sitemap";

export async function GET() {
  const Url = process.env.NEXT_PUBLIC_API_URL!;
  
  // Получите все курсы
  const allCourses = await getAllCoursesPublic({ limit: 1000, page: 1 });
  
  // Получите все блоги
  const allBlogs = await getAllBlogsPublic({ limit: 1000, page: 1 });
  
  // Получите все новости
  const allNews = await getAllNewsPublic({ limit: 1000, page: 1 });

  // Генерация URL для курсов
  const Courses: ISitemapField[] = allCourses.items.flatMap(
    ({ createdAt, category, url }) => {
      const lastmod = new Date(createdAt).toISOString();

      const categoryUrl = typeof category === 'object' ? category?.url ?? '' : (category ?? '');
      const loc = `${Url}/${categoryUrl}/${url ?? ''}`;

      return [
        {
          loc,
          lastmod,
          changefreq: "monthly",
          priority: "0.9" as any, 
        },
      ];
    },
  );

  // Генерация URL для блогов
  const Blogs: ISitemapField[] = allBlogs.items.flatMap(
    ({ date, url }) => {
      const lastmod = date ? new Date(date).toISOString() : new Date().toISOString();
      const loc = `${Url}/blog/${url}`;

      return [
        {
          loc,
          lastmod,
          changefreq: "weekly",
          priority: "0.8" as any, 
        },
      ];
    },
  );

  // Генерация URL для новостей
  const News: ISitemapField[] = allNews.items.flatMap(
    ({ date, url }) => {
      const lastmod = date ? new Date(date).toISOString() : new Date().toISOString();
      const loc = `${Url}/news/${url}`;

      return [
        {
          loc,
          lastmod,
          changefreq: "daily",
          priority: "0.8" as any,
        },
      ];
    },
  );

  const routes: ISitemapField[] = [
    {
      loc: `${Url}/`,
      lastmod: new Date().toISOString(),
      changefreq: "weekly",
      priority: "0.9" as any,
    },
    {
      loc: `${Url}/courses`,
      lastmod: new Date().toISOString(),
      changefreq: "weekly",
      priority: "1.0" as any,
    },
    {
      loc: `${Url}/blog`,
      lastmod: new Date().toISOString(),
      changefreq: "weekly",
      priority: "0.9" as any,
    },
    {
      loc: `${Url}/news`,
      lastmod: new Date().toISOString(),
      changefreq: "daily",
      priority: "0.9" as any,
    },
    {
      loc: `${Url}/about`,
      lastmod: new Date().toISOString(),
      changefreq: "monthly",
      priority: "0.6" as any,
    },
    {
      loc: `${Url}/contact`,
      lastmod: new Date().toISOString(),
      changefreq: "monthly",
      priority: "0.6" as any,
    },
  ];

  return getServerSideSitemap([...routes, ...Courses, ...Blogs, ...News]);
}