import { useEffect } from "react";
import "./Toast.css";

export type ToastType = "success" | "error" | "warning" | "info";

type Props = {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  onClose: (id: string) => void;
};

export function Toast({ id, message, type, duration = 3000, onClose }: Props) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const icons = {
    success: "✅",
    error: "❌",
    warning: "⚠️",
    info: "ℹ️",
  };

  return (
    <div className={`toast toast-${type}`}>
      <span className="toast-icon">{icons[type]}</span>
      <span className="toast-message">{message}</span>
      <button className="toast-close" onClick={() => onClose(id)}>
        ✕
      </button>
    </div>
  );
}