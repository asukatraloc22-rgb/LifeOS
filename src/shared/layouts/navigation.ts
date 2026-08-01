export interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: string;
  section: 'main' | 'life' | 'system';
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', path: '/', icon: '◆', section: 'main' },
  { id: 'finance', label: 'WealthOS', path: '/finance', icon: '◈', section: 'life' },
  { id: 'basketball', label: 'AthleteOS', path: '/basketball', icon: '●', section: 'life' },
  { id: 'academy', label: 'Academy', path: '/academy', icon: '▲', section: 'life' },
  { id: 'realestate', label: 'Immobilier', path: '/real-estate', icon: '■', section: 'life' },
  { id: 'goals', label: 'Objectifs', path: '/goals', icon: '◎', section: 'life' },
  { id: 'habits', label: 'Habitudes', path: '/habits', icon: '◐', section: 'life' },
  { id: 'tasks', label: 'Tâches', path: '/tasks', icon: '☐', section: 'life' },
  { id: 'notes', label: 'Notes', path: '/notes', icon: '✎', section: 'life' },
  { id: 'journal', label: 'Journal', path: '/journal', icon: '✦', section: 'life' },
  { id: 'analytics', label: 'Analytics', path: '/analytics', icon: '▤', section: 'system' },
  { id: 'settings', label: 'Réglages', path: '/settings', icon: '⚙', section: 'system' },
];
