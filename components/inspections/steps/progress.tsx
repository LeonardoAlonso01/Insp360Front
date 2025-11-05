"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface StepProgressProps {
  currentStep: number
  totalSteps: number
  stepTitles: string[]
}

export function StepProgress({ currentStep, totalSteps, stepTitles }: StepProgressProps) {
  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1
          const isCompleted = stepNumber < currentStep
          const isCurrent = stepNumber === currentStep
          const isUpcoming = stepNumber > currentStep

          return (
            <div key={stepNumber} className="flex items-center">
              {/* Step Circle */}
              <div
                className={cn("flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all", {
                  "bg-green-600 border-green-600 text-white": isCompleted,
                  "bg-red-600 border-red-600 text-white": isCurrent,
                  "bg-white border-slate-300 text-slate-400": isUpcoming,
                })}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <span className="text-sm font-medium">{stepNumber}</span>
                )}
              </div>

              {/* Step Title */}
              <div className="ml-2 hidden sm:block">
                <p
                  className={cn("text-sm font-medium", {
                    "text-green-600": isCompleted,
                    "text-red-600": isCurrent,
                    "text-slate-400": isUpcoming,
                  })}
                >
                  {stepTitles[index]}
                </p>
              </div>

              {/* Connector Line */}
              {index < totalSteps - 1 && (
                <div
                  className={cn("flex-1 h-0.5 mx-4", {
                    "bg-green-600": isCompleted,
                    "bg-slate-300": !isCompleted,
                  })}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Mobile Step Title */}
      <div className="sm:hidden mt-2 text-center">
        <p className="text-sm font-medium text-red-600">{stepTitles[currentStep - 1]}</p>
      </div>
    </div>
  )
}
