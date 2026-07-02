import {
  LayoutDashboard,
  Briefcase,
  GitBranch,
  Users,
  CalendarDays,
  ClipboardCheck,
  BarChart3,
  FileText,
  Settings,
} from 'lucide-react';

export const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/crm', label: 'CRM Comercial', icon: Briefcase },
  { href: '/procesos', label: 'Procesos de Selección', icon: GitBranch },
  { href: '/candidatos', label: 'Candidatos', icon: Users },
  { href: '/agenda', label: 'Agenda', icon: CalendarDays },
  { href: '/evaluaciones', label: 'Evaluaciones', icon: ClipboardCheck },
  { href: '/reportes', label: 'Reportes', icon: BarChart3 },
  { href: '/documentos', label: 'Documentos', icon: FileText },
  { href: '/configuracion', label: 'Configuración', icon: Settings },
];
