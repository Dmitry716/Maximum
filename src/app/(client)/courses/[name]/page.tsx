import { getAllCoursesPublic, getCourseByName } from "@/api/requests";
import CoursesDetailPage from "@/components/courses/courses-detail";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar/navbar";
import { ScrollIosHtml } from "@/components/scroll-ios-html";
import ScrollToTop from "@/components/scroll-to-top";
import Switcher from "@/components/switcher";
import { env } from "@/lib/env";
import { QueryClient } from "@tanstack/react-query";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import { Suspense } from "react";

export async function generateMetadata({
  params,
}: {
  params: paramsType;
}): Promise<Metadata> {
  const { name: id } = await params;
  if (!id) return {};
  const course = await getCourseByName(id);

  if (!course) return {};

  const imgPath = course.images?.length > 0 ? course.images[0].url : null;
  const imgUrl = imgPath
    ? `${env.NEXT_PUBLIC_API_URL}${
        imgPath.startsWith("/") ? "" : "/"
      }${imgPath}`
    : null;

  return {
    title: course.metaTitle || course.name,
    description: course.metaDescription || course.description,
    keywords: course.keywords?.split(",") || [],
    openGraph: {
      title: course.metaTitle || course.name,
      description: course.metaDescription || course.description,
      images: imgUrl ? [imgUrl] : [],
      type: "article",
      publishedTime: course.createdAt
        ? new Date(course.createdAt).toISOString()
        : undefined,
      modifiedTime: course.updatedAt
        ? new Date(course.updatedAt).toISOString()
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: course.metaTitle || course.name,
      description: course.metaDescription || course.description,
      images: imgUrl ? [imgUrl] : [],
    },
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/courses/${id}`,
    },
  };
}

export async function generateStaticParams() {
  try {
    const courses = await getAllCoursesPublic();

    return courses.items
      .filter(
        (course) =>
          course.url &&
          course.category &&
          typeof course.category !== "string" &&
          course.category.url &&
          course.category.url !== "courses",
      )
      .map((course) => ({
        name: course.url,
        courses: (course.category as any)?.url,
      }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return []; // Возвращаем пустой массив в случае ошибки
  }
}

export const revalidate = 600;

export type paramsType = Promise<{ name: string }>;

export default async function Page(props: { params: paramsType }) {
  const { name } = await props.params;

  const queryClient = new QueryClient();

  const [coursesResult, courseResult] = await Promise.allSettled([
    queryClient.fetchQuery({
      queryKey: ["courses", name],
      queryFn: () => getAllCoursesPublic({ limit: 4 }),
    }),
    queryClient.fetchQuery({
      queryKey: ["course", name],
      queryFn: () => getCourseByName(name),
    }),
  ]);

  let course = null;
  if (courseResult.status === "fulfilled") {
    course = courseResult.value;
  } else {
    if (courseResult.reason.status === 404) {
      return notFound();
    }
    // в остальных случаях тоже 404, чтобы не ломать сервер
    return notFound();
  }

  const courses =
    coursesResult.status === "fulfilled" ? coursesResult.value : { items: [] };

  // JSON-LD для отдельного курса
  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.name,
    description: course.description,
    provider: {
      "@type": "Organization",
      name: "Спортивно-образовательный центр «Максимум»",
      sameAs: `${env.NEXT_PUBLIC_SITE_URL}`,
      logo: `${env.NEXT_PUBLIC_SITE_URL}/logo.webp`,
    },
    url: `${env.NEXT_PUBLIC_SITE_URL}/courses/${course.url}`,
    image: course.images?.[0]?.url
      ? `${env.NEXT_PUBLIC_API_URL}${course.images[0].url}`
      : undefined,
    offers: {
      "@type": "Offer",
      price: course.price || "0",
      priceCurrency: "BYN",
      availability: "https://schema.org/InStock",
    },
    about:
      course.category && typeof course.category === "object"
        ? course.category.name
        : undefined,
  };

  return (
    <>
      <Script
        type="application/ld+json"
        id="course-schema"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />

      <Suspense>
        <ScrollIosHtml />
      </Suspense>
      <Navbar navlight={true} />
      {course && courses && (
        <CoursesDetailPage course={course} courses={courses.items} />
      )}
      <Footer />
      <ScrollToTop />
      <Switcher />
    </>
  );
}
