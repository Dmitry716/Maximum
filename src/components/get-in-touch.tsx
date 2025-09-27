import React from 'react'
import Link from 'next/link'

import { FiPhone } from 'react-icons/fi'

export default function GetInTouch() {
  return (
    <div className="grid grid-cols-1 text-center">
      <h3 className="mb-6 md:text-3xl md:leading-normal text-2xl leading-normal font-semibold">Есть вопросы? Свяжитесь с нами!</h3>

      <p className="text-slate-400 max-w-xl mx-auto">Откройте для себя мир знаний и возможностей <br />
        с нашим спортивно-образовательным центром «Максимум»</p>

      <div className="mt-6">
        <Link href="/contactus" className="h-10 px-5 tracking-wide inline-flex items-center justify-center font-medium rounded-md bg-violet-600 text-white"><FiPhone className="align-middle me-2" />Связаться с нами</Link>
      </div>
    </div>
  )
}
