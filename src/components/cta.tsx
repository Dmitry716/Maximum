import React from 'react'


import Counter from './counter'
import { counterData } from '@/app/data';

interface CounterData {
  value: number;
  symbol: string;
  title: string;
}

export default function Cta() {
  return (
    <section className="relative py-24 bg-no-repeat bg-center bg-fixed bg-cover" style={{ backgroundImage: `url('/images/bg/2.jpg')` }}>
      <div className="absolute inset-0 bg-black/60"></div>
      <div className="container relative">
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 items-center gap-6">
          {counterData.map((item: CounterData, index: number) => {
            return (
              <div className="counter-box text-center" key={index}>
                <h1 className="text-white lg:text-5xl text-4xl font-semibold mb-2"><Counter className="counter-value" value={item.value} />{item.symbol}</h1>
                <h5 className="counter-head text-white uppercase font-medium">{item.title}</h5>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
