// Gmail transport — server-side only, NUNCA importar desde cliente
// OAuth2 de Google: las credenciales viven SOLO en variables de entorno del servidor.
// Configuración manual en Google Cloud Console: ver docs/email-setup.md

import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

let cached: Transporter | null = null;

export function getGmailTransport(): Transporter {
  if (cached) return cached;

  const clientId = process.env.GMAIL_CLIENT_ID;
  const clientSecret = process.env.GMAIL_CLIENT_SECRET;
  const refreshToken = process.env.GMAIL_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error(
      '[email] Gmail OAuth2 no configurado. Faltan: ' +
      [
        !clientId && 'GMAIL_CLIENT_ID',
        !clientSecret && 'GMAIL_CLIENT_SECRET',
        !refreshToken && 'GMAIL_REFRESH_TOKEN',
      ]
        .filter(Boolean)
        .join(', ')
    );
  }

  cached = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: 'soportemanifiesta.app@gmail.com',
      clientId,
      clientSecret,
      refreshToken,
    },
  });

  return cached;
}

export const FROM = 'MANIFIESTA con Victoria <soportemanifiesta.app@gmail.com>';
