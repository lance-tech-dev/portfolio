"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDangerous?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  isDangerous = true,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 font-mono"
      onClick={onCancel}
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      <div
        className="w-full max-w-sm bg-neutral-950 border border-neutral-800 rounded-xl shadow-2xl p-6 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3">
          <div
            className={`p-2 rounded-full shrink-0 ${
              isDangerous
                ? "bg-red-950/50 text-red-400"
                : "bg-neutral-900 text-neutral-300"
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="space-y-1 min-w-0">
            <h2
              id="confirm-dialog-title"
              className="text-sm font-bold text-white"
            >
              {title}
            </h2>
            <p className="text-xs text-neutral-400 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-neutral-400 hover:text-white transition-colors text-xs"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            autoFocus
            className={`px-4 py-2 font-semibold rounded-md transition-colors text-xs ${
              isDangerous
                ? "bg-red-600 hover:bg-red-500 text-white"
                : "bg-white hover:bg-neutral-200 text-black"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
