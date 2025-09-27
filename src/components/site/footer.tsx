import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-background mt-8 border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-4 text-lg font-semibold">О нас</h3>
            <p>Мы предоставляем качественное образование для всех.</p>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Быстрые ссылки</h3>
            <ul className="space-y-2">
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
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Контакты</h3>
            <p>Email: info@example.com</p>
            <p>Телефон: +7 (999) 123-45-67</p>
          </div>
        </div>
        <div className="mt-8 border-t pt-4 text-center">
          <p>&copy; 2024 Образовательный центр. Все права защищены.</p>
        </div>
      </div>
    </footer>
  )
}

