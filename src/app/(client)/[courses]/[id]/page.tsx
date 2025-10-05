import { getAllCoursesPublic, getCourseByName } from "@/api/requests";
import CoursesDetailPage from "@/components/courses/courses-detail";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar/navbar";
import ScrollToTop from "@/components/scroll-to-top";
import Switcher from "@/components/switcher";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";

export async function generateMetadata({
  params,
}: {
  params: paramsType;
}): Promise<Metadata> {
  const { id } = await params;
  if (!id) return {};
  const course = await getCourseByName(id);

  if (!course) return {};

  const imgPath = course.images?.length > 0 ? course.images[0].url : null;
  const imgUrl = imgPath
    ? `${process.env.NEXT_PUBLIC_API_URL}${
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
      canonical: `${process.env.NEXT_PUBLIC_API_URL}/${
        (await params).courses
      }/${id}`,
    },
  };
}

export async function generateStaticParams() {
  const courses = await getAllCoursesPublic({ limit: 1000, page: 1 });

  return courses.items.map((course) => ({
    id: course.url,
    courses:
      course.category && typeof course.category !== "string"
        ? course.category.url
        : "courses",
  }));
}

export const revalidate = 600;

export type paramsType = Promise<{ id: string; courses: string }>;

export default async function Page(props: { params: paramsType }) {
  const { id } = await props.params;

  let course = null;
  try {
    course = await getCourseByName(id);
  } catch (error: any) {
    if (error.response?.status === 404) return notFound();
    throw error;
  }

  const courses = await getAllCoursesPublic();

  // JSON-LD для отдельного курса
  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.name,
    description: course.description,
    provider: {
      "@type": "Organization",
      name: "Спортивно-образовательный центр «Максимум»",
      sameAs: `${process.env.NEXT_PUBLIC_API_URL}`,
      logo: `${process.env.NEXT_PUBLIC_API_URL}/logo.webp`,
    },
    url: `${process.env.NEXT_PUBLIC_API_URL}/${(await props.params).courses}/${
      course.url
    }`,
    image: course.images?.[0]?.url
      ? `${process.env.NEXT_PUBLIC_API_URL}${course.images[0].url}`
      : undefined,
    offers: {
      "@type": "Offer",
      price: course.price || "0",
      priceCurrency: "BYN",
      availability: "https://schema.org/InStock",
    },
    courseMode: "onsite",
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


      <Navbar navlight={true} tagline={false} />
      {course && courses && (
        <CoursesDetailPage course={course} courses={courses.items} />
      )}
      <Footer />
      <ScrollToTop />
      <Switcher />
    </>
  );
}
