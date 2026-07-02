'use client';

import { useQuery } from '@tanstack/react-query';
import { BookOpen, Clock, Users } from 'lucide-react';
import { dashboardApi } from '@/lib/api';

type Course = { id: string; title: string; lessons: number; duration: string; enrolled: number };

export default function AcademiaPage() {
  const { data, isLoading } = useQuery({ queryKey: ['academia'], queryFn: dashboardApi.academia });
  const courses = (data as Course[]) ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold" style={{ color: 'var(--kova-navy)' }}>Academia Comercial</h1>
        <p className="text-sm text-slate-500">Cursos y contenidos para el equipo comercial.</p>
      </div>

      {isLoading ? (
        <p className="text-sm text-slate-500">Cargando...</p>
      ) : courses.length === 0 ? (
        <div className="kova-card p-8 text-center text-slate-400 text-sm">No hay cursos disponibles.</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((c) => (
            <div key={c.id} className="kova-card p-5 space-y-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#EEF2FA' }}>
                <BookOpen className="w-5 h-5" style={{ color: 'var(--kova-blue)' }} />
              </div>
              <h3 className="font-semibold" style={{ color: 'var(--kova-navy)' }}>{c.title}</h3>
              <div className="flex items-center gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> {c.lessons} lecciones</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {c.duration}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <Users className="w-3 h-3" /> {c.enrolled} inscritos
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
