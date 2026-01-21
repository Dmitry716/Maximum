import {
  createLoader,
  parseAsInteger,
  parseAsString,
  ParserMap,
} from "nuqs/server";

export const coursesSearchParamsMap: ParserMap = {
  category: parseAsString.withDefault("all"),
  limit: parseAsInteger,
  page: parseAsInteger.withDefault(1),
};

export const loadCoursesSearchParams = createLoader(coursesSearchParamsMap);
