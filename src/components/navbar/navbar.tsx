'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'
import { Sheet, SheetContent, SheetFooter, SheetTitle, SheetTrigger } from '../ui/sheet';
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { Menu } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import BuyBtn from './buy-btn';


export default function Navbar({ navlight, tagline }: { navlight: any, tagline: any }) {
  let [manu, setManu] = useState<any>(false);
  let [subManu, setSubManu] = useState<any>();
  let [scroll, setScroll] = useState<boolean>(false)
  const [isOpenCollap, setIsOpenCollap] = useState(false)
  const [open, setOpen] = useState(false)

  const pathname = usePathname()

  useEffect(() => {
    setManu(pathname)
    window.scrollTo(0, 0)

    const handlerScroll = () => {
      if (window.scrollY > 50) {
        setScroll(true)
      } else { setScroll(false) }
    }
    window.addEventListener('scroll', handlerScroll)

    return () => {
      window.removeEventListener('scroll', handlerScroll)
    };
  }, [])

  let textColor = ''

  if (scroll) {
    textColor = '!text-black dark:text-white'
  } else if (pathname !== '/contact' && pathname !== '/courses') {
    textColor = '!text-white'
  } else {
    textColor = '!text-black dark:text-white'
  }


  return (
    <>
      <nav id="topnav" className={`defaultscroll is-sticky ${scroll ? 'nav-sticky' : ''} `}>
        <div className="container relative">

          <Link className={` logo ${textColor}`} href="/">
            МАКСИМУМ
          </Link>

          <ul className="buy-button flex items-center relative ">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger >
                {!open && (
                  <Menu className={`w-6 h-6 block ${textColor} lg:hidden`} onClick={() => setOpen(true)} />
                )}
              </SheetTrigger>
              <SheetContent className='z-[9999]'>
                <SheetFooter>
                  <SheetTitle>
                    <VisuallyHidden>Меню навигации</VisuallyHidden>
                  </SheetTitle>
                  <ul className={'w-full text-center gap-y-5 flex flex-col h-screen justify-center'}>

                    <li
                      className={`has-submenu parent-parent-menu-item 
                          ${['/about'].includes(manu) ? 'active' : ''}`}>
                      <Link href="/about" >О Нас</Link>
                    </li>
                    <li className={`has-submenu parent-parent-menu-item ${['/courses', '/courses/id'].includes(manu) ? 'active' : ''}`}>
                      <Link href="/courses" >Направления</Link>
                    </li>

                    <li className={manu === '/blog' ? 'active' : ''}><Link href="/blog" className="sub-menu-item">Блог</Link></li>
                    <li className={manu === '/news' ? 'active' : ''}><Link href="/news" className="sub-menu-item">Новости</Link></li>

                    <li>
                      <Collapsible
                        open={isOpenCollap}
                        onOpenChange={setIsOpenCollap}
                      >
                        <CollapsibleTrigger >
                          Информация
                        </CollapsibleTrigger>
                        <CollapsibleContent className="flex flex-col gap-2">
                          <Link href="/files/erip.pdf" target="_blank" className="dark:bg-slate-700 bg-slate-300 p-1 dark:text-white px-4 text-sm">
                            Способы оплаты в ЕРИП
                          </Link>
                          <Link href="/files/rules_of_visiting.pdf" target="_blank" className="dark:bg-slate-500 bg-slate-200 p-1 dark:text-white px-4 text-sm">
                            Правила посещения
                          </Link>
                          <Link href="/files/contract.pdf" target="_blank" className="dark:bg-slate-500 bg-slate-200 p-1 dark:text-white px-4 text-sm">
                            Договор
                          </Link>
                        </CollapsibleContent>
                      </Collapsible>
                    </li>

                    <li className={manu === '/contact' ? 'active' : ''}><Link href="/contact" className="sub-menu-item">Контакты</Link></li>
                  </ul>
                </SheetFooter>
              </SheetContent>
            </Sheet>
            <li>
              <BuyBtn navlight={navlight} scroll={scroll} />
            </li>
          </ul>

          <div id="navigation" >
            <ul className={`navigation-menu justify-start ${navlight ? 'nav-light' : ''}`}>

              <li
                className={`has-submenu parent-parent-menu-item 
              ${['/about'].includes(manu) ? 'active' : ''}`}>
                <Link href="/about" >О Нас</Link>
              </li>

              <li
                className={`has-submenu parent-parent-menu-item 
              ${['/courses', '/courses/id'].includes(manu) ? 'active' : ''}`}>
                <Link href="/courses" >Направления</Link>
              </li>

              <li className={manu === '/blog' ? 'active' : ''}><Link href="/blog" className="sub-menu-item">Блог</Link></li>
              <li className={manu === '/news' ? 'active' : ''}><Link href="/news" className="sub-menu-item">Новости</Link></li>
              <li className={`has-submenu parent-parent-menu-item ${['/features', '/pricing', '/instructors', '/faqs', '/blog', '/blog-sidebar', '/blog-detail'].includes(manu) ? 'active' : ''}`}>
                <Link href="#" onClick={() => setSubManu(subManu === '/page-item' ? '' : '/page-item')}>Информация</Link><span className="menu-arrow"></span>
                <ul className={`submenu ${['/page-item', '/auth-item', '/blog-item', '/special-item'].includes(subManu) ? 'open' : ''}`}>
                  <li ><Link href="/files/erip.pdf" target="_blank" className="sub-menu-item">Способы оплаты в ЕРИП</Link></li>
                  <li ><Link href="/files/rules_of_visiting.pdf" target="_blank" className="sub-menu-item">Правила посещения</Link></li>
                  <li >   <Link href="/files/contract.pdf" target="_blank" className="sub-menu-item">Договор</Link></li>
                </ul>
              </li>

              <li className={manu === '/contact' ? 'active' : ''}><Link href="/contact" className="sub-menu-item">Контакты</Link></li>
            </ul>
          </div>
        </div>
      </nav>

    </>
  )
}
