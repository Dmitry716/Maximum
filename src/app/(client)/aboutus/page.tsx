import React from 'react'
import Navbar from '@/components/navbar/navbar'
import AboutOne from '@/components/about-one'
import Features from '@/components/features'
import Cta from '@/components/cta'
import GetInTouch from '@/components/get-in-touch'
import Footer from '@/components/footer'
import ScrollToTop from '@/components/scroll-to-top'
import Switcher from '@/components/switcher'
import { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "О нас | Спортивно-образовательный центр «Максимум» в Витебске",
    description: "Спортивно-образовательный центр «Максимум» в Витебске — это профессиональные преподаватели, современные программы и индивидуальный подход. Узнайте о нашей миссии и достижениях!",
    keywords: ["о нас", "спортивный центр Витебск", "преподаватели", "наши достижения", "миссия центра", "о Максимуме"],
    openGraph: {
      title: "О нас | Спортивный центр «Максимум» в Витебске",
      description: "Узнайте о нашем центре, о преподавателях и уникальных программах занятий в Витебске!",
      type: "website",
      url: `${process.env.NEXT_PUBLIC_API_URL}/about`,
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_API_URL}/images/og/og.jpg`,
          width: 800,
          height: 600,
          alt: "Спортивно-образовательный центр «Максимум» в Витебске",
        },
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: "О нас | Спортивный центр «Максимум» в Витебске",
      description: "Узнайте о нашем центре, о преподавателях и уникальных программах занятий в Витебске!",
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_API_URL}/images/og/og.jpg`,
          width: 800,
          height: 600,
          alt: "Спортивно-образовательный центр «Максимум» в Витебске",
        },
      ]
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_API_URL}/about`,
    },
  };
};

export default function Page() {
  return (
    <>
      <Navbar navlight={true} tagline={false} />

      <section className="relative table w-full py-32 lg:py-72 bg-no-repeat bg-center bg-cover" style={{ backgroundImage: `url('/images/course/4.jpg')` }}>
        <div className="absolute inset-0 bg-black opacity-80"></div>
        <div className="container relative">
          <div className="grid grid-cols-1 text-center mt-10">
            <h3 className="md:text-3xl text-2xl md:leading-normal leading-normal font-semibold text-white">О Нас</h3>
          </div>
        </div>
      </section>

      <div className="relative">
        <div className="shape overflow-hidden z-1 text-white dark:text-slate-900">
          <svg viewBox="0 0 2880 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 48H1437.5H2880V0H2160C1442.5 52 720 0 720 0H0V48Z" fill="currentColor"></path>
          </svg>
        </div>
      </div>
      <section className="relative lg:py-24 py-16">
        <div className="container relative">
          <AboutOne title={false} />
        </div>

        <div className="container relative lg:mt-24 mt-16">
          <div className="grid grid-cols-1 pb-6 text-center">
            <h4 className="mb-6 md:text-3xl text-2xl md:leading-normal leading-normal font-semibold">
              Последние добавленные курсы
            </h4>

            <p className="text-slate-400 max-w-xl mx-auto">
              Ознакомьтесь с новыми предложениями и возможностями для обучения и развития.
            </p>
          </div>
          <Features />
        </div>
      </section>

      <Cta />

      <section className="relative lg:py-24 py-16">

        <div className="container relative lg:mt-24 mt-16">
          <GetInTouch />
        </div>
      </section>
      <Footer />
      <ScrollToTop />
      <Switcher />
    </>
  )
}
