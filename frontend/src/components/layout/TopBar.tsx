import {
  Bell,
  Command,
  Search,
} from 'lucide-react';

import { useAuth } from '../../context/useAuth';

export function TopBar() {
  const { user } = useAuth();

  const initials =
    user?.fullName
      ?.split(' ')
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() ?? 'U';

  return (
    <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-white/[0.06] bg-[#09090b]/80 px-5 backdrop-blur-xl md:px-8 lg:px-10">
      <div className="hidden w-full max-w-sm items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.03] px-3.5 py-2.5 md:flex">
        <Search className="h-4 w-4 text-zinc-600" />

        <input
          type="text"
          placeholder="Search notifications..."
          className="w-full bg-transparent text-sm text-zinc-300 outline-none placeholder:text-zinc-600"
        />

        <div className="flex items-center gap-1 rounded-md border border-white/[0.06] bg-white/[0.03] px-1.5 py-1 text-[10px] text-zinc-600">
          <Command className="h-3 w-3" />
          K
        </div>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <button
          type="button"
          className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.03] text-zinc-400 transition hover:bg-white/[0.06] hover:text-white"
        >
          <Bell className="h-[18px] w-[18px]" />

          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-violet-400 ring-2 ring-[#09090b]" />
        </button>

        <div className="h-7 w-px bg-white/[0.07]" />

        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-zinc-200">
              {user?.fullName}
            </p>

            <p className="text-xs text-zinc-600">
              @{user?.username}
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-400/90 to-indigo-500/80 text-xs font-bold text-white shadow-lg shadow-violet-500/10">
            {initials}
          </div>
        </div>
      </div>
    </header>
  );
}