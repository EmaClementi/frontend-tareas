import { useEffect } from "react";
import "./Modal.css";

type Props = {
  open: boolean;
  title?: string;
  children: React.ReactNode;
  onClose: () => void;
};

export function Modal({ open, title, children, onClose }: Props) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  useEffect(() => {
  const handleEsc = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  if (open) {
    window.addEventListener("keydown", handleEsc);
  }

  return () => {
    window.removeEventListener("keydown", handleEsc);
  };
}, [open, onClose]);


  if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
      >
        {title && <h3>{title}</h3>}
        <div className="modal-content">{children}</div>
      </div>
    </div>
  );
}
