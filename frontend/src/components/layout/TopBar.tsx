import {
  Bell,
  Menu,
  Moon,
  Sun,
} from 'lucide-react';

import {
  AnimatePresence,
  motion,
} from 'framer-motion';

import {
  useEffect,
  useState,
} from 'react';

import {
  Link,
} from 'react-router-dom';

import { useAuth } from '../../context/useAuth';
import { useTheme } from '../../context/useTheme';

import { Sidebar } from './Sidebar';

export function TopBar() {
  const { user } = useAuth();

  const {
    theme,
    toggleTheme,
  } = useTheme();

  const [
    mobileMenuOpen,
    setMobileMenuOpen,
  ] = useState(false);

  const initials =
    user?.fullName
      ?.split(' ')
      .filter(Boolean)
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() ?? 'U';

  useEffect(() => {
    if (!mobileMenuOpen) {
      document.body.style.overflow = '';

      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      'hidden';

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener(
      'keydown',
      handleKeyDown,
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        'keydown',
        handleKeyDown,
      );
    };
  }, [mobileMenuOpen]);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex h-[76px] items-center border-b border-[var(--border)] bg-[var(--topbar-bg)] px-4 backdrop-blur-2xl transition-colors duration-300 sm:px-5 md:px-8 lg:px-10">
        {/* Mobile menu button */}
        <motion.button
          type="button"
          whileTap={{
            scale: 0.92,
          }}
          onClick={() =>
            setMobileMenuOpen(true)
          }
          aria-label="Open navigation"
          aria-expanded={
            mobileMenuOpen
          }
          className="mr-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] text-[var(--text-secondary)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--border-hover)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)] lg:hidden"
        >
          <Menu className="h-[18px] w-[18px]" />
        </motion.button>

        {/* Left breathing space */}
        <div className="flex-1" />

        {/* Right side actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme toggle */}
          <motion.button
            type="button"
            whileHover={{
              y: -2,
            }}
            whileTap={{
              scale: 0.92,
            }}
            onClick={toggleTheme}
            aria-label={
              theme === 'dark'
                ? 'Switch to light mode'
                : 'Switch to dark mode'
            }
            title={
              theme === 'dark'
                ? 'Light mode'
                : 'Dark mode'
            }
            className="group relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] text-[var(--text-secondary)] shadow-sm transition-all duration-200 hover:border-[var(--border-hover)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]"
          >
            <AnimatePresence
              mode="wait"
              initial={false}
            >
              {theme === 'dark' ? (
                <motion.span
                  key="sun"
                  initial={{
                    opacity: 0,
                    rotate: -45,
                    scale: 0.7,
                  }}
                  animate={{
                    opacity: 1,
                    rotate: 0,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    rotate: 45,
                    scale: 0.7,
                  }}
                  transition={{
                    duration: 0.18,
                  }}
                >
                  <Sun className="h-[17px] w-[17px]" />
                </motion.span>
              ) : (
                <motion.span
                  key="moon"
                  initial={{
                    opacity: 0,
                    rotate: 45,
                    scale: 0.7,
                  }}
                  animate={{
                    opacity: 1,
                    rotate: 0,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    rotate: -45,
                    scale: 0.7,
                  }}
                  transition={{
                    duration: 0.18,
                  }}
                >
                  <Moon className="h-[17px] w-[17px]" />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Notification shortcut */}
          <motion.div
            whileHover={{
              y: -2,
            }}
            whileTap={{
              scale: 0.92,
            }}
          >
            <Link
              to="/notifications"
              aria-label="Open notifications"
              title="Notifications"
              className="group relative flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] text-[var(--text-secondary)] shadow-sm transition-all duration-200 hover:border-[var(--border-hover)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]"
            >
              <Bell className="h-[17px] w-[17px] transition-transform duration-200 group-hover:-rotate-6" />

              <span className="absolute right-[8px] top-[8px] h-1.5 w-1.5 rounded-full bg-violet-400 ring-2 ring-[var(--topbar-bg)]" />
            </Link>
          </motion.div>

          {/* Separator */}
          <div className="mx-1 hidden h-7 w-px bg-[var(--border)] sm:block" />

          {/* Profile */}
          <div className="flex items-center gap-3">
            <div className="hidden text-right xl:block">
              <p className="max-w-[160px] truncate text-xs font-medium text-[var(--text-primary)]">
                {user?.fullName}
              </p>

              <p className="mt-0.5 max-w-[160px] truncate text-[10px] text-[var(--text-muted)]">
                @{user?.username}
              </p>
            </div>

            <motion.div
              whileHover={{
                scale: 1.04,
                y: -2,
              }}
              whileTap={{
                scale: 0.97,
              }}
              transition={{
                type: 'spring',
                stiffness: 360,
                damping: 24,
              }}
              className="profile-avatar relative"
              title={user?.fullName}
            >
              <div
                aria-hidden="true"
                className="profile-avatar__ring"
              />

              <div className="relative flex h-10 w-10 items-center justify-center rounded-[13px] border border-[var(--border-hover)] bg-[var(--surface)] shadow-[0_8px_22px_rgba(0,0,0,0.12)]">
                <span className="text-[10px] font-semibold tracking-[0.06em] text-[var(--text-primary)]">
                  {initials}
                </span>

                {/* Online indicator */}
                <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3 items-center justify-center rounded-full border-2 border-[var(--topbar-bg)] bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.35)]" />
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Mobile navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Overlay */}
            <motion.button
              type="button"
              aria-label="Close navigation"
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
                duration: 0.18,
              }}
              onClick={
                closeMobileMenu
              }
              className="fixed inset-0 z-[89] bg-black/45 backdrop-blur-[3px] lg:hidden"
            />

            {/* Drawer */}
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
              initial={{
                x: '-100%',
              }}
              animate={{
                x: 0,
              }}
              exit={{
                x: '-100%',
              }}
              transition={{
                type: 'spring',
                stiffness: 330,
                damping: 32,
              }}
              className="fixed inset-y-0 left-0 z-[90] w-[278px] max-w-[85vw] lg:hidden"
            >
              <Sidebar
                mobile
                onNavigate={
                  closeMobileMenu
                }
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}