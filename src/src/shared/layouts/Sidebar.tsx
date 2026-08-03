import { NavLink } from 'react-router-dom';
import { NAV_ITEMS } from './navigation';
import { cn } from '@/shared/utils/cn';

const SECTION_LABEL: Record<string, string> = {
  main: '',
  life: 'Life',
  system: 'Système',
};

export function Sidebar() {
  const sections = ['main', 'life', 'system'] as const;

  return (
    <aside className="w-[210px] shrink-0 bg-bg-2 border-r border-border flex flex-col h-screen overflow-y-auto">
      <div className="px-4 pt-[18px] pb-[14px] border-b border-border">
        <div className="font-display text-lg font-extrabold tracking-tight">
          Life<span className="text-accent-2">OS</span>
        </div>
        <div className="text-[9px] text-text-3 uppercase tracking-widest mt-0.5">Personal Operating System</div>
      </div>

      <nav className="flex-1 py-2">
        {sections.map((section) => (
          <div key={section} className="px-2 pt-3 pb-1">
            {SECTION_LABEL[section] && (
              <div className="text-[9px] uppercase tracking-wide text-text-3 px-2 mb-1.5 font-medium">
                {SECTION_LABEL[section]}
              </div>
            )}
            {NAV_ITEMS.filter((i) => i.section === section).map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs text-text-2 transition-all mb-0.5',
                    isActive
                      ? 'bg-gradient-to-br from-accent/18 to-accent-2/7 text-text border border-accent/25'
                      : 'hover:bg-bg-3 hover:text-text border border-transparent',
                  )
                }
              >
                <span
                  className={cn(
                    'w-6 h-6 rounded-md flex items-center justify-center text-[13px] shrink-0',
                  )}
                >
                  {item.icon}
                </span>
                {item.label}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="mt-auto p-2 border-t border-border">
        <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg bg-bg-3">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-accent to-pink flex items-center justify-center text-[11px] font-bold text-white shrink-0">
            R
          </div>
          <div className="text-[11px] text-text-2 truncate">Mon espace</div>
        </div>
      </div>
    </aside>
  );
}
