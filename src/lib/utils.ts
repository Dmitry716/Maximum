import { uploadFile } from "@/api/requests"
import { FileType } from "@/types/enum"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatPhoneNumber = (input: string) => {
  const cleaned = input.replace(/\D/g, "")
  const match = cleaned.match(/^(\d{3})(\d{2})(\d{7})$/)
  if (match) {
    return `+${match[1]} ${match[2]} ${match[3]}`
  }
  return input
}

export async function handleUploadFile(file: File, fileType: FileType) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("fileType", fileType);
  formData.append("entityId", "1");
  formData.append("entityType", "application");

  const data = await uploadFile(formData);
  return data.path;
}
