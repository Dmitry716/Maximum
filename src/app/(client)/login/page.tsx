import React from 'react'
import BackToHome from '@/components/back-to-home'
import Switcher from '@/components/switcher'
import LoginForm from '@/components/login-form'

export default function Page() {
  return (
    <>
      <section className="md:h-screen py-36 flex items-center relative bg-no-repeat bg-center bg-cover" style={{ backgroundImage: `url('/images/bg/2.jpg')` }}>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black z-2" id="particles-snow"></div>
        <div className="container relative z-3">
          <div className="flex">
            <div className="max-w-[400px] w-full p-6 bg-white dark:bg-slate-900 shadow-md shadow-slate-100 dark:shadow-slate-800 rounded-md">
              <h1 className='text-2xl font-bold'>Maxximum</h1>
              <h5 className="my-2 text-xl font-semibold">Войти</h5>
              <LoginForm />
            </div>
          </div>
        </div>
      </section>
      <BackToHome />
      <Switcher />
    </>
  )
}
