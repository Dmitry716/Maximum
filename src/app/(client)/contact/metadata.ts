import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Контакты | Спортивно-образовательный центр «Максимум» в Витебске",
    description: "Свяжитесь с нами по телефону, электронной почте или посетите наш центр в Витебске. Мы всегда рады помочь!",
    keywords: ["контакты", "центр Максимум", "Витебск", "телефон", "адрес", "электронная почта"],
    openGraph: {
      title: "Контакты | Спортивно-образовательный центр «Максимум» в Витебске",
      description: "Свяжитесь с нами по телефону, электронной почте или посетите наш центр в Витебске.",
      type: "website",
      url: `${process.env.NEXT_PUBLIC_API_URL}/contact`,
      locale: "ru_RU",
    },
    twitter: {
      card: "summary_large_image",
      title: "Контакты | Спортивно-образовательный центр «Максимум» в Витебске",
      description: "Свяжитесь с нами по телефону, электронной почте или посетите наш центр в Витебске.",
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_API_URL}/contact`,
    },
  };
}