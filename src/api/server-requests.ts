// Серверные версии API функций для использования в Server Components
import { serverGet } from "@/lib/server-api";
import { NewsItem, Blog } from "@/types/type";

export async function getNewsByUrlServer(url: string): Promise<NewsItem> {
  try {
    return await serverGet(`/api/news/url/${url}`, { revalidate: 600 }); // 10 минут
  } catch (error: any) {
    console.error(`Error fetching news by URL '${url}':`, error);
    
    if (error.message.includes('404') || error.message.includes('HTTP error! status: 404')) {
      throw new Error('News not found');
    }
    
    throw error; // Пробрасываем другие ошибки
  }
}

export async function getBlogByUrlServer(url: string): Promise<Blog> {
  try {
    return await serverGet(`/api/blog/url/${url}`, { revalidate: 600 }); // 10 минут
  } catch (error: any) {
    console.error(`Error fetching blog by URL '${url}':`, error);
    
    if (error.message.includes('404') || error.message.includes('HTTP error! status: 404')) {
      throw new Error('Blog not found');
    }
    
    throw error; // Пробрасываем другие ошибки
  }
}

export async function getNewsServer(
  currentPage: number,
  limit: number,
  status: string,
  categoryName?: string,
  excludeBlogId?: number
): Promise<{ items: NewsItem[]; total: number }> {
  const params = new URLSearchParams({
    page: String(currentPage),
    limit: String(limit),
    status,
  });

  if (categoryName) {
    params.append("categoryName", categoryName);
  }

  if (excludeBlogId !== undefined) {
    params.append("excludeBlogId", String(excludeBlogId));
  }

  return await serverGet(`/api/news?${params.toString()}`, { revalidate: 300 }); // 5 минут
}

export async function getBlogsServer(
  currentPage: number,
  limit: number,
  status: string,
  categoryName?: string,
  excludeBlogId?: number
): Promise<{ items: Blog[]; total: number }> {
  const params = new URLSearchParams({
    page: String(currentPage),
    limit: String(limit),
    status,
  });

  if (categoryName) {
    params.append("categoryName", categoryName);
  }

  if (excludeBlogId !== undefined) {
    params.append("excludeBlogId", String(excludeBlogId));
  }

  return await serverGet(`/api/blog?${params.toString()}`, { revalidate: 300 }); // 5 минут
}

export async function getSeoSettingsByPageNameServer(pageName: string) {
  try {
    return await serverGet(`/api/seo/${pageName}`, { revalidate: 3600 }); // 1 час
  } catch (error: any) {
    console.error(`Error fetching SEO data for page '${pageName}':`, error);
    
    // Обрабатываем различные типы ошибок
    if (error.message.includes('404') || error.message.includes('HTTP error! status: 404')) {
      console.warn(`SEO data for page '${pageName}' not found (404).`);
      return null;
    }
    
    if (error.message.includes('Empty response') || error.message.includes('Invalid JSON')) {
      console.warn(`Invalid SEO response for page '${pageName}', using defaults.`);
      return null;
    }
    
    // Для других ошибок тоже возвращаем null, чтобы не ломать сборку
    console.warn(`SEO fetch failed for page '${pageName}', using defaults.`);
    return null;
  }
}