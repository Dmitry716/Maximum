"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

const loginSchema = z.object({ 
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(passwordRegex, {
      message: "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    }),
});

type LoginFormValues = z.infer<typeof loginSchema>

export default function SignupForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", name: "" },
  })

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormValues) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const response = await res.json()
      if (response.statusCode === 409) {
        toast.error(response.message)
        return
      }
      return response
    },
    onMutate: () => setIsLoading(true),
    onSuccess: () => {
      toast.success("You are registered successfully. Please log in")
      setTimeout(() => {
        router.push(`/login`)
      }, 2000);
    },
    onError: (e) => {
      console.log(e);

      // toast.error("Email or password incorrect")
    },
    onSettled: () => setIsLoading(false),
  })

  const onLoginSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data)
  }

  return (
    <Form key={"login"} {...loginForm}>
      <form
        onSubmit={loginForm.handleSubmit(onLoginSubmit)}
        className="space-y-4"
      >
        <FormField
          control={loginForm.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Name:</FormLabel>
              <FormControl>
                <Input placeholder="Harry" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={loginForm.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address:</FormLabel>
              <FormControl>
                <Input placeholder="name@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={loginForm.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password:</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Registering..." : "Register"}
        </Button>
        <div className="text-center">
          <span className="text-slate-400 me-2">Already have an account ? </span> <Link href="/login" className="text-black dark:text-white font-bold">Sign in</Link>
        </div>
      </form>
    </Form>
  )
}