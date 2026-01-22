import {
  loadPaginationSearchParams,
  paginationSerialize,
} from "@/lib/search-params";
import Link from "next/link";
import { SearchParams } from "nuqs/server";
import { FunctionComponent } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface PaginationProps {
  pathname: string;
  searchParams: Promise<SearchParams>;
  totalCount: number;
}

const Pagination: FunctionComponent<PaginationProps> = async (params) => {
  const { pathname, searchParams, totalCount } = params;
  const { page, limit } = await loadPaginationSearchParams(searchParams);

  const totalPages = Math.ceil(totalCount / limit);

  const getQueryString = (page: number) => {
    return `${pathname}${paginationSerialize({ page, limit })}`;
  };

  return (
    totalPages > 1 && (
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-12 grid-cols-1 mt-6">
          <div className="md:col-span-12 text-center">
            <nav>
              <ul className="inline-flex items-center -space-x-px">
                <li>
                  {page > 1 ? (
                    <Link
                      href={getQueryString(page - 1)}
                      className="size-8 inline-flex justify-center items-center mx-1 rounded-full text-slate-400 bg-white hover:text-white shadow-sm hover:bg-violet-600"
                    >
                      <FiChevronLeft
                        className="text-gray-400 text-sm flex-shrink-0 min-w-[0.875rem]"
                        aria-hidden="true"
                      />
                    </Link>
                  ) : (
                    <span className="size-8 inline-flex justify-center items-center mx-1 rounded-full text-gray-300 bg-gray-100 cursor-not-allowed">
                      <FiChevronLeft
                        className="text-gray-400 text-sm flex-shrink-0 min-w-[0.875rem]"
                        aria-hidden="true"
                      />
                    </span>
                  )}
                </li>
                {/* Sahifa raqamlari */}
                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pageNum = idx + 1;
                  return (
                    <li key={pageNum}>
                      <Link
                        href={getQueryString(pageNum)}
                        className={`size-8 inline-flex justify-center items-center mx-1 rounded-full ${
                          pageNum === page
                            ? "bg-violet-600 text-white"
                            : "bg-white text-slate-400 hover:bg-violet-600 hover:text-white shadow-sm"
                        }`}
                      >
                        {pageNum}
                      </Link>
                    </li>
                  );
                })}
                <li>
                  {page < totalPages ? (
                    <Link
                      href={getQueryString(page + 1)}
                      className="size-8 inline-flex justify-center items-center mx-1 rounded-full text-slate-400 bg-white hover:text-white shadow-sm hover:bg-violet-600"
                    >
                      <FiChevronRight
                        className="text-gray-400 text-sm flex-shrink-0 min-w-[0.875rem]"
                        aria-hidden="true"
                      />
                    </Link>
                  ) : (
                    <span className="size-8 inline-flex justify-center items-center mx-1 rounded-full text-gray-300 bg-gray-100 cursor-not-allowed">
                      <FiChevronRight
                        className="text-gray-400 text-sm flex-shrink-0 min-w-[0.875rem]"
                        aria-hidden="true"
                      />
                    </span>
                  )}
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    )
  );
};

export default Pagination;
