"use client";
import { Categories, CourseQueryParams } from "@/types/type";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FiSearch } from "react-icons/fi";

export default function CoursesSidebar({
  searchParams,
  setSearchParams,
  categories = [],
}: {
  ages: string[];
  searchParams: CourseQueryParams;
  setSearchParams: (queryParams: CourseQueryParams) => void;
  categories?: Categories[];
}) {
  const { categories: selectedCategories, search } = searchParams;
  const router = useRouter();

  const applyFilters = () => {
    setSearchParams({
      search,
      categories: selectedCategories,
    });
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      applyFilters();
    }, 500);

    return () => clearTimeout(timeout);
  }, [search, selectedCategories]);

  const toggleCategory = (id: number) => {
    const idStr = String(id);
    let oldSelectedCategories: string[] = selectedCategories || [];
    const includesId = oldSelectedCategories.includes(idStr);
    let newSelectedCategories: string[] | undefined = selectedCategories || [];
    if (includesId) {
      newSelectedCategories = newSelectedCategories?.filter(
        (catId) => catId !== idStr,
      );
    } else {
      if (oldSelectedCategories.includes("all")) {
        newSelectedCategories = undefined;
      } else {
        newSelectedCategories = [...newSelectedCategories, idStr];
      }
    }
    setSearchParams({ categories: newSelectedCategories, page: 1, search: "" });
  };

  return (
    <div className="p-6 bg-white dark:bg-slate-900 rounded-md shadow shadow-slate-100 dark:shadow-slate-800 sticky top-20">
      {/* Search */}
      <form>
        <div>
          <label htmlFor="searchname" className="font-semibold text-xl">
            Поиск направления
          </label>
          <div className="relative mt-2">
            <FiSearch className="absolute top-[10px] start-3 size-5" />
            <input
              onChange={(e) => setSearchParams({ search: e.target.value })}
              value={search}
              name="search"
              id="searchname"
              type="text"
              className="w-full py-2 px-3 border border-slate-100 dark:border-slate-800 focus:border-violet-600/30 dark:focus:border-violet-600/30 bg-transparent focus:outline-none rounded-md h-10 ps-10"
              placeholder="Поиск"
            />
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
                checked={!selectedCategories}
                onChange={() => {
                  router.push("/courses");
                  setSearchParams({ categories: undefined });
                }}
                id="AllCategories"
              />
              <label
                className="form-checkbox-label text-lg text-slate-400"
                htmlFor="AllCategories"
              >
                Все категории
              </label>
            </div>
          </div>
          {categories &&
            categories.map((category) => (
              <div key={category.id} className="flex justify-between mt-2">
                <div className="inline-flex items-center mb-0">
                  <input
                    checked={
                      !!searchParams.categories?.includes(String(category.id))
                    }
                    className="form-checkbox h-5 w-5 rounded border-gray-200 dark:border-gray-800 text-violet-600 focus:border-violet-300 focus:ring focus:ring-offset-0 focus:ring-violet-200 focus:ring-opacity-50 me-2"
                    type="checkbox"
                    onChange={() => toggleCategory(Number(category.id))}
                    value={category.id}
                    id={`category-${category.id}`}
                  />
                  <label
                    className="form-checkbox-label text-lg text-slate-400"
                    htmlFor={`category-${category.id}`}
                  >
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
  );
}
