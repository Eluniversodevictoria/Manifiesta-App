'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="es">
      <body
        style={{
          margin: 0,
          minHeight: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          padding: '24px',
          fontFamily: 'system-ui, sans-serif',
          background: '#FBF8F4',
          textAlign: 'center',
        }}
      >
        <span style={{ fontSize: 32 }} aria-hidden="true">✦</span>
        <p style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#24191D' }}>
          Algo salió mal
        </p>
        <p style={{ margin: 0, fontSize: 14, color: '#75666B' }}>
          El error fue registrado. Intenta de nuevo.
        </p>
        <button
          onClick={reset}
          style={{
            marginTop: 8,
            padding: '12px 28px',
            borderRadius: 100,
            border: 'none',
            background: '#C96F8A',
            color: 'white',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Reintentar
        </button>
      </body>
    </html>
  );
}
