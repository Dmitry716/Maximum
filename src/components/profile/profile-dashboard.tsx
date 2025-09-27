"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProfileForm from "./profile-form"
import AccountSettings from "./account-settings"
import { User, Settings } from "lucide-react"

export default function ProfileDashboard() {

  return (
      <div className="max-w-6xl mx-auto">
        <Tabs defaultValue="profile" className="w-full" >
          <TabsList className="flex justify-between p-1 mb-4  rounded-xl">
            <div>
            <TabsTrigger
              value="profile"
              className="px-3 py-1.5 text-sm font-medium transition-all duration-200 ease-in-out rounded-lg text-purple-700 hover:bg-purple-200 data-[state=active]:bg-white data-[state=active]:text-purple-700 data-[state=active]:shadow-sm"
            >
              <User size={18} className="inline-block mr-1 -mt-0.5" />
              <span>Profile</span>
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="px-3 py-1.5 text-sm font-medium transition-all duration-200 ease-in-out rounded-lg text-purple-700 hover:bg-purple-200 data-[state=active]:bg-white data-[state=active]:text-purple-700 data-[state=active]:shadow-sm"
            >
              <Settings size={18} className="inline-block mr-1 -mt-0.5" />
              <span>Settings</span>
            </TabsTrigger>
            </div>
          </TabsList>
          <div className="rounded-xl shadow-lg overflow-hidden">
            <TabsContent value="profile" className="p-4  focus:outline-none">
              <ProfileForm />
            </TabsContent>
            <TabsContent value="settings" className="p-4  focus:outline-none">
              <AccountSettings />
            </TabsContent>
          </div>
        </Tabs>
      </div>
  )
}

