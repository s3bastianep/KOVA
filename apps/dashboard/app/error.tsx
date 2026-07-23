'use client';

import { useEffect } from 'react';

/**
 * Error boundary global del dashboard: si una página lanza una excepción al
 * renderizar, el usuario ve esta pantalla con opción de reintentar en lugar
 * de la página de error genérica de Next (que puede filtrar detalles en dev).
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[app/error]', error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        background: '#0b0d0a',
        color: '#f4f6f0',
        fontFamily: "'Manrope', 'Helvetica Neue', Arial, sans-serif",
        padding: 24,
        textAlign: 'center',
      }}
    >
      <p style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>
        litt hunter<span className="lh-mark__sq" aria-hidden="true" />
      </p>
      <h1 style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>Algo salió mal</h1>
      <p style={{ color: 'rgba(244, 246, 240, 0.6)', maxWidth: 420, margin: 0, fontSize: 14 }}>
        Ocurrió un error inesperado. Puedes intentar de nuevo; si el problema continúa,
        recarga la página.
      </p>
      <button
        type="button"
        onClick={reset}
        style={{
          marginTop: 8,
          padding: '10px 24px',
          borderRadius: 999,
          border: 'none',
          background: '#c5de4e',
          color: '#12140f',
          fontWeight: 600,
          fontSize: 14,
          cursor: 'pointer',
        }}
      >
        Intentar de nuevo
      </button>
    </div>
  );
}
