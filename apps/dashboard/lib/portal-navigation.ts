import {
  Briefcase,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Settings,
  Target,
  Upload,
  User,
  ClipboardList,
} from 'lucide-react';

export const PORTAL_NAV = [
  { href: '/portal', label: 'Dashboard', icon: LayoutDashboard, exact: true as const },
  { href: '/portal/perfil', label: 'Mi Perfil', icon: User, exact: false as const },
  { href: '/portal/experiencia', label: 'Experiencia', icon: Briefcase, exact: false as const },
  { href: '/portal/formacion', label: 'Formación', icon: GraduationCap, exact: false as const },
  { href: '/portal/comercial', label: 'Perfil Comercial', icon: Target, exact: false as const },
  { href: '/portal/documentos', label: 'Documentos', icon: Upload, exact: false as const },
  { href: '/portal/vacantes', label: 'Vacantes', icon: FileText, exact: false as const },
  { href: '/portal/aplicaciones', label: 'Aplicaciones', icon: ClipboardList, exact: false as const },
  { href: '/portal/configuracion', label: 'Configuración', icon: Settings, exact: false as const },
] as const;
