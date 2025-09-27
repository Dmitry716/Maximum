"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Overview } from "@/components/dashboard/overview"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { useQuery } from "@tanstack/react-query"
import { getStats } from "@/api/requests"
import { DashboardStats } from "@/types/type"
import { useAuth } from "@/hooks/auth-context"
import { UserRole } from "@/types/enum"

export default function DashboardPage() {

  const { user } = useAuth()

  if (!user) return null

  const { data: stats, isLoading, error } = useQuery<DashboardStats, Error>({
    queryKey: ['stats'],
    queryFn: () => user.role !== UserRole.ADMIN && user.role !== UserRole.SUPER_ADMIN ? getStats(user.sub) : getStats(),
    staleTime: 1000 * 60 * 5,
    retry: 3,
  });

  if (isLoading) return <div>Загрузка панели управления...</div>
  if (error) return <div>Ошибка</div>
  if (!stats) return null

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Панель управления</h2>
      </div>

      <StatsCards stats={stats} />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Обзор</CardTitle>
            <CardDescription>Зачисление студентов и показатели завершения курсов за последние 30 дней</CardDescription>
          </CardHeader>
          <CardContent>
            <Overview data={stats.monthlyCompletionAndEnrollment} />
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Последняя активность</CardTitle>
            <CardDescription>Последние действия в вашем образовательном центре</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentActivity />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

