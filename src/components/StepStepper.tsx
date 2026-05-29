"use client";

import { cn } from "@/lib/utils";
import type { WizardStep } from "@/types";

interface StepStepperProps {
  currentStep: WizardStep | 3;
}

export function StepStepper({ currentStep }: StepStepperProps) {
  const steps = [
    { id: 1, label: "Upload Resumes" },
    { id: 2, label: "Job Description" },
    { id: 3, label: "Analyze" },
  ];

  return (
    <div className="w-full bg-[#ebdad3] py-5 px-6 flex justify-center shrink-0 border-b-2 border-neutral-900">
      <div className="flex items-center gap-2 md:gap-4 max-w-[600px] w-full">
        {steps.map((step, index) => {
          const isActive = currentStep === step.id;
          const isComplete = currentStep > step.id;
          const isUpcoming = currentStep < step.id;

          return (
            <div key={step.id} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-3 w-28">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-[14px] font-bold transition-all duration-300 shadow-[2px_2px_0px_#1A1412] border-2 border-neutral-900",
                    isActive && "bg-primary text-white scale-110 shadow-[4px_4px_0px_#1A1412]",
                    isComplete && "bg-primary text-white",
                    isUpcoming && "bg-surface-white text-neutral-500"
                  )}
                >
                  {isComplete ? "✓" : step.id}
                </div>
                <span
                  className={cn(
                    "text-[12px] font-bold uppercase tracking-wider whitespace-nowrap hidden sm:block transition-colors",
                    isActive ? "text-primary" : "text-neutral-500"
                  )}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "h-[2px] flex-1 mx-2 transition-colors duration-300",
                    isComplete ? "bg-primary" : "bg-neutral-900"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
