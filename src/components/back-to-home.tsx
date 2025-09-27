import React from 'react'
import { FiArrowLeft } from 'react-icons/fi'
import Link from 'next/link'

export default function BackToHome() {
  return (
        <div className="fixed bottom-3 end-3 z-10">
            <Link href="/" className="size-8 flex bg-violet-600 text-white justify-center items-center rounded-full back-button"><FiArrowLeft className="size-4"/></Link>
        </div>
  )
}
