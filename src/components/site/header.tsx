import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="bg-background shadow">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link href="/" className="text-2xl font-bold">
          Образовательный центр
        </Link>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link href="/courses">Курсы</Link>
            </li>
            <li>
              <Link href="/about">О нас</Link>
            </li>
            <li>
              <Link href="/contact">Контакты</Link>
            </li>
          </ul>
        </nav>
        <Link href="/enroll">
          <Button>Записаться на курс</Button>
        </Link>
      </div>
    </header>
  )
}

