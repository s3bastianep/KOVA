'use client';

import { use, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

type FormQuestion = {
  id: string;
  label: string;
  category: string;
  inputType: 'number' | 'select' | 'text';
  options: string[];
  placeholder?: string;
  helpText?: string;
};

export default function PostularPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [done, setDone] = useState<{ compatibility: number; message: string } | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['postulacion', id],
    queryFn: () => fetch(`/api/procesos/${id}/postulacion`).then((r) => r.json()),
  });

  const questions = (data?.questions ?? []) as FormQuestion[];

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/procesos/${id}/postulacion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, phone, answers }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message ?? 'Error al postular');
      setDone({ compatibility: json.compatibility, message: json.message });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al postular');
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-slate-500">Cargando...</div>;
  }

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
        <div className="kova-card p-8 max-w-md text-center space-y-4">
          <p className="font-heading text-3xl font-bold" style={{ color: 'var(--kova-green)' }}>{done.compatibility}%</p>
          <p className="text-sm text-slate-600">Compatibilidad con el cargo</p>
          <p className="text-sm" style={{ color: 'var(--kova-navy)' }}>{done.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-xl mx-auto space-y-6">
        <div className="text-center">
          <p className="text-xs uppercase tracking-wide text-slate-400">{data?.companyName}</p>
          <h1 className="font-heading text-2xl font-bold mt-1" style={{ color: 'var(--kova-navy)' }}>{data?.title}</h1>
          <p className="text-sm text-slate-500 mt-2">Completa el formulario. El sistema calculará tu compatibilidad automáticamente.</p>
        </div>

        <form onSubmit={submit} className="kova-card p-6 space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Nombre" value={firstName} onChange={setFirstName} required />
            <Field label="Apellido" value={lastName} onChange={setLastName} required />
          </div>
          <Field label="Correo" value={email} onChange={setEmail} type="email" required />
          <Field label="Teléfono" value={phone} onChange={setPhone} />

          <hr className="border-slate-100" />
          <p className="text-xs font-semibold uppercase text-slate-400">Perfil profesional</p>

          {questions.map((q) => (
            <div key={q.id}>
              <label className="text-sm font-medium block mb-1" style={{ color: 'var(--kova-navy)' }}>
                {q.label}
                <span className="text-slate-400 font-normal text-xs ml-1">({q.category})</span>
              </label>
              {q.inputType === 'select' ? (
                <select
                  value={answers[q.id] ?? ''}
                  onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                >
                  <option value="">Seleccionar...</option>
                  {q.options.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : (
                <input
                  type={q.inputType === 'number' ? 'number' : 'text'}
                  value={answers[q.id] ?? ''}
                  onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))}
                  placeholder={q.placeholder}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                />
              )}
              {q.helpText && <p className="text-xs text-slate-400 mt-1">{q.helpText}</p>}
            </div>
          ))}

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button type="submit" disabled={loading} className="w-full py-3 rounded-lg text-white font-semibold text-sm kova-btn-primary disabled:opacity-60">
            {loading ? 'Enviando...' : 'Postularme'}
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = 'text', required }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean;
}) {
  return (
    <div>
      <label className="text-sm font-medium mb-1 block" style={{ color: 'var(--kova-navy)' }}>{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} required={required}
        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" />
    </div>
  );
}
