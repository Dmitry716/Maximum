import { CourseLevel, DayOfWeek } from "./enum";

export const CourseLevelLabels: Record<CourseLevel, string> = {
  [CourseLevel.BEGINNER]: "Начальный",
  [CourseLevel.INTERMEDIATE]: "Средний",
  [CourseLevel.ADVANCED]: "Профессиональный",
};

export const dayOfWeekLabels: Record<any, string> = {
  [DayOfWeek.MONDAY]: "Понедельник",
  [DayOfWeek.TUESDAY]: "Вторник",
  [DayOfWeek.WEDNESDAY]: "Среда",
  [DayOfWeek.THURSDAY]: "Четверг",
  [DayOfWeek.FRIDAY]: "Пятница",
  [DayOfWeek.SATURDAY]: "Суббота",
  [DayOfWeek.SUNDAY]: "Воскресенье",
};
