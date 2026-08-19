import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Política de reembolsos — MANIFIESTA con Victoria',
  description: 'Condiciones de reembolso y garantía de MANIFIESTA.',
};

export default function ReembolsosPage() {
  return (
    <main className="mx-auto max-w-2xl px-5 py-16" style={{ color: 'var(--text-primary)' }}>
      <p className="mb-1 text-sm" style={{ color: 'var(--text-tertiary)' }}>Última actualización: 18 de agosto de 2026</p>

      <h1 className="mb-10 text-3xl font-bold">Política de reembolsos</h1>

      <Section titulo="Garantía de 7 días">
        <p>
          Si compraste MANIFIESTA y no estás satisfecha, tienes <strong>7 días calendario</strong>{' '}
          desde la fecha de compra para solicitar el reembolso completo, sin preguntas.
        </p>
        <p className="mt-3">
          Este plazo también cumple con el derecho de retracto del Código de Defensa del
          Consumidor de Brasil (CDC), que Hotmart aplica en todas sus ventas.
        </p>
      </Section>

      <Section titulo="Cómo pedir el reembolso">
        <p>Tienes dos caminos, cualquiera funciona:</p>
        <ol className="mt-3 list-decimal space-y-2 pl-5">
          <li>
            <strong>Desde Hotmart:</strong> ingresa a tu portal de compradoras, busca tu
            compra de MANIFIESTA y usa el botón de solicitar reembolso.
          </li>
          <li>
            <strong>Escribiéndonos:</strong> manda un correo a{' '}
            <a href="mailto:manifiesta.app@mail.com" className="underline underline-offset-2">
              manifiesta.app@mail.com
            </a>{' '}
            desde el correo con el que compraste y te orientamos de inmediato.
          </li>
        </ol>
      </Section>

      <Section titulo="Qué pasa con tu acceso">
        <p>
          Una vez aprobado el reembolso por Hotmart, el acceso a la app se desactiva
          automáticamente. Tu historial de prácticas queda guardado durante 30 días por si
          decides volver.
        </p>
      </Section>

      <Section titulo="Renovaciones">
        <p>
          La suscripción se renueva automáticamente. Si no quieres que se renueve, cancela
          desde tu portal de Hotmart <strong>antes</strong> del siguiente ciclo. No hacemos
          reembolsos por renovaciones ya procesadas, salvo que haya un error técnico de
          nuestra parte.
        </p>
      </Section>

      <Section titulo="Fuera del plazo de garantía">
        <p>
          Pasados los 7 días, los pagos no son reembolsables. Si tuviste un problema técnico
          que te impidió usar la app, escríbenos — evaluamos cada caso con buena fe.
        </p>
      </Section>

      <Footer />
    </main>
  );
}

function Section({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="mb-9">
      <h2 className="mb-3 text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>{titulo}</h2>
      <div className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{children}</div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="mt-14 pt-6 text-xs" style={{ borderTop: '1px solid var(--surface-2)', color: 'var(--text-tertiary)' }}>
      <nav className="flex flex-wrap gap-x-4 gap-y-1">
        <Link href="/privacidad" className="underline underline-offset-2">Política de privacidad</Link>
        <Link href="/terminos" className="underline underline-offset-2">Términos de servicio</Link>
        <Link href="/aviso-ia" className="underline underline-offset-2">Aviso de IA</Link>
        <a href="mailto:manifiesta.app@mail.com" className="underline underline-offset-2">Contacto</a>
      </nav>
    </footer>
  );
}
