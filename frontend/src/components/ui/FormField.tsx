import type {
  InputHTMLAttributes,
} from 'react';

interface FormFieldProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function FormField({
  label,
  id,
  className = '',
  ...props
}: FormFieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium text-[var(--text-secondary)]"
      >
        {label}
      </label>

      <input
        id={id}
        {...props}
        className={[
          'premium-input h-12 w-full rounded-xl px-4 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]',
          className,
        ].join(' ')}
      />
    </div>
  );
}