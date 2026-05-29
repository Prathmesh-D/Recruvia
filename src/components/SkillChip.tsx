import { cn } from "@/lib/utils";

interface SkillChipProps {
  label: string;
  variant?: "matched" | "missing" | "amber" | "neutral";
  size?: "sm" | "md";
}

export function SkillChip({ label, variant = "neutral", size = "md" }: SkillChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center font-medium rounded-lg whitespace-nowrap",
        size === "sm" && "text-xs px-2 py-0.5",
        size === "md" && "text-[13px] px-2.5 py-1",
        variant === "matched" && "bg-success-light text-success",
        variant === "missing" && "bg-primary-light text-primary",
        variant === "amber" && "bg-warning-light text-warning",
        variant === "neutral" && "bg-surface-warm text-neutral-700"
      )}
    >
      {label}
    </span>
  );
}
