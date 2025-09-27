import type React from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

interface CrudLayoutProps {
  title: string
  description: string
  isButton?: boolean
  createButtonLabel: string
  onCreateClick: () => void
  children: React.ReactNode
}

export function CrudLayout({ title, description, createButtonLabel, onCreateClick, children, isButton = true }: CrudLayoutProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
          <p className="text-muted-foreground">{description}</p>
        </div>
        {isButton && <Button onClick={onCreateClick}>
          <PlusCircle className="mr-2 h-4 w-4" />
          {createButtonLabel}
        </Button>}
      </div>
      {children}
    </div>
  )
}

