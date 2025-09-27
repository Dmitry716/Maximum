import React from 'react'
import Link from 'next/link'
import Image from 'next/image';

export default function BlogsSidebar({ blogRecentPost, title, isBlog }: { blogRecentPost: any[], title?: string, isBlog?: boolean }) {
  return (
    <div className="sticky top-20 p-6 bg-white dark:bg-slate-900 rounded-md shadow dark:shadow-gray-700">

      <div className="mt-6">
        <h5 className="font-semibold">{title}</h5>
        {blogRecentPost.map((item: any, index: number) => {
          return (
            <div className="flex items-center mt-4" key={index}>
              {isBlog && item.images?.length > 0 &&
                <Image src={`${process.env.NEXT_PUBLIC_API_URL}/${item.images[0]}`}
                  width={113}
                  height={100}
                  className="h-16 rounded-md shadow dark:shadow-gray-800"
                  alt="blog" />
              }
              {!isBlog && item?.image &&
                <Image src={`${process.env.NEXT_PUBLIC_API_URL}/${item?.image}`}
                  width={113}
                  height={100}
                  className="h-16 rounded-md shadow dark:shadow-gray-800"
                  alt="news" />
              }

              <div className="ms-3">
                <Link href={isBlog ? `/blog/${item.url}` : `/news/${item.url}`} className="font-medium hover:text-violet-600">{item.title}</Link>
              </div>
            </div>
          )
        })}
      </div>


    </div>
  )
}
