import type { ReactNode } from 'react';

import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({
  children,
}: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      <Sidebar />

      <div className="lg:pl-[248px]">
        <TopBar />

        <main className="px-5 py-7 md:px-8 md:py-9 lg:px-10">
          {children}
        </main>
      </div>
    </div>
  );
}