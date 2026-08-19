import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Aviso de inteligencia artificial — MANIFIESTA con Victoria',
  description: 'Cómo funciona la IA en MANIFIESTA y qué significa para ti.',
};

export default function AvisoIAPage() {
  return (
    <main className="mx-auto max-w-2xl px-5 py-16" style={{ color: 'var(--text-primary)' }}>
      <p className="mb-1 text-sm" style={{ color: 'var(--text-tertiary)' }}>Última actualización: 18 de agosto de 2026</p>

      <h1 className="mb-10 text-3xl font-bold">Aviso de inteligencia artificial</h1>

      <Section titulo="Qué hace la IA en MANIFIESTA">
        <p>
          MANIFIESTA usa inteligencia artificial para generar tu práctica diaria personalizada
          — la afirmación, visualización, decreto, journaling y acción concreta que Victoria
          prepara para ti según tu deseo. También la usa para recomendaciones de la
          biblioteca y para el audio de la práctica (síntesis de voz).
        </p>
      </Section>

      <Section titulo="La IA orienta, tú decides">
        <p>
          El contenido que genera la IA es <strong>orientación y acompañamiento espiritual</strong>,
          no consejo médico, psicológico, legal, financiero ni profesional de ningún tipo.
        </p>
        <p className="mt-3">
          La IA puede cometer errores o generar contenido que no encaje exactamente con tu
          situación. Tus decisiones de vida — de salud, dinero, relaciones o cualquier otra
          área — siguen siendo tuyas y de los profesionales que consultes.
        </p>
      </Section>

      <Section titulo="Tus datos y la IA">
        <p>
          El texto de tus deseos y prácticas puede enviarse a Anthropic (proveedor de IA) y
          a Cartesia (síntesis de voz), ambos con servidores en EE.UU., para procesar la
          respuesta. Estos proveedores no usan tus datos para entrenar sus modelos públicos.
        </p>
        <p className="mt-3">
          No incluyas en tus textos información que preferieras no compartir con un servicio
          externo: contraseñas, datos bancarios, diagnósticos médicos o información íntima
          de terceros.
        </p>
      </Section>

      <Section titulo="Sin promesas de resultados">
        <p>
          MANIFIESTA acompaña tu práctica de manifestación. No garantizamos ni prometemos
          resultados específicos — financieros, emocionales, de salud, de relaciones ni de
          ningún otro tipo. La práctica constante y tus propias acciones son siempre la
          parte más importante.
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
        <Link href="/reembolsos" className="underline underline-offset-2">Reembolsos</Link>
        <a href="mailto:manifiesta.app@mail.com" className="underline underline-offset-2">Contacto</a>
      </nav>
    </footer>
  );
}
