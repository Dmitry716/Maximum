'use client'
import React, { useEffect, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { Categories, CourseQueryParams } from "@/types/type";
import { useRouter } from 'next/navigation';

export default function CoursesSidebar({
  filters,
  setFilters,
  categories = [],
}: {
  ages: string[];
  filters: CourseQueryParams;
  setFilters: React.Dispatch<React.SetStateAction<CourseQueryParams>>;
  categories?: Categories[];
}) {
  const [search, setSearch] = useState(filters.search ?? '');
  const [selectedCategories, setSelectedCategories] = useState<number[]>(filters.categories ?? []);
  const [level, setLevel] = useState(filters.level ?? '');
  const [minSlider, setMinSlider] = useState(0);
  const [maxSlider, setMaxSlider] = useState(100);
  const router = useRouter();

  const SLIDER_MIN = 0;
  const SLIDER_MAX = 100;
  const REAL_MAX = 1000000;

  const minPrice = Math.floor((minSlider / SLIDER_MAX) * REAL_MAX);
  const maxPrice = maxSlider === SLIDER_MAX
    ? REAL_MAX
    : Math.floor((maxSlider / SLIDER_MAX) * REAL_MAX);

  const handleMinSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = +e.target.value;
    setMinSlider(Math.min(value, maxSlider));
  };

  const handleMaxSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = +e.target.value;
    setMaxSlider(Math.max(value, minSlider));
  };

  const applyFilters = () => {
    setFilters(prev => ({
      ...prev,
      page: 1,
      search,
      categories: selectedCategories,
      minPrice,
      maxPrice,
      level
    }));
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      applyFilters();
    }, 500);

    return () => clearTimeout(timeout);
  }, [minPrice, maxPrice, search, selectedCategories, level])

  useEffect(() => {
    setSelectedCategories(filters.categories ?? [])
  }, [filters.categories])

  const toggleCategory = (id: number) => {
    setSelectedCategories(prev =>
      prev.includes(id) ? prev.filter(catId => catId !== id) : [...prev, id]
    );
  };

  return (
    <div className="p-6 bg-white dark:bg-slate-900 rounded-md shadow shadow-slate-100 dark:shadow-slate-800 sticky top-20">

      {/* Search */}
      <form>
        <div>
          <label htmlFor="searchname" className="font-semibold text-xl">Поиск направления</label>
          <div className="relative mt-2">
            <FiSearch className="absolute top-[10px] start-3 size-5" />
            <input onChange={(e) => setSearch(e.target.value)} name="search" id="searchname" type="text" className="w-full py-2 px-3 border border-slate-100 dark:border-slate-800 focus:border-violet-600/30 dark:focus:border-violet-600/30 bg-transparent focus:outline-none rounded-md h-10 ps-10" placeholder="Поиск" />
          </div>
        </div>
      </form>

      {/* Categories */}
      <div className="mt-6">
        <h3 className="font-semibold">Категории</h3>
        <div className="block">
          <div className="flex justify-between mt-2">
            <div className="inline-flex items-center mb-0">
              <input
                className="form-checkbox h-5 w-5 rounded border-gray-200 dark:border-gray-800 text-violet-600 focus:border-violet-300 focus:ring focus:ring-offset-0 focus:ring-violet-200 focus:ring-opacity-50 me-2"
                type="checkbox"
                checked={selectedCategories.length === 0}
                onChange={() => {
                  router.push('/courses')
                  setSelectedCategories([])
                }}
                id="AllCategories"
              />
              <label className="form-checkbox-label text-lg text-slate-400" htmlFor="AllCategories">
                Все категории
              </label>
            </div>
          </div>

          {categories && categories.map((category) => (
            <div key={category.id} className="flex justify-between mt-2">
              <div className="inline-flex items-center mb-0">
                <input
                  checked={selectedCategories.includes(Number(category.id))}
                  className="form-checkbox h-5 w-5 rounded border-gray-200 dark:border-gray-800 text-violet-600 focus:border-violet-300 focus:ring focus:ring-offset-0 focus:ring-violet-200 focus:ring-opacity-50 me-2"
                  type="checkbox"
                  onChange={() => toggleCategory(Number(category.id))}
                  value={category.id}
                  id={`category-${category.id}`}
                />
                <label className="form-checkbox-label text-lg text-slate-400" htmlFor={`category-${category.id}`}>
                  {category.name}
                </label>
              </div>

              <span className="  text-violet-600 text-md  font-semibold rounded-full h-5">
                {category.coursesCount}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Price range */}
      {/* <div className="mt-6">
        <h3 className="font-semibold">Цена</h3>

        <div className="range-slider mt-3">
          <span className="flex justify-between pb-2">
            <span>
              <input
                type="number"
                className="text-slate-400 w-20"
                value={Math.floor(minPrice)}
                onChange={(e) =>
                  setMinSlider((+e.target.value / REAL_MAX) * SLIDER_MAX)
                }
              />
            </span>

            <span>
              <input
                type="number"
                className="text-slate-400 w-20"
                value={Math.floor(maxPrice)}
                onChange={(e) =>
                  setMaxSlider((+e.target.value / REAL_MAX) * SLIDER_MAX)
                }
              />
            </span>
          </span>

          <input
            type="range"
            min={SLIDER_MIN}
            max={SLIDER_MAX}
            step={1}
            value={minSlider}
            onChange={handleMinSliderChange}
            className="w-full"
          />
          <input
            type="range"
            min={SLIDER_MIN}
            max={SLIDER_MAX}
            step={1}
            value={maxSlider}
            onChange={handleMaxSliderChange}
            className="w-full mt-2"
          />
        </div>
      </div> */}

      {/* Level */}
      {/* <div className="mt-6">
        <h3 className="font-semibold">Выбрать возраст</h3>
        <div className="block">
          <div className="flex flex-col gap-y-2 justify-between mt-2">
            <div className="inline-flex items-center mb-0">
              <input
                onChange={() => setLevel('')}
                checked={level === ''}
                className="form-radio h-5 w-5 rounded-full border-gray-200 dark:border-gray-800 text-violet-600 focus:ring-violet-200 me-2"
                type="radio"
                name="courseLevel"
                id="allS"
              />
              <label className="text-slate-400 text-lg" htmlFor="all">Все</label>
            </div>
            {ages && ages.map((age) => (
              <div key={age} className="inline-flex items-center mb-0">
                <input
                  onChange={() => setLevel(age)}
                  checked={level === age}
                  className="form-radio h-5 w-5 rounded-full border-gray-200 dark:border-gray-800 text-violet-600 focus:ring-violet-200 me-2"
                  type="radio"
                  name="courseLevel"
                  id="all"
                />
                <label className="text-slate-400 text-lg" htmlFor="all">{age}</label>
              </div>
            ))}
          </div>

        </div>
      </div> */}
      
    </div>
  )
}
