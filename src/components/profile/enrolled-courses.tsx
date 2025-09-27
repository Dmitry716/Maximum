import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Clock, Award } from "lucide-react"

const courses = [
  {
    id: 1,
    name: "Front-end Development",
    progress: 75,
    image: "/placeholder.svg?height=100&width=100",
    duration: "8 weeks",
    certificate: false,
  },
  {
    id: 2,
    name: "UI/UX Design Basics",
    progress: 40,
    image: "/placeholder.svg?height=100&width=100",
    duration: "6 weeks",
    certificate: false,
  },
  {
    id: 3,
    name: "JavaScript Fundamentals",
    progress: 100,
    image: "/placeholder.svg?height=100&width=100",
    duration: "4 weeks",
    certificate: true,
  },
  {
    id: 4,
    name: "React for Beginners",
    progress: 10,
    image: "/placeholder.svg?height=100&width=100",
    duration: "10 weeks",
    certificate: false,
  },
]

export default function EnrolledCourses() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Your Learning Journey</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg border border-gray-100"
          >
            <div className="relative h-40">
              <img src={course.image || "/placeholder.svg"} alt={course.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                <span className="text-white text-lg font-semibold text-center">{course.name}</span>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Clock size={16} className="mr-1" />
                  <span>{course.duration}</span>
                </div>
                {course.certificate && (
                  <div className="flex items-center text-sm text-green-600">
                    <Award size={16} className="mr-1" />
                    <span>Certificate</span>
                  </div>
                )}
              </div>
              <Progress value={course.progress} className="h-2 mb-2" />
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Progress: {course.progress}%</span>
                <Button className="bg-purple-600 hover:bg-purple-700 text-white text-sm px-3 py-1 h-auto">
                  {course.progress === 100 ? "Review" : "Continue"}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

