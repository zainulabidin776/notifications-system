import {
  BellRing,
  LayoutDashboard,
  LogOut,
  Plus,
  Settings,
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';

import { useAuth } from '../../context/useAuth';

const navigation = [
  {
    label: 'Overview',
    path: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Notifications',
    path: '/notifications',
    icon: BellRing,
  },
  {
    label: 'Create',
    path: '/notifications/new',
    icon: Plus,
  },
];

export function Sidebar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[248px] border-r border-white/[0.07] bg-[#0c0c0f]/95 px-4 py-5 backdrop-blur-xl lg:flex lg:flex-col">
      <div className="flex items-center gap-3 px-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-violet-400/15 bg-violet-400/10">
          <BellRing className="h-5 w-5 text-violet-300" />
        </div>

        <div>
          <p className="text-sm font-semibold tracking-[0.16em] text-white uppercase">
            Notify
          </p>

          <p className="text-[11px] text-zinc-600">
            Personal workspace
          </p>
        </div>
      </div>

      <div className="mt-10">
        <p className="px-3 text-[10px] font-semibold tracking-[0.18em] text-zinc-600 uppercase">
          Workspace
        </p>

        <nav className="mt-3 space-y-1.5">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/dashboard'}
                className={({ isActive }) =>
                  [
                    'group flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-all',
                    isActive
                      ? 'bg-white/[0.07] text-white shadow-sm shadow-black/20'
                      : 'text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-200',
                  ].join(' ')
                }
              >
                <Icon className="h-[18px] w-[18px]" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto space-y-1.5">
        <button
          type="button"
          className="flex h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium text-zinc-500 transition hover:bg-white/[0.04] hover:text-white"
        >
          <Settings className="h-[18px] w-[18px]" />
          Settings
        </button>

        <button
          type="button"
          onClick={handleLogout}
          className="flex h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium text-zinc-500 transition hover:bg-red-400/[0.06] hover:text-red-300"
        >
          <LogOut className="h-[18px] w-[18px]" />
          Log out
        </button>

        <div className="mt-5 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-3">
          <p className="text-[11px] text-zinc-600">
            Notify workspace
          </p>

          <p className="mt-1 text-xs font-medium leading-5 text-zinc-400">
            Everything important,
            <br />
            without the noise.
          </p>
        </div>
      </div>
    </aside>
  );
}