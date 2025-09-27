"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EnrollmentChart } from "@/components/statistics/enrollment-chart"
import { RevenueChart } from "@/components/statistics/revenue-chart"
import { CompletionRateChart } from "@/components/statistics/completion-rate-chart"
import { StudentDemographicsChart } from "@/components/statistics/student-demographics-chart"
import { useQuery } from "@tanstack/react-query"
import { DashboardStats } from "@/types/type"
import { getStats } from "@/api/requests"

export default function StatisticsPage() {
  const { data: stats, isLoading, error } = useQuery<DashboardStats, Error>({
    queryKey: ['stats'],
    queryFn: () => getStats(),
    staleTime: 1000 * 60 * 5,
    retry: 3,
  });  

  if (isLoading) return <div>Загрузка панели управления...</div>
  if (error) return <div>Ошибка</div>
  if (!stats) return null  
  
  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Statistics</h2>
      </div>

      <Tabs defaultValue="enrollment" className="space-y-4">
        <TabsList>
          <TabsTrigger value="enrollment">Enrollment</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="completion">Completion Rates</TabsTrigger>
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
        </TabsList>

        <TabsContent value="enrollment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Student Enrollment</CardTitle>
              <CardDescription>Monthly student enrollment data for the past year</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <EnrollmentChart stats={stats.monthlyCompletionAndEnrollment} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Analysis</CardTitle>
              <CardDescription>Monthly revenue breakdown by course category and payment method</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <RevenueChart />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completion" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Course Completion Rates</CardTitle>
              <CardDescription>Percentage of students who complete each course</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <CompletionRateChart stats={stats.courseEnrollmentStats} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="demographics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Student Demographics</CardTitle>
              <CardDescription>Breakdown of student demographics by age, location, and background</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <StudentDemographicsChart />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

