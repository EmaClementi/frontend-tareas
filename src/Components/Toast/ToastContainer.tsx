import { Toast } from "./Toast";
import type { ToastType } from "./Toast";
import "./ToastContainer.css";


export type ToastItem = {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
};

type Props = {
  toasts: ToastItem[];
  onClose: (id: string) => void;
};

export function ToastContainer({ toasts, onClose }: Props) {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={onClose}
        />
      ))}
    </div>
  );
}