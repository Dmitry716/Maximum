import React from 'react'
import Link from 'next/link'

export default function Tagline() {
  return (
        <div className="tagline bg-slate-100 dark:bg-slate-800">
            <div className="container relative">                
                <div className="grid grid-cols-1">
                    <div className="flex justify-center">
                        <span className="text-[16px]">Inform the best course offers with discounts up to 60%, <Link href="" className="hover:text-violet-600 font-semibold">get it now</Link> 🔥</span>
                    </div>
                </div>
            </div>
        </div>
  )
}
