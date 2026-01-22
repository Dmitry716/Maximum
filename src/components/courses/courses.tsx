"use client";

import { getAllCoursesPublic } from "@/api/requests";
import { coursesSearchParamsParserMap } from "@/lib/search-params";
import { Course } from "@/types/type";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useQueryStates } from "nuqs";
import CoursesNavigation from "./courses-navigation";
import CoursesOne from "./courses-one";

type CoursesProps = {
  categories: any;
};

export default function Courses(params: CoursesProps) {
  const { categories } = params;

  const [searchParams, setSearchParams] = useQueryStates(
    coursesSearchParamsParserMap,
    {
      scroll: true,
    },
  );

  const { data: courses } = useSuspenseQuery({
    queryKey: ["courses", searchParams],
    queryFn: () => getAllCoursesPublic(searchParams),
    staleTime: 1000 * 60 * 5,
    retry: 3,
  });

  const totalPages = Math.ceil(courses.total / courses.limit);

  return (
    <div id="courses-list" className="lg:col-span-8 md:order-1 order-2">
      {categories && (
        <CoursesNavigation
          searchParams={searchParams}
          setSearchParams={setSearchParams}
          categories={categories}
        />
      )}
      <div className="grid lg:grid-cols-3 grid-cols-1 gap-6">
        {courses.items.map((item: Course, index: number) => {
          return <CoursesOne item={item} key={index} />;
        })}
      </div>
    </div>
  );
}
