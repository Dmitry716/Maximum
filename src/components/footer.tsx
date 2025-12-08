import React from 'react'
import Link from 'next/link'

import { FiChevronRight, FiMapPin, FiPhoneCall } from 'react-icons/fi'

import { footerLink } from '@/app/data'
import { InstagramIcon, Timer } from 'lucide-react'
import { MdEmail } from 'react-icons/md'

export default function Footer() {
  return (
    <footer className="relative bg-slate-900 dark:bg-slate-800 w-full" role="contentinfo">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="py-16">
          <div className="w-full">
            <div className="grid md:grid-cols-6 grid-cols-1 gap-6 items-start">
              <div className="lg:col-span-4 md:col-span-4 w-full">
                {/* Use proper heading hierarchy */}
                <h2 className='text-2xl font-bold text-white mb-6 leading-tight'>Максимум</h2>
                <p className="mb-6 text-gray-300 leading-relaxed max-w-md">
                  Спортивно-образовательный центр «Максимум».
                  Развиваем. Обучаем. Вдохновляем.
                  Индивидуальный подход
                  и забота о каждом ребёнке.
                </p>

                {/* Contact information with proper semantic markup */}
                <address className="not-italic space-y-4">
                  <div className="flex items-start gap-3">
                    <Timer
                      className="text-xl text-violet-600 mt-1 flex-shrink-0 min-w-[1.25rem]"
                      aria-hidden="true"
                    />
                    <div className="min-h-[2.5rem]">
                      <div className="text-gray-300 text-sm leading-relaxed">
                        Ежедневно с 9:00 до 21:00<br />
                        <span className="text-xs text-gray-400">(Обед: 13:00–14:00)</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <FiMapPin
                      className="text-xl text-violet-600  flex-shrink-0 min-w-[1.25rem]"
                      aria-hidden="true"
                    />
                    <div className="min-h-[2rem]">
                      <div className="text-gray-300 text-sm leading-relaxed">
                        г. Витебск
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <FiPhoneCall
                      className="text-xl text-violet-600 mt-2 flex-shrink-0 min-w-[1.25rem]"
                      aria-hidden="true"
                    />
                    <div className="min-h-[2.5rem] flex items-center">
                      <a
                        href="tel:+375297800008"
                        className="text-gray-300 hover:text-white duration-300 ease-in-out focus:text-white focus:outline-none focus:ring-2 focus:ring-violet-600 focus:ring-offset-2 focus:ring-offset-slate-900 rounded px-1 text-sm"
                        aria-label="Позвонить по номеру +375 (29) 780-00-08"
                      >
                        +375 (29) 780-00-08
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MdEmail
                      className="text-xl text-violet-600 mt-2 flex-shrink-0 min-w-[1.25rem]"
                      aria-hidden="true"
                    />
                    <div className="min-h-[2.5rem] flex items-center">
                      <a
                        href="mailto:vitebskmaximum@gmail.com"
                        className="text-gray-300 hover:text-white duration-300 ease-in-out focus:text-white focus:outline-none focus:ring-2 focus:ring-violet-600 focus:ring-offset-2 focus:ring-offset-slate-900 rounded px-1 text-sm break-all"
                        aria-label="Отправить email на vitebskmaximum@gmail.com"
                      >
                        vitebskmaximum@gmail.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <InstagramIcon
                      className="text-xl text-violet-600 mt-2 flex-shrink-0 min-w-[1.25rem]"
                      aria-hidden="true"
                    />
                    <div className="min-h-[2.5rem] flex items-center">
                      <a
                        href="https://instagram.com/vitebskmaximum"
                        className="text-gray-300 hover:text-white duration-300 ease-in-out focus:text-white focus:outline-none focus:ring-2 focus:ring-violet-600 focus:ring-offset-2 focus:ring-offset-slate-900 rounded px-1 text-sm break-all"
                        aria-label="Отправить email на vitebskmaximum@gmail.com"
                      >
                        vitebskmaximum
                      </a>
                    </div>
                  </div>
                </address>
              </div>

              <div className="lg:col-span-2 md:col-span-2 w-full">
              <p className="mb-3 text-gray-400">
                  ООО «Спортивно-образовательный центр «Максимум»<br />
                  УНП 391841030
                </p>
                <h2 className="text-gray-100 font-semibold text-lg mb-6 leading-tight">Полезные ссылки</h2>

                <nav aria-label="Полезные ссылки">
                  <ul className="space-y-3">
                    {footerLink.map((item: any, index: number) => (
                      <li key={index} className="flex items-center gap-2">
                        <FiChevronRight
                          className="text-gray-400 text-sm flex-shrink-0 min-w-[0.875rem]"
                          aria-hidden="true"
                        />
                        <Link
                          href={item.link}
                          className="text-gray-300 hover:text-white duration-300 ease-in-out focus:text-white focus:outline-none focus:ring-2 focus:ring-violet-600 focus:ring-offset-2 focus:ring-offset-slate-900 rounded px-1 text-sm leading-relaxed"
                        >
                          {item.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </div>
          </div>
          <span className='absolute text-[12px] md:text-[16px] text-center text-gray-400 text-nowrap left-1/2 transform -translate-x-1/2 bottom-[10px]'>Copyright ©2025 Все права защищены <br/>Разработка сайта <Link className='font-bold text-[#5828ba] hover:underline' href={'https://apsod.com/'} target='_blank'>Apsod</Link></span>
        </div>
      </div>

    </footer>
  )
}