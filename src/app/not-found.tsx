// app/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen max-w-7xl mx-auto flex flex-col justify-between px-6 py-12 text-center">
      <header className="flex justify-between items-start">
        <span className="text-xl font-semibold">Максимум</span>
        <span className="text-sm text-gray-500">Ошибка 404</span>
      </header>

      <main className="flex flex-col items-start justify-center flex-1 space-y-6">
        <h1 className="text-3xl md:text-5xl font-bold text-start">Такой страницы нет</h1>
        <p className="text-gray-600 max-w-md text-start">
          Ссылка, по которой вы перешли, никуда не ведет. Возможно, в ней была опечатка, или эта страница была удалена.
        </p>
        <Link href="/" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-medium">
          Перейти на главную
        </Link>
      </main>

      <footer className="flex justify-between items-center text-sm mt-8">
        <Link href="https://maxximum.by">maxximum.by</Link>
      </footer>
    </div >
  );
}
