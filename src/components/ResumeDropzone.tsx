"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { cn, validateFile } from "@/lib/utils";

interface ResumeDropzoneProps {
  onFilesSelected: (files: { file: File; error?: string }[]) => void;
  disabled?: boolean;
}

import { motion } from "framer-motion";

export function ResumeDropzone({ onFilesSelected, disabled }: ResumeDropzoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      const results = [];

      for (const file of acceptedFiles) {
        const validation = validateFile(file);
        results.push({ file, error: validation.error });
      }

      for (const rejection of rejectedFiles) {
        let error = "Invalid file.";
        if (rejection.errors[0]?.code === "file-invalid-type") {
          error = "Unsupported file type. Use PDF, DOC, or DOCX.";
        } else if (rejection.errors[0]?.code === "file-too-large") {
          error = "File too large — max 5 MB.";
        }
        results.push({ file: rejection.file, error });
      }

      onFilesSelected(results);
    },
    [onFilesSelected]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled,
    maxSize: 5 * 1024 * 1024,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
        ".docx",
      ],
    },
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "h-[180px] bg-surface-white rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer text-center px-6 outline-none shadow-[2px_2px_0px_#1A1412] transition-all duration-200 ease-in-out",
        isDragActive
          ? "border-primary bg-surface-warm scale-[1.02] shadow-[4px_4px_0px_#1A1412]"
          : "border-neutral-900 hover:border-primary hover:bg-surface-warm/50 hover:shadow-[4px_4px_0px_#1A1412] hover:scale-[1.015] hover:-translate-y-0.5 active:scale-[0.985]",
        disabled && "opacity-50 cursor-not-allowed hover:border-neutral-300 hover:bg-white hover:scale-100 hover:translate-y-0 active:scale-100"
      )}
    >
      <input {...getInputProps()} />
      <div className="w-10 h-10 mb-3 text-primary">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
      </div>
      <p className="text-base font-medium text-neutral-900 mb-1">
        Drag & drop resumes here
      </p>
      <p className="text-sm text-neutral-500 mb-4">
        or <span className="text-primary underline">click to browse files</span>
      </p>
      <p className="text-xs text-neutral-500">
        PDF, DOC, DOCX · Max 5 MB per file
      </p>
    </div>
  );
}
