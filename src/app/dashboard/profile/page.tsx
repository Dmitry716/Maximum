import type { Metadata } from "next"
import ProfileDashboard from "@/components/profile/profile-dashboard"
export const metadata: Metadata = {
  title: "User Profile | Maximum",
  description: "Manage your Maximum profile, courses, and account settings",
}

export default function ProfilePage() {
  return (
    <ProfileDashboard />
  )
}

