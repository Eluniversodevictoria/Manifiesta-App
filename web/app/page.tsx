'use client';

// MANIFIESTA — con Victoria
// Página de ventas: 10 secciones canónicas (19-PAGINA-DE-VENTAS.md)
// Copy trazado a FICHA-AVATAR.md · Big Idea: "La Práctica de Victoria"
// Modelo 2 (onboarding-first): CTA → /onboarding

import {
  BookOpen,
  CalendarCheck,
  Flame,
  Heart,
  HelpCircle,
  Sparkles,
  Star,
  Wand2,
} from 'lucide-react';
import { Hero } from '@/components/landing/Hero';
import { Problema } from '@/components/landing/Problema';
import { Agitacion } from '@/components/landing/Agitacion';
import { Solucion } from '@/components/landing/Solucion';
import { AppPorDentro } from '@/components/landing/AppPorDentro';
import { Oferta } from '@/components/landing/Oferta';
import { Garantia } from '@/components/landing/Garantia';
import { Faq } from '@/components/landing/Faq';
import { CtaFinal } from '@/components/landing/CtaFinal';
import { FooterLegal } from '@/components/landing/FooterLegal';
import { StickyCtaMobile } from '@/components/landing/ui';

const CTA_HREF = '/onboarding';
const CTA_LABEL = 'Crear mi primera práctica gratis';

export default function LandingManifiesta() {
  return (
    <div
      className="min-h-dvh"
      style={{
        background: 'var(--bg)',
        color: 'var(--text-primary)',
        fontFamily: 'var(--font-body)',
      }}
    >
      {/* ── 1. HERO ── */}
      <Hero
        appName="MANIFIESTA"
        loginHref="/entrar"
        loginLabel="Ya tengo cuenta"
        h1Marked="Victoria te dice qué [acento]practicar hoy[/acento] para manifestar"
        subtitleMarked="Escribe lo que quieres atraer y recibe [b]una práctica completa[/b] para ese deseo"
        ctaLabel={CTA_LABEL}
        ctaHref={CTA_HREF}
        socialProof={
          <span>Sin tarjeta · Tu primera práctica es completamente gratis</span>
        }
        visualPlaceholderSugerencia="pantalla de práctica del día generada: afirmación, ritual, scripting y acción concreta para el deseo de la usuaria"
      />

      {/* ── 2. PROBLEMA ── */}
      <Problema
        titulo="¿Te suena alguna de estas?"
        preguntas={[
          {
            icon: BookOpen,
            textoMarked:
              '¿Llevas meses consumiendo contenido espiritual pero sin [b]una práctica real[/b]?',
          },
          {
            icon: Flame,
            textoMarked:
              '¿Empezaste afirmaciones, scripting o rituales y los dejaste a la semana?',
          },
          {
            icon: HelpCircle,
            textoMarked:
              '¿Sabes todo lo que tienes que hacer pero no sabes [b]por dónde empezar hoy[/b]?',
          },
          {
            icon: Heart,
            textoMarked:
              '¿Sientes que a otras personas les funciona la manifestación pero a ti no?',
          },
        ]}
      />

      {/* ── 3. AGITACIÓN ── */}
      <Agitacion
        frases={[
          'Cada semana consumes inspiración que se evapora antes de que empiece el día.',
          'Sin una práctica tuya, específica para lo que quieres, seguirás en el mismo punto.',
          'No te falta voluntad. Te falta [acento]alguien que te diga qué hacer hoy[/acento].',
        ]}
        contraste={{
          labelHoy: 'Hoy',
          hoy: 'Mucho contenido, cero práctica consistente. La manifestación "no te funciona".',
          labelFuturo: 'En 3 meses, si nada cambia',
          futuro: 'Sigues consumiendo. Sigues sin ver evidencia. Sigues dudando de ti.',
        }}
      />

      {/* ── 4. SOLUCIÓN — mecanismo bautizado: "La Práctica de Victoria" ── */}
      <Solucion
        kicker="EL MECANISMO"
        tituloMarked="Tu práctica de hoy, [acento]diseñada para ti[/acento]"
        mecanismo="La Práctica de Victoria"
        bigIdeaMarked="No te falta disciplina: te falta una práctica que sea [b]tuya[/b]. Victoria la crea en el momento para tu deseo específico."
        pasos={[
          {
            titulo: 'Escribe tu deseo',
            detalle: 'Dile a Victoria qué quieres atraer hoy.',
          },
          {
            titulo: 'Victoria lo prepara',
            detalle: 'Genera afirmación, ritual, scripting y acción concreta.',
          },
          {
            titulo: 'Lo practicas en 10 minutos',
            detalle: 'Queda guardado en tu historial de manifestaciones.',
          },
        ]}
        antesDespues={{
          labelAntes: 'Antes',
          antes: 'Afirmaciones genéricas que no se sienten tuyas. Práctica que dura 3 días.',
          labelDespues: 'Con MANIFIESTA',
          despues: 'Una práctica creada para tu deseo de hoy. Victoria recuerda lo que quieres.',
        }}
      />

      {/* ── 5. LA APP POR DENTRO ── */}
      <AppPorDentro
        tituloMarked="Así se ve [acento]tu práctica[/acento] cada día"
        frames={[
          {
            label: 'Escribe tu deseo',
            nombrePantalla: 'Mi deseo de hoy',
          },
          {
            label: 'Tu práctica del día',
            nombrePantalla: 'Afirmación + ritual + acción',
          },
          {
            label: '"Necesito manifestar…"',
            nombrePantalla: 'Práctica urgente al instante',
          },
          {
            label: 'Mis manifestaciones',
            nombrePantalla: 'Seguimiento + "Se manifestó ✨"',
          },
        ]}
        ctaLabel={CTA_LABEL}
        ctaHref={CTA_HREF}
      />

      {/* ── 6. OFERTA ── */}
      <Oferta
        kicker="LA OFERTA"
        tituloMarked="Empieza gratis. Sigue por [acento]$0.26 al día[/acento]"
        stack={{
          lineas: [
            {
              resultado: 'Práctica diaria personalizada por Victoria (12 meses)',
              valor: '$96',
            },
            {
              resultado: '"Necesito manifestar…" — práctica al instante cuando lo necesitas',
              valor: '$48',
            },
            {
              resultado: 'Biblioteca completa: rituales, decretos, scripting, señales',
              valor: '$29',
            },
            {
              resultado: 'Historial de manifestaciones + botón "Se manifestó ✨"',
              valor: '$19',
            },
          ],
          totalTachado: '$192',
          nota: 'Hoy: $7.99/mes o $59.99/año',
        }}
        anual={{
          nombre: 'Anual',
          badge: 'MÁS POPULAR',
          precioMes: '$5',
          totalAnual: 'Se cobra $59.99/año',
          ahorro: '2 meses gratis',
          descomposicionDia: 'menos de $0.20 al día',
          ctaLabel: CTA_LABEL,
          ctaHref: CTA_HREF,
          features: [
            'Práctica diaria personalizada sin límite',
            '"Necesito manifestar…" al instante',
            'Biblioteca completa de rituales y decretos',
            'Historial + seguimiento de manifestaciones',
            'Botón "Se manifestó ✨" con celebración',
            'Journaling conectado a cada deseo',
          ],
        }}
        mensual={{
          nombre: 'Mensual',
          precioMes: '$7.99',
          ctaLabel: 'Elegir mensual',
          ctaHref: CTA_HREF,
          features: [
            'Práctica diaria personalizada sin límite',
            '"Necesito manifestar…" al instante',
            'Biblioteca completa de rituales y decretos',
            'Cancelas cuando quieras',
          ],
        }}
      />

      {/* ── 7. GARANTÍA ── */}
      <Garantia
        nombre="la Garantía de la Primera Práctica Real"
        condicionMarked="Si en 7 días La Práctica de Victoria no te da [b]una práctica que se sienta tuya[/b], escribes un mensaje y te devolvemos todo. Sin preguntas."
        pisoLegal="Respaldada por la política de reembolso de Hotmart — 7 días"
        icon={Star}
      />

      {/* ── 8. FAQ ── */}
      <Faq
        items={[
          {
            pregunta: '¿En qué se diferencia de otras apps de afirmaciones?',
            respuestaMarked:
              'Las demás apps te mandan afirmaciones genéricas para todo el mundo. MANIFIESTA [b]crea una práctica para tu deseo específico de hoy[/b] — Victoria recuerda lo que quieres y adapta cada práctica a tu situación real.',
          },
          {
            pregunta: '¿Cuánto tiempo me lleva cada día?',
            respuestaMarked:
              'La Práctica de Victoria está diseñada para [b]10 minutos o menos[/b]. Puedes hacerla a la mañana, en el almuerzo o antes de dormir.',
          },
          {
            pregunta: '¿Qué pasa si un día no practico?',
            respuestaMarked:
              'Nada se borra, nada se reinicia. Tu historial y tus manifestaciones siguen ahí. [b]No hay culpa, no hay empezar de cero[/b] — Victoria retoma donde quedaste.',
          },
          {
            pregunta: '¿Para qué tipo de deseos funciona?',
            respuestaMarked:
              'Para cualquier deseo concreto: dinero, trabajo, amor, negocio, hogar, viaje, una oportunidad específica. Mientras más [b]específica sea tu intención, más personalizada es la práctica[/b].',
          },
          {
            pregunta: '¿Y si quiero manifestar algo urgente que no es "del día"?',
            respuestaMarked:
              'Para eso existe [b]"Necesito manifestar…"[/b]: escribes exactamente lo que estás viviendo o quieres conseguir y Victoria crea una práctica en el momento, adaptada a esa situación.',
          },
          {
            pregunta: '¿Qué pasa si no me sirve?',
            respuestaMarked:
              'Tienes 7 días de prueba con la Garantía de la Primera Práctica Real: [b]un mensaje y te devolvemos todo[/b].',
          },
        ]}
      />

      {/* ── 9. CTA FINAL ── */}
      <CtaFinal
        h2Marked="Imagina saber [acento]exactamente qué practicar[/acento] hoy"
        futurePacingMarked="Mañana te despiertas, escribes tu deseo y Victoria ya sabe qué necesitas. [b]Tu práctica lista en segundos[/b]."
        ctaLabel={CTA_LABEL}
        ctaHref={CTA_HREF}
        recap="Primera práctica gratis · Garantía de 7 días · Sin tarjeta"
        psMarked="PS: Llevas tiempo sabiendo lo que quieres. MANIFIESTA con Victoria es el único lugar donde una práctica completa — afirmación, ritual, scripting y una acción real — se crea [b]para tu deseo de hoy[/b]. Entra gratis y compruébalo."
      />

      {/* ── 10. FOOTER LEGAL ── */}
      <FooterLegal
        appName="MANIFIESTA — con Victoria"
        soporteEmail="hola@manifiesta.app"
        enlaces={[
          { label: 'Privacidad', href: '/privacidad' },
          { label: 'Términos', href: '/terminos' },
          { label: 'Reembolsos', href: '/reembolsos' },
          { label: 'Aviso de IA', href: '/aviso-ia' },
        ]}
      />

      {/* Sticky CTA mobile */}
      <StickyCtaMobile labelComercial={CTA_LABEL} href={CTA_HREF} />
    </div>
  );
}
