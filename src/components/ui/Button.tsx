import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "inverse" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center font-semibold transition-all duration-150 rounded-[10px] cursor-pointer select-none",
          "focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2",
          "disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none relative overflow-hidden",
          // Variants
          variant === "primary" &&
            "bg-white text-neutral-900 hover:bg-primary hover:text-white shadow-[4px_4px_0px_#1A1412] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#1A1412] border-2 border-neutral-900",
          variant === "secondary" &&
            "bg-surface-white text-neutral-900 border-2 border-neutral-900 shadow-[4px_4px_0px_#1A1412] hover:bg-primary hover:text-white active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#1A1412]",
          variant === "inverse" &&
            "bg-primary text-white border-2 border-neutral-900 shadow-[4px_4px_0px_#1A1412] hover:bg-white hover:text-neutral-900 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#1A1412]",
          variant === "ghost" &&
            "bg-transparent text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50 border-2 border-transparent hover:border-neutral-900",
          variant === "destructive" &&
            "bg-error text-white hover:bg-primary-dark shadow-[4px_4px_0px_#1A1412] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#1A1412] border-2 border-neutral-900",
          // Sizes
          size === "sm" && "h-8 px-3 text-[13px] gap-1.5",
          size === "md" && "h-10 px-5 text-sm gap-2",
          size === "lg" && "h-12 px-7 text-base gap-2.5",
          className
        )}
        {...props}
      >
        {isLoading && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin text-current opacity-80" />
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
