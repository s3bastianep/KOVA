import {
  LayoutDashboard,
  Briefcase,
  Building2,
  GitBranch,
  Users,
  CalendarDays,
  ClipboardCheck,
  BarChart3,
  FileText,
  Settings,
  ListTodo,
  Trophy,
  type LucideIcon,
} from 'lucide-react';

export type NavItem = { href: string; label: string; icon: LucideIcon };
export type NavGroup = { title?: string; items: NavItem[] };

export const NAV_GROUPS: NavGroup[] = [
  {
    items: [{ href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard }],
  },
  {
    title: 'Comercial',
    items: [
      { href: '/crm', label: 'CRM Comercial', icon: Briefcase },
    ],
  },
  {
    title: 'Reclutamiento',
    items: [
      { href: '/procesos', label: 'Procesos de Selección', icon: GitBranch },
      { href: '/candidatos', label: 'Candidatos', icon: Users },
      { href: '/finalistas', label: 'Finalistas', icon: Trophy },
      { href: '/evaluaciones', label: 'Evaluaciones', icon: ClipboardCheck },
    ],
  },
  {
    title: 'Gestión',
    items: [
      { href: '/agenda', label: 'Agenda', icon: CalendarDays },
      { href: '/tareas', label: 'Tareas', icon: ListTodo },
      { href: '/reportes', label: 'Reportes', icon: BarChart3 },
      { href: '/documentos', label: 'Documentos', icon: FileText },
    ],
  },
  {
    title: 'Configuración',
    items: [
      { href: '/configuracion', label: 'Configuración', icon: Settings },
    ],
  },
];

/** Compatibilidad: lista plana de todos los ítems */
export const NAV_ITEMS: NavItem[] = NAV_GROUPS.flatMap((g) => g.items);

/** Menú principal plano (orden del diseño) */
export const NAV_MAIN: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/crm', label: 'CRM Comercial', icon: Briefcase },
  { href: '/clientes', label: 'Clientes', icon: Building2 },
  { href: '/procesos', label: 'Procesos de Selección', icon: GitBranch },
  { href: '/candidatos', label: 'Candidatos', icon: Users },
  { href: '/agenda', label: 'Agenda', icon: CalendarDays },
  { href: '/evaluaciones', label: 'Evaluaciones', icon: ClipboardCheck },
  { href: '/reportes', label: 'Reportes', icon: BarChart3 },
  { href: '/documentos', label: 'Documentos', icon: FileText },
  { href: '/configuracion', label: 'Configuración', icon: Settings },
];

/** Rutas visibles para usuarios CLIENT (empresas cliente): solo lo relativo a sus procesos. */
const CLIENT_NAV_HREFS = new Set(['/dashboard', '/procesos', '/candidatos', '/configuracion']);

export function navItemsForRole(role?: string | null): NavItem[] {
  if (role === 'CLIENT') return NAV_MAIN.filter((item) => CLIENT_NAV_HREFS.has(item.href));
  return NAV_MAIN;
}
