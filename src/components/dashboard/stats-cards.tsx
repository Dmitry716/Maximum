import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardStats } from "@/types/type"
import { Users, BookOpen, DollarSign, GraduationCap } from "lucide-react"

export function StatsCards({ stats }: { stats: DashboardStats }) {
  if (!stats) return null

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="animate-slide-in">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Students</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalStudents}</div>
          {/* <p className="text-xs text-muted-foreground">+12% from last month</p> */}
        </CardContent>
      </Card>

      <Card className="animate-slide-in [animation-delay:100ms]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.activeCourses}</div>
          {/* <p className="text-xs text-muted-foreground">+2 new courses this month</p> */}
        </CardContent>
      </Card>

      <Card className="animate-slide-in [animation-delay:200ms]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalRevenue.toFixed(2)} BYN/мес.</div>
          {/* <p className="text-xs text-muted-foreground">+18.2% from last month</p> */}
        </CardContent>
      </Card>

      <Card className="animate-slide-in [animation-delay:300ms]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Course Completion</CardTitle>
          <GraduationCap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.averageCompletionRate}%</div>
          {/* <p className="text-xs text-muted-foreground">+5% from last month</p> */}
        </CardContent>
      </Card>
    </div>
  )
}

