"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Bell, Mail, Lock, Trash2, User } from "lucide-react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { updatePassword, updateUserSatus } from "@/api/requests"
import { useAuth } from "@/hooks/auth-context"
import { toast } from "sonner"
import { UserStatus } from "@/types/enum"
import axios from "axios"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"

const settingsFormSchema = z.object({
  oldPassword: z.string().min(8, { message: "Password must be at least 8 characters" }),
  newPassword: z.string().min(8, { message: "Password must be at least 8 characters" }),
  confirmPassword: z.string().min(8, { message: "Password must be at least 8 characters" }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type SettingsFormValues = z.infer<typeof settingsFormSchema>

export default function AccountSettings() {
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(false)
  const [open, setOpen] = useState(false)

  const { user } = useAuth()
  if (!user) return null

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onChange",
  })

  const {
    mutate: updateSettingsMutation,
    isPending
  } = useMutation({
    mutationFn: async (data: any) => {
      const res = await updatePassword(user.sub, data.newPassword, data.oldPassword)
      return res
    },
    onSuccess: () => {
      toast.success("Password updated successfully")
      form.reset()
    },
    onError: (error: any) => {
      console.log("Xatolik:", error);
      if (error.response?.data?.statusCode === 409) {
        form.setError("oldPassword", { message: error.response.data.message })
      }
    },
  });

  const {
    mutate: updateStatusMutation,
    isPending: isStatusPending
  } = useMutation({
    mutationFn: async () => {
      const res = await updateUserSatus(user.sub, UserStatus.INACTIVE)
      return res
    },
    onSuccess: () => {
      toast.success("Account has been destroyed")
      axios.post("/api/logout", {}).then((res: any) => console.log(res))
      setTimeout(() => {
        window.location.href = "/login"
      }, 1000);
    },
    onError: (error: any) => {
      console.log("Xatolik:", error);
    },
  });

  async function onSubmit(data: SettingsFormValues) {
    updateSettingsMutation(data)
  }

  const handleNotificationChange = () => {
    // Здесь будет логика сохранения настроек уведомлений

  }

  return (
    <div >
      <div className="hidden">
        <h2 className="text-2xl font-bold mb-4">Account Settings</h2>
        <div className=" p-6 shadow-lg rounded-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <Mail className="text-purple-600 flex-shrink-0" />
              <div>
                <Label htmlFor="email-notifications" className="font-medium">
                  Email Notifications
                </Label>
                <p className="text-sm">Receive email updates about your account</p>
              </div>
            </div>
            <Switch
              id="email-notifications"
              checked={emailNotifications}
              onCheckedChange={(checked) => {
                setEmailNotifications(checked)
                handleNotificationChange()
              }}
            />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <Bell className="text-purple-600 flex-shrink-0" />
              <div>
                <Label htmlFor="sms-notifications" className="font-medium">
                  SMS Notifications
                </Label>
                <p className="text-sm">Receive text messages about your account</p>
              </div>
            </div>
            <Switch
              id="sms-notifications"
              checked={smsNotifications}
              onCheckedChange={(checked) => {
                setSmsNotifications(checked)
                handleNotificationChange()
              }}
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <Lock className="mr-2 text-purple-600" />
          Change Password
        </h3>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-6 rounded-xl shadow-md">
          <div>
            <Label htmlFor="oldPassword">Current Password</Label>
            <Input {...form.register("oldPassword")} id="oldPassword" type="password" required className="mt-1" />
            {form.formState.errors.oldPassword && (
              <p className="text-red-600 text-sm mt-1">{form.formState.errors.oldPassword.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="newPassword">New Password</Label>
            <Input {...form.register("newPassword")} id="newPassword" type="password" required className="mt-1" />
            {form.formState.errors.newPassword && (
              <p className="text-red-600 text-sm mt-1">{form.formState.errors.newPassword.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input {...form.register("confirmPassword")} id="confirmPassword" type="password" required className="mt-1" />
            {form.formState.errors.confirmPassword && (
              <p className="text-red-600 text-sm mt-1">{form.formState.errors.confirmPassword.message}</p>
            )}
          </div>
          <Button type="submit" disabled={!form.formState.isDirty || isPending} className="bg-purple-600 hover:bg-purple-700 text-white w-full sm:w-auto">
            Change Password
          </Button>
        </form>
      </div>

      <div>
        <h3 className="text-xl font-semibold py-4 flex items-center">
          <Trash2 className="mr-2 text-red-600" />
          Delete Account
        </h3>
        <div className=" shadow-lg p-6 rounded-xl">
          <p className="text-sm  mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          {/* Delete Account dialog */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" className="w-full sm:w-auto">
                Delete Account
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                </DialogDescription>
              </DialogHeader>
              <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                <Button onClick={() => setOpen(false)} variant="outline">Cancel</Button>
                <DialogClose asChild>
                  <Button disabled={isStatusPending} onClick={() => updateStatusMutation()} variant="destructive">Delete Account</Button>
                </DialogClose>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}

