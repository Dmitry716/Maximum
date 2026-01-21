import {
  createLoader,
  parseAsInteger,
  parseAsNativeArrayOf,
  parseAsString,
  ParserMap,
} from "nuqs/server";

export const coursesSearchParamsMap: ParserMap = {
  categories: parseAsNativeArrayOf(parseAsString).withDefault(["all"]),
  limit: parseAsInteger,
  search: parseAsString,
  page: parseAsInteger,
};

export const loadCoursesSearchParams = createLoader(coursesSearchParamsMap);
