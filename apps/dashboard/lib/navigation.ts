import {
  LayoutDashboard,
  Building2,
  GitBranch,
  TrendingUp,
  Calendar,
  CheckSquare,
  BarChart3,
  Settings,
} from 'lucide-react';

export const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/empresas', label: 'Empresas', icon: Building2 },
  { href: '/procesos', label: 'Procesos', icon: GitBranch },
  { href: '/pipeline-comercial', label: 'Pipeline Comercial', icon: TrendingUp },
  { href: '/calendario', label: 'Calendario', icon: Calendar },
  { href: '/tareas', label: 'Tareas', icon: CheckSquare },
  { href: '/reportes', label: 'Reportes', icon: BarChart3 },
  { href: '/configuracion', label: 'Configuración', icon: Settings },
];
