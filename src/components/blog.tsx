import { env } from "@/lib/env";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import Image from "next/image";
import Link from "next/link";
import { FiCalendar } from "react-icons/fi";

export default function Blog({
  blogs,
  link,
  isBlog,
}: {
  blogs: any[];
  link: string;
  isBlog: boolean;
}) {
  return (
    <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
      {blogs.map((item: any, index: number) => {
        return (
          <div
            className="group relative h-fit overflow-hidden bg-white dark:bg-slate-900 rounded-md shadow dark:shadow-gray-700 transition-all duration-500"
            key={index}
          >
            <div className="relative overflow-hidden">
              {isBlog && item.images?.length > 0 && (
                <Image
                  src={`${env.NEXT_PUBLIC_API_URL}/${item.images[0]}`}
                  width={0}
                  height={0}
                  sizes="100vw"
                  style={{ width: "100%", height: "auto" }}
                  alt="blog"
                />
              )}
              {!isBlog && item.image && (
                <Image
                  src={`${env.NEXT_PUBLIC_API_URL}/${item.image}`}
                  width={0}
                  height={0}
                  sizes="100vw"
                  style={{ width: "100%", height: "auto" }}
                  alt="news"
                />
              )}

              {isBlog && item && item?.tags.length > 0 && (
                <div className="absolute start-6 bottom-6">
                  <span className="bg-violet-600 text-white text-[12px] px-2.5 py-1 rounded-md h-4">
                    {item?.tags[0]?.tag}
                  </span>
                </div>
              )}
            </div>

            <div className="relative p-6">
              <div className="">
                <div className="flex justify-between mb-4">
                  <span className="text-slate-400 text-sm flex items-center">
                    <FiCalendar className="size-4 me-1" />
                    {format(item.date, "d MMMM yyyy", { locale: ru })}
                  </span>
                </div>

                <Link
                  href={link + item.url}
                  className="text-lg hover:text-violet-600 font-medium"
                >
                  {item.title}
                </Link>

                <div className="mt-3">
                  <Link
                    href={link + item.url}
                    className="btn btn-link hover:text-violet-600 after:bg-violet-600 duration-500 ease-in-out"
                  >
                    Читать далее <i className="mdi mdi-arrow-right"></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
