"use client";

import {
  createCategory,
  deleteCategory,
  getCategoriesAdmin,
  updateCategory,
} from "@/api/requests";
import { CrudLayout } from "@/components/crud/crud-layout";
import { DataTable } from "@/components/crud/data-table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/auth-context";
import { UserRole } from "@/types/enum";
import { Category } from "@/types/type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import slugify from "slugify";
import { toast } from "sonner";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[] | null>([]);
  const [isDialogDeleteOpen, setIsDialogDeleteOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Partial<Category>>({});
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();
  const { user } = useAuth();

  if (!user?.role) return null;

  const { data, isLoading } = useQuery({
    queryKey: ["categoriesAdmin"],
    queryFn: getCategoriesAdmin,
    staleTime: 1000 * 60 * 5,
    retry: 3,
  });

  const { mutate: createOrUpdateCategory, isPending } = useMutation({
    mutationFn: async () => {
      // @ts-ignore
      const ctgSlug = slugify(currentCategory.name, { lower: true });
      if (isEditing) {
        return await updateCategory({
          ...currentCategory,
          url: ctgSlug,
        } as Category);
      } else {
        return await createCategory({
          ...currentCategory,
          url: ctgSlug,
        } as Category);
      }
    },
    onSuccess: (result) => {
      if (isEditing) {
        setCategories(
          (prev) =>
            prev?.map((c) =>
              c.id === result.id ? ({ ...c, ...result } as Category) : c,
            ) || [],
        );
        setCurrentCategory({});
      } else {
        setCurrentCategory({});
        setCategories((prev: any) => [
          ...(prev || []),
          { ...result, studentCount: 0, coursesCount: 0 },
        ]);
      }
      queryClient.invalidateQueries({ queryKey: ["categoriesAdmin"] });
      setIsDialogOpen(false);
      setIsEditing(false);
    },
    onError: (error) => {
      console.log("Xatolik:", error);
    },
  });

  const { mutate: deleteCategoryMutation, isPending: isPendingDelete } =
    useMutation({
      mutationFn: async (id: string) => {
        return await deleteCategory(id as string);
      },
      onSuccess: () => {
        setCategories(
          (prev) => prev && prev?.filter((c) => c.id !== currentCategory.id),
        );
        setCurrentCategory({});
        toast.success("Категория удалена успешно");
        queryClient.invalidateQueries({ queryKey: ["categories"] });
        setIsDialogDeleteOpen(false);
      },
      onError: (error) => {
        console.log("Xatolik:", error);
      },
    });

  useEffect(() => {
    if (data) {
      setCategories(data as any);
    }
  }, [data]);

  const columns: ColumnDef<Category>[] = [
    {
      accessorKey: "name",
      header: "Название",
    },
    {
      accessorKey: "coursesCount",
      header: "Курсы",
    },
    {
      accessorKey: "studentCount",
      header: "Студенты",
    },
    {
      accessorKey: "status",
      header: "Статус",
    },
    {
      id: "actions",
      header: "Действия",
      cell: ({ row }) => {
        const category = row.original;
        return (
          <div className="flex gap-2 items-center justify-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEdit(category)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setIsDialogDeleteOpen(true);
                setCurrentCategory({
                  id: category.id,
                  name: category.name,
                  status: category.status,
                });
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
      enableSorting: false,
      enableColumnFilter: false,
    },
  ];

  const columnsUser: ColumnDef<Category>[] = [
    {
      accessorKey: "name",
      header: "Название",
    },
    {
      accessorKey: "coursesCount",
      header: "Курсы",
    },
    {
      accessorKey: "studentCount",
      header: "Студенты",
    },
    {
      accessorKey: "status",
      header: "Статус",
    },
  ];

  const handleEdit = (category: Category) => {
    setCurrentCategory(category);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  return (
    <CrudLayout
      title="Категории"
      description="Управление категориями курсов вашего образовательного центра"
      createButtonLabel="Создать категорию"
      isButton={
        user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN
      }
      onCreateClick={() => {
        setCurrentCategory({});
        setIsEditing(false);
        setIsDialogOpen(true);
      }}
    >
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <DataTable
          columns={
            user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN
              ? columns
              : columnsUser
          }
          data={categories}
          searchKey="name"
        />
      )}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEditing
                ? "Редактировать категорию"
                : "Создать новую категорию"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Измените информацию о категории здесь."
                : "Заполните информацию о новой категории здесь."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Название
              </Label>
              <Input
                id="name"
                value={currentCategory.name || ""}
                onChange={(e) =>
                  setCurrentCategory({
                    ...currentCategory,
                    name: e.target.value,
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Описание
              </Label>
              <Input
                id="description"
                value={currentCategory.description || ""}
                onChange={(e) =>
                  setCurrentCategory({
                    ...currentCategory,
                    description: e.target.value,
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-2 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Статус
              </Label>
              <Select
                value={currentCategory.status}
                onValueChange={(value) =>
                  setCurrentCategory((prev) => ({
                    ...prev,
                    status: value as any,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите статус" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              disabled={isPending}
              onClick={() => createOrUpdateCategory()}
            >
              {isEditing
                ? "Сохранить изменения"
                : isPending
                  ? "Создание..."
                  : "Создать категорию"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isDialogDeleteOpen} onOpenChange={setIsDialogDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Удалить категорию</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить категорию?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              className=" hover:bg-red-600"
              disabled={isPendingDelete}
              onClick={() =>
                deleteCategoryMutation(currentCategory.id as string)
              }
            >
              {isPendingDelete ? "Удаление..." : "Удалить категорию"}
            </Button>
            <Button
              disabled={isPending}
              onClick={() => {
                setIsDialogDeleteOpen(false);
                setCurrentCategory({});
              }}
            >
              Закрыть
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </CrudLayout>
  );
}
