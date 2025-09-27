import Link from 'next/link';
import Image from 'next/image';


export default function AboutOne({ title }: { title: any }) {
  return (
    <>
      <div className="grid md:grid-cols-12 grid-cols-1 items-center gap-6">
        <div className="lg:col-span-6 md:col-span-7">
          <div className="relative">
            <div className="relative md:shrink-0 lg:me-0 me-10">
              <Image className="object-cover md:w-96 w-84 h-[500px] rounded-lg shadow-md dark:shadow-gyay-700" src='/images/course/1.jpg' width={0} height={0} sizes='100vw' style={{ width: '100%', height: 'auto' }} alt="" />
            </div>

            <div className="absolute bottom-10 lg:end-6 end-0">

              <div className="relative md:shrink-0">
                <Image className="object-cover size-48 rounded-lg shadow-md dark:shadow-gyay-700" src='/images/course/4.jpg' width={0} height={0} sizes='100vw' style={{ width: '100%', height: 'auto' }} alt="" />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 md:col-span-5">
          {title &&
            <span className="text-violet-600 font-semibold mb-3 uppercase">Our Story</span>
          }
          <h2>О Нас</h2>

          <p className="max-w-xl mx-auto">
            Спортивно-образовательный центр «Максимум» – это уникальное, современное пространство, где дети и подростки могут всесторонне расти, раскрывать и развивать свои таланты и способности. <br /> <br />
            Большое разнообразие направлений дополнительного образования позволяет каждому ребенку раскрыть свой потенциал в спорте, учебе и творчестве. У нас вы можете получить квалифицированную помощь логопеда, посетить увлекательные мастер-классы. <br /> <br />
            Мы с особым вниманием относимся к каждому ребенку, обеспечивая индивидуальный подход и необходимую поддержку, в том числе детям с ограниченными возможностями здоровья.
            Выбирая лучшее для своего ребенка – выбирайте «Максимум»!
          </p>

          <div className="mt-6">
            <Link
              href="/courses"
              className="h-10 px-5 tracking-wide inline-flex items-center justify-center font-medium rounded-md bg-violet-600/10 hover:bg-violet-600 text-violet-600 hover:text-white"
            >
              Подробнее <i className="mdi mdi-arrow-right align-middle ms-1"></i>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
