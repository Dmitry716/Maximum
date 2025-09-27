import React from 'react'
import Link from 'next/link';

import { IconType } from 'react-icons';
import Image from 'next/image';
import { teamData } from '@/app/data';

interface TeamData{
    image: string;
    name: string;
    position: string;
    social: IconType[];
}

export default function Team() {
  return (
        <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 mt-6 gap-6">
            {teamData.slice(0,4).map((item:TeamData,index:number)=>{
                return(
                    <div className="group text-center" key={index}>
                        <div className="relative inline-block mx-auto w-full rounded-full overflow-hidden">
                            <Image src={item.image} width={0} height={0} sizes='100vw' style={{ width: '100%', height:'auto'}} className="" alt=""/>
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black rounded-full opacity-0 group-hover:opacity-100 duration-500"></div>

                            <ul className="list-none absolute start-0 end-0 -bottom-20 group-hover:bottom-5 duration-500">
                                {item.social.map((el,index)=>{
                                    let Icon = el
                                    return(
                                        <li className="inline mx-[2px]" key={index}><Link href="" className="size-8 inline-flex items-center justify-center tracking-wide align-middle duration-500 text-base text-center bg-violet-600 text-white rounded-full"><Icon className="size-4"/></Link></li>
                                    )
                                })}
                            </ul>
                        </div>

                        <div className="content mt-3">
                            <Link href="" className="text-lg font-medium hover:text-violet-600 duration-500">{item.name}</Link>
                            <p className="text-slate-400">{item.position}</p>
                        </div>
                    </div>
                )
            })}
        </div>
  )
}
