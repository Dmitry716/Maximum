"use client";

import { coursesSearchParamsMap } from "@/lib/coursesSearchParams";
import { Categories, Category } from "@/types/type";
import { useQueryStates } from "nuqs";
import { FunctionComponent } from "react";

interface CoursesHeaderProps {
  categories: Categories[];
}

const CoursesHeader: FunctionComponent<CoursesHeaderProps> = (params) => {
  const { categories } = params;
  const [coursesSearchParams] = useQueryStates(coursesSearchParamsMap, {
    scroll: true,
  });
  const selectedCategories = coursesSearchParams.categories.map(
    (catUrl: string) => categories.find((cat) => cat.url === catUrl),
  );
  const selectedCategoriesDescriptions = selectedCategories.map(
    (cat: Category) => cat?.description ?? cat?.name ?? "Кружки и секции",
  );

  return (
    <div className="lg:col-span-5 md:col-span-4">
      <h1 className="text-2xl md:leading-normal leading-normal font-semibold">
        {selectedCategoriesDescriptions}
      </h1>
    </div>
  );
};

export default CoursesHeader;
