"use client";
import React, { useState } from "react";
import Image from "next/image";

import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer";
import ScrollToTop from "@/components/scroll-to-top";
import Switcher from "@/components/switcher";

import { FiMail, FiMapPin, FiPhone, FiX } from "react-icons/fi";
import Link from "next/link";
import { z } from "zod";
import { contactFormSchemaClient } from "@/lib/validations";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { createApplication } from "@/api/requests";
import { ApplicationStatus } from "@/types/enum";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/phone-input";
import Script from "next/script";

type ContactFormSchemaFormValues = z.infer<typeof contactFormSchemaClient>;

export default function Page() {
  let [modal, setModal] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<ContactFormSchemaFormValues>({
    resolver: zodResolver(contactFormSchemaClient),
    defaultValues: {
      childName: "",
      parentPhone: "",
      status: ApplicationStatus.NEW,
      message: "",
    },
  });

  const { mutate: createApplicationMutation, isPending } = useMutation({
    mutationFn: async (data: any) => {
      const res = await createApplication({
        childName: data.childName,
        parentPhone: data.parentPhone,
        status: data.status,
        photo: data.photo,
        age: data.age,
        courseId: data.courseId,
        parentEmail: data.parentEmail,
        message: data.message,
      });
      return { ...res, updatedData: data };
    },
    onSuccess: (result: any) => {
      if (result) {
        toast.success("Заявка отправлена");
        reset();
      }
    },
    onError: (error) => {
      console.log("Xatolik:", error);
    },
  });

  const onSubmit = async (data: any) => {
    createApplicationMutation(data);
  };

  // JSON-LD для страницы контактов
  const contactPageSchema = {
    "@context": "https://schema.org ",
    "@type": "ContactPage",
    url: `${process.env.NEXT_PUBLIC_API_URL}/contact`,
    about: {
      "@type": "LocalBusiness",
      name: "Спортивно-образовательный центр «Максимум»",
      image: `${process.env.NEXT_PUBLIC_API_URL}/logo.webp`,
      telephone: "+375297800008",
      email: "vitebskmaximum@gmail.com",
      address: {
        "@type": "PostalAddress",
        streetAddress: "пр-т Московский, 66-108",
        addressLocality: "Витебск",
        addressCountry: "BY",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: "55.17936763601323",
        longitude: "30.224230076207",
      },
      openingHours: "Mo,Tu,We,Th,Fr 09:00-18:00",
      sameAs: [
        "https://www.facebook.com/maximus-center ",
        "https://www.instagram.com/maximus_center ",
      ],
    },
  };

  return (
    <>
      <Script
        type="application/ld+json"
        id="contact-page-schema"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }}
      />
      
      <Navbar navlight={false} tagline={false} />

      <div className="container-fluid relative mt-20">
        <div className="grid grid-cols-1">
          <div className="w-full leading-[0] border-0">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2278.2230817878108!2d30.224230076207!3d55.17936763601323!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46c57143825962f5%3A0x19aa23901c0d0578!2sMoskovskiy%20Prospekt%2066%2C%20Viciebsk%2C%20Viciebskaja%20voblas%C4%87%20210029%2C%20Belarus!5e0!3m2!1suz!2s!4v1749380269977!5m2!1suz!2s"
              style={{ border: "0" }}
              title="map"
              className="w-full h-[500px]"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>

      <section className="relative lg:py-24 py-16">
        <div className="container relative">
          <div className="grid md:grid-cols-12 grid-cols-1 items-center gap-6">
            <div className="lg:col-span-7 md:col-span-6">
              <Image
                src="/images/contact.svg"
                width={0}
                height={0}
                sizes="100vw"
                style={{ width: "100%", height: "auto" }}
                alt=""
              />
            </div>

            <div className="lg:col-span-5 md:col-span-6">
              <div className="lg:me-5">
                <div className="bg-white dark:bg-slate-900 rounded-md shadow dark:shadow-gray-700 p-6">
                  <h3 className="mb-6 md:text-3xl text-2xl md:leading-normal leading-normal font-semibold">
                    Свяжитесь с нами!
                  </h3>

                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div>
                      <div className="lg:col-span-6 mb-5">
                        <label htmlFor="childName" className="font-medium">
                          Ваше имя:
                        </label>
                        <input
                          {...register("childName")}
                          name="childName"
                          id="childName"
                          type="text"
                          className="w-full py-2 px-3 border border-slate-100 dark:border-slate-800 focus:border-violet-600/30 bg-transparent focus:outline-none rounded-md h-10 mt-2"
                          placeholder="Имя:"
                        />
                        {errors.childName && (
                          <span className="text-red-600">
                            {errors.childName.message}
                          </span>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="parentPhone">Телефон родителя</Label>
                        <PhoneInput
                          className="w-full py-2 px-3 border border-slate-100 dark:border-slate-800 focus:border-violet-600/30 bg-transparent focus:outline-none rounded-md h-10 mt-2"
                          value={watch("parentPhone") || ""}
                          onChange={(val) =>
                            setValue("parentPhone", val, { shouldDirty: true })
                          }
                        />
                        {errors.parentPhone && (
                          <p className="text-red-500 text-sm">
                            {errors.parentPhone.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1">
                      <div className="mb-5 mt-4">
                        <label htmlFor="comments" className="font-medium">
                          Ваше сообщение:
                        </label>
                        <textarea
                          {...register("message")}
                          name="comments"
                          id="comments"
                          className="w-full py-2 px-3 border border-slate-100 dark:border-slate-800 focus:border-violet-600/30 bg-transparent focus:outline-none rounded-md h-28 mt-2 textarea"
                          placeholder="Сообщение:"
                        ></textarea>
                        {errors.message && (
                          <span className="text-red-600">
                            {errors.message.message}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={!isDirty || isPending}
                      id="submit"
                      name="send"
                      className="h-10 px-5 disabled:opacity-50 tracking-wide inline-flex items-center justify-center font-medium rounded-md bg-violet-600 text-white"
                    >
                      Отправить сообщение
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container relative lg:mt-24 mt-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-6">
            {/* Телефон */}
            <div className="text-center px-6">
              <div className="size-16 bg-violet-600/5 text-violet-600 rounded-2xl flex align-middle justify-center items-center shadow-sm mx-auto">
                <FiPhone className="text-3xl" />
              </div>
              <div className="content mt-4">
                <h5 className="text-lg font-semibold">Телефон</h5>
                <p className="text-slate-400 mt-3">
                  Свяжитесь с нами по телефону или мессенджерам
                </p>
                <div className="mt-4">
                  <Link
                    href="tel:+375297800008"
                    className="btn btn-link text-violet-600 hover:text-violet-600 after:bg-violet-600 transition duration-500"
                  >
                    +375 29 780 00 08
                  </Link>
                </div>
              </div>
            </div>

            {/* Почта */}
            <div className="text-center px-6">
              <div className="size-16 bg-violet-600/5 text-violet-600 rounded-2xl flex align-middle justify-center items-center shadow-sm mx-auto">
                <FiMail className="text-3xl" />
              </div>
              <div className="content mt-4">
                <h5 className="text-lg font-semibold">Электронная почта</h5>
                <p className="text-slate-400 mt-3">
                  Напишите нам, и мы ответим в ближайшее время
                </p>
                <div className="mt-4">
                  <Link
                    href="mailto:vitebskmaximum@gmail.com"
                    className="btn btn-link text-violet-600 hover:text-violet-600 after:bg-violet-600 transition duration-500"
                  >
                    vitebskmaximum@gmail.com
                  </Link>
                </div>
              </div>
            </div>

            {/* Адрес */}
            <div className="text-center px-6">
              <div className="size-16 bg-violet-600/5 text-violet-600 rounded-2xl flex align-middle justify-center items-center shadow-sm mx-auto">
                <FiMapPin className="text-3xl" />
              </div>
              <div className="content mt-4">
                <h5 className="text-lg font-semibold">Адрес</h5>
                <p className="text-slate-400 mt-3">
                  г. Витебск, пр-т Московский, 66-108
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {modal && (
        <div className="w-full h-screen bg-slate-900/80 fixed top-0 left-0 bottom-0 right-0 z-999 flex items-center justify-center">
          <div className="w-full h-full px-5 md:px-40 md-py-20 py-5">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d55431.05581015953!2d-95.461302!3d29.735948000000004!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8640c36647a52ab1%3A0x70a301678672cb!2sBriargrove%20Park%2C%20Houston%2C%20TX%2C%20USA!5e0!3m2!1sen!2sin!4v1710322657489!5m2!1sen!2sin"
              width="100%"
              height="100%"
              title="myfram"
              loading="lazy"
            ></iframe>
          </div>
          <button
            className="text-slate-400 absolute top-[20px] right-[20px]"
            onClick={() => setModal(!modal)}
          >
            <FiX className="size-5" />
          </button>
        </div>
      )}

      <Footer />

      <ScrollToTop />
      <Switcher />
    </>
  );
}
