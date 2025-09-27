"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts"

const data = [
  {
    month: "Jan",
    programming: 4500,
    design: 2300,
    business: 1800,
    marketing: 1200,
  },
  {
    month: "Feb",
    programming: 5200,
    design: 2700,
    business: 2100,
    marketing: 1500,
  },
  {
    month: "Mar",
    programming: 6100,
    design: 3200,
    business: 2400,
    marketing: 1900,
  },
  {
    month: "Apr",
    programming: 6700,
    design: 3500,
    business: 2700,
    marketing: 2200,
  },
  {
    month: "May",
    programming: 7100,
    design: 3800,
    business: 3000,
    marketing: 2500,
  },
  {
    month: "Jun",
    programming: 8500,
    design: 4200,
    business: 3300,
    marketing: 2800,
  },
]

export function RevenueChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="programming" name="Programming" fill="#3b82f6" />
        <Bar dataKey="design" name="Design" fill="#10b981" />
        <Bar dataKey="business" name="Business" fill="#f59e0b" />
        <Bar dataKey="marketing" name="Marketing" fill="#8b5cf6" />
      </BarChart>
    </ResponsiveContainer>
  )
}

