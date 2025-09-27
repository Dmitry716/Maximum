"use client"

import React from "react"
import { useKeenSlider } from "keen-slider/react"
import "keen-slider/keen-slider.min.css"
import Image from "next/image"

function ThumbnailPlugin(mainRef: any) {
  return (slider: any) => {
    function removeActive() {
      slider.slides.forEach((slide: any) => {
        slide.classList.remove("active")
      })
    }
    function addActive(idx: any) {
      slider.slides[idx].classList.add("active")
    }

    function addClickEvents() {
      slider.slides.forEach((slide: any, idx: any) => {
        slide.addEventListener("click", () => {
          if (mainRef.current) mainRef.current.moveToIdx(idx)
        })
      })
    }

    slider.on("created", () => {
      if (!mainRef.current) return
      addActive(slider.track.details.rel)
      addClickEvents()
      mainRef.current.on("animationStarted", (main: any) => {
        removeActive()
        const next = main.animator.targetIdx || 0
        addActive(main.track.absToRel(next))
        slider.moveToIdx(Math.min(slider.track.details.maxIdx, next))
      })
    })
  }
}

export default function Slider({ images }: { images: string[] }) {
  const [sliderRef, instanceRef] = useKeenSlider({
    initial: 0,
  })
  const [thumbnailRef] = useKeenSlider(
    {
      initial: 0,
      slides: {
        perView: 4,
        spacing: 10,
      },
    },
    [ThumbnailPlugin(instanceRef)]
  )

  return (
    <div>
      <div ref={sliderRef} className="keen-slider max-h-80">
        {images.map((image) => (
          <div key={image} className="keen-slider__slide">
            <Image
              src={`${process.env.NEXT_PUBLIC_API_URL}/${image}`}
              width={0} height={0}
              sizes='100vw'
              className="object-contain"
              style={{ width: '100%', height: 400 }} alt="blog images"
            />
          </div>

        ))}

      </div>

      <div ref={thumbnailRef} className="keen-slider thumbnail">
        {images.map((image) => (
          <div key={image} className="keen-slider__slide ">
            <Image
              src={`${process.env.NEXT_PUBLIC_API_URL}/${image}`}
              width={0} height={0}
              sizes='10vw'
              style={{ width: '100%', height: 'auto' }} alt="blog images"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
