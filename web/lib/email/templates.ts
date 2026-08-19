// Templates de email — voz de Victoria: cálida, cercana, femenina, sin urgencia falsa

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://manifiesta.app';

// ── Paleta de la marca ─────────────────────────────────────────────────────
const C = {
  bg:      '#FDF8F0',
  white:   '#FFFFFF',
  accent:  '#C4748A',
  accentL: '#F2C4C4',
  text:    '#22141A',
  muted:   '#A87888',
  border:  '#F2E8E8',
};

function shell(content: string): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<title>MANIFIESTA con Victoria</title>
</head>
<body style="margin:0;padding:0;background:${C.bg};font-family:Georgia,serif;color:${C.text};">
<table width="100%" cellpadding="0" cellspacing="0" style="background:${C.bg};padding:32px 16px;">
  <tr><td align="center">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:${C.white};border-radius:20px;border:1px solid ${C.border};overflow:hidden;">
      <!-- Header -->
      <tr>
        <td style="background:${C.accent};padding:20px 32px;text-align:center;">
          <p style="margin:0;font-size:22px;color:${C.white};letter-spacing:0.08em;font-weight:700;">✦ MANIFIESTA</p>
          <p style="margin:4px 0 0;font-size:12px;color:rgba(255,255,255,0.75);font-family:Arial,sans-serif;letter-spacing:0.04em;">con Victoria</p>
        </td>
      </tr>
      <!-- Body -->
      <tr><td style="padding:32px;">
        ${content}
      </td></tr>
      <!-- Footer -->
      <tr>
        <td style="padding:20px 32px;border-top:1px solid ${C.border};text-align:center;">
          <p style="margin:0;font-size:12px;color:${C.muted};font-family:Arial,sans-serif;line-height:1.6;">
            Enviado desde MANIFIESTA · soportemanifiesta.app@gmail.com<br>
            Si tienes preguntas, responde este email directamente.
          </p>
        </td>
      </tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
}

function cta(texto: string, url: string): string {
  return `<p style="margin:24px 0 0;text-align:center;">
    <a href="${url}" style="display:inline-block;background:${C.accent};color:${C.white};text-decoration:none;padding:14px 32px;border-radius:100px;font-family:Arial,sans-serif;font-size:15px;font-weight:700;letter-spacing:0.02em;">${texto}</a>
  </p>`;
}

function h1(texto: string): string {
  return `<h1 style="margin:0 0 16px;font-size:24px;color:${C.text};line-height:1.3;">${texto}</h1>`;
}

function p(texto: string): string {
  return `<p style="margin:0 0 14px;font-size:16px;line-height:1.7;color:${C.text};">${texto}</p>`;
}

function accentBox(texto: string): string {
  return `<div style="background:${C.bg};border-left:3px solid ${C.accent};border-radius:0 12px 12px 0;padding:14px 18px;margin:20px 0;">
    <p style="margin:0;font-size:15px;font-style:italic;color:${C.accent};line-height:1.6;">${texto}</p>
  </div>`;
}

function lista(items: string[]): string {
  const filas = items.map(
    (i) => `<tr><td style="padding:5px 0 5px 0;font-size:15px;color:${C.text};line-height:1.5;font-family:Arial,sans-serif;">
      <span style="color:${C.accent};margin-right:8px;">✦</span>${i}</td></tr>`
  ).join('');
  return `<table style="width:100%;margin:16px 0;" cellpadding="0" cellspacing="0">${filas}</table>`;
}

function unsubscribeFooter(tipo: string): string {
  return `<p style="margin:20px 0 0;font-size:11px;color:${C.muted};font-family:Arial,sans-serif;text-align:center;">
    Este es un email de ${tipo}. Si prefieres no recibirlos,
    <a href="${APP_URL}/unsubscribe" style="color:${C.muted};">cancela tu suscripción aquí</a>.
  </p>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// TRANSACCIONALES
// ─────────────────────────────────────────────────────────────────────────────

export function emailTrialD1(nombre: string): { subject: string; html: string } {
  return {
    subject: '✨ Tus 7 días de MANIFIESTA empezaron ahora',
    html: shell(
      h1('Hola ' + nombre + ', tu práctica ya está lista.') +
      p('Acabo de preparar todo para ti. Tienes 7 días con acceso completo a MANIFIESTA — rituales, afirmaciones, scripting guiado, biblioteca completa y la práctica diaria personalizada para lo que quieres manifestar.') +
      accentBox('Lo único que necesitas hacer hoy es abrir la app y escribir qué quieres atraer a tu vida. Victoria hará el resto.') +
      lista([
        'Práctica diaria personalizada — nueva cada día',
        '"Necesito manifestar…" — para cuando algo urge',
        'Biblioteca completa: rituales, decretos, señales',
        'Tus manifestaciones guardadas y en seguimiento',
      ]) +
      cta('Empezar mi primera práctica →', APP_URL + '/app')
    ),
  };
}

export function emailTrialD3(nombre: string): { subject: string; html: string } {
  return {
    subject: 'La práctica de hoy te está esperando 🌸',
    html: shell(
      h1('¿Cómo vas, ' + nombre + '?') +
      p('Llevo unos días pensando en ti. ¿Ya escribiste tu primera manifestación? ¿Ya hiciste tu práctica del día?') +
      p('La consistencia es lo que marca la diferencia — no la perfección. Cinco minutos hoy valen más que una hora "cuando tengas tiempo".') +
      accentBox('"El universo responde a la energía que pones, no a la que planeas poner."') +
      p('Si todavía no has escrito qué quieres manifestar, hoy es el día perfecto para empezar.') +
      cta('Ver mi práctica de hoy →', APP_URL + '/app') +
      unsubscribeFooter('seguimiento de tu práctica')
    ),
  };
}

export function emailTrialD5(nombre: string): { subject: string; html: string } {
  return {
    subject: 'Lo que construiste esta semana (aunque no lo notes) ✨',
    html: shell(
      h1('Ya llevas 5 días, ' + nombre + '.') +
      p('Incluso si no usaste la app todos los días, ya escribiste tu deseo. Ya lo nombraste. Eso tiene más peso de lo que crees.') +
      p('En MANIFIESTA, tu historial se va acumulando — cada práctica hecha, cada manifestación que guardas, cada check-in. Es tuyo para siempre.') +
      accentBox('Ese historial es lo más valioso que tienes aquí. Crecer no se ve en el día uno, pero sí cuando miras atrás.') +
      p('Te invito a abrir la app hoy y hacer la práctica. Lo que sientes al terminarla no tiene precio.') +
      cta('Abrir MANIFIESTA →', APP_URL + '/app') +
      unsubscribeFooter('seguimiento de tu práctica')
    ),
  };
}

export function emailTrialD7(nombre: string): { subject: string; html: string } {
  return {
    subject: 'Tu prueba termina mañana — quiero que sepas algo 🌙',
    html: shell(
      h1('Mañana termina tu prueba, ' + nombre + '.') +
      p('Quiero ser directa contigo: si MANIFIESTA te ha servido esta semana — aunque sea un poco — vale la pena continuar. La práctica que empezaste necesita tiempo para dar frutos.') +
      p('Si decides seguir, elige el plan que más se ajusta a ti:') +
      lista([
        'Plan Mensual — $6.99/mes · Sin compromisos, cancelas cuando quieras',
        'Plan Anual — $4/mes · 2 meses gratis · Para quienes saben que esto es para ellas',
      ]) +
      p('Si no estás segura, el plan mensual es el lugar perfecto para empezar.') +
      cta('Elegir mi plan →', APP_URL + '/onboarding/paywall') +
      p('Si decides no continuar, entiendo. Tus manifestaciones guardadas siguen siendo tuyas — puedes volver cuando estés lista.') +
      unsubscribeFooter('seguimiento de tu prueba')
    ),
  };
}

export function emailSuscripcionActivada(nombre: string, periodo: 'mensual' | 'anual'): { subject: string; html: string } {
  const planLabel = periodo === 'anual' ? 'Anual' : 'Mensual';
  return {
    subject: `✨ Tu plan ${planLabel} de MANIFIESTA está activo`,
    html: shell(
      h1('¡Ya eres parte de MANIFIESTA, ' + nombre + '!') +
      p('Tu plan ' + planLabel + ' está activo. Acceso completo, sin límites, para practicar a tu ritmo.') +
      accentBox('Victoria ya tiene lista tu práctica de hoy. Entra cuando puedas.') +
      lista([
        'Práctica diaria personalizada — nueva cada día',
        '"Necesito manifestar…" — para lo urgente',
        'Biblioteca completa sin restricciones',
        'Historial completo de tu práctica',
      ]) +
      cta('Entrar a MANIFIESTA →', APP_URL + '/app') +
      p('Si tienes cualquier pregunta, responde este email directamente. Estamos aquí.')
    ),
  };
}

export function emailCancelacion(nombre: string): { subject: string; html: string } {
  return {
    subject: 'Tu suscripción a MANIFIESTA fue cancelada',
    html: shell(
      h1('Hasta pronto, ' + nombre + '.') +
      p('Tu suscripción se canceló correctamente. Conservas acceso hasta el final del período ya pagado — después de eso, la app entrará en modo de solo lectura.') +
      p('Tu historial y tus manifestaciones están guardados. Si decides volver en cualquier momento, todo seguirá donde lo dejaste.') +
      accentBox('A veces los momentos de pausa son parte del proceso también.') +
      p('Si hubo algo que no funcionó como esperabas, me encantaría saber. Puedes responder este email directamente.') +
      cta('Volver a MANIFIESTA cuando estés lista →', APP_URL)
    ),
  };
}

export function emailReembolso(nombre: string): { subject: string; html: string } {
  return {
    subject: 'Tu reembolso de MANIFIESTA fue procesado',
    html: shell(
      h1('Tu reembolso está en camino, ' + nombre + '.') +
      p('Procesamos tu reembolso correctamente. El monto llegará a tu cuenta según los tiempos de tu banco (normalmente 3-10 días hábiles).') +
      p('Tu acceso a MANIFIESTA se cerró. Si fue un error o quieres volver en el futuro, escríbenos y lo resolvemos.') +
      p('Gracias por haber confiado en nosotras. Te deseamos lo mejor.') +
      cta('Contactar soporte →', 'mailto:soportemanifiesta.app@gmail.com')
    ),
  };
}

export function emailTrialExpirado(nombre: string): { subject: string; html: string } {
  return {
    subject: 'Tu período de prueba terminó — tu historial te espera 🌙',
    html: shell(
      h1('Tu prueba terminó, ' + nombre + '.') +
      p('Tus 7 días de acceso completo llegaron a su fin. Todo lo que guardaste — tus manifestaciones, tu historial, tu práctica — sigue ahí, esperándote.') +
      p('Para seguir practicando, elige el plan que va contigo:') +
      lista([
        'Plan Mensual — $6.99/mes · Cancelas cuando quieras',
        'Plan Anual — $4/mes · 2 meses gratis',
      ]) +
      cta('Elegir mi plan y seguir →', APP_URL + '/onboarding/paywall') +
      p('Si tienes alguna pregunta, responde este email.') +
      unsubscribeFooter('recuperación de acceso')
    ),
  };
}

export function emailWinbackTrial(nombre: string): { subject: string; html: string } {
  return {
    subject: 'Tus manifestaciones siguen guardadas 🌸',
    html: shell(
      h1(nombre + ', tu práctica te está esperando.') +
      p('Hace unos días terminó tu prueba. Sé que la vida tiene sus ritmos y sus momentos — y si este no fue el momento, está bien.') +
      p('Pero si sientes que quieres retomar, todo lo que guardaste en MANIFIESTA sigue ahí. Tu historial, tus deseos, tu proceso — intactos.') +
      accentBox('"Volver no es empezar de cero. Es continuar desde donde lo dejaste."') +
      cta('Volver a MANIFIESTA →', APP_URL + '/onboarding/paywall') +
      p('Plan mensual: $6.99/mes · Plan anual: $4/mes (2 meses gratis)') +
      unsubscribeFooter('seguimiento post-prueba')
    ),
  };
}

export function emailWinbackCancelada(nombre: string): { subject: string; html: string } {
  return {
    subject: 'Te echamos de menos, ' + nombre + ' 🌙',
    html: shell(
      h1('Ha pasado una semana, ' + nombre + '.') +
      p('Desde que cancelaste, he pensado en ti. La manifestación es un proceso que se construye con el tiempo — y a veces una pausa es exactamente lo que necesitamos.') +
      p('Si estás lista para retomar tu práctica, todo sigue guardado. Puedes volver hoy mismo.') +
      accentBox('"Lo que pides no desaparece porque hayas pausado. El universo tiene memoria."') +
      cta('Volver a MANIFIESTA →', APP_URL + '/onboarding/paywall') +
      p('Si hay algo en lo que podamos mejorar, responde este email. Me encanta saber qué piensas.') +
      unsubscribeFooter('seguimiento post-cancelación')
    ),
  };
}
