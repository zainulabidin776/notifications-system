import {
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  LoaderCircle,
  LockKeyhole,
  Moon,
  Palette,
  RotateCcw,
  Save,
  Settings2,
  ShieldCheck,
  Sun,
  UserRound,
} from 'lucide-react';

import {
  motion,
} from 'framer-motion';

import {
  useMemo,
  useState,
  type FormEvent,
} from 'react';

import axios from 'axios';

import {
  AppLayout,
} from '../../components/layout/AppLayout';

import {
  PremiumCard,
} from '../../components/ui/PremiumCard';

import {
  useAuth,
} from '../../context/useAuth';

import {
  useTheme,
} from '../../context/useTheme';

function getApiErrorMessage(
  error: unknown,
  fallback: string,
) {
  if (
    axios.isAxiosError(error)
  ) {
    const message =
      error.response?.data
        ?.message;

    if (
      Array.isArray(message)
    ) {
      return message.join(
        ', ',
      );
    }

    if (
      typeof message ===
        'string' &&
      message.trim()
    ) {
      return message;
    }
  }

  return fallback;
}

export function SettingsPage() {
  const {
    user,
    updateProfile,
    changePassword,
  } = useAuth();

  const {
    theme,
    toggleTheme,
  } = useTheme();

  const isDark =
    theme === 'dark';

  const [
    fullName,
    setFullName,
  ] = useState(
    user?.fullName ?? '',
  );

  const [
    username,
    setUsername,
  ] = useState(
    user?.username ?? '',
  );

  const [
    profileSaving,
    setProfileSaving,
  ] = useState(false);

  const [
    profileError,
    setProfileError,
  ] =
    useState<string | null>(
      null,
    );

  const [
    profileSuccess,
    setProfileSuccess,
  ] =
    useState<string | null>(
      null,
    );

  const [
    currentPassword,
    setCurrentPassword,
  ] = useState('');

  const [
    newPassword,
    setNewPassword,
  ] = useState('');

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState('');

  const [
    showCurrentPassword,
    setShowCurrentPassword,
  ] = useState(false);

  const [
    showNewPassword,
    setShowNewPassword,
  ] = useState(false);

  const [
    passwordSaving,
    setPasswordSaving,
  ] = useState(false);

  const [
    passwordError,
    setPasswordError,
  ] =
    useState<string | null>(
      null,
    );

  const [
    passwordSuccess,
    setPasswordSuccess,
  ] =
    useState<string | null>(
      null,
    );

  const cleanFullName =
    fullName.trim();

  const cleanUsername =
    username
      .trim()
      .toLowerCase();

  const profileChanged =
    useMemo(() => {
      if (!user) {
        return false;
      }

      return (
        cleanFullName !==
          user.fullName ||
        cleanUsername !==
          user.username
      );
    }, [
      cleanFullName,
      cleanUsername,
      user,
    ]);

  const profileValid =
    cleanFullName.length >= 2 &&
    cleanUsername.length >= 3;

  const initials =
    (
      cleanFullName ||
      user?.fullName ||
      'User'
    )
      .split(' ')
      .filter(Boolean)
      .map(
        (part) =>
          part[0],
      )
      .slice(0, 2)
      .join('')
      .toUpperCase();

  const handleResetProfile =
    () => {
      if (!user) {
        return;
      }

      setFullName(
        user.fullName,
      );

      setUsername(
        user.username,
      );

      setProfileError(null);
      setProfileSuccess(null);
    };

  const handleProfileSubmit =
    async (
      event:
        FormEvent<HTMLFormElement>,
    ) => {
      event.preventDefault();

      if (
        !profileChanged ||
        !profileValid ||
        profileSaving
      ) {
        return;
      }

      setProfileError(null);
      setProfileSuccess(null);
      setProfileSaving(true);

      try {
        const updatedUser =
          await updateProfile({
            fullName:
              cleanFullName,

            username:
              cleanUsername,
          });

        setFullName(
          updatedUser.fullName,
        );

        setUsername(
          updatedUser.username,
        );

        setProfileSuccess(
          'Profile updated successfully.',
        );
      } catch (error) {
        setProfileError(
          getApiErrorMessage(
            error,
            'Unable to update your profile.',
          ),
        );
      } finally {
        setProfileSaving(false);
      }
    };

  const handlePasswordSubmit =
    async (
      event:
        FormEvent<HTMLFormElement>,
    ) => {
      event.preventDefault();

      setPasswordError(null);
      setPasswordSuccess(null);

      if (
        newPassword.length < 6
      ) {
        setPasswordError(
          'New password must be at least 6 characters long.',
        );

        return;
      }

      if (
        newPassword !==
        confirmPassword
      ) {
        setPasswordError(
          'New password and confirmation do not match.',
        );

        return;
      }

      if (
        !currentPassword
      ) {
        setPasswordError(
          'Enter your current password.',
        );

        return;
      }

      setPasswordSaving(true);

      try {
        const response =
          await changePassword({
            currentPassword,
            newPassword,
          });

        setCurrentPassword(
          '',
        );

        setNewPassword('');
        setConfirmPassword('');

        setPasswordSuccess(
          response.message,
        );
      } catch (error) {
        setPasswordError(
          getApiErrorMessage(
            error,
            'Unable to change your password.',
          ),
        );
      } finally {
        setPasswordSaving(false);
      }
    };

  return (
    <AppLayout>
      <div className="mx-auto max-w-5xl">
        {/* Page heading */}
        <motion.section
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.35,
          }}
        >
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold tracking-[0.16em] text-violet-400 uppercase">
            <Settings2 className="h-3.5 w-3.5" />

            Account
          </div>

          <h1 className="text-3xl font-semibold tracking-[-0.04em] text-[var(--text-primary)] md:text-[38px]">
            Settings
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--text-muted)]">
            Manage your profile,
            account security and
            workspace appearance.
          </p>
        </motion.section>

        <div className="mt-8 space-y-5">
          {/* =========================================
              PROFILE
             ========================================= */}

          <PremiumCard accent>
            <section className="p-6 md:p-7">
              <div className="flex flex-col gap-5 border-b border-[var(--border)] pb-6 sm:flex-row sm:items-center">
                <div className="profile-avatar relative shrink-0">
                  <div
                    aria-hidden="true"
                    className="profile-avatar__ring"
                  />

                  <div className="relative flex h-16 w-16 items-center justify-center rounded-[19px] border border-[var(--border-hover)] bg-[var(--surface)] shadow-[0_10px_30px_rgba(0,0,0,0.12)]">
                    <span className="text-sm font-semibold tracking-[0.08em] text-[var(--text-primary)]">
                      {initials}
                    </span>

                    <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-[3px] border-[var(--surface)] bg-emerald-400" />
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <UserRound className="h-4 w-4 text-violet-400" />

                    <p className="text-[11px] font-semibold tracking-[0.12em] text-[var(--text-muted)] uppercase">
                      Profile
                    </p>
                  </div>

                  <h2 className="mt-2 truncate text-xl font-semibold tracking-[-0.03em] text-[var(--text-primary)]">
                    {cleanFullName ||
                      'Your profile'}
                  </h2>

                  <p className="mt-1 truncate text-sm text-[var(--text-muted)]">
                    @
                    {cleanUsername ||
                      'username'}
                  </p>
                </div>
              </div>

              <form
                onSubmit={
                  handleProfileSubmit
                }
                className="mt-6"
              >
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="settings-full-name"
                      className="mb-2 block text-sm font-medium text-[var(--text-secondary)]"
                    >
                      Full name
                    </label>

                    <input
                      id="settings-full-name"
                      type="text"
                      value={
                        fullName
                      }
                      onChange={(
                        event,
                      ) => {
                        setFullName(
                          event
                            .target
                            .value,
                        );

                        setProfileError(
                          null,
                        );

                        setProfileSuccess(
                          null,
                        );
                      }}
                      maxLength={
                        100
                      }
                      autoComplete="name"
                      className="premium-input h-12 w-full rounded-xl px-4 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
                    />

                    <p className="mt-2 text-[11px] text-[var(--text-muted)]">
                      Used throughout
                      your workspace.
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="settings-username"
                      className="mb-2 block text-sm font-medium text-[var(--text-secondary)]"
                    >
                      Username
                    </label>

                    <div className="premium-input flex h-12 items-center rounded-xl px-4">
                      <span className="mr-1 text-sm text-[var(--text-muted)]">
                        @
                      </span>

                      <input
                        id="settings-username"
                        type="text"
                        value={
                          username
                        }
                        onChange={(
                          event,
                        ) => {
                          setUsername(
                            event
                              .target
                              .value,
                          );

                          setProfileError(
                            null,
                          );

                          setProfileSuccess(
                            null,
                          );
                        }}
                        maxLength={
                          50
                        }
                        autoCapitalize="none"
                        autoComplete="username"
                        spellCheck={
                          false
                        }
                        className="h-full min-w-0 flex-1 border-0 bg-transparent text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
                      />
                    </div>

                    <p className="mt-2 text-[11px] text-[var(--text-muted)]">
                      Must be unique
                      across accounts.
                    </p>
                  </div>
                </div>

                {profileError && (
                  <div
                    role="alert"
                    className="mt-5 rounded-xl border border-red-400/20 bg-red-400/[0.06] px-4 py-3 text-sm text-red-400"
                  >
                    {
                      profileError
                    }
                  </div>
                )}

                {profileSuccess && (
                  <div
                    role="status"
                    className="mt-5 flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.06] px-4 py-3 text-sm text-emerald-400"
                  >
                    <CheckCircle2 className="h-4 w-4 shrink-0" />

                    {
                      profileSuccess
                    }
                  </div>
                )}

                <div className="mt-6 flex flex-col-reverse gap-2 border-t border-[var(--border)] pt-6 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={
                      handleResetProfile
                    }
                    disabled={
                      !profileChanged ||
                      profileSaving
                    }
                    className="flex h-11 items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 text-sm font-medium text-[var(--text-secondary)] transition-all hover:border-[var(--border-hover)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <RotateCcw className="h-4 w-4" />

                    Reset
                  </button>

                  <button
                    type="submit"
                    disabled={
                      !profileChanged ||
                      !profileValid ||
                      profileSaving
                    }
                    className="flex h-11 min-w-36 items-center justify-center gap-2 rounded-xl border border-violet-400/25 bg-violet-400/[0.1] px-5 text-sm font-semibold text-violet-400 transition-all hover:-translate-y-0.5 hover:border-violet-400/40 hover:bg-violet-400/[0.15] disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {profileSaving ? (
                      <>
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </section>
          </PremiumCard>

          {/* =========================================
              APPEARANCE
             ========================================= */}

          <PremiumCard>
            <section className="p-6 md:p-7">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-violet-400/15 bg-violet-400/[0.07] text-violet-400">
                  <Palette className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-base font-semibold text-[var(--text-primary)]">
                    Appearance
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-[var(--text-muted)]">
                    Choose how your
                    workspace looks.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <motion.button
                  type="button"
                  whileHover={{
                    y: -2,
                  }}
                  whileTap={{
                    scale: 0.985,
                  }}
                  onClick={() => {
                    if (isDark) {
                      toggleTheme();
                    }
                  }}
                  className={[
                    'relative overflow-hidden rounded-2xl border p-5 text-left transition-all duration-200',

                    !isDark
                      ? 'border-violet-400/35 bg-violet-400/[0.07]'
                      : 'border-[var(--border)] bg-[var(--surface-soft)] hover:border-[var(--border-hover)] hover:bg-[var(--surface-hover)]',
                  ].join(' ')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-700 shadow-sm">
                      <Sun className="h-[18px] w-[18px]" />
                    </div>

                    {!isDark && (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-500 text-white">
                        <Check className="h-3.5 w-3.5" />
                      </div>
                    )}
                  </div>

                  <p className="mt-5 text-sm font-semibold text-[var(--text-primary)]">
                    Light
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">
                    Clean, bright and
                    focused.
                  </p>
                </motion.button>

                <motion.button
                  type="button"
                  whileHover={{
                    y: -2,
                  }}
                  whileTap={{
                    scale: 0.985,
                  }}
                  onClick={() => {
                    if (!isDark) {
                      toggleTheme();
                    }
                  }}
                  className={[
                    'relative overflow-hidden rounded-2xl border p-5 text-left transition-all duration-200',

                    isDark
                      ? 'border-violet-400/35 bg-violet-400/[0.07]'
                      : 'border-[var(--border)] bg-[var(--surface-soft)] hover:border-[var(--border-hover)] hover:bg-[var(--surface-hover)]',
                  ].join(' ')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#16161a] text-zinc-100 shadow-sm">
                      <Moon className="h-[18px] w-[18px]" />
                    </div>

                    {isDark && (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-500 text-white">
                        <Check className="h-3.5 w-3.5" />
                      </div>
                    )}
                  </div>

                  <p className="mt-5 text-sm font-semibold text-[var(--text-primary)]">
                    Dark
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">
                    Reduced glare with
                    richer depth.
                  </p>
                </motion.button>
              </div>
            </section>
          </PremiumCard>

          {/* =========================================
              SECURITY
             ========================================= */}

          <PremiumCard>
            <section className="p-6 md:p-7">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.07] text-emerald-400">
                  <ShieldCheck className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-base font-semibold text-[var(--text-primary)]">
                    Security
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-[var(--text-muted)]">
                    Update your password
                    using your current
                    credentials.
                  </p>
                </div>
              </div>

              <form
                onSubmit={
                  handlePasswordSubmit
                }
                className="mt-6"
              >
                <div className="grid gap-5 md:grid-cols-2">
                  {/* Current password */}
                  <div className="md:col-span-2">
                    <label
                      htmlFor="current-password"
                      className="mb-2 block text-sm font-medium text-[var(--text-secondary)]"
                    >
                      Current password
                    </label>

                    <div className="premium-input flex h-12 items-center rounded-xl px-4">
                      <LockKeyhole className="mr-3 h-4 w-4 shrink-0 text-[var(--text-muted)]" />

                      <input
                        id="current-password"
                        type={
                          showCurrentPassword
                            ? 'text'
                            : 'password'
                        }
                        value={
                          currentPassword
                        }
                        onChange={(
                          event,
                        ) => {
                          setCurrentPassword(
                            event
                              .target
                              .value,
                          );

                          setPasswordError(
                            null,
                          );

                          setPasswordSuccess(
                            null,
                          );
                        }}
                        autoComplete="current-password"
                        className="h-full min-w-0 flex-1 border-0 bg-transparent text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
                        placeholder="Enter current password"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowCurrentPassword(
                            (
                              current,
                            ) =>
                              !current,
                          )
                        }
                        aria-label={
                          showCurrentPassword
                            ? 'Hide current password'
                            : 'Show current password'
                        }
                        className="ml-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[var(--text-muted)] transition hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]"
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* New */}
                  <div>
                    <label
                      htmlFor="new-password"
                      className="mb-2 block text-sm font-medium text-[var(--text-secondary)]"
                    >
                      New password
                    </label>

                    <div className="premium-input flex h-12 items-center rounded-xl px-4">
                      <KeyRound className="mr-3 h-4 w-4 shrink-0 text-[var(--text-muted)]" />

                      <input
                        id="new-password"
                        type={
                          showNewPassword
                            ? 'text'
                            : 'password'
                        }
                        value={
                          newPassword
                        }
                        onChange={(
                          event,
                        ) => {
                          setNewPassword(
                            event
                              .target
                              .value,
                          );

                          setPasswordError(
                            null,
                          );

                          setPasswordSuccess(
                            null,
                          );
                        }}
                        minLength={6}
                        autoComplete="new-password"
                        placeholder="At least 6 characters"
                        className="h-full min-w-0 flex-1 border-0 bg-transparent text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowNewPassword(
                            (
                              current,
                            ) =>
                              !current,
                          )
                        }
                        aria-label={
                          showNewPassword
                            ? 'Hide new password'
                            : 'Show new password'
                        }
                        className="ml-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[var(--text-muted)] transition hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]"
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm */}
                  <div>
                    <label
                      htmlFor="confirm-password"
                      className="mb-2 block text-sm font-medium text-[var(--text-secondary)]"
                    >
                      Confirm new password
                    </label>

                    <div className="premium-input flex h-12 items-center rounded-xl px-4">
                      <KeyRound className="mr-3 h-4 w-4 shrink-0 text-[var(--text-muted)]" />

                      <input
                        id="confirm-password"
                        type={
                          showNewPassword
                            ? 'text'
                            : 'password'
                        }
                        value={
                          confirmPassword
                        }
                        onChange={(
                          event,
                        ) => {
                          setConfirmPassword(
                            event
                              .target
                              .value,
                          );

                          setPasswordError(
                            null,
                          );

                          setPasswordSuccess(
                            null,
                          );
                        }}
                        minLength={6}
                        autoComplete="new-password"
                        placeholder="Repeat new password"
                        className="h-full min-w-0 flex-1 border-0 bg-transparent text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
                      />
                    </div>
                  </div>
                </div>

                {passwordError && (
                  <div
                    role="alert"
                    className="mt-5 rounded-xl border border-red-400/20 bg-red-400/[0.06] px-4 py-3 text-sm text-red-400"
                  >
                    {
                      passwordError
                    }
                  </div>
                )}

                {passwordSuccess && (
                  <div
                    role="status"
                    className="mt-5 flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.06] px-4 py-3 text-sm text-emerald-400"
                  >
                    <CheckCircle2 className="h-4 w-4 shrink-0" />

                    {
                      passwordSuccess
                    }
                  </div>
                )}

                <div className="mt-6 flex justify-end border-t border-[var(--border)] pt-6">
                  <button
                    type="submit"
                    disabled={
                      passwordSaving ||
                      !currentPassword ||
                      !newPassword ||
                      !confirmPassword
                    }
                    className="flex h-11 min-w-40 items-center justify-center gap-2 rounded-xl border border-emerald-400/25 bg-emerald-400/[0.08] px-5 text-sm font-semibold text-emerald-400 transition-all hover:-translate-y-0.5 hover:border-emerald-400/40 hover:bg-emerald-400/[0.13] disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {passwordSaving ? (
                      <>
                        <LoaderCircle className="h-4 w-4 animate-spin" />

                        Updating...
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="h-4 w-4" />

                        Change password
                      </>
                    )}
                  </button>
                </div>
              </form>
            </section>
          </PremiumCard>
        </div>
      </div>
    </AppLayout>
  );
}