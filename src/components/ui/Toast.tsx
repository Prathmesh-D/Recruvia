"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState, useCallback } from "react";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "warning" | "info";
  duration?: number;
}

let toastListeners: Array<(toast: Toast) => void> = [];

export function showToast(
  message: string,
  type: Toast["type"] = "info",
  duration: number = 4000
) {
  const toast: Toast = {
    id: Math.random().toString(36).slice(2),
    message,
    type,
    duration,
  };
  toastListeners.forEach((listener) => listener(toast));
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Toast) => {
    setToasts((prev) => [...prev, toast]);
  }, []);

  useEffect(() => {
    toastListeners.push(addToast);
    return () => {
      toastListeners = toastListeners.filter((l) => l !== addToast);
    };
  }, [addToast]);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-sm">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={removeToast} />
      ))}
    </div>
  );
}

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: (id: string) => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), toast.duration || 4000);
    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onDismiss]);

  const iconMap = {
    success: "✓",
    error: "✕",
    warning: "⚠",
    info: "ℹ",
  };

  const colorMap = {
    success: "bg-success-light text-success border-success/20",
    error: "bg-error-light text-primary border-primary/20",
    warning: "bg-warning-light text-warning border-warning/20",
    info: "bg-neutral-50 text-neutral-700 border-neutral-200",
  };

  return (
    <div
      className={cn(
        "animate-fade-in-up rounded-2xl border px-4 py-3 shadow-md flex items-start gap-3 min-w-[280px]",
        colorMap[toast.type]
      )}
      role="alert"
    >
      <span className="text-lg leading-none mt-0.5">{iconMap[toast.type]}</span>
      <p className="text-sm font-medium flex-1">{toast.message}</p>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-current opacity-50 hover:opacity-100 transition-opacity text-sm leading-none cursor-pointer"
        aria-label="Dismiss notification"
      >
        ✕
      </button>
    </div>
  );
}
