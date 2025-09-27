'use client'
import React from 'react'
import { TypeAnimation } from 'react-type-animation';

export default function TypeEffect() {
  return (
    <h1 className="font-semibold lg:leading-normal leading-normal tracking-wide text-4xl lg:text-5xl text-white mb-5">Get Quality

        <TypeAnimation
            sequence={[
                'Courses',
                1000,
                'Education',
                1000,
            ]}
            wrapper="span"
            speed={30}
            repeat={Infinity}
            className="font-bold text-yellow-400 typewrite ms-1"
            cursor={false}
            />

                <span className="font-bold text-yellow-400 typewrite" data-period="2000" data-type='[ "Courses", "Education" ]'></span> 

                <br/> Through <span className="after:absolute after:end-0 after:start-0 after:bottom-3 after:-rotate-6 after:h-2 after:w-auto after:rounded-md after:bg-yellow-400/50 after:-z-1 z-1 relative">1-on-1</span> <br/> Online Classes</h1>
  )
}
