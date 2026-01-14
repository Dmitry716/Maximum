"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormValues) => {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const response = await res.json()      
      console.log('???', response)
      if (!response.ok) throw new Error(response.message || "Login failed")

      return response
    },
    onMutate: () => setIsLoading(true),
    onSuccess: (data) => {      
      if (data.ok) {
        toast.success("Авторизация прошла успешно")
        router.push(`/dashboard`)
        setTimeout(() => {
          window.location.reload()
        }, 1000);
      }
    },
    onError: () => {
      toast.error("Неверный адрес электронной почты или пароль")
    },
    onSettled: () => setIsLoading(false),
  })

  const onLoginSubmit = (data: LoginFormValues) => {    
    loginMutation.mutate(data)
  }

  return (
    <Form key={"login"} {...loginForm}>
      <p className="text-sm text-muted-foreground">Введите свой адрес электронной почты и пароль ниже для входа</p>
      <form
        onSubmit={loginForm.handleSubmit(onLoginSubmit)}
        className="space-y-4 mt-2"
      >
        <FormField
          control={loginForm.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Электронная почта</FormLabel>
              <FormControl>
                <Input placeholder="имя@example.com" {...field} />
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
              <FormLabel>Пароль</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Загрузка..." : "Войти"}
        </Button>
       
      </form>
    </Form>
  )
}