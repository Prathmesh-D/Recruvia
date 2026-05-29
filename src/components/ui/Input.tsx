import { cn } from "@/lib/utils";
import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon, error, ...props }, ref) => {
    return (
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-300 pointer-events-none">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full h-11 bg-surface-white rounded-lg border-2 text-sm font-bold text-primary placeholder:text-primary/50 focus:bg-primary/5",
            "transition-shadow duration-150",
            "focus:outline-none focus:border-primary focus:shadow-[4px_4px_0px_#1A1412] shadow-sm",
            icon ? "pl-10 pr-4" : "px-4",
            error
              ? "border-primary"
              : "border-neutral-900 hover:shadow-[2px_2px_0px_#1A1412]",
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-xs text-primary" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  charCount?: number;
  maxChars?: number;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, charCount, maxChars, ...props }, ref) => {
    return (
      <div className="relative">
        <textarea
          ref={ref}
          className={cn(
            "w-full bg-surface-white rounded-lg border-2 text-sm font-medium text-primary placeholder:text-primary/50 focus:bg-primary/5",
            "transition-shadow duration-150 resize-y min-h-[220px] px-4 py-3",
            "focus:outline-none focus:border-primary focus:shadow-[4px_4px_0px_#1A1412] shadow-sm",
            error
              ? "border-primary"
              : "border-neutral-900 hover:shadow-[2px_2px_0px_#1A1412]",
            className
          )}
          {...props}
        />
        <div className="flex justify-between items-center mt-1.5">
          {error ? (
            <p className="text-xs text-primary" role="alert">
              {error}
            </p>
          ) : (
            <span />
          )}
          {maxChars !== undefined && (
            <span className="text-xs text-neutral-500">
              {charCount?.toLocaleString() ?? 0} / {maxChars.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    );
  }
);
Textarea.displayName = "Textarea";
