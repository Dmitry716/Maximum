import React from 'react'
import Link from 'next/link';

import { categories } from '@/app/data';

import { IconType } from 'react-icons';

interface Categorie{
    icon: IconType;
    title: string;
}

export default function Categories() {
    
  return (
    <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 mt-6 gap-6">
        {categories.map((item:Categorie, index:number)=>{
            let Icon = item.icon
            return(
                <div key={index} className="group flex items-center bg-white hover:bg-gradient-to-tr hover:to-violet-600 hover:from-fuchsia-600 dark:bg-slate-900 rounded-md shadow shadow-slate-200 dark:shadow-slate-800 duration-500 p-5">
                    <div className="size-12 bg-violet-600/5 group-hover:bg-white/20 text-violet-600 group-hover:text-white rounded-md flex align-middle justify-center items-center shadow-sm">
                        <Icon className="text-2xl"/>
                    </div>

                    <div className="content ms-3">
                        <Link href="" className="title text-lg font-semibold group-hover:text-white">{item.title}</Link>
                        <p className="text-slate-400 group-hover:text-white/50">10+ Courses</p>
                    </div>
                </div>
            )
        })}
    </div>
  )
}
