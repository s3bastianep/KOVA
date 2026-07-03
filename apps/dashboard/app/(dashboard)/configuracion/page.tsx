'use client';

import { useEffect, useState } from 'react';
import { User, Shield, Bell, Building2, Settings } from 'lucide-react';
import { getStoredUser, type AuthUser } from '@/lib/api';
import { PageHeader } from '@/components/layout/PageHeader';

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: 'Super Administrador',
  COORDINATOR: 'Coordinador',
  CONSULTANT: 'Consultor',
  CLIENT: 'Cliente',
};

export default function ConfiguracionPage() {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader
        title="Configuración"
        subtitle="Preferencias de la cuenta y del espacio de trabajo."
        icon={Settings}
        accent="#F1F5F9"
        tone="#475569"
      />

      <div className="kova-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <User className="w-4 h-4" style={{ color: 'var(--kova-blue)' }} />
          <h3 className="font-semibold text-sm" style={{ color: 'var(--kova-navy)' }}>Mi perfil</h3>
        </div>
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs text-slate-400">Nombre</p>
            <p style={{ color: 'var(--kova-navy)' }}>{user ? `${user.firstName} ${user.lastName}` : '—'}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Correo</p>
            <p style={{ color: 'var(--kova-navy)' }}>{user?.email ?? '—'}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Rol</p>
            <p style={{ color: 'var(--kova-navy)' }}>{user ? (ROLE_LABELS[user.role] ?? user.role) : '—'}</p>
          </div>
        </div>
      </div>

      <div className="kova-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Building2 className="w-4 h-4" style={{ color: 'var(--kova-blue)' }} />
          <h3 className="font-semibold text-sm" style={{ color: 'var(--kova-navy)' }}>Espacio de trabajo</h3>
        </div>
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs text-slate-400">Organización</p>
            <p style={{ color: 'var(--kova-navy)' }}>Kova Talent OS</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Plan</p>
            <p style={{ color: 'var(--kova-navy)' }}>Enterprise</p>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div className="kova-card p-6">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-4 h-4" style={{ color: 'var(--kova-blue)' }} />
            <h3 className="font-semibold text-sm" style={{ color: 'var(--kova-navy)' }}>Seguridad</h3>
          </div>
          <button className="text-sm px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50">Cambiar contraseña</button>
        </div>
        <div className="kova-card p-6">
          <div className="flex items-center gap-2 mb-3">
            <Bell className="w-4 h-4" style={{ color: 'var(--kova-blue)' }} />
            <h3 className="font-semibold text-sm" style={{ color: 'var(--kova-navy)' }}>Notificaciones</h3>
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input type="checkbox" defaultChecked className="accent-blue-700" /> Recibir alertas por correo
          </label>
        </div>
      </div>
    </div>
  );
}
