'use client';

import { useMemo, useState } from 'react';
import './registro.css';
import {
  COMMERCIAL_INDUSTRIES,
  COMMERCIAL_TOOLS,
  type CommercialProfile,
  splitFullName,
} from '@/lib/candidate-commercial-profile';

const STEPS = [
  {
    tag: 'Paso 1 de 6',
    title: 'Creemos tu perfil comercial',
    sub: 'Esto no es una hoja de vida genérica: son los datos que usamos para encontrar vacantes compatibles contigo.',
    kind: 'contact' as const,
  },
  {
    tag: 'Paso 2 de 6',
    title: 'Tu rol comercial',
    sub: '¿A qué tipo de posición aplicas y cuánta experiencia comercial tienes?',
    kind: 'role' as const,
  },
  {
    tag: 'Paso 3 de 6',
    title: 'Cómo vendes',
    sub: 'No todos los vendedores venden igual. Esto determina tu compatibilidad real con cada vacante.',
    kind: 'sales' as const,
  },
  {
    tag: 'Paso 4 de 6',
    title: 'Tu industria y herramientas',
    sub: 'Selecciona todo lo que aplique a tu experiencia.',
    kind: 'industry' as const,
  },
  {
    tag: 'Paso 5 de 6',
    title: 'Tus logros',
    sub: 'Un número concreto dice más que un párrafo.',
    kind: 'achievements' as const,
  },
  {
    tag: 'Paso 6 de 6',
    title: 'Autoevaluación de competencias',
    sub: 'Sé honesto. Esto luego se contrasta con evaluación real durante el proceso.',
    kind: 'sliders' as const,
  },
];

const ROLE_OPTIONS = ['SDR / Prospección', 'Ejecutivo comercial', 'Key Account Manager', 'Gerente comercial'];
const CYCLE_OPTIONS = ['Menos de 1 mes', '1 a 3 meses', '3 a 6 meses', 'Más de 6 meses'];
const TICKET_OPTIONS = ['Menos de $5M', '$5M–$20M', '$20M–$100M', 'Más de $100M'];

const SLIDERS = [
  { key: 'venta_consultiva', label: 'Venta consultiva' },
  { key: 'prospeccion', label: 'Prospección' },
  { key: 'objeciones', label: 'Manejo de objeciones' },
  { key: 'logro_orient', label: 'Orientación al logro' },
] as const;

const EMPTY_PROFILE: CommercialProfile = {
  industrias: [],
  herramientas: [],
  venta_consultiva: 60,
  prospeccion: 60,
  objeciones: 60,
  logro_orient: 60,
};

export default function RegistroPage() {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<CommercialProfile>(EMPTY_PROFILE);
  const [done, setDone] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const current = STEPS[step];
  const progress = ((step + 1) / STEPS.length) * 100;

  const canNext = useMemo(() => {
    if (step === 0) {
      return Boolean(profile.nombre?.trim() && profile.email?.trim() && /.+@.+\..+/.test(profile.email));
    }
    if (step === 1) {
      return Boolean(profile.rol && profile.anios !== '' && profile.anios != null);
    }
    if (step === 2) {
      return Boolean(profile.tipoVenta && profile.naturaleza && profile.enfoque && profile.ciclo && profile.ticket);
    }
    if (step === 3) {
      return (profile.industrias?.length ?? 0) > 0;
    }
    return true;
  }, [step, profile]);

  const update = (patch: Partial<CommercialProfile>) => {
    setProfile((prev) => ({ ...prev, ...patch }));
  };

  const toggleTag = (key: 'industrias' | 'herramientas', value: string) => {
    setProfile((prev) => {
      const list = [...(prev[key] ?? [])];
      const idx = list.indexOf(value);
      if (idx > -1) list.splice(idx, 1);
      else list.push(value);
      return { ...prev, [key]: list };
    });
  };

  const submit = async () => {
    setLoading(true);
    setError('');
    try {
      const { firstName, lastName } = splitFullName(profile.nombre ?? '');
      const res = await fetch('/api/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile, firstName, lastName }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message ?? 'Error al registrar');
      setDone(json.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrar');
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="kv-registro">
        <nav className="kv-registro-nav">
          <div className="kv-registro-logo">
            <span className="kv-registro-logo-mark" aria-hidden />
            Kova
          </div>
          <div className="kv-registro-nav-sub">Panel de candidato</div>
        </nav>
        <div className="kv-registro-stage">
          <div className="kv-registro-success">
            <div className="kv-registro-success-icon" aria-hidden>
              ✓
            </div>
            <p className="kv-registro-step-tag">Perfil guardado</p>
            <h1 className="kv-registro-step-title">¡Listo, {profile.nombre?.split(' ')[0] || 'candidato'}!</h1>
            <p className="kv-registro-step-sub" style={{ margin: '0 auto' }}>
              {done}
            </p>
            <p className="kv-registro-step-sub" style={{ marginTop: 20 }}>
              No verás vacantes ni puntajes aquí. Si hay una oportunidad compatible, el equipo de Kova te contactará
              directamente.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="kv-registro">
      <nav className="kv-registro-nav">
        <div className="kv-registro-logo">
          <span className="kv-registro-logo-mark" aria-hidden />
          Kova
        </div>
        <div className="kv-registro-nav-sub">Panel de candidato</div>
      </nav>

      <div className="kv-registro-stage">
        <div className="kv-registro-progress-track">
          <div className="kv-registro-progress-fill" style={{ width: `${progress}%` }} />
        </div>

        <p className="kv-registro-step-tag">{current.tag}</p>
        <h1 className="kv-registro-step-title">{current.title}</h1>
        {current.sub && <p className="kv-registro-step-sub">{current.sub}</p>}

        {current.kind === 'contact' && (
          <>
            <div className="kv-registro-field">
              <label htmlFor="nombre">Nombre completo</label>
              <input
                id="nombre"
                type="text"
                value={profile.nombre ?? ''}
                onChange={(e) => update({ nombre: e.target.value })}
              />
            </div>
            <div className="kv-registro-field">
              <label htmlFor="email">Correo electrónico</label>
              <input
                id="email"
                type="email"
                value={profile.email ?? ''}
                onChange={(e) => update({ email: e.target.value })}
              />
            </div>
            <div className="kv-registro-field">
              <label htmlFor="ciudad">Ciudad</label>
              <input
                id="ciudad"
                type="text"
                value={profile.ciudad ?? ''}
                onChange={(e) => update({ ciudad: e.target.value })}
              />
            </div>
          </>
        )}

        {current.kind === 'role' && (
          <>
            <div className="kv-registro-field">
              <label htmlFor="rol">Rol al que aplicas</label>
              <select id="rol" value={profile.rol ?? ''} onChange={(e) => update({ rol: e.target.value })}>
                <option value="">Selecciona...</option>
                {ROLE_OPTIONS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
            <div className="kv-registro-field">
              <label htmlFor="anios">Años de experiencia comercial</label>
              <input
                id="anios"
                type="number"
                min={0}
                max={40}
                value={profile.anios ?? ''}
                onChange={(e) => update({ anios: e.target.value })}
              />
            </div>
          </>
        )}

        {current.kind === 'sales' && (
          <>
            {[
              {
                key: 'tipoVenta' as const,
                label: 'Tipo de venta',
                options: ['Consultiva', 'Transaccional'],
              },
              {
                key: 'naturaleza' as const,
                label: 'Naturaleza de la venta',
                options: ['Técnica', 'Relacional'],
              },
              {
                key: 'enfoque' as const,
                label: 'Enfoque principal',
                options: ['Prospección (hunter)', 'Manejo de cuentas (farmer)'],
              },
            ].map((group) => (
              <div className="kv-registro-field" key={group.key}>
                <label>{group.label}</label>
                <div className="kv-registro-choice-grid">
                  {group.options.map((option) => (
                    <button
                      key={option}
                      type="button"
                      className={`kv-registro-choice${profile[group.key] === option ? ' selected' : ''}`}
                      onClick={() => update({ [group.key]: option })}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <div className="kv-registro-field-row">
              <div className="kv-registro-field">
                <label htmlFor="ciclo">Ciclo de venta típico</label>
                <select id="ciclo" value={profile.ciclo ?? ''} onChange={(e) => update({ ciclo: e.target.value })}>
                  <option value="">Selecciona...</option>
                  {CYCLE_OPTIONS.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>
              <div className="kv-registro-field">
                <label htmlFor="ticket">Ticket promedio manejado</label>
                <select id="ticket" value={profile.ticket ?? ''} onChange={(e) => update({ ticket: e.target.value })}>
                  <option value="">Selecciona...</option>
                  {TICKET_OPTIONS.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </>
        )}

        {current.kind === 'industry' && (
          <>
            <div className="kv-registro-field">
              <label>Industrias en las que tienes experiencia</label>
              <div className="kv-registro-tag-grid">
                {COMMERCIAL_INDUSTRIES.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={`kv-registro-tag-choice${profile.industrias?.includes(item) ? ' selected' : ''}`}
                    onClick={() => toggleTag('industrias', item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <div className="kv-registro-field">
              <label>Herramientas / CRM que has usado</label>
              <div className="kv-registro-tag-grid">
                {COMMERCIAL_TOOLS.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={`kv-registro-tag-choice${profile.herramientas?.includes(item) ? ' selected' : ''}`}
                    onClick={() => toggleTag('herramientas', item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {current.kind === 'achievements' && (
          <>
            <div className="kv-registro-field">
              <label htmlFor="cuota">% de cumplimiento de cuota promedio (últimos 12 meses)</label>
              <input
                id="cuota"
                type="number"
                min={0}
                max={200}
                value={profile.cuota ?? ''}
                onChange={(e) => update({ cuota: e.target.value })}
              />
            </div>
            <div className="kv-registro-field">
              <label htmlFor="logro">Tu logro comercial más relevante</label>
              <textarea
                id="logro"
                value={profile.logro ?? ''}
                onChange={(e) => update({ logro: e.target.value })}
              />
            </div>
          </>
        )}

        {current.kind === 'sliders' && (
          <>
            {SLIDERS.map((slider) => {
              const value = Number(profile[slider.key] ?? 60);
              return (
                <div className="kv-registro-slider-field" key={slider.key}>
                  <div className="kv-registro-slider-head">
                    <span>{slider.label}</span>
                    <b>{value}%</b>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={value}
                    onChange={(e) => update({ [slider.key]: e.target.value })}
                  />
                </div>
              );
            })}
          </>
        )}

        {error && <p className="kv-registro-error">{error}</p>}

        <div className="kv-registro-btn-row">
          {step > 0 ? (
            <button type="button" className="kv-registro-btn-ghost" onClick={() => setStep((s) => s - 1)}>
              Atrás
            </button>
          ) : (
            <span />
          )}
          {step < STEPS.length - 1 ? (
            <button
              type="button"
              className="kv-registro-btn-solid"
              disabled={!canNext}
              onClick={() => setStep((s) => s + 1)}
            >
              Siguiente →
            </button>
          ) : (
            <button
              type="button"
              className="kv-registro-btn-solid"
              disabled={loading}
              onClick={submit}
            >
              {loading ? 'Guardando...' : 'Guardar mi perfil →'}
            </button>
          )}
        </div>

        <p className="kv-registro-save-note">
          Tu perfil es confidencial. Solo el equipo Kova lo usa para evaluar compatibilidad con vacantes.
        </p>
      </div>
    </div>
  );
}
