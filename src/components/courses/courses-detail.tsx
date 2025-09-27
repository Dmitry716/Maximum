import React from 'react'
import Image from 'next/image'
import CoursesOne from '@/components/courses/courses-one'
import { FiClock } from 'react-icons/fi'
import { Course } from '@/types/type'
import { ScheduleGroup } from '../schedule-group'
import { RegisterApp } from '../register-app'
import { RenderNovel } from '../render-novel'

export default function CoursesDetailPage({ course, courses }: { course: Course, courses: Course[] }) {

  return (
    <>
      <section
        className="relative table w-full py-32 lg:py-44 bg-no-repeat bg-center bg-cover"
        style={{
          backgroundImage: `url(${process.env.NEXT_PUBLIC_API_URL}/${course.images[0]?.url})`,
        }}
      >
        <div className="absolute inset-0 bg-black opacity-80"></div>
        <div className="container relative">
          <div className="grid grid-cols-1 ProseMirror  text-center mt-10">
            <h1 className="mt-3   text-white">{course.name}</h1>
            {course.isShow && <div className="flex items-center mx-auto mt-8">
              <Image src={`${process.env.NEXT_PUBLIC_API_URL}/${course.instructor?.avatar}`} width={32} height={32} className="size-8 rounded-full shadow-md dark:shadow-gray-800" alt="" />
              <h2 className="font-semibold text-white block ms-3">{course.instructor?.name}</h2>
            </div>}
            <span className="bg-violet-600 mt-8 text-white text-xs font-bold px-2.5 py-0.5 rounded w-fit mx-auto h-5">{Math.round(Number(course.price))} BYN/мес.</span>
            <div className="flex justify-center items-center mt-8 mx-3">
              <FiClock className="text-lg text-white" />
              <span className="text-white/60 ms-2">{course.duration}</span>
            </div>
            <div className="mt-8 mb-0 inline-block">
              <RegisterApp course={course} />
            </div>
          </div>
        </div>

        <div className="absolute text-center z-10 bottom-5 start-0 end-0 mx-3">

        </div>
      </section>

      <div className="relative">
        <div className="shape overflow-hidden z-1 text-white dark:text-slate-900">
          <svg viewBox="0 0 2880 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 48H1437.5H2880V0H2160C1442.5 52 720 0 720 0H0V48Z" fill="currentColor"></path>
          </svg>
        </div>
      </div>

      <section className="relative md:py-24 py-16 overflow-hidden">
        {/* Overview Schedule Images */}
        <div className="container relative">
          {/* Overview */}
          <div className="grid grid-cols-1">
            <p className=' dark:text-slate-300'>{course.description}</p>

            {course?.detailedDescription
              && <RenderNovel
                contentFromDB={course.detailedDescription}
              />}

          </div>


          {/* Schedule */}
          <div className="grid grid-cols-1 mt-6">
            <h5 className="text-2xl font-semibold">Расписание</h5>
          </div>
          {course.groups && <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <ScheduleGroup groups={course.groups} />
          </div>}

          {/* Images */}
          <div className="grid grid-cols-1 mt-6">
            <h3 className="text-2xl font-semibold">Фотогалерея</h3>
          </div>
          <div className="grid md:grid-cols-2 grid-cols-1 mt-6 gap-6">
            {course.images[0] && <Image
              src={`${process.env.NEXT_PUBLIC_API_URL}/${course.images[0]?.url}`}
              width={0}
              height={0}
              sizes='100vw'
              style={{ width: '100%', height: 'auto' }}
              className="rounded-md shadow" alt="" />}

            {course?.images[1] && <div className="relative">
              <Image
                src={`${process.env.NEXT_PUBLIC_API_URL}/${course.images[1]?.url}`}
                width={0}
                height={0}
                sizes='100vw'
                style={{ width: '100%', height: 'auto' }}
                className="rounded-md shadow" alt="" />
              {/* <VideoModal /> */}
            </div>}
          </div>
        </div>

        {/* Recent Courses */}
        <div id='recent-courses' className="container relative md:mt-24 mt-16">
          <div className="grid grid-cols-1 pb-6 text-center">
            <h4 className="mb-6 md:text-3xl text-2xl md:leading-normal leading-normal font-semibold">Последние курсы</h4>
            <p className="text-slate-400 max-w-xl mx-auto">Откройте для себя мир знаний и возможностей с нашей образовательной онлайн-платформой и начните новую карьеру.</p>
          </div>

          <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 mt-6 gap-6">
            {courses && courses.filter((item: Course) => item.id !== course.id).slice(0, 3).map((item: Course, index: number) => {
              return (
                <CoursesOne item={item} key={index} />
              )
            })}
          </div>
        </div>

      </section>
    </>
  )
}
