import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Política de privacidad — MANIFIESTA con Victoria',
  description: 'Cómo tratamos tus datos en MANIFIESTA.',
};

export default function PrivacidadPage() {
  return (
    <main className="mx-auto max-w-2xl px-5 py-16" style={{ color: 'var(--text-primary)' }}>
      <p className="mb-1 text-sm" style={{ color: 'var(--text-tertiary)' }}>Última actualización: 18 de agosto de 2026</p>

      <h1 className="mb-10 text-3xl font-bold">Política de privacidad</h1>

      <Section titulo="Responsable y contacto">
        <p>
          MANIFIESTA — con Victoria es responsable del tratamiento necesario para operar la
          aplicación. Para consultas, correcciones, eliminación de datos, revocación de
          consentimiento o cualquier reclamo, escribe a{' '}
          <a href="mailto:soportemanifiesta.app@gmail.com" className="underline underline-offset-2">
            soportemanifiesta.app@gmail.com
          </a>{' '}
          desde el correo asociado a tu cuenta.
        </p>
      </Section>

      <Section titulo="Datos que tratamos">
        <p>
          Podemos tratar nombre, correo electrónico, estado de tu suscripción, tus deseos y
          manifestaciones guardadas, prácticas completadas, entradas de journaling y scripting,
          favoritos de biblioteca, preferencias de práctica (leer / escuchar) y racha diaria.
          También registramos eventos técnicos de uso para medir y mejorar la experiencia.
        </p>
      </Section>

      <Section titulo="Finalidades y base del tratamiento">
        <p>
          Usamos los datos necesarios para autenticarte, validar tu compra, personalizar tu
          práctica diaria con Victoria, sincronizar tu progreso, prestarte soporte y prevenir
          fraude. Los correos de recordatorio o recuperación solo se envían cuando das tu
          autorización; puedes retirarla desde el enlace incluido en cada mensaje.
        </p>
      </Section>

      <Section titulo="Proveedores y transferencias internacionales">
        <p className="mb-3">
          Para operar la app usamos los siguientes proveedores. Algunos pueden procesar tu
          información fuera de tu país bajo sus propias medidas de seguridad y contratos:
        </p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li><strong>Supabase</strong> — base de datos y autenticación (EE.UU.)</li>
          <li><strong>Vercel</strong> — alojamiento de la app (EE.UU.)</li>
          <li><strong>Anthropic (Claude)</strong> — inteligencia artificial para generar tu práctica diaria personalizada (EE.UU.)</li>
          <li><strong>Cartesia</strong> — síntesis de voz para el audio de la práctica (EE.UU.)</li>
          <li><strong>Hotmart</strong> — procesamiento de pagos y suscripciones (Brasil / global)</li>
          <li><strong>Resend</strong> — envío de correos transaccionales (EE.UU.)</li>
        </ul>
        <p className="mt-3">
          MANIFIESTA no almacena los datos de tu tarjeta — ese proceso lo maneja Hotmart
          directamente.
        </p>
      </Section>

      <Section titulo="IA y datos que envías">
        <p>
          Tu deseo, el contexto de tu práctica y los textos que escribes en la app pueden
          enviarse a Anthropic (EE.UU.) para generar tu práctica personalizada y a Cartesia
          para convertirla en audio. Estos proveedores procesan el texto bajo sus propios
          términos y medidas de seguridad.
        </p>
        <p className="mt-3">
          No incluyas contraseñas, datos bancarios, diagnósticos médicos ni información
          sensible de otras personas en tus textos. Cuanto más personal es lo que escribes,
          más cuidas lo que compartes.
        </p>
      </Section>

      <Section titulo="Conservación">
        <p>
          Los datos de tu cuenta se conservan mientras el servicio esté activo y durante el
          tiempo razonablemente necesario para resolver solicitudes, prevenir fraude y cumplir
          obligaciones legales aplicables. Los registros mínimos de pagos pueden conservarse
          durante el periodo que exija la ley.
        </p>
      </Section>

      <Section titulo="Tus derechos">
        <p>
          Puedes conocer, actualizar, rectificar o solicitar la eliminación de tus datos;
          pedir prueba de tu autorización; conocer el uso dado a la información; revocar el
          consentimiento y presentar consultas o reclamos escribiéndonos a{' '}
          <a href="mailto:soportemanifiesta.app@gmail.com" className="underline underline-offset-2">
            soportemanifiesta.app@gmail.com
          </a>
          . Si resides en EE.UU. puedes acudir ante la FTC; si estás en California, también
          aplican tus derechos bajo la CCPA.
        </p>
        <p className="mt-3">
          Para eliminar tu cuenta y todos tus datos, ve a{' '}
          <strong>Perfil → Eliminar cuenta</strong> dentro de la app, o escríbenos y lo
          hacemos en menos de 48 horas. Si resides en California, también puedes ejercer tus
          derechos bajo la CCPA (California Consumer Privacy Act) escribiéndonos al mismo
          correo.
        </p>
      </Section>

      <Section titulo="Seguridad y menores">
        <p>
          Aplicamos autenticación, controles por usuario, cifrado en tránsito, claves privadas
          de servidor y minimización de datos. Ningún sistema es infalible. MANIFIESTA no está
          dirigida a menores de 18 años.
        </p>
      </Section>

      <Section titulo="Avisos de cambios">
        <p>
          Si modificamos esta política de forma significativa, te lo avisamos por correo antes
          de que el cambio entre en vigor. La fecha de "última actualización" siempre refleja
          la versión vigente.
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
        <Link href="/terminos" className="underline underline-offset-2">Términos de servicio</Link>
        <Link href="/reembolsos" className="underline underline-offset-2">Política de reembolsos</Link>
        <Link href="/aviso-ia" className="underline underline-offset-2">Aviso de IA</Link>
        <a href="mailto:soportemanifiesta.app@gmail.com" className="underline underline-offset-2">Contacto</a>
      </nav>
    </footer>
  );
}
