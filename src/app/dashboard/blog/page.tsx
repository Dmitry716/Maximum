"use client"

import { useEffect, useState } from "react"
import { CrudLayout } from "@/components/crud/crud-layout"
import { DataTable } from "@/components/crud/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import { createBlog, deleteBlog, getBlogs, getCategories, getUsers, updateBlog, uploadFile } from "@/api/requests"
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query"
import { z } from "zod"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { BlogPostStatus, UserRole } from "@/types/enum"
import { Blog, User } from "@/types/type"
import { toast } from "sonner"
import { useAuth } from "@/hooks/auth-context"
import { blogFormSchema } from "@/lib/validations"
import { TiptapEditor } from "@/components/tip-tap-editor"
import TailwindAdvancedEditor from "@/components/tailwind/advanced-editor"
import { Textarea } from "@/components/ui/textarea"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import slugify from "slugify"
import Link from "next/link"

type BlogFormValues = z.infer<typeof blogFormSchema>

export default function CoursesPage() {
  const [blogs, setBlogs] = useState<Blog[] | null>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  // Pagination state
  const [status, setStatus] = useState(BlogPostStatus.PUBLISHED)
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [total, setTotal] = useState(0)
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
  } = useForm<BlogFormValues>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      title: "",
      content: "",
      images: [],
      category: "",
      status: BlogPostStatus.DRAFT,
      tags: [],
      authorId: 0,
      metaTitle: "",
      metaDescription: "",
      keywords: "",
    },
  });

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['blogs', currentPage, pageSize, status],
    queryFn: () => getBlogs(currentPage, pageSize, status),
    staleTime: 1000 * 60 * 5,
    retry: 3,
  }) as any

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: 1000 * 60 * 5,
    retry: 3,
  })

  const { data: users } = useQuery<User[], Error>({
    queryKey: ['usersBlog'],
    queryFn: () => getUsers(),
    staleTime: 1000 * 60 * 5,
    retry: 3,
    enabled: user.role === UserRole.ADMIN
  });

  useEffect(() => {
    refetch()
    if (data) {
      setBlogs(data.items as any);
      setTotal(data.total);
      setTotalPages((data.total / pageSize) | 0);
    }
  }, [data, status, currentPage, pageSize]);

  useEffect(() => {
    setValue("tags", tags, { shouldDirty: true });
  }, [tags]);

  const {
    mutate: createOrUpdateCourse,
    isPending
  } = useMutation({
    mutationFn: async (data: any) => {
      if (isEditing) {
        const res = await updateBlog({
          data: {
            title: data.title,
            content: data.content,
            images: data.images,
            category: data.category,
            status: data.status,
            tags: data.tags,
            authorId: data.authorId,
            url: data.url,
            metaTitle: data.metaTitle,
            metaDescription: data.metaDescription,
            keywords: data.keywords
          },
          id: String(data.id)
        });
        return { ...res, updatedData: data }
      } else {
        const res = await createBlog({
          title: data.title,
          content: data.content,
          images: data.images,
          category: data.category,
          status: data.status,
          tags: data.tags,
          url: data.url,
          authorId: data.authorId,
          metaTitle: data.metaTitle,
          metaDescription: data.metaDescription,
          keywords: data.keywords
        });
        return { ...res, updatedData: data }
      }
    },
    onSuccess: (result: any) => {
      if (result) {
        toast.success(isEditing ? "Блог обновлен успешно" : "Блог создан успешно")
        refetch()
        setTags([])
        setIsDialogOpen(false)
        setIsEditing(false)
      }
    },
    onError: (error: any) => {
      console.log("Xatolik:", error);
      if (error.response?.data?.statusCode === 400) {
        toast.error(error.response?.data?.message)
      }
    },
  });

  const columns: ColumnDef<Blog>[] = [
    {
      accessorKey: "image",
      header: "Изображение",
      cell: ({ row }) => (
        row.original?.images?.length > 0 && <Image
          src={`${process.env.NEXT_PUBLIC_API_URL}/${row.original?.images[0]}` || "/placeholder.svg"}
          alt={`${process.env.NEXT_PUBLIC_API_URL}/${row.original.title}`}
          width={100}
          height={100}
          style={{ height: 100, width: 100 }}
          className="rounded-md object-contain"
        />
      ),
    },
    {
      accessorKey: "title",
      header: "Заголовок",
      cell: ({ row }) => <Link
        // @ts-ignore
        href={`${process.env.NEXT_PUBLIC_API_URL}/blog/${row.original.url}`}
        target="_blank"
        className="max-w-[200px] text-blue-500 truncate">
        {row.original.title}
      </Link>,
    },
    {
      accessorKey: "author",
      header: "Автор",
      accessorFn: (row: any) => row.author?.name || "Null",
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
      accessorKey: "category",
      header: "Категория",
    },
    {
      accessorKey: "status",
      header: "Статус",
    },
    {
      id: "actions",
      header: "Действия",
      cell: ({ row }) => {
        const blogs = row.original
        return (
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={() => handleEdit(blogs)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleDelete(blogs.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
  ]

  const handleEdit = (blog: Blog) => {
    reset({
      id: String(blog.id),
      title: blog.title,
      content: blog.content,
      images: blog.images,
      category: blog.category,
      status: blog.status,
      tags: blog.tags.flatMap((tag: any) => tag.tag.split(",")),
      authorId: blog.authorId,
      metaTitle: blog.metaTitle,
      metaDescription: blog.metaDescription,
      keywords: blog.keywords
    })
    setTags(blog.tags.flatMap((tag: any) => tag.tag.split(",")))
    setIsEditing(true)
    setIsDialogOpen(true)
  }

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
        setTagInput("");
      }
    }
  };

  const handleDelete = async (id: number) => {
    blogs && setBlogs(blogs.map((course) => (course.id === id ? { ...course, isLoading: true } : course)))
    const res = await deleteBlog(String(id))
    if (res) {
      blogs && setBlogs(blogs?.filter((course) => course.id !== id))
      toast.success("Блог удален успешно")
    }
  }

  const onSubmit = async (data: any) => {
    const courseSlug = slugify(data.title, { lower: true, locale: "ru" })

    createOrUpdateCourse({ ...data, url: courseSlug });
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

  return (
    <CrudLayout
      title="Блог"
      description="Управление блогом вашего образовательного центра"
      createButtonLabel="Создать пост"
      onCreateClick={() => {
        reset({
          title: "",
          content: "",
          images: [],
          category: "",
          status: BlogPostStatus.DRAFT,
          tags: [],
          authorId: user.role === UserRole.ADMIN ? 0 : Number(user.sub)
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
        <div className="flex w-72 ml-2 items-center space-x-2">
          <span className="text-sm text-muted-foreground">Статус:</span>
          <Select
            defaultValue={BlogPostStatus.PUBLISHED}
            onValueChange={(value) => {
              setStatus(value as BlogPostStatus);
            }}
          >
            <SelectTrigger >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={BlogPostStatus.DRAFT}>Черновик</SelectItem>
              <SelectItem value={BlogPostStatus.PUBLISHED}>Опубликовано</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading
        ? <div>Loading...</div>
        : <DataTable columns={columns} data={blogs} searchKey="title" />
      }

      <Dialog
        open={isDialogOpen}
        onOpenChange={(e) => {
          setIsDialogOpen(e)
          if (!e) setTags([])
        }}>
        <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto">
          <DialogHeader className="px-2">
            <DialogTitle>{isEditing ? "Редактировать пост" : "Создать новый пост"}</DialogTitle>
            <DialogDescription>
              {isEditing ? "Измените информацию о посте здесь." : "Заполните информацию о новом посте здесь."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 px-2 py-4 overflow-y-auto" style={{ maxHeight: "calc(95vh - 150px)" }}>
              {/* Основные поля формы */}
              <div className="grid grid-cols-1 gap-4">
                {/* Заголовок */}
                <div className="space-y-2">
                  <Label htmlFor="name">Заголовок</Label>
                  <Input className="hidden"  {...register("id")} />
                  <Input
                    id="name"
                    {...register("title")}
                  />
                  {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
                </div>
              </div>

              {/* Содержание */}
              <div className="space-y-2">
                <Label htmlFor="content">Содержание</Label>
                <Controller
                  name="content"
                  control={control}
                  rules={{ required: 'Описание обязательно' }}
                  render={({ field }) => (
                    <TailwindAdvancedEditor value={field.value} onChange={field.onChange} />
                  )}
                />
                {errors.content && (
                  <p className="text-red-500 text-sm">
                    {errors.content.message as string}
                  </p>
                )}
              </div>

              {/* Автор */}
              <div className="grid grid-cols-2 gap-4">
                {users && <div className="space-y-2">
                  <Label htmlFor="author">Автор</Label>
                  {users.length > 0 && (
                    <Select
                      value={String(watch("authorId"))}
                      onValueChange={(value) => setValue("authorId", Number(value), { shouldDirty: true })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите категорию" />
                      </SelectTrigger>
                      <SelectContent>
                        {users.map((author) => (
                          <SelectItem
                            key={author.id}
                            value={author.id.toString()}
                          >
                            {author.name || `User ${author.id}`}
                          </SelectItem>
                        ))}

                      </SelectContent>
                    </Select>
                  )}
                  {errors.authorId && <p className="text-red-500 text-sm">{errors.authorId.message}</p>}
                </div>}
              </div>

              {/* Image */}
              <div className="space-y-2">
                <Label htmlFor="images-upload">Изображения</Label>
                <div className="flex flex-col gap-4">
                  {watch("images")?.length < 1 && <Button
                    type="button"
                    variant="outline"
                    className="bg-primary/5 hover:bg-primary/10"
                    onClick={() => document.getElementById("images-upload")?.click()}
                  >
                    Загрузить изображения
                  </Button>}
                  {errors.images && <p className="text-red-500 text-sm">{errors.images.message}</p>}
                  <Input
                    id="images-upload"
                    type="file"
                    accept="images/*"
                    multiple
                    className="hidden"
                    onChange={async (e) => {
                      const files = Array.from(e.target.files || []).slice(0, 5 - (watch("images")?.length || 0));
                      try {
                        const uploaded = await Promise.all(
                          files.map(async (file) => {
                            const path = await handleUploadFile(file);
                            return path;
                          })
                        );
                        const current = watch("images") || [];
                        setValue("images", [...current, ...uploaded].slice(0, 5), { shouldDirty: true });
                      } catch (error) {
                        console.error(error);
                        alert("Файл не загружен");
                      }
                    }}

                  />
                  <div className="flex gap-4 flex-wrap">
                    {watch("images")?.map((images, index) => (
                      <div key={images} className="relative h-32 w-32 rounded-md overflow-hidden border">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_API_URL}/${images}`}
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

              {/* Категория */}
              <div className="space-y-2">
                <Label htmlFor="category">Категория</Label>
                {categories && categories.length > 0 && (
                  <Select
                    value={watch("category")}
                    onValueChange={(value) => setValue("category", value, { shouldDirty: true })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите категорию" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
              </div>

              {/* Теги */}
              <div className="space-y-2">
                <Label htmlFor="tags">Теги (нажмите Enter после каждого)</Label>

                <div className="flex flex-wrap gap-2 border px-2 py-1 rounded">
                  {tags.map((tag, index) => (
                    <span key={index} className="bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded">
                      {tag}
                      <button
                        type="button"
                        className="ml-1 text-red-500"
                        onClick={() => setTags(tags.filter((_, i) => i !== index))}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <Input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    className="flex-1 outline-none"
                    placeholder="Введите тег и нажмите Enter"
                  />
                </div>

                {errors.tags && <p className="text-red-500 text-sm">{errors.tags.message}</p>}
              </div>

              {/* Статус */}
              <div className="space-y-2">
                <Label htmlFor="status">Статус</Label>
                <Select
                  defaultValue={BlogPostStatus.DRAFT}
                  value={watch("status")}
                  onValueChange={(value) => {
                    setValue("status", value as BlogPostStatus, { shouldDirty: true });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите статус" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={BlogPostStatus.DRAFT}>Черновик</SelectItem>
                    <SelectItem value={BlogPostStatus.PUBLISHED}>Опубликованный</SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
              </div>

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
              <Button type="submit" disabled={!isDirty || isPending} >{isEditing ? "Сохранить изменения" : "Создать статью"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </CrudLayout>
  )
}

