import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Términos de servicio — MANIFIESTA con Victoria',
  description: 'Condiciones de uso de MANIFIESTA.',
};

export default function TerminosPage() {
  return (
    <main className="mx-auto max-w-2xl px-5 py-16" style={{ color: 'var(--text-primary)' }}>
      <p className="mb-1 text-sm" style={{ color: 'var(--text-tertiary)' }}>Última actualización: 18 de agosto de 2026</p>

      <h1 className="mb-10 text-3xl font-bold">Términos de servicio</h1>

      <Section titulo="El servicio">
        <p>
          MANIFIESTA — con Victoria es una app de práctica diaria de manifestación. Genera
          rituales personalizados, afirmaciones, visualizaciones, scripting y journaling
          basados en los deseos que tú defines. El acceso activo está disponible para
          suscriptoras con plan vigente.
        </p>
        <p className="mt-3">
          Lo que la app <strong>no hace</strong>: no garantiza resultados financieros, de
          salud, emocionales ni de ningún otro tipo. Las prácticas son orientación y
          acompañamiento — tus decisiones siguen siendo tuyas.
        </p>
      </Section>

      <Section titulo="Pagos, suscripción y acceso">
        <p>
          Los pagos y cancelaciones se gestionan en Hotmart. Para activar tu acceso debes
          usar el mismo correo con el que compraste. La suscripción se renueva
          automáticamente cada mes o cada año según el plan que elijas — puedes cancelarla
          cuando quieras desde tu portal de compradoras en Hotmart antes del siguiente ciclo.
        </p>
        <p className="mt-3">
          Si cancelas, mantienes el acceso durante el periodo ya pagado cuando Hotmart lo
          permita. Si hay reembolso, contracargo o expiración, el acceso puede desactivarse.
        </p>
      </Section>

      <Section titulo="Garantía">
        <p>
          La garantía comercial es de <strong>7 días</strong> desde la fecha de compra. Se
          solicita a través de Hotmart o escribiéndonos a{' '}
          <a href="mailto:manifiesta.app@mail.com" className="underline underline-offset-2">
            manifiesta.app@mail.com
          </a>{' '}
          para orientarte.
        </p>
      </Section>

      <Section titulo="Cancelación fácil">
        <p>
          Cancelar es tan fácil como suscribirse. Ingresa a tu portal de compradoras en
          Hotmart, busca tu compra de MANIFIESTA y cancela desde allí. También puedes
          escribirnos y te guiamos paso a paso.
        </p>
      </Section>

      <Section titulo="Uso responsable">
        <p>
          No uses MANIFIESTA para automatizar abuso, revender el acceso, intentar saltar
          límites técnicos ni ingresar datos de terceros sin su permiso. Podemos limitar o
          suspender accesos ante abuso, fraude, contracargos o uso que dañe el servicio o a
          otras usuarias.
        </p>
      </Section>

      <Section titulo="Contenido generado por IA">
        <p>
          Las prácticas diarias, afirmaciones, decretos y recomendaciones son generadas por
          inteligencia artificial (Anthropic / Claude). Son orientación personalizada, no
          consejo médico, legal, financiero ni profesional. La IA puede cometer errores —
          verifica siempre lo que sea importante para ti.
        </p>
        <p className="mt-3">
          El contenido que genera la app a partir de tus datos es tuyo. No lo usamos para
          entrenar modelos ni lo compartimos con terceros salvo lo necesario para operar el
          servicio (ver Política de privacidad).
        </p>
      </Section>

      <Section titulo="Limitación de responsabilidad">
        <p>
          MANIFIESTA se brinda "tal como está". No garantizamos disponibilidad ininterrumpida
          ni resultados específicos. Nuestra responsabilidad total frente a ti no excede el
          monto que pagaste en los últimos 12 meses.
        </p>
      </Section>

      <Section titulo="Ley aplicable">
        <p>
          Estos términos se rigen por las leyes del Estado de New Jersey, Estados Unidos. Para
          cualquier disputa, intentaremos resolverla directamente contigo antes de recurrir a
          instancias formales.
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
        <Link href="/reembolsos" className="underline underline-offset-2">Política de reembolsos</Link>
        <Link href="/aviso-ia" className="underline underline-offset-2">Aviso de IA</Link>
        <a href="mailto:manifiesta.app@mail.com" className="underline underline-offset-2">Contacto</a>
      </nav>
    </footer>
  );
}
