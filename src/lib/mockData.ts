interface Curses {
  id: string,
  name: string,
  category: string,
  students: number,
  status: string,
  price: number
}

interface Categories {
  id: string,
  name: string,
  courses: number,
  students: number,
  status: string,
}

export const mockCourses: Curses[] = [
  {
    id: "1",
    name: "Web Development Fundamentals",
    category: "Programming",
    students: 128,
    status: "Active" as const,
    price: 99.99,
  },
  {
    id: "2",
    name: "Advanced JavaScript",
    category: "Programming",
    students: 85,
    status: "Active" as const,
    price: 129.99,
  },
  {
    id: "3",
    name: "UX/UI Design Principles",
    category: "Design",
    students: 64,
    status: "Active" as const,
    price: 89.99,
  },
  {
    id: "4",
    name: "Data Science Bootcamp",
    category: "Data Science",
    students: 42,
    status: "Draft" as const,
    price: 199.99,
  },
  {
    id: "5",
    name: "Mobile App Development",
    category: "Programming",
    students: 0,
    status: "Draft" as const,
    price: 149.99,
  },
]

export const mockCategories: Categories[] = [
  {
    id: "1",
    name: "Programming",
    courses: 12,
    students: 345,
    status: "Active" as const,
  },
  {
    id: "2",
    name: "Design",
    courses: 8,
    students: 189,
    status: "Active" as const,
  },
  {
    id: "3",
    name: "Business",
    courses: 6,
    students: 127,
    status: "Active" as const,
  },
  {
    id: "4",
    name: "Marketing",
    courses: 5,
    students: 98,
    status: "Active" as const,
  },
  {
    id: "5",
    name: "Data Science",
    courses: 4,
    students: 76,
    status: "Active" as const,
  },
  {
    id: "6",
    name: "Language Learning",
    courses: 0,
    students: 0,
    status: "Draft" as const,
  },
]

export const mockUsers = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@example.com",
    role: "Admin" as const,
    status: "Active" as const,
    joined: "Jan 10, 2023",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    role: "Instructor" as const,
    status: "Active" as const,
    joined: "Mar 15, 2023",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "3",
    name: "Michael Brown",
    email: "michael.brown@example.com",
    role: "Instructor" as const,
    status: "Active" as const,
    joined: "Apr 20, 2023",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    role: "Student" as const,
    status: "Active" as const,
    joined: "May 5, 2023",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "5",
    name: "David Wilson",
    email: "david.wilson@example.com",
    role: "Student" as const,
    status: "Inactive" as const,
    joined: "Jun 12, 2023",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

export const mockDashboardStats = {
  totalStudents: 1284,
  activeCourses: 24,
  totalRevenue: 24563,
  completionRate: 78,
}

