'use client';

import { useState } from 'react';
import { XCircle } from 'lucide-react';

const REASONS = ['Experiencia', 'Salario', 'Competencias', 'Ubicación', 'Otro'];

type Props = {
  open: boolean;
  candidateName?: string;
  loading?: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
};

export function RejectModal({ open, candidateName, loading, onClose, onConfirm }: Props) {
  const [reason, setReason] = useState('Competencias');
  const [custom, setCustom] = useState('');

  if (!open) return null;

  const finalReason = reason === 'Otro' ? custom.trim() : reason;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => !loading && onClose()}>
      <div className="w-full max-w-md kova-card p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-red-50">
            <XCircle className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-sm" style={{ color: 'var(--kova-navy)' }}>Rechazar candidato</h3>
            {candidateName && <p className="text-xs text-slate-500 mt-0.5">{candidateName}</p>}
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-slate-500 mb-2">Motivo del rechazo</p>
          <div className="flex flex-wrap gap-2">
            {REASONS.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setReason(r)}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${reason === r ? 'border-red-300 bg-red-50 text-red-700 font-medium' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
              >
                {r}
              </button>
            ))}
          </div>
          {reason === 'Otro' && (
            <input
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              placeholder="Describe el motivo..."
              className="mt-2 w-full text-sm px-3 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-red-100"
            />
          )}
        </div>

        <div className="flex gap-2 justify-end pt-1">
          <button type="button" disabled={loading} onClick={onClose} className="text-sm px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50">
            Cancelar
          </button>
          <button
            type="button"
            disabled={loading || !finalReason}
            onClick={() => onConfirm(finalReason)}
            className="text-sm px-4 py-2 rounded-lg text-white bg-red-500 hover:bg-red-600 disabled:opacity-50"
          >
            Confirmar rechazo
          </button>
        </div>
      </div>
    </div>
  );
}
