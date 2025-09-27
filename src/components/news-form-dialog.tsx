"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, Loader2 } from "lucide-react"
import Image from "next/image"
import { Categories, NewsItem, NewsListResponse } from "@/types/type"
import { NewsStatus } from "@/types/enum"
import { createNews, updateNews, uploadFile } from "@/api/requests"
import { z } from "zod"
import { toast } from "sonner"
import { Label } from "./ui/label"
import TailwindAdvancedEditor from "./tailwind/advanced-editor"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion"
import slugify from "slugify"

interface NewsFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  newsItem?: NewsItem | null
  onSuccess: () => void,
  setNews: (data: any) => void,
  categories: Categories[]
}

export const newsFormSchema = z.object({
  title: z.string().min(1, "Заголовок обязателен").max(200, "Заголовок слишком длинный"),
  content: z.string().min(1, "Содержание обязательно"),
  image: z.string().min(1, "Неверный URL изображения"),
  category: z.string().max(100, "Категория слишком длинная").optional(),
  status: z.nativeEnum(NewsStatus, {
    errorMap: () => ({ message: "Выберите корректный статус" }),
  }),
  authorId: z.number().optional(),
  metaTitle: z.string().nullable().optional(),
  metaDescription: z.string().nullable().optional(),
  keywords: z.string().nullable().optional(),
})

export type NewsFormData = z.infer<typeof newsFormSchema>


export function NewsFormDialog({ open, onOpenChange, newsItem, onSuccess, setNews, categories }: NewsFormDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(newsItem?.image || null)
  const isEditing = !!newsItem

  const form = useForm<NewsFormData>({
    resolver: zodResolver(newsFormSchema),
    defaultValues: {
      title: newsItem?.title || "",
      content: newsItem?.content || "",
      image: newsItem?.image || "",
      category: newsItem?.category || "",
      status: newsItem?.status || NewsStatus.DRAFT,
      authorId: newsItem?.author?.id,
      metaTitle: newsItem?.metaTitle,
      metaDescription: newsItem?.metaDescription,
      keywords: newsItem?.keywords
    },
  })

  useEffect(() => {
    form.reset({
      title: newsItem?.title || "",
      content: newsItem?.content || "",
      image: newsItem?.image || "",
      category: newsItem?.category || "",
      status: newsItem?.status || NewsStatus.DRAFT,
      authorId: newsItem?.author?.id,
      metaTitle: newsItem?.metaTitle,
      metaDescription: newsItem?.metaDescription,
      keywords: newsItem?.keywords
    })
  }, [newsItem, form])

  const onSubmit = async (data: NewsFormData) => {
    const courseSlug = slugify(data.title, { lower: true, locale: "ru" })
    setIsLoading(true)
    try {
      if (isEditing && newsItem) {
        await updateNews(String(newsItem.id), {...data, url: courseSlug})

        toast.success("Новость обновлена успешно")
      } else {
        const res = await createNews({...data, url: courseSlug})

        setNews((prev: NewsListResponse) => ({ ...prev, ...res }))
        toast.success("Новость создана успешно")
      }
      onSuccess()
      onOpenChange(false)
      form.reset()
      setImagePreview(null)
    } catch (error:any) {
      console.log("Xatolik:", error);
      if (error.response?.data?.statusCode === 400) {
        toast.error(error.response?.data?.message)
      }
    } finally {
      setIsLoading(false)
    }
  }

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Редактировать новость" : "Создать новую новость"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Измените информацию о новости здесь." : "Заполните информацию о новой новости здесь."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Заголовок</FormLabel>
                  <FormControl>
                    <Input placeholder="Введите заголовок новости" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Содержание */}
            <div className="space-y-2">
              <Label htmlFor="content">Содержание</Label>
              <Controller
                name="content"
                control={form.control}
                rules={{ required: 'Описание обязательно' }}
                render={({ field }) => (
                  <TailwindAdvancedEditor value={field.value} onChange={field.onChange} />
                )}
              />
              {form.formState.errors.content && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.content.message as string}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {categories && categories.length > 0 && (<FormItem>
                <FormLabel htmlFor="category">Категория</FormLabel>
                <Select

                  value={form.watch("category")}
                  onValueChange={(value) => form.setValue("category", value, { shouldDirty: true })}
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
                {form.formState.errors.category && <p className="text-red-500 text-sm">{form.formState.errors.category.message}</p>}
              </FormItem>
              )}

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Статус</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите статус" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={NewsStatus.DRAFT}>Черновик</SelectItem>
                        <SelectItem value={NewsStatus.PUBLISHED}>Опубликовано</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Изображение</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <Button
                          type="button"
                          variant="outline"
                          className="flex items-center gap-2"
                          onClick={() => document.getElementById("image-upload")?.click()}
                        >
                          <Upload className="h-4 w-4" />
                          Выбрать изображение
                        </Button>
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
                                form.setValue("image", imageUrl);
                              } catch (error) {
                                console.error(error);
                                alert("Faylni yuklashda xatolik yuz berdi");
                              }
                            }
                          }}
                        />
                        <Input
                          placeholder="Или введите URL изображения"
                          type="hidden"
                          value={field.value || ""}
                          onChange={(e) => {
                            field.onChange(e.target.value)
                            setImagePreview(e.target.value)
                          }}
                          className="flex-1"
                        />
                      </div>
                      {imagePreview || form.getValues("image") && (
                        <div className="relative h-40 w-full max-w-md rounded-md overflow-hidden border">
                          <Image
                            src={`${process.env.NEXT_PUBLIC_API_URL}/${form.getValues("image")}` || imagePreview || "/placeholder.svg"}
                            alt="Предпросмотр"
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                      {...form.register("metaTitle")}
                    />
                    {form.formState.errors.metaTitle && <p className="text-red-500 text-sm">{form.formState.errors.metaTitle.message}</p>}
                  </div>

                  {/* Meta Description */}
                  <div className="space-y-2">
                    <Label htmlFor="metaDescription">Мета-описание</Label>
                    <Textarea
                      id="metaDescription"
                      {...form.register("metaDescription")}
                      rows={4}
                    />
                    {form.formState.errors.metaDescription && <p className="text-red-500 text-sm">{form.formState.errors.metaDescription.message}</p>}
                  </div>

                  {/* Meta Description */}
                  <div className="space-y-2">
                    <Label htmlFor="keywords">Keywords (через запятую)</Label>
                    <Input
                      id="keywords"
                      {...form.register("keywords")}
                    />
                    {form.formState.errors.keywords && <p className="text-red-500 text-sm">{form.formState.errors.keywords.message}</p>}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                Отмена
              </Button>
              <Button type="submit" disabled={!form.formState.isDirty || isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? "Сохранить изменения" : "Создать новость"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
