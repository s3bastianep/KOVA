'use client';

import { useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2, LogOut, Mail, Shield } from 'lucide-react';
import { authApi, clearSession, getStoredUser, portalApi } from '@/lib/api';

const inputClass =
  'mt-1.5 w-full rounded-xl border border-[var(--kova-border)] bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-[var(--kova-blue)] focus:ring-2 focus:ring-[var(--kova-ring)]';

const btnPrimary =
  'inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--kova-lime)] px-5 py-2.5 text-sm font-semibold text-[var(--kv-ink)] transition hover:brightness-[0.97] disabled:opacity-50';

const btnSecondary =
  'inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--kova-border-strong)] bg-white px-4 py-2.5 text-sm font-medium text-[var(--kova-navy)] transition hover:bg-[var(--kova-surface-2)] disabled:opacity-50';

export function PortalConfiguracionClient() {
  const router = useRouter();
  const stored = getStoredUser();

  const [nombre, setNombre] = useState(
    stored ? `${stored.firstName} ${stored.lastName}`.trim() : '',
  );
  const [email, setEmail] = useState(stored?.email ?? '');
  const [loading, setLoading] = useState(true);

  const [newEmail, setNewEmail] = useState('');
  const [emailPassword, setEmailPassword] = useState('');
  const [emailStatus, setEmailStatus] = useState<'idle' | 'saving' | 'ok' | 'error'>('idle');
  const [emailMessage, setEmailMessage] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passStatus, setPassStatus] = useState<'idle' | 'saving' | 'ok' | 'error'>('idle');
  const [passMessage, setPassMessage] = useState('');

  useEffect(() => {
    portalApi
      .cuenta()
      .then((data) => {
        setNombre(data.nombre || `${data.firstName} ${data.lastName}`.trim());
        setEmail(data.email);
      })
      .catch(() => {
        /* keep stored user fallback */
      })
      .finally(() => setLoading(false));
  }, []);

  const updateStoredEmail = (nextEmail: string) => {
    const user = getStoredUser();
    if (!user) return;
    localStorage.setItem('kova_user', JSON.stringify({ ...user, email: nextEmail }));
  };

  const submitEmail = async (e: FormEvent) => {
    e.preventDefault();
    setEmailStatus('saving');
    setEmailMessage('');
    try {
      const res = await portalApi.updateCuenta({
        action: 'email',
        currentPassword: emailPassword,
        newEmail,
      });
      setEmail(res.email ?? newEmail);
      updateStoredEmail(res.email ?? newEmail);
      setNewEmail('');
      setEmailPassword('');
      setEmailStatus('ok');
      setEmailMessage(res.message || 'Correo actualizado');
    } catch (err) {
      setEmailStatus('error');
      setEmailMessage(err instanceof Error ? err.message : 'No pudimos actualizar el correo');
    }
  };

  const submitPassword = async (e: FormEvent) => {
    e.preventDefault();
    setPassMessage('');
    if (newPassword !== confirmPassword) {
      setPassStatus('error');
      setPassMessage('La confirmación no coincide');
      return;
    }
    if (newPassword.length < 8) {
      setPassStatus('error');
      setPassMessage('La nueva contraseña debe tener al menos 8 caracteres');
      return;
    }
    setPassStatus('saving');
    try {
      const res = await portalApi.updateCuenta({
        action: 'password',
        currentPassword,
        newPassword,
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPassStatus('ok');
      setPassMessage(res.message || 'Contraseña actualizada');
    } catch (err) {
      setPassStatus('error');
      setPassMessage(err instanceof Error ? err.message : 'No pudimos actualizar la contraseña');
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      /* ignore */
    }
    clearSession();
    router.push('/login');
  };

  if (loading && !email) {
    return (
      <div className="flex items-center justify-center py-24 text-[var(--kova-navy-muted)]">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        Cargando cuenta...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <section className="rounded-xl border border-[var(--kova-border)] bg-white p-6 lg:p-8">
        <p className="kova-portal-eyebrow">Cuenta</p>
        <h1 className="kova-portal-title kova-portal-title-lg mt-2 font-heading">Configuración</h1>
        <p className="kova-portal-body mt-3">
          Administra el correo y la contraseña de tu cuenta. Los cambios de datos personales están en tu
          perfil.
        </p>

        <div className="mt-6 space-y-3 rounded-xl border border-[var(--kova-border)] bg-[var(--kova-surface-2)]/40 p-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--kova-navy-muted)]">Nombre</p>
            <p className="mt-1 font-medium text-[var(--kova-navy)]">{nombre || 'N/D'}</p>
            <Link href="/portal/perfil" className="mt-1 inline-block text-sm font-semibold text-[var(--kova-blue)] hover:underline">
              Editar en perfil
            </Link>
          </div>
          <div className="border-t border-[var(--kova-border)] pt-3">
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--kova-navy-muted)]">Correo actual</p>
            <p className="mt-1 break-all font-medium text-[var(--kova-navy)]">{email || 'N/D'}</p>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-[var(--kova-border)] bg-white p-6">
        <div className="mb-4 flex items-center gap-2">
          <Mail className="h-4 w-4 text-[var(--kova-blue)]" />
          <h2 className="font-heading text-base font-bold text-[var(--kova-navy)]">Cambiar correo</h2>
        </div>
        <form className="space-y-4" onSubmit={submitEmail}>
          <label className="block text-sm font-medium text-[var(--kova-navy)]">
            Nuevo correo
            <input
              type="email"
              required
              autoComplete="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className={inputClass}
              placeholder="tu@correo.com"
            />
          </label>
          <label className="block text-sm font-medium text-[var(--kova-navy)]">
            Contraseña actual
            <input
              type="password"
              required
              autoComplete="current-password"
              value={emailPassword}
              onChange={(e) => setEmailPassword(e.target.value)}
              className={inputClass}
            />
          </label>
          {emailMessage ? (
            <p
              className={`text-sm ${emailStatus === 'error' ? 'text-[var(--kova-coral)]' : 'text-[var(--kova-green)]'}`}
            >
              {emailMessage}
            </p>
          ) : null}
          <button type="submit" className={btnPrimary} disabled={emailStatus === 'saving'}>
            {emailStatus === 'saving' ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              'Actualizar correo'
            )}
          </button>
        </form>
      </section>

      <section className="rounded-xl border border-[var(--kova-border)] bg-white p-6">
        <div className="mb-4 flex items-center gap-2">
          <Shield className="h-4 w-4 text-[var(--kova-blue)]" />
          <h2 className="font-heading text-base font-bold text-[var(--kova-navy)]">Cambiar contraseña</h2>
        </div>
        <form className="space-y-4" onSubmit={submitPassword}>
          <label className="block text-sm font-medium text-[var(--kova-navy)]">
            Contraseña actual
            <input
              type="password"
              required
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className={inputClass}
            />
          </label>
          <label className="block text-sm font-medium text-[var(--kova-navy)]">
            Nueva contraseña
            <input
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={inputClass}
            />
          </label>
          <label className="block text-sm font-medium text-[var(--kova-navy)]">
            Confirmar nueva contraseña
            <input
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={inputClass}
            />
          </label>
          {passMessage ? (
            <p
              className={`text-sm ${passStatus === 'error' ? 'text-[var(--kova-coral)]' : 'text-[var(--kova-green)]'}`}
            >
              {passMessage}
            </p>
          ) : null}
          <button type="submit" className={btnPrimary} disabled={passStatus === 'saving'}>
            {passStatus === 'saving' ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              'Actualizar contraseña'
            )}
          </button>
        </form>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--kova-border)] bg-white px-5 py-4">
        <p className="text-sm text-[var(--kova-navy-muted)]">¿Quieres salir de esta sesión?</p>
        <button type="button" className={btnSecondary} onClick={logout}>
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
