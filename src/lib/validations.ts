import { ApplicationStatus, BlogPostStatus, CourseLevel, CourseStatus, UserStatus } from "@/types/enum";
import { z } from "zod";

export const blogFormSchema = z.object({
  title: z.string().min(1, "Название обязательно"),
  content: z.string().min(10, "Описание должно быть не менее 10 символов"),
  images: z.array(z.string().min(1, "Изображение обязательно"))
    .max(5, "Максимум 5 изображений")
    .default([]), // Позволяем пустой массив
  category: z.string().min(1, "Категория обязательна"),
  authorId: z.number().min(1, "Автор обязателен"),
  status: z.nativeEnum(BlogPostStatus, {
    errorMap: () => ({ message: "Статус должен быть одним из draft, archived, published" })
  }),
  id: z.preprocess(
    (val) => (val === "" ? null : val),
    z.string().nullable().optional()
  ),
  tags: z.array(z.string()).default([]),
  metaTitle: z.string().nullable().optional(),
  metaDescription: z.string().nullable().optional(),
  keywords: z.string().nullable().optional(),
})
.refine((data) => {
  // Если статус "published", то изображения обязательны
  if (data.status === BlogPostStatus.PUBLISHED) {
    return data.images.length >= 1;
  }
  return true;
}, {
  message: "Для публикации поста необходимо добавить минимум 1 изображение",
  path: ["images"]
});

export const courseFormSchema = z.object({
  name: z.string().min(1, "Название обязательно"),
  description: z.string().min(10, "Описание должно быть не менее 10 символов"),
  detailedDescription: z.string().min(100, "Описание должно быть не менее 100 символов"),
  price: z.coerce.number().int().min(1, "Цена должна быть положительной"),
  duration: z.string().min(1, "Продолжительность обязательна"),
  status: z.nativeEnum(CourseStatus, {
    errorMap: () => ({ message: "Статус должен быть одним из draft, archived, published" })
  }),
  category: z.string().min(1, "Категория обязательна"),
  instructor: z.string().nullable().optional(),
  images: z.array(z.object({
    url: z.string().min(1, "Изображение обязательно"),
    videoUrl: z.string().optional(),
  })).min(1, "Минимум 1 изображение").max(2, "Максимум 2 изображения"),
  id: z.preprocess(
    (val) => (val === "" ? null : val),
    z.string().nullable().optional()
  ),
  level: z.nativeEnum(CourseLevel, {
    errorMap: () => ({ message: "Уровень должен быть одним из beginner, intermediate, advanced" })
  }).nullable().optional(),
  isShow: z.boolean().nullable().optional(),
  heading: z.string().nullable().optional(),
  color: z.string().nullable().optional(),
  metaTitle: z.string().nullable().optional(),
  metaDescription: z.string().nullable().optional(),
  keywords: z.string().nullable().optional(),
});

export const groupFormSchema = z.object({
  groupNumber: z.string().min(1, "Номер группы обязателен"),
  ageRange: z.string().min(1, "Диапазон возраста обязателен"),
  id: z.preprocess(
    (val) => (val === "" ? null : val),
    z.string().nullable().optional()
  ),
  maxStudents: z
    .number({
      required_error: "Максимальное количество студентов обязательно",
      invalid_type_error: "Введите число",
    })
    .min(1, "Максимальное количество студентов должно быть больше нуля"),
  courseId: z.number().min(1, "Курс обязателен"),
  schedule: z
    .array(
      z.object({
        dayOfWeek: z.string().optional(),
        startTime: z.string().optional(),
        endTime: z.string().optional(),
      })
    )
    .transform((items) =>
      items.filter(
        (item) =>
          item.dayOfWeek?.trim() &&
          item.startTime?.trim() &&
          item.endTime?.trim()
      )
    )
    .refine(
      (items) => items.length > 0,
      {
        message: "Хотя бы один день должен быть заполнен",
      }
    )
})

export const applicationFormSchemaClient = z.object({
  childName: z.string().min(1, "ФИ ребенка обязательно").trim(),
  parentPhone: z.string()
    .min(1, "Телефон родителя обязателен")
    .regex(/^\+375 \d{2} \d{3}-\d{2}-\d{2}$/, "Введите полный номер телефона в формате +375 XX XXX-XX-XX"),
  status: z.nativeEnum(ApplicationStatus, {
    errorMap: () => ({ message: "Статус должен быть одним из new, processing, confirmed, cancelled, pending" })
  }),
  parentEmail: z.string().min(1, "Родительский email обязателен").email("Некорректный email").trim(),
  message: z.string().nullable().optional(),
  photo: z.string().nullable().optional(),
  age: z.number().nullable().optional(),
  courseId: z.number().nullable().optional(),
  responseMessage: z.string().nullable().optional(),
  id: z.preprocess(
    (val) => (val === "" ? null : val),
    z.string().nullable().optional()
  ),
  rules: z.boolean().refine(value => value === true, {
    message: "Подтвердите согласие с условиями"
  }),
});

export const phoneSchema = z.string().regex(
  /^\+375 \d{2} \d{3}-\d{2}-\d{2}$/,
  "Введите полный номер телефона в формате +375 XX XXX-XX-XX"
);

export const contactFormSchemaClient = z.object({
  childName: z.string().min(1, "Название обязательно"),
  parentPhone: phoneSchema,
  status: z.nativeEnum(ApplicationStatus, {
    errorMap: () => ({ message: "Статус должен быть одним из new, processing, confirmed, cancelled, pending" })
  }),
  message: z.string().min(1, "Сообщение обязательно"),
});

export const applicationFormSchema = z.object({
  childName: z.string().min(1, "Название обязательно"),
  parentPhone: phoneSchema,
  status: z.nativeEnum(ApplicationStatus, {
    errorMap: () => ({ message: "Статус должен быть одним из new, processing, confirmed, cancelled, pending" })
  }),
  groupId: z.string({
    required_error: "Пожалуйста, выберите группу"
  }).min(1, "Группа обязательна"),
  parentEmail: z.string().min(1, "Родительский email обязателен"),
  message: z.string().nullable().optional(),
  photo: z.string().nullable().optional(),
  age: z.number().nullable().optional(),
  courseId: z.number().nullable().optional(),
  responseMessage: z.string().nullable().optional(),
  id: z.preprocess(
    (val) => (val === "" ? null : val),
    z.string().nullable().optional()
  ),
});

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

export type UserFormValues = z.infer<ReturnType<typeof userFormSchema>>;

export const userFormSchema = (isEdit: boolean) =>
  z.object({
    name: z.string().min(2, {
      message: "Название обязательно",
    }),
    email: z.string().email({
      message: "Введите корректную электронную почту",
    }),
    password: isEdit
      ? z.string().optional()
      : z
        .string()
        .min(8, { message: "Пароль должен содержать не менее 8 символов" })
        .regex(passwordRegex, {
          message:
            "Пароль должен содержать хотя бы одну заглавную букву, одну строчную букву и одну цифру",
        }),
    status: z
      .nativeEnum(UserStatus, {
        errorMap: () => ({
          message: "Статус должен быть одним из active, inactive",
        }),
      })
      .optional()
      .nullable(),
    role: z.string().min(1, "Роль обязательна"),
    phone: z.string().optional().nullable(),
    avatar: z.string().optional().nullable(),
    biography: z.string().optional().nullable(),
    birthDate: z.string().optional().nullable(),
    location: z.string().optional().nullable(),
    occupation: z.string().optional().nullable(),
    education: z.string().optional().nullable(),
    website: z.string().optional().nullable(),
    id: z.preprocess(
      (val) => (val === "" ? null : val),
      z.string().nullable().optional()
    ),
  });
