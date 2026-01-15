"use client"

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useQuery } from '@tanstack/react-query'
import { getAllCoursesPublic } from '@/api/requests'

export default function CoursesTwo() {
  const { data: courses, isLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: () => getAllCoursesPublic(),
    staleTime: 1000 * 60 * 5,
    retry: 3,
    placeholderData: (previousData) => previousData,
  })

  return (
    <div className="grid lg:grid-cols-2 md:grid-cols-1  mt-6 gap-6">
      {courses && courses.items.slice(0, 8).map((item: any, index: number) => (
        <div key={index} className="group grid md:grid-cols-2 justify-center md:justify-between bg-white dark:bg-slate-900 rounded-md shadow-md hover:shadow-lg shadow-slate-100 dark:shadow-slate-800 transition duration-500">
          <div className="p-3 pb-0 relative">
            <Link href={`${process.env.NEXT_PUBLIC_API_URL}/${item.category.url}/${item.url}`} className="relative overflow-hidden rounded-md">
              <Image
                src={`${process.env.NEXT_PUBLIC_API_URL}/${item?.images[0]?.url}` || "/placeholder-image.png"}
                width={0}
                height={0}
                sizes="100vw"
                style={{ width: '100%', height: 200 }}
                className="object-cover group-hover:scale-105 duration-500 rounded-md"
                alt=""
              />
            </Link>
          </div>

          <div className="p-3 flex flex-col justify-between">
            <div>
              <div className="flex justify-start">
                <span className=" text-sm flex items-center text-slate-400 ">
                  {`${Math.round(Number(item.price))} BYN/мес.`}
                </span>
              </div>

              <h2
                className="text-lg font-medium line-clamp-2">
                {item.name}
              </h2>

              <p className="text-slate-400 my-2 line-clamp-3">{item.description}</p>
            </div>

            <Link href={`${process.env.NEXT_PUBLIC_API_URL}/${item.category.url}/${item.url}`} className="h-8 px-3 tracking-wide inline-flex items-center justify-center font-medium rounded-md bg-violet-600/10 hover:bg-violet-600 text-violet-600 hover:text-white text-sm">Подробнее <i className="mdi mdi-arrow-right align-middle ms-1"></i></Link>
          </div>
        </div>
      ))}
    </div>
  )
}
