"use client";
import { Categories, CourseQueryParams } from "@/types/type";
import clsx from "clsx";
import { useEffect } from "react";

export default function CoursesNavigation({
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

  const toggleCategory = (url: string) => {
    let oldSelectedCategories: string[] = selectedCategories || [];
    const includesId = oldSelectedCategories.includes(url);
    let newSelectedCategories: string[] | undefined = [];
    if (includesId) {
      newSelectedCategories = oldSelectedCategories?.filter(
        (catUrl) => catUrl !== url,
      );
    } else {
      oldSelectedCategories = oldSelectedCategories.filter(
        (catUrl) => catUrl !== "all",
      );
      newSelectedCategories = [...oldSelectedCategories, url];
    }
    if (
      newSelectedCategories.length === 0 ||
      newSelectedCategories.length === categories.length
    ) {
      newSelectedCategories = ["all"];
    }
    setSearchParams({
      categories: newSelectedCategories,
      page: null,
      search: null,
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 h-12">
      {/* Categories */}
      <div className="flex gap-4">
        <div>
          <input
            className="hidden"
            type="checkbox"
            checked={selectedCategories?.includes("all")}
            onChange={(e) => {
              setSearchParams({
                categories: ["all"],
                page: null,
                search: null,
              });
            }}
            id="AllCategories"
          />
          <label
            className={clsx(
              "form-checkbox-label text-lg text-slate-400 " +
                "rounded-full border border-gray-300 px-3 py-2",
              {
                "bg-violet-50": selectedCategories?.includes("all"),
              },
            )}
            htmlFor="AllCategories"
          >
            Все категории
          </label>
        </div>
        {categories &&
          categories.map((category) => (
            <div key={category.id}>
              <input
                checked={!!searchParams.categories?.includes(category.url)}
                className="hidden"
                type="checkbox"
                onChange={() => toggleCategory(category.url)}
                value={category.id}
                id={`category-${category.id}`}
              />
              <label
                className={clsx(
                  "form-checkbox-label text-lg text-slate-400 " +
                    "rounded-full border border-gray-300 px-3 py-2",
                  {
                    "bg-violet-50": selectedCategories?.includes(category.url),
                  },
                )}
                htmlFor={`category-${category.id}`}
              >
                {category.name}
                <span className="text-violet-600 text-md font-semibold rounded-full h-5 ml-2">
                  {category.coursesCount}
                </span>
              </label>
            </div>
          ))}
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
