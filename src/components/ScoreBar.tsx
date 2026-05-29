import { cn, getScoreColor } from "@/lib/utils";

interface ScoreBarProps {
  score: number;
  label: string;
}

export function ScoreBar({ score, label }: ScoreBarProps) {
  const { bg } = getScoreColor(score);
  
  // Use a slightly softer background for the bar itself, using text token instead of full bg if it's the light variant
  const barColor = score >= 80 ? "bg-success" : score >= 60 ? "bg-primary" : score >= 40 ? "bg-warning" : "bg-primary-dark";

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-bold text-neutral-900 uppercase tracking-widest">{label}</span>
        <span className="text-[13px] font-mono font-bold text-primary">{score}/100</span>
      </div>
      <div className="h-4 w-full bg-surface-warm border-2 border-neutral-900 overflow-hidden shadow-[2px_2px_0px_#1A1412]">
        <div
          className="h-full bg-primary border-r-2 border-neutral-900 transition-all duration-700 ease-out relative"
          style={{ width: `${score}%` }}
        >
          {/* Diagonal stripes on progress bar */}
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 10px, #fff 10px, #fff 20px)" }} />
        </div>
      </div>
    </div>
  );
}
