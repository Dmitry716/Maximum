import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Award, BookOpen, GraduationCap } from "lucide-react"

interface ProfileOverviewProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export default function ProfileOverview({ activeTab, setActiveTab }: ProfileOverviewProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Welcome back, John!</h2>
        <Button onClick={() => setActiveTab("profile")}>Edit Profile</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-[#8A3FFC] text-white p-4 rounded-lg flex items-center justify-between">
          <div>
            <p className="text-sm opacity-80">Enrolled Courses</p>
            <p className="text-2xl font-bold">4</p>
          </div>
          <BookOpen size={24} />
        </div>
        <div className="bg-[#4CAF50] text-white p-4 rounded-lg flex items-center justify-between">
          <div>
            <p className="text-sm opacity-80">Completed Courses</p>
            <p className="text-2xl font-bold">2</p>
          </div>
          <GraduationCap size={24} />
        </div>
        <div className="bg-[#FFC107] text-white p-4 rounded-lg flex items-center justify-between">
          <div>
            <p className="text-sm opacity-80">Certificates Earned</p>
            <p className="text-2xl font-bold">1</p>
          </div>
          <Award size={24} />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Current Course Progress</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Front-end Development</span>
              <span className="text-sm font-medium">75%</span>
            </div>
            <Progress value={75} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">UI/UX Design Basics</span>
              <span className="text-sm font-medium">40%</span>
            </div>
            <Progress value={40} className="h-2" />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Recent Activity</h3>
        <ul className="space-y-2">
          <li className="text-sm">Completed lesson 5 in Front-end Development</li>
          <li className="text-sm">Started new course: UI/UX Design Basics</li>
          <li className="text-sm">Earned certificate in JavaScript Fundamentals</li>
        </ul>
      </div>
    </div>
  )
}

