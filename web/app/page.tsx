'use client';

// MANIFIESTA — con Victoria
// Landing v2: 11 secciones canónicas, paleta marfil + Rosa Victoria como acento.

import { Hero } from '@/components/landing/Hero';
import { Demo } from '@/components/landing/Demo';
import { Problema } from '@/components/landing/Problema';
import { Mecanismo } from '@/components/landing/Mecanismo';
import { Diferenciacion } from '@/components/landing/Diferenciacion';
import { FeelInside } from '@/components/landing/FeelInside';
import { CtaEmocional } from '@/components/landing/CtaEmocional';
import { Oferta } from '@/components/landing/Oferta';
import { Faq } from '@/components/landing/Faq';
import { CtaFinal } from '@/components/landing/CtaFinal';
import { FooterLegal } from '@/components/landing/FooterLegal';
import { StickyCtaMobile } from '@/components/landing/ui';

const CTA_HREF = '/onboarding';
const CTA_LABEL_HERO    = 'Probar MANIFIESTA gratis 7 días';
const CTA_LABEL         = 'Probar gratis 7 días';
const CTA_LABEL_PRICING = 'Empezar mis 7 días gratis';
const CTA_LABEL_CIERRE  = 'Empezar mis 7 días gratis';

const FAQ_ITEMS = [
  {
    pregunta: '¿Necesito tarjeta para probar MANIFIESTA?',
    respuesta:
      'Sí. Para comenzar los 7 días gratis debes registrar tu método de pago. Hoy no se realiza ningún cobro.',
  },
  {
    pregunta: '¿Cuándo me cobran?',
    respuesta:
      'Tu prueba comienza el día que te registras. Si decides continuar, el plan que hayas elegido se cobra al finalizar los 7 días gratuitos.',
  },
  {
    pregunta: '¿Cómo cancelo?',
    respuesta:
      'Puedes cancelar antes de que termine tu prueba desde Hotmart. Si cancelas antes del día 7, no se realiza el cobro de la suscripción.',
  },
  {
    pregunta: '¿En qué se diferencia de una app de afirmaciones?',
    respuesta:
      'Las apps de afirmaciones suelen mostrar frases creadas para temas generales. MANIFIESTA empieza con lo que tú quieres manifestar. Victoria utiliza ese deseo para crear una práctica que puede combinar afirmación, scripting, ritual y una acción concreta.',
  },
  {
    pregunta: '¿Cuánto tiempo necesito cada día?',
    respuesta:
      'Las prácticas están diseñadas para integrarse fácilmente en tu día. No necesitas pasar una hora haciendo rituales. La idea es que puedas abrir MANIFIESTA, hacer tu práctica y continuar con tu día.',
  },
  {
    pregunta: '¿Qué pasa si un día no practico?',
    respuesta:
      'Nada. No pierdes tu proceso ni tienes que volver a empezar. Victoria continúa desde donde estás.',
  },
  {
    pregunta: '¿Y si hoy necesito trabajar algo diferente?',
    respuesta:
      'Para eso existe "Necesito manifestar…". Cuéntale a Victoria qué necesitas en ese momento y recibe una práctica específica.',
  },
  {
    pregunta: '¿MANIFIESTA garantiza que lo que pida se manifestará?',
    respuesta:
      'No. MANIFIESTA no promete resultados mágicos ni puede controlar circunstancias externas. Te ayuda a convertir tus intenciones en prácticas, reflexión y acciones que puedas incorporar a tu vida.',
  },
];

export default function LandingManifiesta() {
  return (
    <div className="min-h-dvh" style={{ background: 'var(--bg)', color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}>

      {/* 1. HERO */}
      <Hero
        appName="MANIFIESTA"
        loginHref="/entrar"
        loginLabel="Ya tengo cuenta"
        ctaLabel={CTA_LABEL_HERO}
        ctaHref={CTA_HREF}
        socialProof="7 días gratis · Hoy $0"
      />

      {/* 2. DEMO — producto visible pronto */}
      <Demo />

      {/* 3. PROBLEMA */}
      <Problema />

      {/* 4. MECANISMO */}
      <Mecanismo />

      {/* 5. DIFERENCIACIÓN */}
      <Diferenciacion />

      {/* 6. ASÍ SE SIENTE POR DENTRO */}
      <FeelInside />

      {/* 7. CTA EMOCIONAL */}
      <CtaEmocional ctaLabel={CTA_LABEL} ctaHref={CTA_HREF} />

      {/* 8. PRICING */}
      <Oferta ctaLabel={CTA_LABEL_PRICING} ctaHref={CTA_HREF} />

      {/* 9. FAQ */}
      <Faq titulo="Lo que quizá quieras saber" items={FAQ_ITEMS} />

      {/* 10. CIERRE */}
      <CtaFinal ctaLabel={CTA_LABEL_CIERRE} ctaHref={CTA_HREF} />

      {/* FOOTER LEGAL */}
      <FooterLegal
        appName="MANIFIESTA — con Victoria"
        soporteEmail="soportemanifiesta.app@gmail.com"
        enlaces={[
          { label: 'Privacidad', href: '/privacidad' },
          { label: 'Términos', href: '/terminos' },
          { label: 'Reembolsos', href: '/reembolsos' },
          { label: 'Aviso de IA', href: '/aviso-ia' },
        ]}
      />

      <StickyCtaMobile labelComercial={CTA_LABEL_HERO} href={CTA_HREF} />
    </div>
  );
}
