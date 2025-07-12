"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ToastProps {
  title?: string
  description?: string
  variant?: "default" | "destructive" | "success"
  onClose?: () => void
}

export function Toast({ title, description, variant = "default", onClose }: ToastProps) {
  const [isVisible, setIsVisible] = React.useState(true)

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      onClose?.()
    }, 5000)

    return () => clearTimeout(timer)
  }, [onClose])

  if (!isVisible) return null

  return (
    <div
      className={cn("fixed top-4 right-4 z-[60] w-full max-w-sm rounded-lg border p-4 shadow-lg transition-all", {
        "bg-white border-slate-200": variant === "default",
        "bg-red-50 border-red-200": variant === "destructive",
        "bg-green-50 border-green-200": variant === "success",
      })}
    >
      <div className="flex items-start gap-3">
        <div className="flex-1">
          {title && (
            <h4
              className={cn("text-sm font-semibold", {
                "text-slate-900": variant === "default",
                "text-red-900": variant === "destructive",
                "text-green-900": variant === "success",
              })}
            >
              {title}
            </h4>
          )}
          {description && (
            <p
              className={cn("text-sm", {
                "text-slate-600": variant === "default",
                "text-red-700": variant === "destructive",
                "text-green-700": variant === "success",
              })}
            >
              {description}
            </p>
          )}
        </div>
        <button
          onClick={() => {
            setIsVisible(false)
            onClose?.()
          }}
          className="text-slate-400 hover:text-slate-600"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToastViewport />
    </>
  )
}

export function ToastViewport() {
  return <div className="fixed bottom-0 right-0 z-[100] flex flex-col gap-y-2 sm:m-8 w-[380px] pointer-events-none" />
}

export function ToastTitle({ children }: { children: React.ReactNode }) {
  return <div className="mb-1 text-sm font-semibold">{children}</div>
}

export function ToastDescription({ children }: { children: React.ReactNode }) {
  return <div className="text-sm opacity-90">{children}</div>
}

export function ToastClose() {
  return <button>Close</button>
}

export function ToastAction() {
  return <button>Action</button>
}
