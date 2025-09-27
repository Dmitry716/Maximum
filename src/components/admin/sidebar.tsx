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

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const routes = [
    {
      label: "Панель управления",
      icon: LayoutDashboard,
      href: "/admin/dashboard",
      active: pathname === "/admin/dashboard",
    },
    {
      label: "Курсы",
      icon: BookOpen,
      href: "/admin/courses",
      active: pathname === "/admin/courses",
    },
    {
      label: "Категории",
      icon: FolderKanban,
      href: "/admin/categories",
      active: pathname === "/admin/categories",
    },
    {
      label: "Новости",
      icon: Newspaper,
      href: "/admin/news",
      active: pathname === "/admin/news",
    },
    {
      label: "Блог",
      icon: FileText,
      href: "/admin/blog",
      active: pathname === "/admin/blog",
    },
    {
      label: "Заявки",
      icon: MessageSquare,
      href: "/admin/messages",
      active: pathname === "/admin/messages",
    },
    {
      label: "Статистика",
      icon: BarChart3,
      href: "/admin/statistics",
      active: pathname === "/admin/statistics",
    },
    {
      label: "Пользователи",
      icon: Users,
      href: "/admin/users",
      active: pathname === "/admin/users",
    },
  ]

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
          <span className="text-lg font-bold">ОбразАдмин</span>
        </div>
        <div className="flex-1 overflow-auto py-8">
          <nav className="grid items-start gap-2 px-2">
            {routes.map((route) => (
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
          <Link
            href="/admin/login"
            className="sidebar-item text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <LogOut className="h-5 w-5" />
            <span>Выйти</span>
          </Link>
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

