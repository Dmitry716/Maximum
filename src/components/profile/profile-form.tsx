"use client"

import type React from "react"

import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Camera, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getUserById, updateUserProfile, uploadFile } from "@/api/requests"
import { useAuth } from "@/hooks/auth-context"
import { toast } from "sonner"
import { FileType } from "@/types/enum"

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  avatar: z.string().optional(),
  phone: z.string().optional(),
  biography: z.string().max(500, {
    message: "Bio must not be longer than 500 characters.",
  }),
  occupation: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

const formatPhoneNumber = (input: string) => {
  const cleaned = input.replace(/\D/g, "")
  const match = cleaned.match(/^(\d{3})(\d{2})(\d{7})$/)
  if (match) {
    return `+${match[1]} ${match[2]} ${match[3]}`
  }
  return input
}

export default function ProfileForm() {
  const queryClient = useQueryClient()

  const { user } = useAuth()
  if (!user) return null

  const { data, refetch } = useQuery({
    queryKey: ['profile'],
    queryFn: () => getUserById(user.sub),
    staleTime: 1000 * 60 * 5,
    retry: 3,
  })

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: data?.name || "",
      email: data?.email || "",
      phone: data?.phone || "",
      biography: data?.biography || "",
      occupation: data?.occupation || "",
      avatar: data?.avatar || "",
    },
    mode: "onChange",
  })

  const {
    mutate: updateUserMutation,
    isPending
  } = useMutation({
    mutationFn: async (data: any) => {
      const res = await updateUserProfile(data, user.sub)
      return res
    },
    onSuccess: () => {
      refetch()
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      toast.success("Profile updated successfully")
    },
    onError: (error) => {
      console.log("Xatolik:", error);
    },
  });

  useEffect(() => {
    form.reset({
      name: data?.name || "",
      email: data?.email || "",
      phone: data?.phone || "",
      biography: data?.biography || "",
      occupation: data?.occupation || "",
      avatar: data?.avatar || "",
    })
  }, [data])

  async function onSubmit(data: ProfileFormValues) {
    updateUserMutation(data)
  }

  async function handleUploadFile(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileType", FileType.USER_AVATAR);
    formData.append("entityId", "1");
    formData.append("entityType", "application");

    const data = await uploadFile(formData);
    return data.path;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-6 rounded-xl">
          <div className="relative">
            <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
              <AvatarImage src={`${process.env.NEXT_PUBLIC_API_URL}/${form.watch("avatar")}` || "/placeholder.svg"} alt="Profile picture" />
              {!form.watch("avatar") && <AvatarFallback className="text-2xl">{form.watch("name")[0]}</AvatarFallback>}
            </Avatar>
            <label
              htmlFor="profile-image"
              className="absolute bottom-0 right-0 bg-purple-600 text-white p-2 rounded-full cursor-pointer hover:bg-purple-700 transition-colors shadow-md"
            >
              <Camera className="h-5 w-5" />
              <span className="sr-only">Change profile picture</span>
            </label>
            <Input
              id="profile-image"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  try {
                    const imageUrl = await handleUploadFile(file);
                    form.setValue("avatar", imageUrl, { shouldDirty: true });
                  } catch (error) {
                    console.error(error);
                    alert("Faylni yuklashda xatolik yuz berdi");
                  }
                }
              }}
            />
          </div>
          <div className="space-y-2 text-center sm:text-left">
            <h2 className="text-2xl font-semibold ">{form.watch("name")}</h2>
            <p className="text-sm ">{form.watch("biography") || "Update your photo and personal details here"}</p>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Your email address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={() => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input
                    id="phone"
                    value={form.watch("phone") || ""}
                    onChange={(e) =>
                      form.setValue("phone", formatPhoneNumber(e.target.value), { shouldDirty: true })
                    }
                    placeholder="Your phone number"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="occupation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Occupation</FormLabel>
                <FormControl>
                  <Input placeholder="Your occupation" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="biography"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us a little about yourself"
                  className="resize-none min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>You can write about your interests, goals, or experience.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white" disabled={!form.formState.isDirty || isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </div>
      </form>
    </Form>
  )
}

