"use client";
import { useEffect, useRef } from "react";
export function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const close = useRef(onClose);
  close.current = onClose;
  useEffect(() => {
    const node = ref.current;
    const previous = document.activeElement as HTMLElement | null;
    node?.showModal();
    const cancel = (e: Event) => {
      e.preventDefault();
      close.current();
    };
    node?.addEventListener("cancel", cancel);
    return () => {
      node?.removeEventListener("cancel", cancel);
      node?.close();
      previous?.focus();
    };
  }, []);
  return (
    <dialog
      className="study-modal"
      ref={ref}
      aria-label={title}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-top">
        <h2>{title}</h2>
        <button aria-label="Close dialog" className="close" onClick={onClose}>
          ×
        </button>
      </div>
      {children}
    </dialog>
  );
}
