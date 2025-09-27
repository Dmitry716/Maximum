"use client"

import { createApplication } from "@/api/requests"
import { applicationFormSchemaClient } from "@/lib/validations"
import { ApplicationStatus } from "@/types/enum"
import { Course } from "@/types/type"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { FiShoppingCart } from "react-icons/fi"
import { toast } from "sonner"
import { z } from "zod"
import { DialogFooter } from "./ui/dialog"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Button } from "./ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { PhoneInput } from "./phone-input"
import { useEffect, useRef, useState } from "react"

type ApplicationFormSchemaFormValues = z.infer<typeof applicationFormSchemaClient>

export const RegisterApp = ({ course }: { course: Course }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenModal, setIsOpenModal] = useState(false)
  const lastScrollY = useRef(0);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<ApplicationFormSchemaFormValues>({
    resolver: zodResolver(applicationFormSchemaClient),
    defaultValues: {
      childName: "",
      parentPhone: "",
      status: ApplicationStatus.NEW,
      photo: "",
      age: null,
      courseId: Number(course.id),
      parentEmail: "",
      message: "",
      responseMessage: "",
      rules: false
    },
  });

  const watchedValues = watch();

  const {
    mutate: createApplicationMutation,
    isPending
  } = useMutation({
    mutationFn: async (data: any) => {
      const res = await createApplication({
        childName: data.childName,
        parentPhone: data.parentPhone,
        status: data.status,
        photo: data.photo,
        age: data.age,
        courseId: data.courseId,
        parentEmail: data.parentEmail,
        message: data.message
      });
      return { ...res, updatedData: data }
    },
    onSuccess: (result: any) => {
      if (result) {
        toast.success("Заявка создана успешно")
        reset()
        setIsOpenModal(false)
      }
    },
    onError: (error) => {
      console.log("Xatolik:", error);
      toast.error("Ошибка при создании заявки")
    },
  });

  const onSubmit = async (data: any) => {
    if (!data.childName?.trim()) {
      toast.error("Пожалуйста, введите ФИ ребенка");
      return;
    }
    if (!data.parentPhone?.trim()) {
      toast.error("Пожалуйста, введите телефон родителя");
      return;
    }
    if (!data.parentEmail?.trim()) {
      toast.error("Пожалуйста, введите email");
      return;
    }
    if (!data.rules) {
      toast.error("Пожалуйста, подтвердите согласие с условиями");
      return;
    }

    // Проверка формата телефона
    const phoneRegex = /^\+375 \d{2} \d{3}-\d{2}-\d{2}$/;
    if (!phoneRegex.test(data.parentPhone)) {
      toast.error("Введите корректный номер телефона в формате +375 XX XXX-XX-XX");
      return;
    }

    createApplicationMutation(data);
  };

  const sectionId = "recent-courses";

  const stickyHeaderFunc = () => {
    window.addEventListener("scroll", () => {
      const scrollY = window.scrollY;
      const scrollDown = scrollY > lastScrollY.current;
      lastScrollY.current = scrollY;
      const el = document.getElementById(sectionId);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (
          (!scrollDown && rect.bottom >= 100 && rect.top <= 100) ||
          (scrollDown && rect.top < window.innerHeight && rect.bottom >= 80)
        ) {
          if (sectionId === "recent-courses") {
            setIsOpen(true);
          }
        }
      }
    }, { passive: true });
  };

  useEffect(() => {
    stickyHeaderFunc();
    return () => window.removeEventListener("scroll", stickyHeaderFunc);
  });

  const isPhoneValid = watchedValues.parentPhone ? /^\+375 \d{2} \d{3}-\d{2}-\d{2}$/.test(watchedValues.parentPhone) : false;

  const isFormValid = watchedValues.childName?.trim() &&
    watchedValues.parentPhone?.trim() &&
    watchedValues.parentEmail?.trim() &&
    watchedValues.rules &&
    isPhoneValid &&
    !errors.childName &&
    !errors.parentPhone &&
    !errors.parentEmail &&
    !errors.rules;

  return (
    <>
      <Drawer open={isOpenModal} onOpenChange={setIsOpenModal}>
        <DrawerTrigger asChild>
          <Button
            variant={"default"}
            className="text-white text-lg">
            Записаться
          </Button>
        </DrawerTrigger>
        <DrawerContent className="z-[999999] !static">
          <div className="mx-auto w-full max-w-2xl">
            <DrawerHeader>
              <DrawerTitle>{"Поможем в выборе!"}</DrawerTitle>
              <DrawerDescription> {"Если у вас есть вопросы о формате или вы не знаете что выбрать, оставьте свой номер: мы позвоним, чтобы ответить на все ваши вопросы."} </DrawerDescription>
            </DrawerHeader>
            <form
              style={{ minHeight: "-webkit-fill-available" }}
              onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-4 px-2 py-2 overflow-y-auto" style={{ maxHeight: "calc(95vh - 200px)" }}>
                {/* Основные поля формы */}
                <Input className="hidden"  {...register("id")} />

                {/* childName */}
                <div className="space-y-2">
                  <Label htmlFor="childName">ФИ ребенка</Label>
                  <Input
                    className="text-base"
                    id="childName"
                    {...register("childName")}
                  />
                  {errors.childName && <p className="text-red-500 text-sm">{errors.childName.message}</p>}
                </div>

                {/* Телефон родителя */}
                <div className="space-y-2">
                  <Label htmlFor="parentPhone">Телефон родителя</Label>
                  <PhoneInput
                    className="text-base"
                    value={watch("parentPhone") || ""}
                    onChange={(val) => setValue("parentPhone", val, { shouldDirty: true })}
                  />
                  {errors.parentPhone && <p className="text-red-500 text-sm">{errors.parentPhone.message}</p>}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="parentEmail">Электронная почта</Label>
                  <Input
                    className="text-base"
                    id="parentEmail"
                    type="email"
                    {...register("parentEmail")}
                    onFocus={(e) => {
                      setTimeout(() => {
                        e.target.scrollIntoView({ behavior: "smooth", block: "center" })
                      }, 300)
                    }}
                  />
                  {errors.parentEmail && <p className="text-red-500 text-sm">{errors.parentEmail.message}</p>}
                </div>
              </div>

              {/* rules */}
              <div className="space-y-2 flex gap-x-2 mx-2">
                <Input
                  type="checkbox"
                  id="rules"
                  className="h-10 w-10 text-base mt-1"
                  {...register("rules", { required: "Подтвердите согласие с условиями" })}
                />
                <label htmlFor="rules" className="text-sm">
                  Даю согласие на обработку персональных данных, в том числе с целью получения информации о новых продуктах, демо доступах, скидках, персонализированных предложениях, акциях и полезных вебинарах <a className="underline" href="/files/rules_of_visiting.pdf" target="_blank">на следующих условиях</a>
                </label>
              </div>

              {errors.rules && <p className="text-red-500 text-sm">{errors.rules.message}</p>}

              <DialogFooter className="py-4">
                <Button 
                  type="submit" 
                  disabled={!isFormValid || isPending}
                >
                  {isPending ? "Отправка..." : "Отправить"}
                </Button>
              </DialogFooter>
            </form>
          </div>
        </DrawerContent>
      </Drawer>

      {course && <div
        className={`fixed container w-full  transition-all duration-300 ease-in-out dark:bg-slate-800 bg-slate-200 ${isOpen ? "opacity-100" : "opacity-0"} bottom-0 right-0 left-0 mx-auto z-[999999] overflow-hidden shadow-lg`}>
        <div>
          <div className="flex p-3 items-center justify-between">
            <div>
              <h4 className="flex text-sm md:text-xl items-center text-black dark:text-slate-400 ">
                {`${Math.round(Number(course.price))}`} <sup className="pl-1">BYN/мес.</sup>
              </h4>
              <h2
                className=" text-lg md:text-2xl text-gray-800 dark:text-slate-200 text-start font-medium line-clamp-2">
                {course.name}
              </h2>
            </div>
            <button
              onClick={() => { 
                setIsOpenModal(true);
              }}
              className="h-10 px-3 tracking-wide inline-flex items-center justify-center font-medium rounded-md  hover:bg-violet-600/70 bg-violet-600 text-white text-sm">
              Записаться <i className="mdi mdi-arrow-right align-middle ms-1"></i>
            </button>
          </div>
        </div>
      </div>}
    </>
  )
}