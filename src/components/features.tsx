import React from 'react'

import { featureData } from '@/app/data'
import { IconType } from 'react-icons';

interface FeatureData {
  icon: IconType;
  title: string;
  desc: string[];
}

export default function Features() {
  return (
    <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 mt-6 gap-6">
      {featureData.map((item: FeatureData, index: number) => {
        let Icon = item.icon
        return (
          <div className="p-6 shadow-lg shadow-slate-100 dark:shadow-slate-800 transition duration-500 rounded-2xl" key={index}>
            <div className="size-16 bg-violet-600/5 text-violet-600 rounded-2xl flex align-middle justify-center items-center shadow-sm">
              <Icon className="text-3xl"></Icon>
            </div>

            <div className="content mt-6">
              <h2 className="text-lg hover:text-violet-600 dark:text-white dark:hover:text-violet-600 transition-all duration-500 ease-in-out font-semibold">{item.title}</h2>

              <ul className="text-slate-400 mt-3 list-disc list-inside space-y-1">
                {item.desc.map((point, i) => (
                  <li className='!mr-0' key={i}>{point}</li>
                ))}
              </ul>
            </div>

          </div>
        )
      })}
    </div>
  )
}
