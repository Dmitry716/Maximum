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
    const result = await serverGet(`/api/blog/url/${url}`, { revalidate: 600 }); // 10 минут
    
    // Дополнительная проверка на случай пустого или некорректного ответа
    if (!result || typeof result !== 'object') {
      throw new Error('Invalid blog data received');
    }
    
    return result;
  } catch (error: any) {
    console.error(`Error fetching blog by URL '${url}':`, error);
    console.error(`Full URL being called: ${process.env.NEXT_PUBLIC_API_URL}/api/blog/url/${url}`);
    
    // Обрабатываем различные типы ошибок
    if (error.message.includes('404') || 
        error.message.includes('HTTP error! status: 404') ||
        error.message.includes('Blog not found')) {
      throw new Error('Blog not found');
    }
    
    if (error.message.includes('500') || error.message.includes('HTTP error! status: 500')) {
      console.error(`Server error (500) when fetching blog '${url}'`);
      throw new Error('Server error while fetching blog');
    }
    
    if (error.message.includes('Empty response') || 
        error.message.includes('Invalid JSON') ||
        error.message.includes('Invalid blog data')) {
      console.error(`Invalid response when fetching blog '${url}'`);
      throw new Error('Invalid blog data received');
    }
    
    // Сетевые ошибки
    if (error.message.includes('fetch failed') || 
        error.message.includes('network') || 
        error.message.includes('ECONNREFUSED')) {
      console.error(`Network error when fetching blog '${url}'`);
      throw new Error('Network error while fetching blog');
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
    // Проверяем доступность API во время сборки
    if (!process.env.NEXT_PUBLIC_API_URL) {
      console.warn(`API URL not configured, skipping SEO data for page '${pageName}'`);
      return null;
    }

    return await serverGet(`/api/seo/${pageName}`, { revalidate: 3600 }); // 1 час
  } catch (error: any) {
    // Логируем только в development режиме для уменьшения шума в сборке
    if (process.env.NODE_ENV === 'development') {
      console.error(`Error fetching SEO data for page '${pageName}':`, error);
    }
    
    // Обрабатываем различные типы ошибок
    if (error.message.includes('404') || error.message.includes('HTTP error! status: 404')) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`SEO data for page '${pageName}' not found (404).`);
      }
      return null;
    }
    
    if (error.message.includes('Empty response') || error.message.includes('Invalid JSON')) {
      console.warn(`Invalid SEO response for page '${pageName}', using defaults.`);
      return null;
    }

    // Особая обработка для сетевых ошибок во время сборки
    if (error.message.includes('fetch failed') || error.message.includes('ECONNREFUSED') || error.message.includes('network')) {
      console.warn(`SEO API not available during build for page '${pageName}', using defaults.`);
      return null;
    }
    
    // Для других ошибок тоже возвращаем null, чтобы не ломать сборку
    if (process.env.NODE_ENV === 'development') {
      console.warn(`SEO fetch failed for page '${pageName}', using defaults.`);
    }
    return null;
  }
}