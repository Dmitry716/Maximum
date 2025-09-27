"use client"

import { useEffect, useState } from "react"
import { CrudLayout } from "@/components/crud/crud-layout"
import { DataTable } from "@/components/crud/data-table"
import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, Calendar } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { createCourse, createGroup, deleteCourse, deleteGroup, getAllCourses, getAllCoursesByInstructor, getCategories, getUsers, updateCourse, updateGroup, uploadFile } from "@/api/requests"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { z } from "zod"
import { Controller, useFieldArray, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CourseStatus, DayOfWeek, UserRole } from "@/types/enum"
import { Course, Group, User } from "@/types/type"
import { toast } from "sonner"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useAuth } from "@/hooks/auth-context"
import slugify from 'slugify'
import { courseFormSchema, groupFormSchema } from "@/lib/validations"
import { Switch } from "@/components/ui/switch"
import { dayOfWeekLabels } from "@/types/constants"
import { ScheduleGroup } from "@/components/schedule-group"
import Link from "next/link"
import TailwindAdvancedEditor from "@/components/tailwind/advanced-editor"
import { normalizeEditorValue } from "@/lib/normalize-conten-block"

type CourseFormValues = z.infer<typeof courseFormSchema>

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[] | null>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isFinishCourse, setFinishCourse] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState({
    open: false,
    id: "",
  });

  const [isEditing, setIsEditing] = useState(false)
  const [isEditingGroup, setIsEditingGroup] = useState(false)
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false)
  const [selectedGroups, setSelectedGroups] = useState<Course["groups"]>([])
  const queryClient = useQueryClient()
  const { user } = useAuth()

  if (!user) return null

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    watch,
    formState: { errors, isDirty },
  } = useForm<CourseFormValues>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      name: "",
      category: "",
      heading: "",
      level: undefined,
      description: "",
      price: 0,
      duration: "",
      instructor: null,
      images: [],
      status: CourseStatus.DRAFT,
      detailedDescription: "",
      color: "",
      metaTitle: "",
      metaDescription: "",
      keywords: "",
      id: "",
      isShow: true
    },
  });

  const {
    register: groupRegister,
    handleSubmit: groupHandleSubmit,
    setValue: groupSetValue,
    setError: groupSetError,
    reset: groupReset,
    watch: groupWatch,
    control: groupControl,
    formState: { errors: groupErrors, isDirty: groupIsDirty },
  } = useForm({
    resolver: zodResolver(groupFormSchema),
    defaultValues: {
      groupNumber: "",
      ageRange: "",
      maxStudents: 0,
      courseId: 0,
      schedule: [
        { dayOfWeek: DayOfWeek.MONDAY, startTime: "", endTime: "" },
        { dayOfWeek: DayOfWeek.TUESDAY, startTime: "", endTime: "" },
        { dayOfWeek: DayOfWeek.WEDNESDAY, startTime: "", endTime: "" },
        { dayOfWeek: DayOfWeek.THURSDAY, startTime: "", endTime: "" },
        { dayOfWeek: DayOfWeek.FRIDAY, startTime: "", endTime: "" },
        { dayOfWeek: DayOfWeek.SATURDAY, startTime: "", endTime: "" },
        { dayOfWeek: DayOfWeek.SUNDAY, startTime: "", endTime: "" },
      ],
    },
  });

  const { fields: groupFields } = useFieldArray({
    control: groupControl,
    name: "schedule",
  });

  const { data, isLoading } = useQuery({
    queryKey: ['courses', user.sub],
    queryFn: () =>
      user.role === UserRole.TEACHER
        ? getAllCoursesByInstructor(user.sub)
        : getAllCourses("all"),
    staleTime: 1000 * 60 * 5,
    retry: 3,
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: 1000 * 60 * 5,
    retry: 3,
  })

  const { data: users } = useQuery<User[], Error>({
    queryKey: ['teachers', "teacher"],
    queryFn: () => getUsers("teacher"),
    staleTime: 1000 * 60 * 5,
    retry: 3,
    enabled: user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN,
  });

  useEffect(() => {
    if (user.role !== UserRole.ADMIN && user.role !== UserRole.SUPER_ADMIN) {
      setValue("instructor", user.sub);
    }
  }, [user.role]);

  useEffect(() => {
    if (data) {
      setCourses(data as any);
    }
  }, [data]);

  const {
    mutate: createOrUpdateCourse,
    isPending
  } = useMutation({
    mutationFn: async (data: any) => {
      if (isEditing) {
        const res = await updateCourse({
          data: {
            name: data.name,
            description: data.description,
            detailedDescription: data.detailedDescription,
            price: data.price,
            duration: data.duration,
            status: data.status,
            categoryId: data.categoryId,
            instructorId: data.instructorId,
            images: data.images,
            color: data.color,
            metaTitle: data.metaTitle,
            metaDescription: data.metaDescription,
            keywords: data.keywords,
            level: data.level,
            heading: data.heading,
            url: data.url,
            isShow: data.isShow
          },
          id: String(data.id)
        });
        return { ...res, updatedData: data }
      } else {
        const res = await createCourse({
          name: data.name,
          description: data.description,
          detailedDescription: data.detailedDescription,
          price: data.price,
          duration: data.duration,
          status: data.status,
          categoryId: data.categoryId,
          instructorId: data.instructorId,
          images: data.images,
          color: data.color,
          metaTitle: data.metaTitle,
          metaDescription: data.metaDescription,
          keywords: data.keywords,
          url: data.url,
          level: data.level,
          heading: data.heading,
          isShow: data.isShow
        });
        return { ...res, updatedData: data }
      }
    },
    onSuccess: (result: any) => {
      if (result) {
        if (isEditing) {
          toast.success("Курс обновлен успешно")
        } else {
          setFinishCourse(true)
          groupSetValue("courseId", result.id)
          toast.success("Курс создан успешно")
          queryClient.invalidateQueries({ queryKey: ['categoriesAdmin'] })
        }
        queryClient.invalidateQueries({ queryKey: ["courses"] })
      }
    },
    onError: (error: any) => {
      console.log("Xatolik:", error);
      if (error.response?.data?.statusCode === 400) {
        toast.error(error.response?.data?.message)
      }
    },
  });

  const {
    mutate: deleteGroupMutation,
    isPending: isDeletingGroup
  } = useMutation({
    mutationFn: async (groupId: string) => {
      const res = await deleteGroup(groupId)
      return { ok: res, id: groupId }
    },
    onSuccess: (result: any) => {
      if (result) {
        setSelectedGroups((prev: any) => prev.filter((g: any) => g.id !== Number(result.id)))
        toast.success("Группа удалена успешно")
      }
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const {
    mutate: createGroupMutation,
    isPending: isCreatingGroup,
  } = useMutation({
    mutationFn: async (data: Group) => {
      if (isEditingGroup) {
        return await updateGroup(data)
      }
      return await createGroup(data)
    },
    onSuccess: (result: any) => {
      if (isEditingGroup) {
        setSelectedGroups((prev: any) => prev.map((g: any) => g.id === Number(result.id) ? result : g))
        toast.success("Группа обновлена успешно")
        setIsEditingGroup(false)
      } else {
        toast.success("Группа создана успешно")
        setSelectedGroups((prev: any) => [...(prev || []), result]);
      }
      groupReset({
        groupNumber: "",
        ageRange: "",
        maxStudents: 0,
        courseId: Number(watch("id")) || 0,
        schedule: [
          { dayOfWeek: DayOfWeek.MONDAY, startTime: "", endTime: "" },
          { dayOfWeek: DayOfWeek.TUESDAY, startTime: "", endTime: "" },
          { dayOfWeek: DayOfWeek.WEDNESDAY, startTime: "", endTime: "" },
          { dayOfWeek: DayOfWeek.THURSDAY, startTime: "", endTime: "" },
          { dayOfWeek: DayOfWeek.FRIDAY, startTime: "", endTime: "" },
          { dayOfWeek: DayOfWeek.SATURDAY, startTime: "", endTime: "" },
          { dayOfWeek: DayOfWeek.SUNDAY, startTime: "", endTime: "" },
        ],
      })
      queryClient.invalidateQueries({ queryKey: ["courses"] })
      setTimeout(() => {
        const inputEl = document.getElementById("groups");
        if (inputEl) {
          inputEl.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 1000)
    },
    onError: (error: any) => {
      console.log(error);
      const rawMessage = error?.response?.data?.message;
      if (rawMessage) {
        const messages = Array.isArray(rawMessage) ? rawMessage : [rawMessage];

        messages.forEach(msg => {
          if (typeof msg === "string") {
            const [type, message] = msg.includes("::")
              ? msg.split("::")
              : ["unknown", msg.trim()];

            toast.error(message || "Xatolik yuz berdi")

            if (type === "groupNumber") {
              groupSetError("groupNumber", { message: message })
              const inputEl = document.getElementById("groupNumber");
              if (inputEl) {
                inputEl.scrollIntoView({ behavior: "smooth", block: "center" });
                inputEl.focus();
              }
            } else if (type === "maxStudents") {
              groupSetError("maxStudents", { message: message })
              const inputEl = document.getElementById("maxStudents");
              if (inputEl) {
                inputEl.scrollIntoView({ behavior: "smooth", block: "center" });
                inputEl.focus();
              }
            }
          }
        });
      }
    },
  });

  const {
    mutate: handleDeleteCourseMutation,
    isPending: isDeletingCourse,
  } = useMutation({
    mutationFn: async (data: string) => {
      return await deleteCourse(data)
    },
    onSuccess: (result: any) => {
      if (result) {
        toast.success("Курс удален успешно")
        setIsDeleteDialogOpen({ id: '', open: false })
        queryClient.invalidateQueries({ queryKey: ['courses'] })
      }
    },
    onError: (error: any) => {
      console.log(error);

    },
  });

  const openScheduleModal = (groups: Course["groups"]) => {
    setSelectedGroups(groups)
    setScheduleModalOpen(true)
  }

  const columns: ColumnDef<Course>[] = [
    {
      accessorKey: "images",
      header: "Изображение",
      cell: ({ row }) => (
        <Image
          src={`${process.env.NEXT_PUBLIC_API_URL}/${row.original?.images[0]?.url}` || "/placeholder.svg"}
          alt={`${process.env.NEXT_PUBLIC_API_URL}/${row.original.name}`}
          width={100}
          height={100}
          style={{ height: 100, width: 100 }}
          className="rounded-md object-contain"
        />
      ),
    },
    {
      accessorKey: "name",
      header: "Название",
      cell: ({ row }) => <Link
        // @ts-ignore
        href={`${process.env.NEXT_PUBLIC_API_URL}/${row.original.category?.url}/${row.original.url}`}
        target="_blank"
        className="max-w-[200px] text-blue-500 truncate">
        {row.original.name}
      </Link>,
    },
    {
      accessorKey: "category",
      header: "Категория",
      accessorFn: (row: any) => row.category?.name ?? row.category,
    },
    {
      accessorKey: "price",
      header: "Цена",
      cell: ({ row }) => `${Math.round(Number(row.original.price))} BYN/мес.`,
    },
    {
      accessorKey: "studentCount",
      header: "Студенты",
    },
    {
      accessorKey: "status",
      header: "Статус",
      cell: ({ row }) => {
        const course = row.original
        return course.status === CourseStatus.DRAFT
          ? "Черновик"
          : course.status === CourseStatus.PUBLISHED
            ? "Опубликован" : "Архив"
      },
    },
    {
      id: "schedule",
      header: "Расписание",
      cell: ({ row }) => {
        const course = row.original
        if (!course.groups || course.groups.length === 0) {
          return "Нет групп"
        }

        return (
          <div className="flex items-center">
            <div className="max-w-[150px] text-xs mr-2 truncate">{course.groups.length} групп(ы)</div>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation()
                openScheduleModal(course.groups)
              }}
              className="h-6 w-6"
            >
              <Calendar className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const course = row.original
        return (
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={() => {
              handleEdit(course)
              setFinishCourse(true)
              groupSetValue("courseId", Number(course.id))
              course?.groups && setSelectedGroups(course.groups)
            }}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => {
              setIsDeleteDialogOpen({
                open: true,
                id: course.id,
              })
            }}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
  ]

  const handleEdit = (course: Course) => {
    reset({
      name: course.name,
      description: course.description,
      detailedDescription: course.detailedDescription,
      price: course.price,
      duration: String(course.duration),
      status: course.status,
      heading: course.heading,
      category: String(course.categoryId),
      instructor: course.instructorId ? String(course.instructorId) : null,
      images: course.images,
      color: course.color,
      metaTitle: course.metaTitle,
      metaDescription: course.metaDescription,
      keywords: course.keywords,
      level: course.level,
      id: String(course.id),
      isShow: course.isShow
    })
    setIsEditing(true)
    setIsDialogOpen(true)
  }

  const onSubmit = async (data: any) => {

    const courseSlug = slugify(data.name, { lower: true })

    if (user.role === UserRole.TEACHER) {
      const payload = {
        ...data,
        url: courseSlug,
        categoryId: data.category,
        instructorId: data.instructor ? data.instructor : user.sub,
      };
      createOrUpdateCourse(payload);
    } else {
      const payload = {
        ...data,
        url: courseSlug,
        categoryId: data.category,
        instructorId: data.instructor ? data.instructor : null,
      };
      createOrUpdateCourse(payload);
    }
  };

  const onSubmitGroup = async (data: any) => {
    createGroupMutation(data)
  };

  async function handleUploadFile(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileType", "course_material");
    formData.append("entityId", "1");
    formData.append("entityType", "course");

    const data = await uploadFile(formData);
    return data.path;
  }

  const handleSelectGroup = (group: Group) => {
    setIsEditingGroup(true);

    const days = [
      DayOfWeek.MONDAY,
      DayOfWeek.TUESDAY,
      DayOfWeek.WEDNESDAY,
      DayOfWeek.THURSDAY,
      DayOfWeek.FRIDAY,
      DayOfWeek.SATURDAY,
      DayOfWeek.SUNDAY,
    ];

    const normalizedSchedule = days.map((day) => {
      const existing = group.schedule?.find((s) => s.dayOfWeek === day);
      return {
        dayOfWeek: day,
        startTime: existing?.startTime || "",
        endTime: existing?.endTime || "",
      };
    });

    groupReset({
      groupNumber: group.groupNumber,
      ageRange: group.ageRange,
      maxStudents: group.maxStudents,
      schedule: normalizedSchedule,
      courseId: group.courseId,
      id: String(group.id),
    });

    setTimeout(() => {
      const inputEl = document.getElementById("create-group");
      if (inputEl) {
        inputEl.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 500)
  };

  return (
    <CrudLayout
      title="Курсы"
      description="Управление курсами вашего образовательного центра"
      createButtonLabel="Создать курс"
      onCreateClick={() => {
        reset({
          name: "",
          category: "",
          level: undefined,
          description: "",
          price: 0,
          duration: "",
          instructor: user.role === UserRole.TEACHER ? String(user.sub) : null,
          images: [],
          status: CourseStatus.DRAFT,
          detailedDescription: "",
          color: "",
          metaTitle: "",
          metaDescription: "",
          keywords: "",
          id: "",
          isShow: true
        })
        setFinishCourse(false)
        setSelectedGroups([])
        setIsEditing(false)
        setIsDialogOpen(true)
      }}
    >

      {isLoading
        ? <div>Loading...</div>
        : <DataTable columns={columns} data={courses} searchKey="name" />
      }

      {/* Модальное окно расписания групп */}
      <Dialog open={scheduleModalOpen} onOpenChange={setScheduleModalOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Расписание групп</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {selectedGroups && <ScheduleGroup groups={selectedGroups} />}
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog Modal for delete course */}
      <Dialog open={isDeleteDialogOpen.open} onOpenChange={(e) => setIsDeleteDialogOpen({ ...isDeleteDialogOpen, open: e })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Удалить курс</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Вы уверены, что хотите удалить этот курс?
          </DialogDescription>
          <DialogFooter>
            {/* Cancel Button */}
            <Button onClick={() => {
              setIsDeleteDialogOpen({ id: '', open: false })
            }} >
              Отменить
            </Button>

            <Button
              disabled={isDeletingCourse}
              onClick={() => {
                handleDeleteCourseMutation(isDeleteDialogOpen.id)
              }}
              variant="destructive">
              Удалить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isDialogOpen}
        onOpenChange={(e) => {
          setIsDialogOpen(e)
        }}>
        <DialogContent className="max-w-3xl max-h-[95vh] overflow-y-auto">
          <DialogHeader className="px-2">
            <DialogTitle>{isEditing ? "Редактировать курс" : "Создать новый курс"}</DialogTitle>
            <DialogDescription>
              {isEditing ? "Измените информацию о курсе здесь." : "Заполните информацию о новом курсе здесь."}
            </DialogDescription>
          </DialogHeader>

          {/* Main */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 px-2 py-4 overflow-y-auto" style={{ maxHeight: "calc(95vh - 150px)" }}>
              {/* Основные поля формы */}
              <div className="grid grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Название</Label>
                  <Input className="hidden"  {...register("id")} />
                  <Input
                    id="name"
                    {...register("name")}
                  />
                  {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                </div>
                
                {/* Category */}
                <div className="space-y-2">
                  <Label htmlFor="category">Категория</Label>
                  {categories && categories.length > 0 ? (
                    <Select
                      value={watch("category")}
                      onValueChange={(value) => setValue("category", value, { shouldDirty: true })}
                    >
                      <SelectTrigger>
                        {
                          categories.find((category) => category.id == watch("category"))?.name
                          || "Выберите категорию"
                        }
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>Нет категории</div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Сначала создайте категорию</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                  {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Описание</Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  rows={4}
                />
                {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="detailedDescription">Подробное описание</Label>
                <Controller
                  name="detailedDescription"
                  control={control}
                  rules={{ required: 'Описание обязательно' }}
                  render={({ field }) => (
                    <TailwindAdvancedEditor
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
                {errors.detailedDescription && (
                  <p className="text-red-500 text-sm">
                    {errors.detailedDescription.message as string}
                  </p>
                )}
              </div>


              <div className="grid grid-cols-2 gap-4">
                {/* Price */}
                <div className="space-y-2">
                  <Label htmlFor="price">Цена</Label>
                  <Input
                    id="price"
                    type="number"
                    {...register("price")}
                  />
                  {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
                </div>

                {/* Duration */}
                <div className="space-y-2">
                  <Label htmlFor="duration">Продолжительность</Label>
                  <Input
                    id="duration"
                    {...register("duration")} />
                  {errors.duration && <p className="text-red-500 text-sm">{errors.duration.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Level */}
                {/* <div className="space-y-2">
                  <Label htmlFor="level">Уровень</Label>
                  <Select
                    value={watch("level") || ""}
                    onValueChange={(value) =>
                      setValue("level", value as CourseLevel, { shouldDirty: true })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите Уровень" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={CourseLevel.BEGINNER}>{CourseLevelLabels[CourseLevel.BEGINNER]}</SelectItem>
                      <SelectItem value={CourseLevel.INTERMEDIATE}>{CourseLevelLabels[CourseLevel.INTERMEDIATE]}</SelectItem>
                      <SelectItem value={CourseLevel.ADVANCED}>{CourseLevelLabels[CourseLevel.ADVANCED]}</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.level && <p className="text-red-500 text-sm">{errors.level.message}</p>}
                </div> */}

                {/* Instructor */}
                {user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN && <div className="space-y-2">
                  <Label htmlFor="instructor">Инструктор</Label>
                  {users && users.length > 0 ? <Select
                    value={watch("instructor") || ""}
                    onValueChange={(value) => setValue("instructor", value, { shouldDirty: true })}
                  >
                    <SelectTrigger>
                      {
                        users.find(u => u.id.toString() === watch("instructor"))?.name
                        || "Выберите инструктора"
                      }
                    </SelectTrigger>
                    <SelectContent>
                      {users && users.map((user, index) => (
                        <SelectItem key={`instructor-${user.id}`} value={String(user.id)}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                    : (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div>Нет Инструктор</div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Сначала создайте Инструктор</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  {errors.instructor && <p className="text-red-500 text-sm">{errors.instructor.message}</p>}
                </div>}
              </div>

              {/* Image */}
              <div className="space-y-2">
                <Label htmlFor="images-upload">Изображения (максимум 2)</Label>
                <div className="flex flex-col gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="bg-primary/5 hover:bg-primary/10"
                    onClick={() => document.getElementById("images-upload")?.click()}
                  >
                    Загрузить изображения
                  </Button>
                  {errors.images && <p className="text-red-500 text-sm">{errors.images.message}</p>}
                  <Input
                    id="images-upload"
                    type="file"
                    accept="images/*"
                    multiple
                    className="hidden"
                    onChange={async (e) => {
                      const files = Array.from(e.target.files || []).slice(0, 2);
                      try {
                        const uploaded = await Promise.all(
                          files.map(async (file) => {
                            const path = await handleUploadFile(file);
                            return { url: path };
                          })
                        );
                        const current = watch("images") || [];
                        setValue("images", [...current, ...uploaded].slice(0, 2), { shouldDirty: true });
                      } catch (error) {
                        console.error(error);
                        alert("Файл не загружен");
                      }
                    }}
                  />
                  <div className="flex gap-4 flex-wrap">
                    {watch("images")?.map((images, index) => (
                      <div key={images.url} className="relative h-32 w-32 rounded-md overflow-hidden border">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_API_URL}/${images.url}`}
                          alt={`Изображение ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = watch("images").filter((_, i) => i !== index);
                            setValue("images", updated, { shouldDirty: true });
                          }}
                          className="absolute top-1 right-1 bg-white text-black p-1 rounded-full shadow"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Status and IsShow */}
              <div className="grid grid-cols-2 gap-4">
                {/* Is Show */}
                <div className="space-y-4 mt-1 items-center flex flex-col">
                  <Label htmlFor="airplane-mode">Тренер-показать/скрыть для карточки</Label>
                  <Switch
                    onCheckedChange={(checked) => setValue("isShow", checked, { shouldDirty: true })}
                    checked={!!watch("isShow")}
                  />
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <Label htmlFor="status">Статус</Label>
                  <Select
                    defaultValue={CourseStatus.DRAFT}
                    value={watch("status")}
                    onValueChange={(value) => {
                      setValue("status", value as CourseStatus, { shouldDirty: true });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите статус" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={CourseStatus.DRAFT}>Черновик</SelectItem>
                      <SelectItem value={CourseStatus.ARCHIVED}>Архив</SelectItem>
                      <SelectItem value={CourseStatus.PUBLISHED}>Опубликованный</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
                </div>
              </div>

              {/* Groups */}
              <div className="grid gap-4 py-4">
                {selectedGroups && <ScheduleGroup
                  handleSelectGroup={handleSelectGroup}
                  isDeletingGroup={isDeletingGroup}
                  deleteGroup={(id) => deleteGroupMutation(id)}
                  groups={selectedGroups} />}
              </div>
              <div id="groups"></div>

              {/* SEO */}
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>SEO настройки</AccordionTrigger>
                  <AccordionContent className="grid grid-cols-1 gap-4 px-2">
                    {/* Meta Title */}
                    <div className="space-y-2">
                      <Label htmlFor="metaTitle">Мета-заголовок</Label>
                      <Input
                        id="metaTitle"
                        {...register("metaTitle")}
                      />
                      {errors.metaTitle && <p className="text-red-500 text-sm">{errors.metaTitle.message}</p>}
                    </div>

                    {/* Meta Description */}
                    <div className="space-y-2">
                      <Label htmlFor="metaDescription">Мета-описание</Label>
                      <Textarea
                        id="metaDescription"
                        {...register("metaDescription")}
                        rows={4}
                      />
                      {errors.metaDescription && <p className="text-red-500 text-sm">{errors.metaDescription.message}</p>}
                    </div>

                    {/* Meta Description */}
                    <div className="space-y-2">
                      <Label htmlFor="keywords">Keywords (через запятую)</Label>
                      <Input
                        id="keywords"
                        {...register("keywords")}
                      />
                      {errors.keywords && <p className="text-red-500 text-sm">{errors.keywords.message}</p>}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

            </div>
            <DialogFooter>
              <Button type="submit" disabled={isPending || !isDirty} >{isEditing ? "Сохранить изменения" : "Создать курс"}</Button>
            </DialogFooter>
          </form>

          {/* Раздел групп */}
          <form onSubmit={groupHandleSubmit(onSubmitGroup)}>
            <fieldset disabled={!isFinishCourse} className={`${!isFinishCourse ? "opacity-50" : ""}`}>
              <div className="space-y-4 flex flex-col">
                <Label>Группы и расписание</Label>

                <Card className="p-4">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {/* Group name */}
                    <div className="space-y-2">
                      <Label htmlFor={`groupNumber`}>Название группы</Label>
                      <Input
                        id="groupNumber"
                        {...groupRegister("groupNumber")}
                      />
                      {groupErrors.groupNumber && <p className="text-red-500 text-sm">{groupErrors.groupNumber.message}</p>}
                    </div>
                    {/* Group age */}
                    <div className="space-y-2">
                      <Label htmlFor={`ageRange`}>Возрастной диапазон</Label>
                      <Input
                        id="ageRange"
                        {...groupRegister("ageRange")}
                      />
                      {groupErrors.ageRange && <p className="text-red-500 text-sm">{groupErrors.ageRange.message}</p>}
                    </div>
                  </div>
                  {/* Schedule */}
                  <div className="space-y-2 mb-4">
                    {groupFields.map((day, index) => (
                      <div id={index == 1 ? "create-group" : ""} key={index} className="space-y-2">
                        <Label>
                          {day?.dayOfWeek ? dayOfWeekLabels[day.dayOfWeek] : ""}
                        </Label>
                        <div className="grid grid-cols-3 gap-2 items-center">
                          <Input
                            type="time"
                            {...groupRegister(`schedule.${index}.startTime`)}
                          />
                          <Input
                            type="time"
                            {...groupRegister(`schedule.${index}.endTime`)}
                          />
                        </div>
                      </div>
                    ))}
                    {groupErrors.schedule?.root && <p className="text-red-500 text-sm">{groupErrors.schedule.root.message}</p>}
                  </div>

                  {/* Max students */}
                  <div className="space-y-2 mb-4">
                    <Label htmlFor={`maxStudents`}>Максимальное количество учеников</Label>
                    <Input
                      id="maxStudents"
                      type="number"
                      {...groupRegister("maxStudents", { valueAsNumber: true })}
                    />
                    {groupErrors.maxStudents && <p className="text-red-500 text-sm">{groupErrors.maxStudents.message}</p>}
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <Label htmlFor="courseId">Категория курса</Label>
                    <Select
                      defaultValue={String(groupWatch("courseId"))}
                      value={String(groupWatch("courseId"))}
                      disabled
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите категорию" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={String(groupWatch("courseId"))}>
                          {watch("name")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {groupErrors.courseId && <p className="text-red-500 text-sm">{groupErrors.courseId.message}</p>}
                  </div>
                </Card>

                <DialogFooter>
                  <Button
                    size={"sm"}
                    type="submit"
                    disabled={isCreatingGroup || !groupIsDirty}
                  >
                    {isEditingGroup ? "Сохранить изменения" : "Создать группу"}
                  </Button>
                </DialogFooter>
              </div>
            </fieldset>
          </form>
        </DialogContent>
      </Dialog>
    </CrudLayout>
  )
}

