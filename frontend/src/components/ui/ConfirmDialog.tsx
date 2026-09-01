import {
  LoaderCircle,
  Trash2,
  X,
} from 'lucide-react';

import {
  AnimatePresence,
  motion,
} from 'framer-motion';

import {
  useEffect,
  useRef,
} from 'react';

interface ConfirmDialogProps {
  open: boolean;

  title: string;

  description: string;

  confirmLabel: string;

  isLoading?: boolean;

  onConfirm: () => void;

  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const cancelButtonRef =
    useRef<HTMLButtonElement>(
      null,
    );

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      'hidden';

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (
        event.key === 'Escape' &&
        !isLoading
      ) {
        onCancel();
      }
    };

    window.addEventListener(
      'keydown',
      handleKeyDown,
    );

    const focusTimer =
      window.setTimeout(() => {
        cancelButtonRef.current?.focus();
      }, 50);

    return () => {
      window.clearTimeout(
        focusTimer,
      );

      window.removeEventListener(
        'keydown',
        handleKeyDown,
      );

      document.body.style.overflow =
        previousOverflow;
    };
  }, [
    open,
    isLoading,
    onCancel,
  ]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          transition={{
            duration: 0.17,
          }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-[5px] sm:p-5"
          onMouseDown={(event) => {
            if (
              event.target ===
                event.currentTarget &&
              !isLoading
            ) {
              onCancel();
            }
          }}
        >
          <motion.div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-dialog-title"
            aria-describedby="confirm-dialog-description"
            initial={{
              opacity: 0,
              scale: 0.96,
              y: 10,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.97,
              y: 5,
            }}
            transition={{
              type: 'spring',
              stiffness: 340,
              damping: 29,
            }}
            className="w-full max-w-md overflow-hidden rounded-[24px] border border-[var(--border)] bg-[var(--surface-elevated)] shadow-[0_28px_90px_rgba(0,0,0,0.28)]"
          >
            <div className="flex items-start justify-between p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-red-400/15 bg-red-400/[0.08] text-red-400">
                <Trash2 className="h-5 w-5" />
              </div>

              <motion.button
                type="button"
                whileTap={{
                  scale: 0.9,
                }}
                disabled={
                  isLoading
                }
                onClick={
                  onCancel
                }
                aria-label="Close confirmation dialog"
                className="flex h-9 w-9 items-center justify-center rounded-xl text-[var(--text-muted)] transition-all hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)] disabled:opacity-40"
              >
                <X className="h-4 w-4" />
              </motion.button>
            </div>

            <div className="px-6 pb-6">
              <h3
                id="confirm-dialog-title"
                className="text-lg font-semibold tracking-[-0.02em] text-[var(--text-primary)]"
              >
                {title}
              </h3>

              <p
                id="confirm-dialog-description"
                className="mt-2 text-sm leading-6 text-[var(--text-secondary)]"
              >
                {description}
              </p>
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-[var(--border)] bg-[var(--surface-soft)] p-4 sm:flex-row sm:justify-end">
              <button
                ref={
                  cancelButtonRef
                }
                type="button"
                onClick={
                  onCancel
                }
                disabled={
                  isLoading
                }
                className="h-10 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 text-sm font-medium text-[var(--text-secondary)] transition-all hover:border-[var(--border-hover)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)] disabled:opacity-50"
              >
                Cancel
              </button>

              <motion.button
                type="button"
                whileTap={{
                  scale: 0.97,
                }}
                onClick={
                  onConfirm
                }
                disabled={
                  isLoading
                }
                className="flex h-10 items-center justify-center gap-2 rounded-xl border border-red-400/20 bg-red-500 px-4 text-sm font-semibold text-white transition-all hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading && (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                )}

                {isLoading
                  ? 'Deleting...'
                  : confirmLabel}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}