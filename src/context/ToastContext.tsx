import { createContext } from "react";
import type { ToastType } from "../Components/Toast/Toast";

export type ToastContextType = {
  showToast: (message: string, type: ToastType, duration?: number) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
};

export const ToastContext = createContext<ToastContextType | null>(null);