'use client'
import React, { useState } from 'react';
import Link from 'next/link';

import ModalVideo from 'react-modal-video';
import '../../node_modules/react-modal-video/css/modal-video.css'

import Image from 'next/image';


export default function FaqAbout() {
    const [isOpen, setOpen] = useState(false);

  return (
    <div className="lg:col-span-6 md:col-span-7">
        <div className="relative">
            <div className="relative md:shrink-0 lg:mx-0 mx-5">
                <Image className="object-cover md:w-96 w-84 h-[500px] rounded-lg shadow-md dark:shadow-gyay-700" src='/images/course/4.jpg' width={0} height={0} sizes='100vw' style={{width:'0', height:'auto'}} alt=""/>
            </div>

            <div className="absolute bottom-10 lg:end-6 end-0">
                <div className="relative z-1 top-10 xl:text-start lg:text-end text-end">
                    <Link href="" scroll={false} onClick={() => setOpen(true)} className="lightbox size-20 rounded-full shadow-md dark:shadow-gyay-700 inline-flex items-center justify-center bg-violet-600 text-white">
                        <i className="mdi mdi-play inline-flex items-center justify-center text-2xl"></i>
                    </Link>
                </div>
                <ModalVideo
                    channel="youtube"
                    youtube={{ mute: 0, autoplay: 0 }}
                    isOpen={isOpen}
                    videoId="yba7hPeTSjk"
                    onClose={() => setOpen(false)} 
                />

                <div className="relative md:shrink-0">
                    <Image className="object-cover size-48 rounded-lg shadow-md dark:shadow-gyay-700" src='/images/course/2.jpg' width={0} height={0} sizes='100vw' style={{width:'100%', height:'auto'}} alt=""/>
                </div>
            </div>

            <div className="absolute md:top-16 top-12 md:-start-10 -start-2 p-4 rounded-lg shadow-md dark:shadow-gray-800 bg-white dark:bg-slate-900 w-56 z-2 mover">
                <h5 className="font-semibold mb-3">Our Instrunctors</h5>
                
                <ul className="list-none relative">
                    <li className="inline-block relative"><Link href=""><Image src='/images/team/1.jpg' width={32} height={32} className="size-10 rounded-full shadow-md shadow-slate-100 dark:shadow-slate-800 border-4 border-white dark:border-slate-900 relative hover:z-1 hover:scale-105 transition-all duration-500" alt=""/></Link></li>
                    <li className="inline-block relative -ms-4"><Link href=""><Image src='/images/team/2.jpg' width={32} height={32} className="size-10 rounded-full shadow-md shadow-slate-100 dark:shadow-slate-800 border-4 border-white dark:border-slate-900 relative hover:z-1 hover:scale-105 transition-all duration-500" alt=""/></Link></li>
                    <li className="inline-block relative -ms-4"><Link href=""><Image src='/images/team/3.jpg' width={32} height={32} className="size-10 rounded-full shadow-md shadow-slate-100 dark:shadow-slate-800 border-4 border-white dark:border-slate-900 relative hover:z-1 hover:scale-105 transition-all duration-500" alt=""/></Link></li>
                    <li className="inline-block relative -ms-4"><Link href=""><Image src='/images/team/4.jpg' width={32} height={32} className="size-10 rounded-full shadow-md shadow-slate-100 dark:shadow-slate-800 border-4 border-white dark:border-slate-900 relative hover:z-1 hover:scale-105 transition-all duration-500" alt=""/></Link></li>
                    <li className="inline-block relative -ms-4"><Link href=""><Image src='/images/team/5.jpg' width={32} height={32} className="size-10 rounded-full shadow-md shadow-slate-100 dark:shadow-slate-800 border-4 border-white dark:border-slate-900 relative hover:z-1 hover:scale-105 transition-all duration-500" alt=""/></Link></li>
                    <li className="inline-block relative -ms-4"><Link href="" className="size-9 table-cell tracking-wide align-middle text-base text-center rounded-full bg-violet-600 text-white hover:z-1 hover:scale-105 transition-all duration-500"><i className="mdi mdi-plus"></i></Link></li>
                </ul>
            </div>
        </div>
    </div>
  )
}
