import { cn, formatFileSize, truncateFilename, getFileIcon } from "@/lib/utils";
import type { FileUploadState } from "@/types";

interface FileRowProps {
  file: FileUploadState;
  onRemove: (id: string) => void;
}

export function FileRow({ file, onRemove }: FileRowProps) {
  const { color, label } = getFileIcon(file.file.type);
  const isError = file.status === "error";
  const isSuccess = file.status === "success";

  return (
    <div
      className={cn(
        "flex flex-col rounded-2xl border px-4 py-3 transition-colors duration-200 group animate-fade-in-up",
        isError ? "bg-error-light border-error/20" : "bg-white border-neutral-200"
      )}
    >
      <div className="flex items-center gap-3">
        {/* Icon */}
        <div className={cn("text-xs font-bold w-8 text-center shrink-0", color)}>
          {label}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p
              className={cn(
                "text-sm truncate pr-4",
                isError ? "text-error" : "text-neutral-900"
              )}
              title={file.filename}
            >
              {truncateFilename(file.filename)}
            </p>
            <span
              className={cn(
                "text-xs shrink-0",
                isError ? "text-error/80" : "text-neutral-500"
              )}
            >
              {formatFileSize(file.size)}
            </span>
          </div>

          {/* Progress Bar */}
          {!isSuccess && !isError && (
            <div className="mt-2 h-1 w-full bg-neutral-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300 ease-out"
                style={{ width: `${file.progress}%` }}
              />
            </div>
          )}

          {/* Error Message */}
          {isError && file.error && (
            <p className="mt-1 text-xs text-error font-medium">{file.error}</p>
          )}
        </div>

        {/* Status / Action */}
        <div className="flex items-center justify-center w-6 shrink-0">
          {file.status === "uploading" && (
            <svg
              className="animate-spin h-4 w-4 text-primary"
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
          {isSuccess && (
            <svg
              className="h-4 w-4 text-success"
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
          {isError && (
            <svg
              className="h-4 w-4 text-error"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          )}
        </div>

        {/* Remove Button (shows on hover) */}
        <button
          onClick={() => onRemove(file.id)}
          className="w-6 h-6 flex items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900 opacity-0 group-hover:opacity-100 transition-all focus:opacity-100 cursor-pointer"
          aria-label="Remove file"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  );
}
