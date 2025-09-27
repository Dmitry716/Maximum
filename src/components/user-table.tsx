"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TableCell, TableRow } from "./ui/table"
import { useEffect, useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { EllipsisVertical } from "lucide-react"
import { User, UserWithLoading } from "@/types/type"
import { UserRole } from "@/types/enum"
import { UserFormValues } from "@/lib/validations"

interface YourComponentProps {
  user: UserWithLoading;
  handleStatusChange: (user: User) => void;
  handleEditUser: (user: UserFormValues) => void
  deleteUser: ({ id, open }: { id: string, open: boolean }) => void
}

export default function UserTable({ user, handleStatusChange, handleEditUser, deleteUser }: YourComponentProps) {
  const [isEdit, setIsEdit] = useState(true);
  const [editedUser, setEditedUser] = useState<UserWithLoading>(user);

  const handleEdit = () => {
    setIsEdit(false);
  };

  const handleSave = () => {
    handleStatusChange(editedUser);
    setIsEdit(true);
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEdit(true);
  };

  useEffect(() => {
    setEditedUser(user);
  }, [user]);

  return (
    <TableRow key={user.id}>
      <TableCell className="whitespace-nowrap min-w-[180px]">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={`${process.env.NEXT_PUBLIC_API_URL}/${user.avatar}`} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="font-medium">{user.name}</span>
        </div>
      </TableCell>
      <TableCell className="whitespace-nowrap min-w-[180px]">{user.email}</TableCell>
      <TableCell className="whitespace-nowrap min-w-[150px]">
        {new Date(user.registrationDate).toLocaleString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric"
        })}
      </TableCell>

      {/* Role SELECT */}
      <TableCell>
        <Select
          disabled={isEdit}
          value={editedUser.role}
          onValueChange={(value) =>
            setEditedUser((prev) => ({ ...prev, role: value as any }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Role ni tanlang" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Роль</SelectLabel>
              <SelectItem value={UserRole.SUPER_ADMIN}>Суперадмин</SelectItem>
              <SelectItem value={UserRole.ADMIN}>Админ</SelectItem>
              <SelectItem value={UserRole.EDITOR}>Редактор</SelectItem>
              <SelectItem value={UserRole.TEACHER}>Инструктор</SelectItem>
              <SelectItem value={UserRole.STUDENT}>Студент</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </TableCell>

      {/* Status SELECT */}
      <TableCell>
        <Select
          disabled={isEdit}
          value={editedUser.status}
          onValueChange={(value) =>
            setEditedUser((prev) => ({ ...prev, status: value as any }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Statusni tanlang" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </TableCell>

      {/* Tugmalar */}
      <TableCell>
        {!isEdit ? (
          <div className="flex gap-2">
            <Button
              disabled={JSON.stringify(editedUser) === JSON.stringify(user)}
              variant="link"
              onClick={handleSave}>
              Save
            </Button>
            <Button onClick={handleCancel}>Cancel</Button>
          </div>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">
                <EllipsisVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" forceMount>
              <DropdownMenuItem onClick={() => handleEditUser(user)}>Редактировать</DropdownMenuItem>
              <DropdownMenuItem onClick={handleEdit}>Действие</DropdownMenuItem>
              <DropdownMenuItem onClick={() => deleteUser({ id: user.id, open: true })} className="text-red-600">Удалить</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </TableCell>
    </TableRow>
  );
}