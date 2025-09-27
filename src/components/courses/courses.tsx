"use client"

import CoursesOne from "./courses-one"
import CoursesSidebar from "./courses-sidebar"
import { getAllCoursesPublic } from "@/api/requests";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Course, CourseQueryParams } from "@/types/type";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useIsMobile } from "../ui/use-mobile";

export default function Courses({ ctg, categories, ages }: { ctg: string, categories: any, ages: any }) {
  const [filters, setFilters] = useState<CourseQueryParams>({
    page: 1,
    limit: 12
  });

  const isMobile = useIsMobile();

  const { data: courses, isLoading } = useQuery({
    queryKey: ['courses', filters],
    queryFn: () => getAllCoursesPublic(filters),
    staleTime: 1000 * 60 * 5,
    retry: 3,
    placeholderData: (previousData) => previousData,
  });

  useEffect(() => {
    const findCtg = categories?.find((item: any) => item.url == ctg)?.id
    if (findCtg) setFilters((prev: any) => ({ ...prev, categories: [findCtg] }))
  }, [categories]);

  if (isLoading || !courses) return <div>Loading...</div>;

  const totalPages = Math.ceil(courses.total / courses.limit);

  return (
    <div className="grid lg:grid-cols-12 md:grid-cols-2 grid-cols-1 gap-6">
      <div id="courses-list" className="lg:col-span-8 md:order-1 order-2">
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-6">
          {courses.items.map((item: Course, index: number) => {
            return (
              <CoursesOne item={item} key={index} />
            )
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
                        setFilters((prev: any) => ({ ...prev, page: Math.max(prev.page - 1, 1) }))
                        setTimeout(() => {
                          (document.documentElement || document.body).scrollTo({ top: isMobile ? 270 : 100, behavior: 'smooth' });
                        }, 50);
                      }}
                      disabled={filters.page === 1}
                      className="size-8 inline-flex justify-center items-center mx-1 rounded-full text-slate-400 bg-white dark:bg-slate-900 hover:text-white shadow-sm shadow-slate-100 dark:shadow-slate-800 hover:border-violet-600 dark:hover:border-violet-600 hover:bg-violet-600 dark:hover:bg-violet-600 disabled:opacity-30"
                    >
                      <FiChevronLeft
                        className="text-gray-400 text-sm flex-shrink-0 min-w-[0.875rem]"
                        aria-hidden="true"
                      />
                    </button>
                  </li>

                  {/* Page numbers */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <li key={p}>
                      <button
                        onClick={() => {
                          setFilters((prev) => ({ ...prev, page: p }))
                          setTimeout(() => {
                            (document.documentElement || document.body).scrollTo({ top: isMobile ? 270 : 100, behavior: 'smooth' });
                          }, 50);
                        }}
                        className={`size-8 inline-flex justify-center items-center mx-1 rounded-full ${filters.page === p
                          ? 'bg-violet-600 text-white'
                          : 'text-slate-400 bg-white dark:bg-slate-900 hover:text-white hover:bg-violet-600'
                          }`}
                      >
                        {p}
                      </button>
                    </li>
                  ))}

                  {/* Next */}
                  <li>
                    <button
                      onClick={() => {
                        setFilters((prev: any) => ({ ...prev, page: Math.min(prev.page + 1, totalPages) }))
                        setTimeout(() => {
                          (document.documentElement || document.body).scrollTo({ top: isMobile ? 270 : 100, behavior: 'smooth' });
                        }, 50);
                      }}
                      disabled={filters.page === totalPages}
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

      <div className="lg:col-span-4 md:order-2 order-1">
        {categories && ages && <CoursesSidebar ages={ages as string[]} filters={filters} setFilters={setFilters} categories={categories} />}

      </div>
    </div>
  )
}