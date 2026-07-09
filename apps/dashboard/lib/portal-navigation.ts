import {
  Briefcase,
  ClipboardCheck,
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
  { href: '/portal/perfil', label: 'Mi perfil', icon: User, exact: false as const },
  { href: '/portal/experiencia', label: 'Mi experiencia', icon: Briefcase, exact: false as const },
  { href: '/portal/formacion', label: 'Formación', icon: GraduationCap, exact: false as const },
  { href: '/portal/preferencias', label: 'Preferencias laborales', icon: Target, exact: false as const },
  { href: '/portal/documentos', label: 'Documentos', icon: Upload, exact: false as const },
  { href: '/portal/vacantes', label: 'Vacantes', icon: FileText, exact: false as const },
  { href: '/portal/aplicaciones', label: 'Postulaciones', icon: ClipboardList, exact: false as const },
  { href: '/portal/prueba', label: 'Evaluaciones', icon: ClipboardCheck, exact: false as const, prefetch: false as const },
  { href: '/portal/configuracion', label: 'Configuración', icon: Settings, exact: false as const },
] as const;
