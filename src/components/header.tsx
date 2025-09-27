"use client"

import { Bell, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Switcher from "./switcher"
import { getAdminNotification, getNotification, getUserById, readAllAdminNotification, readAllNotification } from "@/api/requests"
import { useQuery } from "@tanstack/react-query"
import { useAuth } from "@/hooks/auth-context"
import { UserRole } from "@/types/enum"
import { useRouter } from "next/navigation"

export function Header() {
  const router = useRouter()

  const { user } = useAuth()

  if (!user) return null

  const { data, refetch } = useQuery<any, Error>({
    queryKey: ['notification'],
    queryFn: () => user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN ? getAdminNotification() : getNotification(user.sub),
    refetchInterval: 1000 * 60 * 5,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: true,
    retry: 3
  });

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: () => getUserById(user.sub),
    staleTime: 1000 * 60 * 5,
    retry: 3,
  })

  async function readAllNotificationAdmin() {
    if (!data) return
    const ids = data
      .map((item: any) => item.id)
      .filter((item: any) => user?.role === UserRole.ADMIN || user?.role === UserRole.SUPER_ADMIN ? item.isReadAdmin !== false : item.isRead !== false)

    if (user?.role === UserRole.ADMIN || user?.role === UserRole.SUPER_ADMIN) {
      await readAllAdminNotification(ids)
      refetch()
    } else if (user?.role === UserRole.TEACHER) {
      await readAllNotification(ids, user.sub)
      refetch()
    }
  }

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center border-b bg-background px-4 md:px-6">
      <div className="flex flex-1 items-center justify-end space-x-4">
        <div className="flex-1 md:flex md:justify-center">
          <form className="relative hidden w-full max-w-[600px] md:flex">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Поиск..." className="w-full pl-8 md:max-w-[300px] lg:max-w-[600px]" />
          </form>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu onOpenChange={(open) => open && readAllNotificationAdmin()}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="relative"
                aria-label="Уведомления">
                <Bell className="h-5 w-5" />
                {data && (
                  (user.role === UserRole.TEACHER
                    ? data.some((item: any) => item.isRead === false)
                    : data.some((item: any) => item.isReadAdmin === false)
                  ) && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                      {
                        data.filter((item: any) =>
                          user.role === UserRole.TEACHER ? !item.isRead : !item.isReadAdmin
                        ).length
                      }
                    </span>
                  )
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className=" min-w-[300px]" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <h1 className="font-semibold text-lg">Notifications</h1>
              </DropdownMenuLabel>
              {data && data.map((item: any) => (
                <div key={item.id} className={`${((user.role === UserRole.ADMIN && item.isReadAdmin) || (user.role === UserRole.TEACHER && item.isRead)) && "opacity-50"}`}>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>{item.title}</DropdownMenuItem>
                </div>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Switcher />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={`${process.env.NEXT_PUBLIC_API_URL}/${profile?.avatar}` || "/placeholder.svg"} alt="Profile picture" />
                  {!profile?.avatar && <AvatarFallback className="text-2xl">{profile?.name.split(" ")[0]}</AvatarFallback>}
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{profile?.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">{profile?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/dashboard/profile")}>Профиль</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

