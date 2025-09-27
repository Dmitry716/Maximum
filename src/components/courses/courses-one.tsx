import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function CoursesOne({ item }: { item: any }) {
  return (
    <>
      <div className="group flex flex-col justify-between bg-white dark:bg-slate-900 rounded-md shadow-md hover:shadow-lg shadow-slate-100 dark:shadow-slate-800 transition duration-500">
        <div className="p-3 pb-0 relative">
          <Link href={`${process.env.NEXT_PUBLIC_API_URL}/${item.category.url}/${item.url}`} className="relative overflow-hidden rounded-md">
            <Image
              src={`${process.env.NEXT_PUBLIC_API_URL}/${item.images[0]?.url}`}
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: '100%', height: 200 }}
              className="object-cover group-hover:scale-105 duration-500 rounded-md"
              alt=""
            />
          </Link>
        </div>

        <div className="p-6">
          <div className="flex justify-between mb-2">
            <span className=" text-md flex items-center text-slate-400 ">
              {`${Math.round(Number(item.price))} BYN/мес.`}
            </span>
            {item?.groups?.length > 0 &&
              <span className=" text-md flex items-center bg-slate-200 dark:bg-slate-800 rounded-full px-2 text-slate-400 ">
                {item.groups[0].ageRange} лет 
              </span>}
          </div>

          <h2
            className="text-lg  font-medium line-clamp-2">
            {item.name}
          </h2>

          <p className="text-slate-400 mt-2 line-clamp-3">{item.description}</p>

          <div className="flex justify-between mt-3">
            {item.isShow && item.instructor &&
              <span className="flex items-center">
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_URL}/${item.instructor.avatar}`}
                  width={32}
                  height={32} className="size-8 rounded-full shadow shadow-slate-100 dark:shadow-slate-800 me-2"
                  alt="Instructor avatar"
                />
                <Link href={`${process.env.NEXT_PUBLIC_API_URL}/${item.category.url}/${item.url}`} className="hover:text-violet-600 font-medium"> {item.instructor.name}</Link>
              </span>
            }
            <Link href={`${process.env.NEXT_PUBLIC_API_URL}/${item.category.url}/${item.url}`} className="h-8 px-3 tracking-wide inline-flex items-center justify-center font-medium rounded-md bg-violet-600/10 hover:bg-violet-600 text-violet-600 hover:text-white text-sm">Подробнее <i className="mdi mdi-arrow-right align-middle ms-1"></i></Link>
          </div>
        </div>
      </div>
    </>
  )
}
