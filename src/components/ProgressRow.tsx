import { cn } from "@/lib/utils";

interface ProgressRowProps {
  name: string;
  status: "queued" | "analyzing" | "scored" | "error";
  score?: number;
  errorReason?: string;
}

export function ProgressRow({ name, status, score, errorReason }: ProgressRowProps) {
  return (
    <div className="flex items-center justify-between bg-white rounded-2xl border border-neutral-200 px-4 py-3.5 shadow-sm animate-slide-in-left">
      <div className="flex items-center gap-3 min-w-0">
        {/* Status Icon */}
        <div className="w-6 flex justify-center shrink-0">
          {status === "queued" && (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="text-neutral-300"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          )}
          {status === "analyzing" && (
            <svg
              className="animate-spin h-5 w-5 text-primary shrink-0"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          )}
          {status === "scored" && (
            <svg
              className="h-5 w-5 text-success shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
          {status === "error" && (
            <svg
              className="h-5 w-5 text-error shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          )}
        </div>

        {/* Name */}
        <span
          className={cn(
            "text-sm font-medium truncate",
            status === "error" ? "text-error" : "text-neutral-900"
          )}
        >
          {name}
        </span>
      </div>

      <div className="flex items-center gap-3">
        {/* Status Label / Error */}
        {status === "analyzing" && (
          <span className="text-[13px] text-primary italic font-medium">
            Analyzing...
          </span>
        )}
        {status === "queued" && (
          <span className="text-[13px] text-neutral-500 font-medium">
            Queued
          </span>
        )}
        {status === "error" && (
          <span className="text-[12px] text-error max-w-[150px] truncate">
            {errorReason || "Failed"}
          </span>
        )}

        {/* Score Badge */}
        {status === "scored" && score !== undefined && (
          <div className="flex items-center gap-3 animate-scale-in">
            <span className="text-[13px] text-success font-medium">Done</span>
            <div
              className={cn(
                "px-2.5 py-1 rounded-lg font-mono text-sm font-bold min-w-[36px] text-center",
                score >= 80 ? "bg-success-light text-success" : "bg-primary-light text-primary"
              )}
            >
              {score}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
