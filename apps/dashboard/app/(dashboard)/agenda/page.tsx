'use client';

import Link from 'next/link';
import { Calendar, CheckSquare, Phone, MapPin, Video } from 'lucide-react';

const sections = [
  {
    title: 'Calendario',
    href: '/calendario',
    icon: Calendar,
    desc: 'Entrevistas, llamadas, reuniones y visitas',
  },
  {
    title: 'Entrevistas',
    href: '/entrevistas',
    icon: Video,
    desc: 'Agenda de entrevistas por proceso',
  },
  {
    title: 'Tareas',
    href: '/tareas',
    icon: CheckSquare,
    desc: 'Pendientes generados por automatizaciones',
  },
  {
    title: 'Llamadas',
    href: '/calendario?tipo=call',
    icon: Phone,
    desc: 'Seguimiento telefónico con candidatos y clientes',
  },
  {
    title: 'Visitas',
    href: '/calendario?tipo=visit',
    icon: MapPin,
    desc: 'Visitas comerciales y presenciales',
  },
];

export default function AgendaPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold" style={{ color: 'var(--kova-navy)' }}>Agenda</h1>
        <p className="text-sm text-slate-500 mt-1">Calendario, entrevistas y tareas — todo lo que tienes programado.</p>
      </div>
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {sections.map(({ title, href, icon: Icon, desc }) => (
          <Link key={href} href={href} className="kova-card p-5 hover:shadow-md transition-shadow block">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#EEF2FA' }}>
                <Icon className="w-5 h-5" style={{ color: 'var(--kova-blue)' }} />
              </div>
              <h2 className="font-heading font-semibold" style={{ color: 'var(--kova-navy)' }}>{title}</h2>
            </div>
            <p className="text-sm text-slate-500">{desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
