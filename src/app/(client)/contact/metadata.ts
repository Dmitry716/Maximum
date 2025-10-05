import { getSeoSettingsByPageName } from '@/api/requests';
import { SeoSetting as SeoSettingType } from '@/types/type';
import { Metadata } from 'next';

// Удаляем неиспользуемый тип
// type ContactFormSchemaFormValues = z.infer<typeof contactFormSchemaClient>

export async function generateMetadata(): Promise<Metadata> {
  let seoData: SeoSettingType | null = null;
  try {
    // Используем НОВУЮ функцию для получения SEO-данных для общей страницы
    // Передаем 'home' как pageName, так как это главная страница
    seoData = await getSeoSettingsByPageName('contact'); 
  } catch (error) {
    console.error("Error fetching SEO data for contact, using defaults:", error);
    // Просто продолжаем, seoData останется null
  }

  // Определяем значения: из API (из BlogPost) или дефолтные
  const title = seoData?.metaTitle || "Контакты | Спортивно-образовательный центр «Максимум» в Витебске";
  const description = seoData?.metaDescription || "Свяжитесь с нами по телефону, электронной почте или посетите наш центр в Витебске. Мы всегда рады помочь!";
  const keywords = seoData?.keywords ? seoData.keywords.split(",").filter(Boolean) : [
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
      title: seoData?.metaTitle || "Контакты | Спортивно-образовательный центр «Максимум» в Витебске", // Используем то же, что и в title
      description: seoData?.metaDescription || "Свяжитесь с нами по телефону, электронной почте или посетите наш центр в Витебске.", // Используем то же, что и в description
      type: "website",
      url: `${process.env.NEXT_PUBLIC_API_URL}/contact`,
      locale: "ru_RU",
    },
    twitter: {
      card: "summary_large_image",
      title: seoData?.metaTitle || "Контакты | Спортивно-образовательный центр «Максимум» в Витебске", // Используем то же, что и в title
      description: seoData?.metaDescription || "Свяжитесь с нами по телефону, электронной почте или посетите наш центр в Витебске.", // Используем то же, что и в description
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_API_URL}/contact`,
    },
  }
}