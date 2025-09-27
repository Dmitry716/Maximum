'use client'
import React, { useState } from 'react';
import Link from 'next/link'

import ModalVideo from 'react-modal-video';
import '../../../node_modules/react-modal-video/css/modal-video.css'

import { FiVideo } from 'react-icons/fi';

export default function VideoModalTwo() {
    const [isOpen, setOpen] = useState<boolean>(false);
  return (
    <>
        <div className="mt-6">
            <Link href="" className="h-10 px-6 tracking-wide inline-flex items-center justify-center font-medium rounded-md bg-violet-600 text-white">Explore Courses <i className="mdi mdi-arrow-right align-middle ms-1"></i></Link>
            <Link href="#!" scroll={false} onClick={() => setOpen(true)} className="size-10 inline-flex items-center justify-center tracking-wide align-middle duration-500 text-base text-center rounded-full bg-violet-600/10 hover:bg-violet-600 text-violet-600 hover:text-white ms-1 lightbox"><FiVideo className="h-4 w-4"/></Link><span className="font-medium text-slate-400 dark:text-white/80 ms-1 align-middle"> Watch Now</span>
        </div>
        <ModalVideo
            channel="youtube"
            youtube={{ mute: 0, autoplay: 0 }}
            isOpen={isOpen}
            videoId="S_CGed6E610"
            onClose={() => setOpen(false)} 
        />
    </>
  )
}
