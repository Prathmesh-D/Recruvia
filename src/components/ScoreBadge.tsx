import { cn, getScoreColor } from "@/lib/utils";

interface ScoreBadgeProps {
  score: number;
  size?: "md" | "lg";
  className?: string;
}

export function ScoreBadge({ score, size = "md", className }: ScoreBadgeProps) {
  const { bg, text } = getScoreColor(score);

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center font-mono font-bold rounded-lg whitespace-nowrap tracking-tight",
        bg,
        text,
        size === "md" && "text-base h-8 min-w-[40px] px-2.5",
        size === "lg" && "text-[22px] h-10 min-w-[56px] px-3.5",
        className
      )}
    >
      {score}
    </div>
  );
}
