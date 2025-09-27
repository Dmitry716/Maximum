import type React from "react"
import { useState, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ImageUploadProps {
  onImageUpload: (file: File) => void
  currentImage?: string
}

export function ImageUpload({ onImageUpload, currentImage }: ImageUploadProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(currentImage || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result as string)
      }
      reader.readAsDataURL(file)
      onImageUpload(file)
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="image">Изображение</Label>
      <div className="flex items-center space-x-4">
        <Button onClick={handleButtonClick} type="button">
          Выбрать файл
        </Button>
        <Input
          id="image"
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        {previewImage && (
          <div className="relative h-20 w-20">
            <Image
              src={previewImage || "/placeholder.svg"}
              alt="Preview"
              fill
              style={{ objectFit: "cover" }}
              className="rounded-md"
            />
          </div>
        )}
      </div>
    </div>
  )
}

