import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  // Capturar el 100% de errores; ajustar tracesSampleRate si el volumen crece
  tracesSampleRate: 0.1,
  // Replay solo en errores — 0% en sesiones normales para no exceder la cuota gratuita
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0,
  integrations: [
    Sentry.replayIntegration({ maskAllText: true, blockAllMedia: true }),
  ],
  // No enviar en desarrollo local
  enabled: process.env.NODE_ENV === 'production',
});
