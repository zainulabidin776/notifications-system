import type { InputHTMLAttributes } from 'react';

interface FormFieldProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function FormField({
  label,
  error,
  ...props
}: FormFieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-zinc-300">
        {label}
      </span>

      <input
        {...props}
        className={[
          'h-12 w-full rounded-2xl border bg-white/[0.035] px-4 text-sm text-white outline-none transition',
          'placeholder:text-zinc-600',
          'focus:border-violet-400/40 focus:bg-white/[0.05] focus:ring-4 focus:ring-violet-500/10',
          error
            ? 'border-red-400/40'
            : 'border-white/10',
        ].join(' ')}
      />

      {error && (
        <span className="mt-2 block text-xs text-red-300">
          {error}
        </span>
      )}
    </label>
  );
}