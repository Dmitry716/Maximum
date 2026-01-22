import {
  createLoader,
  createSerializer,
  parseAsInteger,
  parseAsString,
  ParserMap,
} from "nuqs/server";
import { LIMIT_PAGE, PAGE } from "./constants";

export const coursesSearchParamsParserMap: ParserMap = {
  category: parseAsString.withDefault("all"),
  limit: parseAsInteger.withDefault(LIMIT_PAGE),
  page: parseAsInteger.withDefault(PAGE),
};

export const loadCoursesSearchParams = createLoader(
  coursesSearchParamsParserMap,
);

export const paginationSearchParamsParserMap: ParserMap = {
  limit: parseAsInteger.withDefault(LIMIT_PAGE),
  page: parseAsInteger.withDefault(PAGE),
};

export const loadPaginationSearchParams = createLoader(
  paginationSearchParamsParserMap,
);

export const paginationSerialize = createSerializer(
  paginationSearchParamsParserMap,
);
