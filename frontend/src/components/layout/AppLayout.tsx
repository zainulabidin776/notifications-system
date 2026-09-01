import type { ReactNode } from 'react';

import { NotificationBannerStack } from '../notifications/NotificationBannerStack';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({
  children,
}: AppLayoutProps) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[var(--app-bg)] text-[var(--text-primary)] transition-colors duration-300">
      {/* Ambient background effects */}
      <div
        className="dashboard-ambient"
        aria-hidden="true"
      />

      {/* Subtle background grid / texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.025]"
        style={{
          backgroundImage: `
            linear-gradient(
              rgba(127, 127, 127, 0.18) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(127, 127, 127, 0.18) 1px,
              transparent 1px
            )
          `,
          backgroundSize: '42px 42px',
          maskImage:
            'linear-gradient(to bottom, black, transparent 85%)',
          WebkitMaskImage:
            'linear-gradient(to bottom, black, transparent 85%)',
        }}
      />

      {/* Left navigation */}
      <Sidebar />

      {/* Main application area */}
      <div className="relative z-10 min-h-screen lg:pl-[248px]">
        {/* Sticky header */}
        <TopBar />

        {/* Global notification banners */}
        <NotificationBannerStack />

        {/* Page content */}
        <main className="relative px-4 py-6 sm:px-5 md:px-8 md:py-8 lg:px-10 lg:py-9">
          <div className="relative z-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}