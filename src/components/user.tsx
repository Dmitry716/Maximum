"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search } from "lucide-react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createUser, deleteUser, getUsers, updateUser } from "@/api/requests"
import UserTable from "@/components/user-table"
import { User, UserWithLoading } from "@/types/type"
import { useAuth } from "@/hooks/auth-context"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { userFormSchema, UserFormValues } from "@/lib/validations"
import { Dialog, DialogDescription } from "@radix-ui/react-dialog"
import { DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { FileType, UserRole, UserStatus } from "@/types/enum"
import { formatPhoneNumber, handleUploadFile } from "@/lib/utils"
import { Button } from "./ui/button"
import Image from "next/image"
import { Textarea } from "./ui/textarea"
import { CrudLayout } from "./crud/crud-layout"
import { toast } from "sonner"

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [users, setUsers] = useState<UserWithLoading[]>([]);
  const [isEditing, setIsEditing] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDelete, setIsDelete] = useState({ open: false, id: "" })
  const queryClient = useQueryClient()
  const { user } = useAuth()

  if (!user?.role) return null

  const { data, isLoading } = useQuery<User[], Error>({
    queryKey: ['users'],
    queryFn: () => getUsers(),
    staleTime: 1000 * 60 * 5,
    retry: 3,
  });

  useEffect(() => {
    if (data) {
      setUsers(data as User[]);
    }
  }, [data]);

  const {
    mutate: createOrUpdateUser,
    isPending
  } = useMutation({
    mutationFn: async (data: UserFormValues) => {
      if (isEditing) {
        return await updateUser(data);
      } else {
        return await createUser(data);
      }
    },
    onSuccess: () => {
      toast.success(isEditing ? "Пользователь обновлен успешно" : "Пользователь создан успешно")
      queryClient.invalidateQueries({ queryKey: ['users'] })
      setIsDialogOpen(false)
      setIsEditing(false)
    },
    onError: (error: any) => {
      console.log("Xatolik:", error);
      if (error.response?.data?.statusCode === 403) {
        toast.error(error.response?.data?.message)
      }
    },
  });

  const {
    mutate: deleteUserMutation,
    isPending: isPendingDelete
  } = useMutation({
    mutationFn: async (data: string) => {
      return await deleteUser(data);
    },
    onSuccess: () => {
      toast.success("Пользователь успешно удален")
      queryClient.invalidateQueries({ queryKey: ['users'] })
      setIsDelete({ open: false, id: "" })
    },
    onError: (error: any) => {
      console.log("Xatolik:", error);
      if (error.response?.data?.statusCode === 403) {
        toast.error(error.response?.data?.message)
      }
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema(isEditing)),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "",
    },
  });

  const filteredUsers = users && users?.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-[400px]">Загрузка пользователей...</div>
  }

  const handleStatusChange = async (user: UserWithLoading) => {
    setUsers(prev =>
      prev.map(u => (u.id === user.id ? { ...u, isLoading: true } : u))
    );

    try {
      const updated = await updateUser(user);

      setUsers(prev =>
        prev.map(u =>
          u.id === user.id ? { ...u, status: updated.status, isLoading: false } : u
        )
      );
    } catch (error) {
      console.error("Xatolik:", error);
      setUsers(prev =>
        prev.map(u =>
          u.id === user.id ? { ...u, isLoading: false } : u
        )
      );
    }
  };

  const onSubmit = async (user: UserFormValues) => {
    createOrUpdateUser(user)
  }

  const handleEdit = (user: UserFormValues) => {
    setIsEditing(true)
    setIsDialogOpen(true)
    reset({ ...user, password: "", id: String(user.id) })
  }

  return (
    <div className="space-y-6">
      <CrudLayout
        title="Пользователи"
        description="Просмотр и управление пользователями, зарегистрированными на вашем сайте."
        createButtonLabel="Добавить пользователя"
        onCreateClick={() => {
          setIsDialogOpen(true)
          setIsEditing(false)
          reset({
            name: "",
            email: "",
            password: "",
            role: "",
            id: "",
            phone: "",
            avatar: "",
            status: UserStatus.ACTIVE,
            birthDate: "",
            occupation: "",
            education: "",
            website: "",
            biography: "",
            location: ""
          })
        }}
      >

        <Card>
          <CardHeader>
            <CardTitle>Управление пользователями</CardTitle>
            <CardDescription>Просмотр и управление пользователями, зарегистрированными на вашем сайте.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Поиск пользователей..."
                  className="w-full pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {filteredUsers && filteredUsers.length > 0 ? (
              <div className="rounded-md border overflow-hidden">
                <div className="w-full overflow-x-auto" style={{ WebkitOverflowScrolling: "touch" }}>
                  <Table className="w-full">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="whitespace-nowrap min-w-[180px] text-center">Пользователь</TableHead>
                        <TableHead className="whitespace-nowrap min-w-[180px] text-center">Email</TableHead>
                        <TableHead className="whitespace-nowrap min-w-[150px] text-center">Дата регистрации</TableHead>
                        <TableHead className="whitespace-nowrap min-w-[150px] text-center">Роль</TableHead>
                        <TableHead className="whitespace-nowrap min-w-[120px] text-center">Статус</TableHead>
                        <TableHead className="whitespace-nowrap min-w-[120px] text-center">Действия</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <UserTable key={user.id} user={user} handleEditUser={handleEdit} deleteUser={setIsDelete} handleStatusChange={handleStatusChange} />
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">Пользователи не найдены</div>
            )}
          </CardContent>
        </Card>

        {/* Update user and create user */}
        <Dialog
          open={isDialogOpen}
          onOpenChange={(e) => {
            setIsDialogOpen(e)
          }}
        >
          <DialogContent className="max-w-3xl max-h-[95vh] overflow-y-auto">
            <DialogHeader className="px-2">
              <DialogTitle>{isEditing ? "Редактирование пользователя" : "Создание пользователя"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-4 px-2 py-4 overflow-y-auto" style={{ maxHeight: "calc(95vh - 150px)" }}>
                {/* Основные поля формы */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name">Имя</Label>
                    <Input className="hidden"  {...register("id")} />
                    <Input
                      id="name"
                      {...register("name")}
                    />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      {...register("email")}
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                  </div>
                </div>

                {/* Пароль и роль */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="password">Пароль</Label>
                    <Input
                      id="password"
                      {...register("password")}
                    />
                    {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                  </div>
                  {/* Role */}
                  <div className="space-y-2">
                    <Label htmlFor="role">Роль</Label>
                    <Select
                      value={watch("role")}
                      onValueChange={(value) => setValue("role", value, { shouldDirty: true })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите роль" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={UserRole.SUPER_ADMIN}>Суперадмин</SelectItem>
                        <SelectItem value={UserRole.ADMIN}>Админ</SelectItem>
                        <SelectItem value={UserRole.EDITOR}>Редактор</SelectItem>
                        <SelectItem value={UserRole.TEACHER}>Инструктор</SelectItem>
                        <SelectItem value={UserRole.STUDENT}>Студент</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}
                  </div>
                </div>

                {/* Статус и телефон */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Status */}
                  <div className="space-y-2">
                    <Label htmlFor="status">Статус</Label>
                    <Select
                      defaultValue={UserStatus.ACTIVE}
                      value={watch("status") || UserStatus.ACTIVE}
                      onValueChange={(value) => {
                        setValue("status", value as UserStatus, { shouldDirty: true });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите статус" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={UserStatus.ACTIVE}>Активен</SelectItem>
                        <SelectItem value={UserStatus.INACTIVE}>Неактивен</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
                  </div>
                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="phone">Телефон</Label>
                    <Input
                      id="phone"
                      value={watch("phone") || ""}
                      onChange={(e) =>
                        setValue("phone", formatPhoneNumber(e.target.value), { shouldDirty: true })
                      }
                      placeholder="Номер телефона"
                    />
                    {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
                  </div>
                </div>

                {/* Birthday and Occupation */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="occupation">Профессия</Label>
                    <Input
                      id="occupation"
                      {...register("occupation")}
                      placeholder="Профессия"
                    />
                    {errors.occupation && <p className="text-red-500 text-sm">{errors.occupation.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birthday">Дата рождения</Label>
                    <Input
                      id="birthday"
                      type="date"
                      {...register("birthDate")}
                      placeholder="Дата рождения"
                    />
                    {errors.birthDate && <p className="text-red-500 text-sm">{errors.birthDate.message}</p>}
                  </div>
                </div>

                {/* Education and Website */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="education">Образование</Label>
                    <Input
                      id="education"
                      {...register("education")}
                      placeholder="Образование"
                    />
                    {errors.education && <p className="text-red-500 text-sm">{errors.education.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Сайт</Label>
                    <Input
                      id="website"
                      {...register("website")}
                      placeholder="Сайт"
                    />
                    {errors.website && <p className="text-red-500 text-sm">{errors.website.message}</p>}
                  </div>
                </div>

                {/* Biography */}
                <div className="space-y-2">
                  <Label htmlFor="biography">Биография</Label>
                  <Textarea
                    id="biography"
                    rows={4}
                    {...register("biography")}
                    placeholder="Биография"
                  />
                  {errors.biography && <p className="text-red-500 text-sm">{errors.biography.message}</p>}
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Label htmlFor="location">Местоположение</Label>
                  <Input
                    id="location"
                    {...register("location")}
                    placeholder="Местоположение"
                  />
                  {errors.location && <p className="text-red-500 text-sm">{errors.location.message}</p>}
                </div>

                {/* Image */}
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
                      {errors.avatar && <p className="text-red-500 text-sm">{errors.avatar.message}</p>}
                      <Input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            try {
                              const imageUrl = await handleUploadFile(file, FileType.USER_AVATAR);
                              setValue("avatar", imageUrl, { shouldDirty: true });
                            } catch (error) {
                              console.error(error);
                              alert("Faylni yuklashda xatolik yuz berdi");
                            }
                          }
                        }}
                      />
                      {watch("avatar") && <span className="text-sm text-muted-foreground">Изображение выбрано</span>}
                    </div>
                    {watch("avatar") && (
                      <div className="relative h-40 w-full max-w-md rounded-md overflow-hidden border">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_API_URL}/${watch("avatar")}` || "/placeholder.svg"}
                          alt="Предпросмотр"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>

              </div>
              <DialogFooter>
                <Button type="submit" disabled={isPending || !isDirty} >{isEditing ? "Сохранить изменения" : "Создать пользователя"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog open={isDelete.open} onOpenChange={(open) => setIsDelete({ ...isDelete, open })}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Удалить пользователя</DialogTitle>
              <DialogDescription>
                Вы уверены, что хотите удалить пользователя?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="destructive"
                disabled={isPendingDelete}
                onClick={() => {
                  deleteUserMutation(isDelete.id)
                  setIsDelete({ open: false, id: "" })
                }}>Удалить</Button>
              <Button onClick={() => setIsDelete({ open: false, id: "" })}>Отменить</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </CrudLayout>
    </div>
  )
}

