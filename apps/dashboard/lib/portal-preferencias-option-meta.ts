import type { LucideIcon } from 'lucide-react';
import {
  Award,
  Briefcase,
  Building2,
  CalendarClock,
  CircleDot,
  CircleHelp,
  ClipboardList,
  Factory,
  Globe2,
  Handshake,
  Headphones,
  Home,
  Laptop,
  MapPin,
  Package,
  RefreshCw,
  Search,
  Sparkles,
  Target,
  Users,
  Wrench,
  Circle,
} from 'lucide-react';

export type PreferenciasOptionMeta = {
  icon: LucideIcon;
  blurb: string;
};

const DEFAULT_META: PreferenciasOptionMeta = {
  icon: CircleDot,
  blurb: '',
};

/** Short blurbs + icons for Preferencias option cards (FlexJobs-style). */
const BY_STEP: Record<string, Record<string, PreferenciasOptionMeta>> = {
  'areas-interes': {
    Ventas: { icon: Target, blurb: 'Roles comerciales de campo o cierre' },
    'Asesor comercial': { icon: Headphones, blurb: 'Asesoría y acompañamiento al cliente' },
    'Key account manager': { icon: Award, blurb: 'Cuentas clave y relación de largo plazo' },
    'Auxiliar servicio al cliente': { icon: Headphones, blurb: 'Soporte y atención postventa' },
    'Director comercial': { icon: Briefcase, blurb: 'Dirección de estrategia y equipo' },
    'Gerente comercial': { icon: Users, blurb: 'Gestión de equipo y resultados' },
    'Ejecutivo comercial': { icon: Handshake, blurb: 'Ejecución de ventas y metas' },
    'Representante de ventas': { icon: Search, blurb: 'Prospección y representación de marca' },
  },
  modalidad: {
    Presencial: { icon: Building2, blurb: 'Trabajo en oficina o en campo' },
    Híbrido: { icon: Home, blurb: 'Combinas oficina y remoto' },
    Remoto: { icon: Laptop, blurb: 'Sin traslado diario a una sede' },
  },
  disponibilidad: {
    Inmediata: { icon: Sparkles, blurb: 'Puedes empezar ya' },
    '7 días': { icon: CalendarClock, blurb: 'Disponible en una semana' },
    '15 días': { icon: CalendarClock, blurb: 'Necesitas un poco más de tiempo' },
  },
  'que-vendes': {
    'Productos físicos': { icon: Package, blurb: 'Bienes tangibles o de consumo' },
    Servicios: { icon: Handshake, blurb: 'Servicios profesionales o técnicos' },
    Software: { icon: Laptop, blurb: 'Licencias o soluciones digitales' },
    'SaaS / Suscripciones': { icon: RefreshCw, blurb: 'Modelos recurrentes en la nube' },
    Consultoría: { icon: ClipboardList, blurb: 'Asesoría y proyectos de valor' },
    Maquinaria: { icon: Wrench, blurb: 'Equipos y maquinaria pesada' },
    'Equipos industriales': { icon: Factory, blurb: 'Soluciones para planta e industria' },
    'Materias primas': { icon: Package, blurb: 'Insumos y commodities' },
    Insumos: { icon: Package, blurb: 'Consumibles para operación' },
    Proyectos: { icon: Target, blurb: 'Venta por proyecto o alcance' },
    'Licitaciones públicas': { icon: Building2, blurb: 'Procesos públicos y pliegos' },
    'Soluciones integrales': { icon: Sparkles, blurb: 'Paquetes producto + servicio' },
  },
  'tipo-venta': {
    'Venta consultiva': { icon: ClipboardList, blurb: 'Diagnóstico y solución a medida' },
    'Venta técnica': { icon: Wrench, blurb: 'Argumento técnico y demo profunda' },
    'Venta transaccional': { icon: Circle, blurb: 'Ciclos cortos y alto volumen' },
    'Venta relacional': { icon: Handshake, blurb: 'Confianza y seguimiento continuo' },
    'Venta estratégica': { icon: Target, blurb: 'Cuentas grandes y largo plazo' },
    'Venta por proyectos': { icon: Briefcase, blurb: 'Propuestas y alcance definido' },
    'Venta recurrente': { icon: RefreshCw, blurb: 'Renovaciones y expansión' },
    'Venta de alto ticket': { icon: Award, blurb: 'Ticket elevado y ciclo largo' },
    'Hunter (prospección)': { icon: Search, blurb: 'Abrir mercado y nuevos clientes' },
    'Farmer (cartera)': { icon: Users, blurb: 'Crecer y cuidar la base instalada' },
  },
  'tipo-cliente': {
    'Empresas (B2B)': { icon: Building2, blurb: 'Vendes a otras empresas' },
    'Consumidor final (B2C)': { icon: Users, blurb: 'Vendes al consumidor' },
    Gobierno: { icon: Building2, blurb: 'Sector público e institucional' },
    Distribuidores: { icon: Package, blurb: 'Canal y mayoristas' },
    Mayoristas: { icon: Package, blurb: 'Volumen a través de mayoristas' },
    Constructoras: { icon: Factory, blurb: 'Proyectos de construcción' },
    'Hospitales / clínicas': { icon: Headphones, blurb: 'Salud y clínicas' },
    Universidades: { icon: ClipboardList, blurb: 'Educación superior' },
    Industria: { icon: Factory, blurb: 'Manufactura y plantas' },
    'Retail / tiendas': { icon: Home, blurb: 'Punto de venta y retail' },
    Otro: { icon: CircleHelp, blurb: 'Otro tipo de cliente' },
  },
  liderazgo: {
    No: { icon: Circle, blurb: 'Sin equipo a cargo' },
    '1-5': { icon: Users, blurb: 'Equipo pequeño' },
    '6-10': { icon: Users, blurb: 'Equipo mediano' },
    '11-20': { icon: Users, blurb: 'Equipo amplio' },
    '20+': { icon: Briefcase, blurb: 'Liderazgo de gran escala' },
  },
  crm: {
    Salesforce: { icon: Target, blurb: 'CRM empresarial' },
    HubSpot: { icon: Sparkles, blurb: 'CRM e inbound' },
    'Microsoft Dynamics': { icon: Building2, blurb: 'Suite Microsoft' },
    SAP: { icon: Factory, blurb: 'ERP / CRM SAP' },
    Zoho: { icon: Laptop, blurb: 'Suite Zoho' },
    'Monday CRM': { icon: ClipboardList, blurb: 'Work OS comercial' },
    Pipedrive: { icon: Target, blurb: 'Pipeline visual' },
    Odoo: { icon: Package, blurb: 'ERP open source' },
    Siigo: { icon: Briefcase, blurb: 'Gestión local' },
    'Ninguno / poco uso': { icon: Circle, blurb: 'Poca o ninguna experiencia en CRM' },
  },
  idiomas: {
    Español: { icon: Globe2, blurb: 'Lengua nativa o de trabajo' },
    Inglés: { icon: Globe2, blurb: 'Idioma comercial clave' },
    Portugués: { icon: Globe2, blurb: 'Mercados LATAM / Brasil' },
    Francés: { icon: Globe2, blurb: 'Idioma adicional' },
    Alemán: { icon: Globe2, blurb: 'Idioma adicional' },
    Italiano: { icon: Globe2, blurb: 'Idioma adicional' },
    Chino: { icon: Globe2, blurb: 'Idioma adicional' },
  },
  viajar: {
    Sí: { icon: MapPin, blurb: 'Disponible para viajes frecuentes' },
    No: { icon: Home, blurb: 'Prefieres no viajar' },
    Ocasionalmente: { icon: CalendarClock, blurb: 'Viajes puntuales, no rutinarios' },
  },
  reubicacion: {
    Sí: { icon: MapPin, blurb: 'Abierto a mudarte por el rol' },
    No: { icon: Home, blurb: 'Quieres quedarte en tu ciudad' },
    'A evaluar': { icon: CircleHelp, blurb: 'Depende de la oportunidad' },
  },
};

export function getPreferenciasOptionMeta(
  stepId: string,
  option: string,
): PreferenciasOptionMeta {
  const fromStep = BY_STEP[stepId]?.[option];
  if (fromStep) return fromStep;

  // "Otra" / "Otro" free-text options
  if (/^otr[oa]$/i.test(option.trim())) {
    return { icon: CircleHelp, blurb: 'Cuéntanos con tus palabras' };
  }

  if (stepId === 'idiomas') {
    return { icon: Globe2, blurb: 'Idioma que puedes usar en el trabajo' };
  }

  if (stepId === 'crm') {
    return { icon: Laptop, blurb: 'Herramienta de gestión comercial' };
  }

  return DEFAULT_META;
}
