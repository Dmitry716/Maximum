'use client'
import React from 'react'
import dynamic from 'next/dynamic';

import { coursesData } from '@/app/data'

const TinySlider = dynamic(()=>import('tiny-slider-react'),{ssr:false})
import '../../../../node_modules/tiny-slider/dist/tiny-slider.css'

import CoursesOne from './courses-one';

interface CoursesData{
    id: number;
    image: string;
    tag1: string;
    tag2: string;
    amount: number;
    lessons: number;
    students: number;
    title: string;
    desc: string;
    user: string;
    name: string; 
}

const settings = {
    container: '.tiny-home-slide-three',
    controls: true,
    mouseDrag: true,
    loop: true,
    rewind: true,
    autoplay: true,
    autoplayButtonOutput: false,
    autoplayTimeout: 3000,
    navPosition: "bottom",
    controlsText: ['<i class="mdi mdi-chevron-left "></i>', '<i class="mdi mdi-chevron-right"></i>'],
    nav: false,
    speed: 400,
    gutter: 0,
    responsive: {
        992: {
            items: 3
        },

        767: {
            items: 2
        },

        320: {
            items: 1
        },
    },
  };

export default function CoursesSlider() {
  return (
    <div className="grid grid-cols-1 relative mt-3">
        <div className="tiny-home-slide-three">
            <TinySlider settings={settings}>
                {coursesData.map((item:CoursesData,index:number)=>{
                    return(
                        <div className="tiny-slide" key={index}>
                            {/* <CoursesOne item={item}/> */}
                        </div>
                    )
                })}
            </TinySlider>
        </div>
    </div>
  )
}
