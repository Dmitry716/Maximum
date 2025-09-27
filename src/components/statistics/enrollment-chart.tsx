"use client"

import { MonthlyCompletionAndEnrollment } from "@/types/type";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function EnrollmentChart({ stats }: { stats: MonthlyCompletionAndEnrollment[] }) {
  
  const data = stats.map(item => {
    const [, mm] = item.name.split('-');                   
    const monthIndex = parseInt(mm, 10) - 1;                
    return {
      month: monthNames[monthIndex] || mm,                  
      enrollments: item.enrollments,
      completions: item.completions,                       
    };
  });

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="enrollments" stroke="#3b82f6" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  )
}

