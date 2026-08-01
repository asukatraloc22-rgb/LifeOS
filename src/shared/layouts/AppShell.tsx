import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-bg">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 max-w-[1400px] mx-auto animate-in fade-in duration-200">{children}</div>
      </main>
    </div>
  );
}
