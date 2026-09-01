import {
  BellRing,
  LayoutDashboard,
  LogOut,
  Plus,
  Settings,
} from 'lucide-react';

import {
  NavLink,
  useNavigate,
} from 'react-router-dom';

import { motion } from 'framer-motion';

import { useAuth } from '../../context/useAuth';

interface SidebarProps {
  mobile?: boolean;
  onNavigate?: () => void;
}

const navigation = [
  {
    label: 'Overview',
    to: '/dashboard',
    icon: LayoutDashboard,
  },

  {
    label: 'Notifications',
    to: '/notifications',
    icon: BellRing,
  },

  {
    label: 'Create',
    to: '/notifications/new',
    icon: Plus,
  },
];

export function Sidebar({
  mobile = false,
  onNavigate,
}: SidebarProps) {
  const {
    user,
    logout,
  } = useAuth();

  const navigate =
    useNavigate();

  const initials =
    user?.fullName
      ?.split(' ')
      .filter(Boolean)
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() ?? 'U';

  const handleLogout = () => {
    logout();

    onNavigate?.();

    navigate('/login');
  };

  return (
    <aside
      className={[
        'flex flex-col border-r border-[var(--border)] bg-[var(--sidebar-bg)] text-[var(--text-primary)] backdrop-blur-2xl transition-colors duration-300',

        mobile
          ? 'h-full w-full'
          : 'fixed inset-y-0 left-0 z-40 hidden w-[248px] lg:flex',
      ].join(' ')}
    >
      {/* Brand */}
      <div className="flex h-[76px] items-center border-b border-[var(--border)] px-5">
        <NavLink
          to="/dashboard"
          onClick={onNavigate}
          className="group flex items-center gap-3"
        >
          <motion.div
            whileHover={{
              rotate: -4,
              scale: 1.04,
            }}
            transition={{
              type: 'spring',
              stiffness: 320,
              damping: 22,
            }}
            className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl border border-violet-400/20 bg-violet-400/[0.07] text-violet-400"
          >
            <BellRing className="relative h-[17px] w-[17px]" />
          </motion.div>

          <div>
            <p className="text-[15px] font-semibold tracking-[-0.025em] text-[var(--text-primary)]">
              NOTIFY
            </p>

            <p className="mt-0.5 text-[10px] text-[var(--text-muted)]">
              Personal workspace
            </p>
          </div>
        </NavLink>
      </div>

      {/* Main navigation */}
      <nav className="flex-1 px-3 py-6">
        <p className="mb-3 px-3 text-[10px] font-semibold tracking-[0.14em] text-[var(--text-muted)] uppercase">
          Workspace
        </p>

        <div className="space-y-1">
          {navigation.map(
            (item) => {
              const Icon =
                item.icon;

              return (
                <NavLink
                  key={
                    item.to
                  }
                  to={item.to}
                  onClick={
                    onNavigate
                  }
                  className={({
                    isActive,
                  }) =>
                    [
                      'group relative flex h-11 items-center gap-3 overflow-hidden rounded-xl border px-3 text-sm font-medium transition-all duration-200',

                      isActive
                        ? 'border-[var(--border)] bg-[var(--surface-hover)] text-[var(--text-primary)] shadow-sm'
                        : 'border-transparent text-[var(--text-muted)] hover:translate-x-0.5 hover:bg-[var(--surface-soft)] hover:text-[var(--text-primary)]',
                    ].join(' ')
                  }
                >
                  {({
                    isActive,
                  }) => (
                    <>
                      {isActive && (
                        <motion.span
                          layoutId="sidebar-active-indicator"
                          className="absolute left-0 top-1/2 h-5 w-[2px] -translate-y-1/2 rounded-full bg-violet-400"
                          transition={{
                            type: 'spring',
                            stiffness: 380,
                            damping: 30,
                          }}
                        />
                      )}

                      <Icon
                        className={[
                          'relative h-[17px] w-[17px] transition-all duration-200',

                          isActive
                            ? 'text-violet-400'
                            : 'text-[var(--text-muted)] group-hover:text-[var(--text-secondary)]',
                        ].join(
                          ' ',
                        )}
                      />

                      <span>
                        {
                          item.label
                        }
                      </span>
                    </>
                  )}
                </NavLink>
              );
            },
          )}
        </div>

        <div className="my-6 h-px bg-[var(--border)]" />

        <p className="mb-3 px-3 text-[10px] font-semibold tracking-[0.14em] text-[var(--text-muted)] uppercase">
          General
        </p>

        {/* Real Settings route */}
        <NavLink
          to="/settings"
          onClick={onNavigate}
          className={({
            isActive,
          }) =>
            [
              'group relative flex h-11 items-center gap-3 overflow-hidden rounded-xl border px-3 text-sm font-medium transition-all duration-200',

              isActive
                ? 'border-[var(--border)] bg-[var(--surface-hover)] text-[var(--text-primary)] shadow-sm'
                : 'border-transparent text-[var(--text-muted)] hover:translate-x-0.5 hover:bg-[var(--surface-soft)] hover:text-[var(--text-primary)]',
            ].join(' ')
          }
        >
          {({
            isActive,
          }) => (
            <>
              {isActive && (
                <motion.span
                  layoutId="sidebar-active-indicator"
                  className="absolute left-0 top-1/2 h-5 w-[2px] -translate-y-1/2 rounded-full bg-violet-400"
                />
              )}

              <Settings
                className={[
                  'h-[17px] w-[17px]',

                  isActive
                    ? 'text-violet-400'
                    : '',
                ].join(' ')}
              />

              Settings
            </>
          )}
        </NavLink>
      </nav>

      {/* User area */}
      <div className="border-t border-[var(--border)] p-3">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-3 transition-all duration-200 hover:bg-[var(--surface-hover)]">
          <div className="flex items-center gap-3">
            <div className="profile-avatar relative shrink-0">
              <div className="profile-avatar__ring" />

              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border-hover)] bg-[var(--surface)]">
                <span className="text-[10px] font-semibold tracking-[0.05em] text-[var(--text-primary)]">
                  {initials}
                </span>

                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[var(--surface)] bg-emerald-400" />
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-[var(--text-primary)]">
                {user?.fullName}
              </p>

              <p className="mt-0.5 truncate text-[10px] text-[var(--text-muted)]">
                @{user?.username}
              </p>
            </div>

            <motion.button
              type="button"
              whileTap={{
                scale: 0.9,
              }}
              onClick={
                handleLogout
              }
              aria-label="Log out"
              title="Log out"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[var(--text-muted)] transition-all duration-200 hover:bg-red-400/[0.08] hover:text-red-400"
            >
              <LogOut className="h-4 w-4" />
            </motion.button>
          </div>
        </div>
      </div>
    </aside>
  );
}