import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

export function truncateFilename(name: string, maxLength: number = 40): string {
  if (name.length <= maxLength) return name;
  const ext = name.split(".").pop() || "";
  const nameWithoutExt = name.slice(0, name.length - ext.length - 1);
  const truncated = nameWithoutExt.slice(0, maxLength - ext.length - 4) + "...";
  return `${truncated}.${ext}`;
}

export function getScoreColor(score: number): {
  bg: string;
  text: string;
  label: string;
} {
  if (score >= 80) return { bg: "bg-success-light", text: "text-success", label: "Excellent" };
  if (score >= 60) return { bg: "bg-primary-light", text: "text-primary", label: "Good" };
  if (score >= 40) return { bg: "bg-warning-light", text: "text-warning", label: "Fair" };
  return { bg: "bg-primary-light", text: "text-primary-dark", label: "Low" };
}

export function getRankEmoji(rank: number): string {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return `${rank}`;
}

export function getFileIcon(mimeType: string): { color: string; label: string } {
  if (mimeType === "application/pdf") return { color: "text-red-600", label: "PDF" };
  if (mimeType.includes("word") || mimeType.includes("docx"))
    return { color: "text-blue-600", label: "DOC" };
  return { color: "text-neutral-500", label: "FILE" };
}

const VALID_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export function validateFile(file: File): { valid: boolean; error?: string } {
  if (!VALID_MIME_TYPES.includes(file.type)) {
    return { valid: false, error: "Unsupported file type. Use PDF, DOC, or DOCX." };
  }
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: "File too large — max 5 MB." };
  }
  return { valid: true };
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
