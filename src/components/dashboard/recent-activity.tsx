"use client"

import { getAdminNotification } from "@/api/requests";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";

export function RecentActivity() {
  const { data } = useQuery<any, Error>({
    queryKey: ['notification'],
    queryFn: () => getAdminNotification(),
    refetchInterval: 1000 * 60 * 5,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: true,
    retry: 3
  });


  return (
    <div className="space-y-8">
      {data && data.map((activity: any) => (
        <div key={activity.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={`${process.env.NEXT_PUBLIC_API_URL}/${activity.user.avatar}`} alt={activity.user} />
            <AvatarFallback>{activity.user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium">{activity.user.name}</p>
            <p className="text-sm text-muted-foreground">{activity.message}</p>
            <p className="text-sm text-muted-foreground">
              {
                formatDistanceToNow(new Date(activity.createdAt), {
                  addSuffix: true,
                  locale: ru,
                })
              }
            </p>
          </div>
          <div className="ml-auto text-xs text-muted-foreground">
            {new Date(activity.createdAt).toLocaleDateString('ru-RU', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

