"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts"

const data = [
  {
    age: "18-24",
    male: 120,
    female: 150,
    other: 15,
  },
  {
    age: "25-34",
    male: 210,
    female: 180,
    other: 20,
  },
  {
    age: "35-44",
    male: 150,
    female: 120,
    other: 10,
  },
  {
    age: "45-54",
    male: 80,
    female: 70,
    other: 5,
  },
  {
    age: "55+",
    male: 40,
    female: 30,
    other: 2,
  },
]

export function StudentDemographicsChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="age" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="male" name="Male" fill="#3b82f6" />
        <Bar dataKey="female" name="Female" fill="#ec4899" />
        <Bar dataKey="other" name="Other" fill="#8b5cf6" />
      </BarChart>
    </ResponsiveContainer>
  )
}

