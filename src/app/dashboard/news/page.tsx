"use client"

import { useState, useEffect } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Pencil, Trash2 } from "lucide-react"
import Image from "next/image"
import { NewsFormDialog } from "@/components/news-form-dialog"
import { NewsDataTable } from "@/components/news-data-table"
import { useToast } from "@/hooks/use-toast"
import { Categories, NewsItem } from "@/types/type"
import { deleteNews, getCategories, getNews } from "@/api/requests"
import { NewsStatus } from "@/types/enum"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"

// Assuming you have a CrudLayout component
const CrudLayout = ({ title, description, createButtonLabel, onCreateClick, children }: any) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <Button onClick={onCreateClick}>{createButtonLabel}</Button>
    </div>
    {children}
  </div>
)

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentItem, setCurrentItem] = useState<NewsItem | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<NewsItem | null>(null)

  // Pagination state
  const [status, setStatus] = useState(NewsStatus.PUBLISHED)
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [total, setTotal] = useState(0)

  const { toast } = useToast()

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: 1000 * 60 * 5,
    retry: 3,
  })  

  const fetchNews = async () => {
    setIsLoading(true)
    try {
      const response = await getNews(currentPage, pageSize, status)
      setNews(response.items)
      setTotalPages(response.total / totalPages)
      setTotal(response.total)
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить новости",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchNews()
  }, [currentPage, pageSize, status])

  const getStatusBadge = (status: NewsStatus) => {
    switch (status) {
      case NewsStatus.PUBLISHED:
        return <Badge variant="default">Опубликовано</Badge>
      case NewsStatus.DRAFT:
        return <Badge variant="secondary">Черновик</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }  

  const columns: ColumnDef<NewsItem>[] = [
    {
      accessorKey: "image",
      header: "Изображение",
      cell: ({ row }) => (
        <Image
          src={`${process.env.NEXT_PUBLIC_API_URL}/${row.original.image}` || "/placeholder.svg"}
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
        href={`${process.env.NEXT_PUBLIC_API_URL}/news/${row.original.url}`}
        target="_blank"
        className="max-w-[200px] text-blue-500 truncate">
        {row.original.title}
      </Link>,
    },
    {
      accessorKey: "author",
      header: "Автор",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <span>{row.original.author?.name || "Неизвестно"}</span>
        </div>
      ),
    },
    {
      accessorKey: "date",
      header: "Дата",
      cell: ({ row }) => <span>{new Date(row.original.date).toLocaleDateString("ru-RU")}</span>,
    },
    {
      accessorKey: "category",
      header: "Категория",
      cell: ({ row }) => <span>{row.original.category || "Без категории"}</span>,
    },
    {
      accessorKey: "status",
      header: "Статус",
      cell: ({ row }) => getStatusBadge(row.original.status),
    },
    {
      id: "actions",
      header: "Действия",
      cell: ({ row }) => {
        const item = row.original
        return (
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={() => handleEdit(item)} title="Редактировать">
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(item)} title="Удалить">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
  ]

  const handleCreate = () => {
    setCurrentItem(null)
    setIsDialogOpen(true)
  }

  const handleEdit = (item: NewsItem) => {
    setCurrentItem(item)
    setIsDialogOpen(true)
  }

  const handleDeleteClick = (item: NewsItem) => {
    setItemToDelete(item)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return

    try {
      await deleteNews(String(itemToDelete.id))
      toast({
        title: "Успешно",
        description: "Новость удалена",
      })
      fetchNews() // Refresh the list
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить новость",
        variant: "destructive",
      })
    } finally {
      setDeleteDialogOpen(false)
      setItemToDelete(null)
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize)
    setCurrentPage(1)
  }

  const handleFormSuccess = () => {
    fetchNews()
  }

  return (
    <CrudLayout
      title="Новости"
      description="Управление новостями вашего образовательного центра"
      createButtonLabel="Создать новость"
      onCreateClick={handleCreate}
    >
      <NewsDataTable
        columns={columns}
        data={news}
        searchKey="title"
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        pageSize={pageSize}
        setStatus={setStatus}
        isLoading={isLoading}
      />

      <NewsFormDialog
        setNews={setNews}
        categories={categories as Categories[]}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        newsItem={currentItem}
        onSuccess={handleFormSuccess}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Подтвердите удаление</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите удалить новость "{itemToDelete?.title}"? Это действие нельзя отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Удалить</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </CrudLayout>
  )
}
