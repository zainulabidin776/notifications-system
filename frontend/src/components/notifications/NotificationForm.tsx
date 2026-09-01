import {
  useState,
  type FormEvent,
} from 'react';

import {
  CircleAlert,
  Info,
  LoaderCircle,
  TriangleAlert,
} from 'lucide-react';

import type {
  CreateNotificationRequest,
  NotificationCategory,
} from '../../types/notification';

interface NotificationFormProps {
  initialValues?: CreateNotificationRequest;

  submitLabel: string;

  isSubmitting: boolean;

  error?: string;

  onSubmit: (
    values: CreateNotificationRequest,
  ) => Promise<void>;
}

interface CategoryOption {
  value: NotificationCategory;

  label: string;

  description: string;

  icon: typeof Info;

  selectedClass: string;
}

const categories: CategoryOption[] = [
  {
    value: 'INFO',

    label: 'Information',

    description:
      'General updates and useful information',

    icon: Info,

    selectedClass:
      'border-blue-400/35 bg-blue-400/[0.07] text-blue-400 shadow-[0_10px_30px_rgba(59,130,246,0.06)]',
  },

  {
    value: 'WARNING',

    label: 'Warning',

    description:
      'Something that may require attention',

    icon: TriangleAlert,

    selectedClass:
      'border-amber-400/35 bg-amber-400/[0.07] text-amber-400 shadow-[0_10px_30px_rgba(245,158,11,0.05)]',
  },

  {
    value: 'ERROR',

    label: 'Critical',

    description:
      'Important problems requiring action',

    icon: CircleAlert,

    selectedClass:
      'border-red-400/35 bg-red-400/[0.07] text-red-400 shadow-[0_10px_30px_rgba(239,68,68,0.05)]',
  },
];

export function NotificationForm({
  initialValues,
  submitLabel,
  isSubmitting,
  error,
  onSubmit,
}: NotificationFormProps) {
  const [
    header,
    setHeader,
  ] = useState(
    initialValues?.header ?? '',
  );

  const [
    body,
    setBody,
  ] = useState(
    initialValues?.body ?? '',
  );

  const [
    category,
    setCategory,
  ] =
    useState<NotificationCategory>(
      initialValues?.category ??
        'INFO',
    );

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const cleanHeader =
      header.trim();

    const cleanBody =
      body.trim();

    if (
      !cleanHeader ||
      !cleanBody
    ) {
      return;
    }

    await onSubmit({
      header: cleanHeader,
      body: cleanBody,
      category,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-7"
    >
      {/* Header */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label
            htmlFor="notification-header"
            className="text-sm font-medium text-[var(--text-secondary)]"
          >
            Header
          </label>

          <span className="text-[10px] text-[var(--text-muted)]">
            {header.length}/200
          </span>
        </div>

        <input
          id="notification-header"
          type="text"
          value={header}
          onChange={(event) =>
            setHeader(
              event.target.value,
            )
          }
          maxLength={200}
          required
          autoComplete="off"
          placeholder="e.g. Deployment completed"
          className="premium-input h-12 w-full rounded-xl px-4 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
        />
      </div>

      {/* Message */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label
            htmlFor="notification-body"
            className="text-sm font-medium text-[var(--text-secondary)]"
          >
            Message
          </label>

          <span className="text-[10px] text-[var(--text-muted)]">
            {body.length}/5000
          </span>
        </div>

        <textarea
          id="notification-body"
          value={body}
          onChange={(event) =>
            setBody(
              event.target.value,
            )
          }
          maxLength={5000}
          required
          rows={7}
          placeholder="Write the notification message..."
          className="premium-input w-full resize-none rounded-xl px-4 py-3 text-sm leading-6 text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
        />
      </div>

      {/* Category */}
      <fieldset>
        <legend className="mb-3 text-sm font-medium text-[var(--text-secondary)]">
          Category
        </legend>

        <div className="grid gap-3 md:grid-cols-3">
          {categories.map(
            (item) => {
              const Icon =
                item.icon;

              const selected =
                category ===
                item.value;

              return (
                <button
                  key={
                    item.value
                  }
                  type="button"
                  onClick={() =>
                    setCategory(
                      item.value,
                    )
                  }
                  aria-pressed={
                    selected
                  }
                  className={[
                    'group rounded-2xl border p-4 text-left transition-all duration-200',

                    selected
                      ? item.selectedClass
                      : 'border-[var(--border)] bg-[var(--surface-soft)] text-[var(--text-secondary)] hover:-translate-y-0.5 hover:border-[var(--border-hover)] hover:bg-[var(--surface-hover)]',
                  ].join(' ')}
                >
                  <div className="flex items-center justify-between">
                    <Icon className="h-5 w-5" />

                    <span
                      className={[
                        'flex h-4 w-4 items-center justify-center rounded-full border transition-all',

                        selected
                          ? 'border-current'
                          : 'border-[var(--border-hover)]',
                      ].join(
                        ' ',
                      )}
                    >
                      {selected && (
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      )}
                    </span>
                  </div>

                  <p className="mt-5 text-sm font-semibold">
                    {item.label}
                  </p>

                  <p className="mt-1.5 text-xs leading-5 opacity-65">
                    {
                      item.description
                    }
                  </p>
                </button>
              );
            },
          )}
        </div>
      </fieldset>

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-400/20 bg-red-400/[0.06] px-4 py-3 text-sm text-red-400"
        >
          {error}
        </div>
      )}

      {/* Submit */}
      <div className="flex justify-end border-t border-[var(--border)] pt-6">
        <button
          type="submit"
          disabled={
            isSubmitting ||
            !header.trim() ||
            !body.trim()
          }
          className="group flex h-11 min-w-40 items-center justify-center gap-2 rounded-xl border border-violet-400/25 bg-violet-400/[0.09] px-5 text-sm font-semibold text-violet-400 transition-all duration-200 hover:-translate-y-0.5 hover:border-violet-400/40 hover:bg-violet-400/[0.14] disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isSubmitting ? (
            <>
              <LoaderCircle className="h-4 w-4 animate-spin" />

              Saving...
            </>
          ) : (
            submitLabel
          )}
        </button>
      </div>
    </form>
  );
}