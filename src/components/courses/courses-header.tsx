"use client";

import { coursesSearchParamsParserMap } from "@/lib/search-params";
import { Categories } from "@/types/type";
import { useQueryStates } from "nuqs";
import { FunctionComponent } from "react";

interface CoursesHeaderProps {
  categories: Categories[];
}

const CoursesHeader: FunctionComponent<CoursesHeaderProps> = (params) => {
  const { categories } = params;
  const [coursesSearchParams] = useQueryStates(coursesSearchParamsParserMap);
  const selectedCategory = categories.find(
    (cat) => cat.url === coursesSearchParams.category,
  ) || { name: "Кружки и секции", description: "Кружки и секции" };
  const selectedCategoryDescription =
    selectedCategory?.description ??
    selectedCategory?.name ??
    "Кружки и секции";

  return (
    <div className="lg:col-span-5 md:col-span-4">
      <h1 className="text-2xl md:leading-normal leading-normal font-semibold">
        {selectedCategoryDescription}
      </h1>
    </div>
  );
};

export default CoursesHeader;
