
export interface SeoData {
  pageName: string; // например, 'blog', 'courses', 'news'
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string; // строка с ключевыми словами через запятую
  ogImage?: string; // опционально, если нужно управлять изображением OG
}

export interface GetSeoResponse {
  data: SeoData | null; // API может возвращать null, если данных нет
}