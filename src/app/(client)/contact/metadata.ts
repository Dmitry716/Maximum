import { getSeoByPageName } from '@/api/requests';
import { Blog as BlogType } from '@/types/type'; // Используем тип Blog
import { Metadata } from 'next';

// Удаляем неиспользуемый тип
// type ContactFormSchemaFormValues = z.infer<typeof contactFormSchemaClient>

export async function generateMetadata(): Promise<Metadata> {
  let seoBlogPost: BlogType | null = null;
  try {
    // Используем обновленный метод для получения SEO-данных для общей страницы
    seoBlogPost = await getSeoByPageName('contact');
  } catch (error) {
    console.error("Error fetching SEO data for /contact, using defaults:", error);
    // Просто продолжаем, seoBlogPost останется null
  }

  // Определяем значения: из API (из BlogPost) или дефолтные
  const title = seoBlogPost?.metaTitle || "Контакты | Спортивно-образовательный центр «Максимум» в Витебске";
  const description = seoBlogPost?.metaDescription || "Свяжитесь с нами по телефону, электронной почте или посетите наш центр в Витебске. Мы всегда рады помочь!";
  const keywords = seoBlogPost?.keywords ? seoBlogPost.keywords.split(",").filter(Boolean) : [
    "контакты",
    "центр Максимум",
    "Витебск",
    "телефон",
    "адрес",
    "электронная почта"
  ];

  return {
    title,
    description,
    keywords,
    openGraph: {
      title: seoBlogPost?.metaTitle || "Контакты | Спортивно-образовательный центр «Максимум» в Витебске", // Используем то же, что и в title
      description: seoBlogPost?.metaDescription || "Свяжитесь с нами по телефону, электронной почте или посетите наш центр в Витебске.", // Используем то же, что и в description
      type: "website",
      url: `${process.env.NEXT_PUBLIC_API_URL}/contact`,
      locale: "ru_RU",
    },
    twitter: {
      card: "summary_large_image",
      title: seoBlogPost?.metaTitle || "Контакты | Спортивно-образовательный центр «Максимум» в Витебске", // Используем то же, что и в title
      description: seoBlogPost?.metaDescription || "Свяжитесь с нами по телефону, электронной почте или посетите наш центр в Витебске.", // Используем то же, что и в description
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_API_URL}/contact`,
    },
  }
}