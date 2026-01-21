"use client";

import { getAllCoursesPublic } from "@/api/requests";
import { coursesSearchParamsMap } from "@/lib/coursesSearchParams";
import { Course } from "@/types/type";
import { useQuery } from "@tanstack/react-query";
import { useQueryStates } from "nuqs";
import { useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import CoursesNavigation from "./courses-navigation";
import CoursesOne from "./courses-one";

export default function Courses({
  ctg,
  categories,
  ages,
}: {
  ctg: string;
  categories: any;
  ages: any;
}) {
  const [searchParams, setSearchParams] = useQueryStates(
    coursesSearchParamsMap,
    {
      scroll: true,
    },
  );
  const { data: courses, isLoading } = useQuery({
    queryKey: ["courses", searchParams],
    queryFn: () => {
      let mappedCategories = [];
      if (searchParams.categories.includes("all")) {
        mappedCategories = [];
      } else {
        mappedCategories = searchParams.categories.map(
          (catUrl: string) =>
            categories.find(
              (cat: { url: string; id: number }) => cat.url === catUrl,
            ).id,
        );
      }
      const search = {
        ...searchParams,
        categories: mappedCategories,
      };
      return getAllCoursesPublic(search);
    },
    staleTime: 1000 * 60 * 5,
    retry: 3,
    placeholderData: (previousData) => previousData,
  });

  useEffect(() => {
    const findCtg = categories?.find((item: any) => item.url == ctg)?.url;
    if (findCtg) {
      setSearchParams({ categories: [findCtg] });
    }
  }, [categories]);

  if (isLoading || !courses) return <div>Loading...</div>;

  const totalPages = Math.ceil(courses.total / courses.limit);

  return (
    <div id="courses-list" className="lg:col-span-8 md:order-1 order-2">
      {categories && ages && (
        <CoursesNavigation
          ages={ages as string[]}
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

      {totalPages > 1 && (
        <div className="grid md:grid-cols-12 grid-cols-1 mt-6">
          <div className="md:col-span-12 text-center">
            <nav>
              <ul className="inline-flex items-center -space-x-px">
                {/* Prev */}
                <li>
                  <button
                    onClick={() => {
                      setSearchParams({
                        page: Math.max(+(searchParams.page ?? "1") - 1, 1),
                      });
                    }}
                    disabled={+(searchParams.page ?? "1") === 1}
                    className="size-8 inline-flex justify-center items-center mx-1 rounded-full text-slate-400 bg-white dark:bg-slate-900 hover:text-white shadow-sm shadow-slate-100 dark:shadow-slate-800 hover:border-violet-600 dark:hover:border-violet-600 hover:bg-violet-600 dark:hover:bg-violet-600 disabled:opacity-30"
                  >
                    <FiChevronLeft
                      className="text-gray-400 text-sm flex-shrink-0 min-w-[0.875rem]"
                      aria-hidden="true"
                    />
                  </button>
                </li>

                {/* Page numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <li key={p}>
                      <button
                        onClick={() => {
                          setSearchParams({
                            page: p,
                          });
                        }}
                        className={`size-8 inline-flex justify-center items-center mx-1 rounded-full ${
                          (searchParams.page ?? 1) === p
                            ? "bg-violet-600 text-white"
                            : "text-slate-400 bg-white dark:bg-slate-900 hover:text-white hover:bg-violet-600"
                        }`}
                      >
                        {p}
                      </button>
                    </li>
                  ),
                )}

                {/* Next */}
                <li>
                  <button
                    onClick={() => {
                      setSearchParams({
                        page: Math.min(
                          +(searchParams.page ?? 0) + 1,
                          totalPages,
                        ),
                      });
                    }}
                    disabled={+(searchParams.page ?? "1") === totalPages}
                    className="size-8 inline-flex justify-center items-center mx-1 rounded-full text-slate-400 bg-white dark:bg-slate-900 hover:text-white shadow-sm shadow-slate-100 dark:shadow-slate-800 hover:border-violet-600 dark:hover:border-violet-600 hover:bg-violet-600 dark:hover:bg-violet-600 disabled:opacity-30"
                  >
                    <FiChevronRight
                      className="text-gray-400 text-sm flex-shrink-0 min-w-[0.875rem]"
                      aria-hidden="true"
                    />
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
