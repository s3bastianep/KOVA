'use client';

import { useEffect, useState } from 'react';
import { User, Shield, Bell, Building2, Settings, FileSpreadsheet, Loader2 } from 'lucide-react';
import { dashboardApi, getStoredUser, type AuthUser } from '@/lib/api';
import { PageHeader } from '@/components/layout/PageHeader';

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: 'Super Administrador',
  COORDINATOR: 'Coordinador',
  CONSULTANT: 'Consultor',
  CLIENT: 'Cliente',
};

const EXPORT_ROLES = new Set(['SUPER_ADMIN', 'COORDINATOR', 'CONSULTANT']);

export default function ConfiguracionPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState('');

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  async function handleExportExcel() {
    setExporting(true);
    setExportError('');
    try {
      const blob = await dashboardApi.exportExcel();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `kova-export-${new Date().toISOString().slice(0, 10)}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setExportError(err instanceof Error ? err.message : 'No se pudo exportar a Excel');
    } finally {
      setExporting(false);
    }
  }

  const canExport = user ? EXPORT_ROLES.has(user.role) : false;

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
            <p style={{ color: 'var(--kova-navy)' }}>{user ? `${user.firstName} ${user.lastName}` : '-'}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Correo</p>
            <p style={{ color: 'var(--kova-navy)' }}>{user?.email ?? '-'}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Rol</p>
            <p style={{ color: 'var(--kova-navy)' }}>{user ? (ROLE_LABELS[user.role] ?? user.role) : '-'}</p>
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
            <p style={{ color: 'var(--kova-navy)' }}>Litt Hunter</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Plan</p>
            <p style={{ color: 'var(--kova-navy)' }}>Enterprise</p>
          </div>
        </div>
      </div>

      {canExport ? (
        <div className="kova-card p-6">
          <div className="flex items-center gap-2 mb-3">
            <FileSpreadsheet className="w-4 h-4" style={{ color: 'var(--kova-blue)' }} />
            <h3 className="font-semibold text-sm" style={{ color: 'var(--kova-navy)' }}>Exportar datos</h3>
          </div>
          <p className="text-sm text-slate-500 mb-4">
            Descarga un archivo Excel con clientes, procesos, candidatos, pipeline, evaluaciones, entrevistas y tareas.
          </p>
          <button
            type="button"
            onClick={handleExportExcel}
            disabled={exporting}
            className="inline-flex items-center gap-2 text-sm px-4 py-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-60"
          >
            {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileSpreadsheet className="w-4 h-4" />}
            {exporting ? 'Generando archivo...' : 'Descargar Excel completo'}
          </button>
          {exportError ? <p className="text-xs text-red-500 mt-2">{exportError}</p> : null}
        </div>
      ) : null}

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
