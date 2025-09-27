import React from 'react'
import Link from 'next/link'
import Navbar from '@/components/navbar/navbar'
import HeroSlider from '@/components/hero-slider'
import AboutOne from '@/components/about-one'
import Features from '@/components/features'
import CoursesTwo from '@/components/courses/courses-two'
import Cta from '@/components/cta'
import GetInTouch from '@/components/get-in-touch'
import Footer from '@/components/footer'
import ScrollToTop from '@/components/scroll-to-top'
import Switcher from '@/components/switcher'

export default function Page() {
  return (
    <>
      {/* <Tagline /> */}

      <Navbar navlight={true} tagline={true} />

      <HeroSlider />

      <section className="relative lg:py-24 py-16">
        <div className="container relative">
          <AboutOne title={false} />
        </div>

        <div className="container relative lg:mt-24 mt-16">
          <div className="grid grid-cols-1 pb-6 text-center">
            <h4 className="mb-6 md:text-3xl text-2xl md:leading-normal leading-normal font-semibold">
              Откройте для себя мир знаний и возможностей <br />
              с нашим спортивно-образовательным центром «Максимум»
            </h4>
          </div>


          <Features />
        </div>

        <div className="container relative lg:mt-24 mt-16">
          <div className="grid grid-cols-1 pb-6 text-center">
            <h4 className="mb-6 md:text-3xl text-2xl md:leading-normal leading-normal font-semibold">
              Последние добавленные курсы
            </h4>

            <p className="text-slate-400 max-w-xl mx-auto">
              Ознакомьтесь с новыми предложениями и возможностями <br /> для обучения и развития.
            </p>
          </div>

          <CoursesTwo />

          <div className="grid md:grid-cols-12 grid-cols-1 mt-6">
            <div className="md:col-span-12 text-center">
              <Link href="/courses" className="text-slate-400 hover:text-violet-600 duration-500 ease-in-out">Посмотреть больше курсов <i className="mdi mdi-arrow-right align-middle"></i></Link>
            </div>
          </div>
        </div>
      </section>

      <Cta />

      {/* Instruktors */}
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
