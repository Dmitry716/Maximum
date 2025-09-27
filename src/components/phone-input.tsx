import { useEffect, useRef } from "react"
import IMask from "imask"
import { Input } from "./ui/input"

export function PhoneInput({ value, onChange, className }: {
  value: string,
  className?: string
  onChange: (val: string) => void
}) {
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (ref.current) {
      const mask = IMask(ref.current, {
        mask: '+375 00 000-00-00',
        lazy: false,
      })

      mask.on("accept", () => onChange(mask.value))

      return () => mask.destroy()
    }
  }, [onChange])

  return (
    <Input
      ref={ref}
      value={value}
      onChange={() => {}}
      className={className}
      placeholder="+375 __ ___-__-__"
    />
  )
}
