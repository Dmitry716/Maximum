"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  BookOpen,
  FolderKanban,
  Newspaper,
  MessageSquare,
  BarChart3,
  Users,
  LogOut,
  FileText,
  Menu,
} from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import axios from "axios"
import { useAuth } from "@/hooks/auth-context"
import { UserRole } from "@/types/enum"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const { user } = useAuth()
  if (!user) return null

  const baseRoutes = [
    {
      label: "Панель управления",
      icon: LayoutDashboard,
      href: "/dashboard",
      active: pathname === "/dashboard",
    },
    {
      label: "Курсы",
      icon: BookOpen,
      href: "/dashboard/courses",
      active: pathname === "/courses",
    },
    {
      label: "Категории",
      icon: FolderKanban,
      href: "/dashboard/categories",
      active: pathname === "/categories",
    },
    {
      label: "Новости",
      icon: Newspaper,
      href: "/dashboard/news",
      active: pathname === "/news",
    },
    {
      label: "Блог",
      icon: FileText,
      href: "/dashboard/blog",
      active: pathname === "/blog",
    },
    {
      label: "Заявки",
      icon: MessageSquare,
      href: "/dashboard/messages",
      active: pathname === "/messages",
    },
    {
      label: "Статистика",
      icon: BarChart3,
      href: "/dashboard/statistics",
      active: pathname === "/statistics",
    },
    {
      label: "Пользователи",
      icon: Users,
      href: "/dashboard/users",
      active: pathname === "/users",
    },
    {
      label: "Управление SEO",
      icon: Users,
      href: "/dashboard/seo",
      active: pathname === "/seo",
    },
  ]

  const routes =
    user.role === UserRole.SUPER_ADMIN
      ? baseRoutes
      : user.role === UserRole.ADMIN ? baseRoutes.filter(
        (route) => 
          route.href !== "/dashboard/messages" && 
          route.href !== "/dashboard/users" && 
          route.href !== "/dashboard/seo"
      )
      : user.role === UserRole.TEACHER ? baseRoutes.filter(
        (route) =>
          route.href !== "/dashboard/users" &&
          route.href !== "/dashboard/blog" &&
          route.href !== "/dashboard/news" &&
          route.href !== "/dashboard/categories"
      )
        : user.role === UserRole.EDITOR && baseRoutes.filter(
          (route) =>
            route.href !== "/dashboard" &&
            route.href !== "/dashboard/users" &&
            route.href !== "/dashboard/courses" &&
            route.href !== "/dashboard/categories" &&
            route.href !== "/dashboard/messages" &&
            route.href !== "/dashboard/statistics"
        )

  function sendRequest() {
    axios.post("/api/logout", {}).then((res: any) => console.log(res))
    setTimeout(() => {
      window.location.href = "/login"
    }, 1000);
  }

  return (
    <>
      <Button
        className="fixed left-4 top-4 z-50 md:hidden"
        variant="outline"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu className="h-4 w-4" />
      </Button>
      <div
        className={cn(
          "fixed inset-y-0 left-0 h-full w-[240px] flex-col border-r bg-background transition-transform duration-300 ease-in-out md:flex md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
          className,
        )}
      >
        <div className="flex h-14 items-center border-b px-4">
          <span className="text-lg font-bold">
            {user && user.role === UserRole.TEACHER
              ? "Преподаватель"
              : user && user.role === UserRole.EDITOR
                ? "Редактор"
                : user && user.role === UserRole.ADMIN
                  ? "Админ"
                  : "Супер Админ"
            }
          </span>
        </div>
        <div className="flex-1 overflow-auto py-8">
          <nav className="grid items-start gap-2 px-2">
            {routes && routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={`sidebar-item ${route.active ? "sidebar-item-active" : ""}`}
                onClick={() => setIsOpen(false)}
              >
                <route.icon className="h-5 w-5" />
                <span>{route.label}</span>
              </Link>
            ))}
          </nav>
        </div>
        <div className="border-t p-4">
          <Button variant={"outline"} onClick={sendRequest} className="sidebar-item hover:text-background">
            <LogOut className="h-5 w-5" />
            <span>Выйти</span>
          </Button>
        </div>
      </div>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}

