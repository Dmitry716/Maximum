import React from 'react'
import { FiEdit2, FiMail } from 'react-icons/fi'

export default function Newsletter() {
  return (
    <>
        <div className="grid grid-cols-1">
            <div className="relative bg-white dark:bg-slate-900 lg:px-8 px-6 py-10 rounded-lg shadow shadow-slate-200 dark:shadow-slate-800 overflow-hidden">
                <div className="grid md:grid-cols-2 grid-cols-1 items-center gap-6">
                    <div className="md:text-start text-center z-1">
                        <h3 className="mb-2 md:text-3xl text-2xl md:leading-normal leading-normal font-semibold">Subscribe to Newsletter!</h3>
                        <p className="text-slate-400 max-w-xl mx-auto">Subscribe to get latest updates and information.</p>
                    </div>
    
                    <div className="z-1">
                        <form className="relative mx-auto max-w-xl">
                            <input type="email" id="subemail" name="name" className="pt-4 pe-40 pb-4 ps-6 w-full h-[50px] outline-none text-black dark:text-white rounded-full bg-white/70 dark:bg-slate-900/70 border border-slate-100 dark:border-slate-800" placeholder="Enter your email id.."/>
                            <button type="submit" className="h-12 px-6 tracking-wide items-center justify-center font-medium bg-violet-600 text-white rounded-full absolute top-[1px] end-[1px]">Subcribe Now</button>
                        </form>
                    </div>
                </div>
    
                <div className="absolute -top-5 -start-5">
                    <FiMail className="iconoir-mail lg:text-[150px] text-7xl text-black/5 dark:text-white/5 ltr:-rotate-45 rtl:rotate-45"/>
                </div>
    
                <div className="absolute -bottom-5 -end-5">
                    <FiEdit2 className="iconoir-edit-pencil lg:text-[150px] text-7xl text-black/5 dark:text-white/5 rtl:-rotate-90"/>
                </div>
            </div>
        </div>
    </>
    
  )
}
