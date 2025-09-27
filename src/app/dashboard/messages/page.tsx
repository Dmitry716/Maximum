"use client"

import { useEffect, useState } from "react"
import { CrudLayout } from "@/components/crud/crud-layout"
import { DataTable } from "@/components/crud/data-table"
import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Pencil, View } from "lucide-react"
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
import { createApplication, deleteApplication, getAllCourses, getApplications, updateApplication, uploadFile } from "@/api/requests"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { set, z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ApplicationStatus, FileType } from "@/types/enum"
import { Application, ApplicationWithLoading } from "@/types/type"
import { toast } from "sonner"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { applicationFormSchema } from "@/lib/validations"
import { PhoneInput } from "@/components/phone-input"
import { Trash2 } from "lucide-react"

const formatPhoneNumber = (input: string) => {
  const cleaned = input.replace(/\D/g, "")
  const match = cleaned.match(/^(\d{3})(\d{2})(\d{7})$/)
  if (match) {
    return `+${match[1]} ${match[2]} ${match[3]}`
  }
  return input
}

type ApplicationFormSchemaFormValues = z.infer<typeof applicationFormSchema>

export default function CoursesPage() {
  const [applications, setApplications] = useState<ApplicationWithLoading[] | null>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [moreDeatil, setMoreDetail] = useState({
    open: false,
    photo: "",
    message: ""
  })

  // Pagination state
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [total, setTotal] = useState(0)
  const queryClient = useQueryClient()

  const statusOptions = [
    { label: "Новая", value: ApplicationStatus.NEW },
    { label: "Записались", value: ApplicationStatus.PENDING },
    { label: "В обработке", value: ApplicationStatus.PROCESSING },
    { label: "Завершена", value: ApplicationStatus.CONFIRMED },
    { label: "Отменена", value: ApplicationStatus.CANCELLED },
  ]

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    resetField,
    watch,
    formState: { errors, isDirty },
  } = useForm<ApplicationFormSchemaFormValues>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: {
      childName: "",
      parentPhone: "",
      status: ApplicationStatus.NEW,
      photo: "",
      age: null,
      courseId: null,
      groupId: '',
      parentEmail: "",
      message: "",
      responseMessage: ""
    },
  });

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['applications', currentPage, pageSize],
    queryFn: () => getApplications(currentPage, pageSize),
    staleTime: 1000 * 60 * 5,
    retry: 3,
  }) as any

  const { data: courses } = useQuery({
    queryKey: ['courses'],
    queryFn: () => getAllCourses('a'),
    staleTime: 1000 * 60 * 5,
    retry: 3,
  })

  useEffect(() => {
    refetch()
    if (data) {
      setApplications(data.items as any);
      setTotal(data.total);
      setTotalPages((data.total / pageSize) | 0);
    }
  }, [data, currentPage, pageSize]);

  const {
    mutate: createOrUpdateApplication,
    isPending
  } = useMutation({
    mutationFn: async (data: any) => {
      if (isEditing) {
        const res = await updateApplication({
          data: {
            childName: data.childName,
            parentPhone: data.parentPhone,
            status: data.status,
            photo: data.photo,
            age: data.age,
            courseId: data.courseId,
            groupId: Number(data.groupId),
            parentEmail: data.parentEmail,
            message: data.message,
            responseMessage: data.responseMessage,
            id: data.id
          }
        });
        return { ...res, updatedData: data }
      } else {
        const res = await createApplication({
          childName: data.childName,
          parentPhone: data.parentPhone,
          status: data.status,
          photo: data.photo,
          age: data.age,
          courseId: data.courseId,
          parentEmail: data.parentEmail,
          message: data.message
        });
        return { ...res, updatedData: data }
      }
    },
    onSuccess: (result: any) => {
      if (result) {
        toast.success(isEditing ? "Заявки обновлен успешно" : "Заявки создан успешно")
        refetch()
        setIsDialogOpen(false)
        setIsEditing(false)
        if (result.updatedData.status === ApplicationStatus.CONFIRMED) {
          queryClient.invalidateQueries({ queryKey: ['courses'] })
          queryClient.invalidateQueries({ queryKey: ['notification'] })
        }
      }
    },
    onError: (error: any) => {
      console.log("Xatolik:", error);
      if (error.response?.data?.statusCode === 400) {
        toast.error(error.response?.data?.message)
      }
    },
  });

  const columns: ColumnDef<ApplicationWithLoading>[] = [
    {
      accessorKey: "childName",
      header: "ФИ ребенка",
    },
    {
      accessorKey: "parentEmail",
      header: "Email",
    },
    {
      accessorKey: "parentPhone",
      header: "Телефон родителя",
    },
    {
      accessorKey: "course.name",
      header: "Название курса",
    },
    {
      accessorKey: "date",
      header: "Дата",
      cell: ({ getValue }) => {
        const raw = getValue() as any;
        const date = new Date(raw);

        if (isNaN(date.getTime())) {
          return "Неверная дата";
        }

        return date.toLocaleString("ru-RU", {
          year: "numeric",
          month: "long",
          day: "numeric"
        });
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <div className="flex flex-col">
          <Select
            onValueChange={(value) => column.setFilterValue(value === "all" ? undefined : value)}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Все" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все</SelectItem>
              {statusOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ),
      cell: ({ row }) => {
        const applica = row.original as ApplicationWithLoading
        return (
          <Badge
            variant={{
              [ApplicationStatus.NEW]: "default",
              [ApplicationStatus.PENDING]: "outline",
              [ApplicationStatus.PROCESSING]: "secondary",
              [ApplicationStatus.CONFIRMED]: "success",
              [ApplicationStatus.CANCELLED]: "destructive",
            }[applica.status] as any}
            className="capitalize"
          >
            {{
              [ApplicationStatus.NEW]: "Новая",
              [ApplicationStatus.PENDING]: "Записались",
              [ApplicationStatus.PROCESSING]: "В обработке",
              [ApplicationStatus.CONFIRMED]: "Завершена",
              [ApplicationStatus.CANCELLED]: "Отменена",
            }[applica.status]}
          </Badge>
        )
      },
    },
    {
      id: "actions",
      header: "Действия",
      cell: ({ row }) => {
        const applica = row.original as any
        return (
          <div className="flex gap-2 justify-center">
            <Button variant="ghost" size="icon" onClick={() => setMoreDetail({ open: true, message: applica?.message, photo: applica?.photo })}>
              <View className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleEdit(applica)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleDelete(applica.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
  ]

  const handleEdit = (blog: Application) => {

    reset({
      childName: blog.childName,
      parentPhone: blog.parentPhone,
      status: blog.status,
      photo: blog.photo,
      age: blog.age,
      courseId: blog.courseId,
      parentEmail: blog.parentEmail,
      message: blog.message,
      groupId: String(blog.groupId),
      responseMessage: blog.responseMessage,
      id: String(blog.id)
    })

    setIsEditing(true)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    applications && setApplications(applications.map((app) => (app.id === id ? { ...app, isLoading: true } : app)))
    const res = await deleteApplication(String(id))
    if (res) {
      applications && setApplications(applications?.filter((course) => course.id !== id))
    }
  }

  const onSubmit = async (data: any) => {
    createOrUpdateApplication(data);
  };

  async function handleUploadFile(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileType", FileType.COURSE_MATERIAL);
    formData.append("entityId", "1");
    formData.append("entityType", "application");

    const data = await uploadFile(formData);
    return data.path;
  }  

  return (
    <CrudLayout
      title="Заявки"
      description="Управление заявками на курсы от пользователей"
      createButtonLabel="Создать заявку"
      isButton={true}
      onCreateClick={() => {
        reset({
          childName: "",
          parentPhone: "",
          status: ApplicationStatus.NEW,
          photo: "",
          age: null,
          courseId: null,
          parentEmail: "",
          message: "",
          responseMessage: "",
          id: null
        })
        setIsEditing(false)
        setIsDialogOpen(true)
      }}
    >

      <div className="flex flex-col md:flex-row items-center w-full">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Строк на странице:</span>
          <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(Number(value))}>
            <SelectTrigger className="w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading
        ? <div>Loading...</div>
        : <DataTable columns={columns} data={applications} searchKey="childName" />
      }

      {/* Модальное окно расписания  */}
      <Dialog open={moreDeatil.open} onOpenChange={(e) => setMoreDetail({ ...moreDeatil, open: e })}>
        <DialogContent className="max-w-xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle></DialogTitle>
          </DialogHeader>
          <div className="flex flex-col justify-center items-center gap-4 py-4">
            {moreDeatil.photo && <Image
              src={`${process.env.NEXT_PUBLIC_API_URL}/${moreDeatil.photo}`}
              alt="avatar"
              width={400}
              height={400}
              className="object-contain"
            />}
            {moreDeatil.message && <p className="text-lg">Cообщения: {moreDeatil.message}</p>}
            {!moreDeatil.photo && <p className="text-lg">Нет фото</p>}
            {!moreDeatil.message && <p className="text-lg">Нет сообщения</p>}
          </div>

        </DialogContent>
      </Dialog>

      <Dialog
        open={isDialogOpen}
        onOpenChange={(e) => {
          setIsDialogOpen(e)
        }}>
        <DialogContent className="max-w-3xl max-h-[95vh] ">
          <DialogHeader className="px-2">
            <DialogTitle>{isEditing ? "Редактировать заявку" : "Создать новую заявку"}</DialogTitle>
            <DialogDescription>
              {isEditing ? "Измените информацию о заявке здесь." : "Заполните информацию о новой заявке здесь."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 px-2 py-4 overflow-y-auto" style={{ maxHeight: "calc(95vh - 200px)" }}>
              {/* Основные поля формы */}
              <Input className="hidden"  {...register("id")} />
              <div className="grid grid-cols-2 gap-4">
                {/* childName */}
                <div className="space-y-2">
                  <Label htmlFor="childName">ФИ ребенка</Label>
                  <Input
                    id="childName"
                    {...register("childName")}
                  />
                  {errors.childName && <p className="text-red-500 text-sm">{errors.childName.message}</p>}
                </div>
                {/* Возраст */}
                <div className="space-y-2">
                  <Label htmlFor="age">Возраст</Label>
                  <Input
                    id="age"
                    type="number"
                    {...register("age", { valueAsNumber: true })}
                  />
                  {errors.age && <p className="text-red-500 text-sm">{errors.age.message}</p>}
                </div>
              </div>

              {/* Сообщение */}
              <div className="space-y-2">
                <Label htmlFor="message">Сообщение</Label>
                <Textarea
                  id="message"
                  {...register("message")}
                  rows={4}
                  placeholder="Сообщение"
                />
                {errors.message && <p className="text-red-500 text-sm">{errors.message.message}</p>}
              </div>

              {/* Телефон родителя */}
              <div className="space-y-2">
                <Label htmlFor="parentPhone">Телефон родителя</Label>
                <PhoneInput
                  className="text-base"
                  value={watch("parentPhone") || ""}
                  onChange={(val) => setValue("parentPhone", val, { shouldDirty: true })}
                />
                {errors.parentPhone && <p className="text-red-500 text-sm">{errors.parentPhone.message}</p>}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="parentEmail">Email</Label>
                <Input
                  id="parentEmail"
                  type="email"
                  {...register("parentEmail")}
                />
                {errors.parentEmail && <p className="text-red-500 text-sm">{errors.parentEmail.message}</p>}
              </div>

              {/* Изображение */}
              <div className="space-y-2">
                <Label htmlFor="image">Изображение</Label>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex items-center gap-2 bg-primary/5 hover:bg-primary/10"
                      onClick={() => document.getElementById("image-upload")?.click()}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-upload"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                      Выбрать изображение
                    </Button>
                    {errors.photo && <p className="text-red-500 text-sm">{errors.photo.message}</p>}
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            const imageUrl = await handleUploadFile(file);
                            setValue("photo", imageUrl, { shouldDirty: true });
                          } catch (error) {
                            console.error(error);
                            alert("Faylni yuklashda xatolik yuz berdi");
                          }
                        }
                      }}
                    />
                    {watch("photo") && <span className="text-sm text-muted-foreground">Изображение выбрано</span>}
                  </div>
                  {watch("photo") && (
                    <div className="relative h-40 w-full max-w-md rounded-md overflow-hidden border">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_API_URL}/${watch("photo")}` || "/placeholder.svg"}
                        alt="Предпросмотр"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Курс */}
              <div className="space-y-2">
                <Label htmlFor="courseId">Курс</Label>
                {courses && courses.length > 0 && <Select
                  value={String(watch("courseId"))}
                  onValueChange={(value) => {
                    setValue("groupId", "", { shouldDirty: true });
                    setValue("courseId", Number(value), { shouldDirty: true })
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите курс" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses && courses.map((user) => (
                      <SelectItem key={user.id} value={user.id.toString()}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>}
                {errors.courseId && <p className="text-red-500 text-sm">{errors.courseId.message}</p>}
              </div>

              {/* Group */}
              <div className="space-y-2">
                <Label htmlFor="groupId">Группа</Label>
                {watch("courseId") && <Select
                  value={String(watch("groupId"))}
                  onValueChange={(value) => setValue("groupId", value, { shouldDirty: true })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите группу" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses && courses.map((course: any) => (
                      course.id == watch("courseId") && course.groups.map((group: any) => (
                        <SelectItem key={group.id} value={group.id.toString()}>
                          {group.groupNumber}
                        </SelectItem>
                      ))
                    ))}
                  </SelectContent>
                </Select>}
                {errors.groupId && <p className="text-red-500 text-sm">{errors.groupId.message}</p>}
              </div>

              {/* Статус */}
              <div className="space-y-2">
                <Label htmlFor="status">Статус</Label>
                <Select
                  defaultValue={ApplicationStatus.NEW}
                  value={watch("status")}
                  onValueChange={(value) => {
                    setValue("status", value as ApplicationStatus, { shouldDirty: true });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите статус" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ApplicationStatus.NEW}>Новая</SelectItem>
                    <SelectItem value={ApplicationStatus.PENDING}>Записались</SelectItem>
                    <SelectItem value={ApplicationStatus.PROCESSING}>В обработке</SelectItem>
                    <SelectItem value={ApplicationStatus.CONFIRMED}>Завершена</SelectItem>
                    <SelectItem value={ApplicationStatus.CANCELLED}>Отменена</SelectItem>

                  </SelectContent>
                </Select>
                {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
              </div>

            </div>
            <DialogFooter className="pt-4">
              <Button type="submit" disabled={!isDirty || isPending} >{isEditing ? "Сохранить изменения" : "Создать сообщение"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </CrudLayout>
  )
}