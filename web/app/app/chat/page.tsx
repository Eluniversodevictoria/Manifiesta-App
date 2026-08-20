'use client';

// Chat con Victoria — exclusivo Pro
// Ventana deslizante de 10 mensajes. Límite 30/mes en servidor.

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Bot, Lock, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type Mensaje = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

function renderMarkdown(texto: string): React.ReactNode[] {
  return texto.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
    part.startsWith('**') && part.endsWith('**')
      ? <strong key={i}>{part.slice(2, -2)}</strong>
      : <span key={i}>{part}</span>
  );
}

function BurbujaMensaje({ msg, idx }: { msg: Mensaje; idx: number }) {
  const esVictoria = msg.role === 'assistant';
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.04, duration: 0.22 }}
      className={`flex gap-2 ${esVictoria ? 'justify-start' : 'justify-end'}`}
    >
      {esVictoria && (
        <div
          className="flex size-8 shrink-0 items-center justify-center rounded-full self-end"
          style={{ background: 'var(--accent)' }}
          aria-hidden="true"
        >
          <span className="text-sm text-white select-none">✦</span>
        </div>
      )}
      <div
        className="max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed"
        style={esVictoria
          ? {
              background: 'var(--surface)',
              color: 'var(--text-primary)',
              borderBottomLeftRadius: 4,
              border: '1px solid color-mix(in oklab, var(--accent) 16%, transparent)',
            }
          : {
              background: 'var(--accent)',
              color: 'white',
              borderBottomRightRadius: 4,
              boxShadow: '0 2px 8px color-mix(in oklab, var(--accent) 30%, transparent)',
            }
        }
      >
        {esVictoria ? renderMarkdown(msg.content) : msg.content}
      </div>
    </motion.div>
  );
}

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
      className="flex items-center gap-2"
    >
      <div
        className="flex size-8 shrink-0 items-center justify-center rounded-full"
        style={{ background: 'var(--accent)' }}
        aria-hidden="true"
      >
        <span className="text-sm text-white select-none">✦</span>
      </div>
      <div
        className="flex items-center gap-1 rounded-2xl px-4 py-3"
        style={{ background: 'var(--surface)', borderBottomLeftRadius: 4 }}
      >
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="block size-1.5 rounded-full"
            style={{ background: 'var(--text-tertiary)' }}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2 }}
          />
        ))}
      </div>
    </motion.div>
  );
}

function ProGate({ onUpgrade }: { onUpgrade: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 text-center gap-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 18, stiffness: 280 }}
        className="flex size-20 items-center justify-center rounded-full"
        style={{
          background: 'radial-gradient(ellipse 80% 80% at 30% 20%, var(--accent-2) 0%, color-mix(in oklab, var(--accent) 8%, transparent) 100%)',
          border: '1.5px solid color-mix(in oklab, var(--accent) 24%, transparent)',
          boxShadow: '0 4px 20px color-mix(in oklab, var(--accent) 15%, transparent)',
        }}
      >
        <Lock size={32} color="var(--accent)" strokeWidth={1.6} />
      </motion.div>
      <div>
        <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
          Chat con Victoria
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          Habla directamente con Victoria sobre tu proceso, tus manifestaciones o cualquier duda de tu práctica. Disponible en el plan Pro.
        </p>
      </div>
      <button
        type="button"
        onClick={onUpgrade}
        className="w-full max-w-xs py-4 rounded-2xl font-bold text-white text-base [touch-action:manipulation]"
        style={{ background: 'var(--accent)' }}
      >
        Activar Pro ✦
      </button>
      <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
        7 días gratis · cancela cuando quieras
      </p>
    </div>
  );
}

export default function ChatPage() {
  const router = useRouter();
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [input, setInput] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [estado, setEstado] = useState<'ok' | 'pro_required' | 'limit_reached' | 'error'>('ok');
  const [usados, setUsados] = useState(0);
  const limite = 30;

  // Altura del composer para calcular el paddingBottom de la lista
  const [composerH, setComposerH] = useState(80);

  const bottomRef   = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const composerRef = useRef<HTMLDivElement>(null);

  const scrollBottom = useCallback(() => {
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 80);
  }, []);

  // Medir alto real del composer cuando cambia (teclado abierto/cerrado, sugerencias)
  useEffect(() => {
    if (!composerRef.current) return;
    const ro = new ResizeObserver(() => {
      setComposerH(composerRef.current?.offsetHeight ?? 80);
    });
    ro.observe(composerRef.current);
    return () => ro.disconnect();
  }, []);

  // Scroll al fondo cuando se abre teclado (visualViewport shrinks)
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const onResize = () => scrollBottom();
    vv.addEventListener('resize', onResize);
    return () => vv.removeEventListener('resize', onResize);
  }, [scrollBottom]);

  // Cargar historial inicial
  useEffect(() => {
    fetch('/api/chat')
      .then(r => {
        if (r.status === 401) { router.push('/entrar'); return null; }
        return r.json();
      })
      .then(data => {
        if (!data) return;
        setCargando(false);
        if (data.error === 'pro_required') { setEstado('pro_required'); return; }
        const hist: Mensaje[] = (data.historial ?? []).map((m: { id: string; role: 'user' | 'assistant'; content: string }) => ({
          id: m.id,
          role: m.role,
          content: m.content,
        }));
        if (hist.length === 0) {
          setMensajes([{
            id: 'welcome',
            role: 'assistant',
            content: 'Hola ✦ Soy Victoria, una guía de IA. Estoy aquí para acompañarte en tu práctica de manifestación. ¿En qué quieres que trabajemos hoy?',
          }]);
        } else {
          setMensajes(hist);
        }
        setUsados(data.mensajesUsados ?? 0);
      })
      .catch(() => { setCargando(false); setEstado('error'); });
  }, [router]);

  useEffect(() => { if (!cargando) scrollBottom(); }, [mensajes, cargando, scrollBottom]);

  const handleEnviar = useCallback(async () => {
    const texto = input.trim();
    if (!texto || enviando) return;

    const msgUser: Mensaje = { id: `u-${Date.now()}`, role: 'user', content: texto };
    setMensajes(prev => [...prev, msgUser]);
    setInput('');
    // Reset textarea height
    if (textareaRef.current) { textareaRef.current.style.height = 'auto'; }
    setEnviando(true);
    scrollBottom();

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: texto }),
      });
      const data = await res.json();

      if (res.status === 403) { setEstado('pro_required'); setEnviando(false); return; }
      if (res.status === 429) { setEstado('limit_reached'); setEnviando(false); return; }
      if (!res.ok) throw new Error(data.error);

      const msgVictoria: Mensaje = { id: `a-${Date.now()}`, role: 'assistant', content: data.respuesta };
      setMensajes(prev => [...prev, msgVictoria]);
      setUsados(data.mensajesUsados ?? usados + 1);
    } catch {
      setMensajes(prev => [...prev, {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: 'Hubo un problema al conectar. Intenta en un momento.',
      }]);
    } finally {
      setEnviando(false);
      scrollBottom();
    }
  }, [input, enviando, usados, scrollBottom]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleEnviar();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  };

  if (cargando) {
    return (
      <div className="flex min-h-dvh items-center justify-center" style={{ background: 'var(--bg)' }}>
        <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.4 }}
          className="text-2xl" aria-hidden="true">✦</motion.div>
      </div>
    );
  }

  return (
    /*
     * Layout de chat con teclado:
     * - El contenedor ocupa exactamente la ventana visual (dvh en desktop, visualViewport en mobile).
     * - El composer está fijo en la parte inferior, siempre sobre el teclado.
     * - La lista de mensajes ocupa el espacio restante y hace scroll interno.
     * - El botón flotante (?) del layout global está oculto vía CSS en esta ruta.
     */
    <div
      className="flex flex-col chat-page-root"
      style={{
        background: 'var(--bg)',
        fontFamily: 'var(--font-body)',
        color: 'var(--text-primary)',
        // Altura = ventana visual (se encoge cuando el teclado sube)
        height: '100dvh',
        // Anclar al viewport visual para que el composer siga el teclado
        position: 'fixed',
        inset: 0,
        overflowY: 'hidden',
      }}
    >
      {/* Header */}
      <div
        className="flex-shrink-0 flex items-center gap-3 px-4 pt-12 pb-3"
        style={{
          background: 'var(--bg)',
          borderBottom: '1px solid color-mix(in oklab, var(--text-tertiary) 12%, transparent)',
        }}
      >
        <Link
          href="/app"
          aria-label="Volver"
          className="flex size-9 items-center justify-center rounded-full flex-shrink-0"
          style={{ background: 'var(--surface)' }}
        >
          <ChevronLeft size={18} color="var(--text-secondary)" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span
              className="text-base font-bold"
              style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
            >
              Victoria
            </span>
            <span
              className="rounded-full px-2 py-0.5 text-xs font-semibold"
              style={{ background: 'color-mix(in oklab, var(--accent) 12%, transparent)', color: 'var(--accent)' }}
            >
              IA
            </span>
          </div>
          <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
            {estado === 'ok'
              ? `${usados}/${limite} mensajes este mes`
              : estado === 'limit_reached'
              ? 'Límite mensual alcanzado'
              : 'Guía de manifestación'}
          </p>
        </div>
        <div
          className="flex size-9 shrink-0 items-center justify-center rounded-full"
          style={{
            background: 'color-mix(in oklab, var(--accent) 10%, transparent)',
            border: '1px solid color-mix(in oklab, var(--accent) 22%, transparent)',
          }}
          aria-hidden="true"
        >
          <span style={{ color: 'var(--accent)', fontSize: 14 }}>✦</span>
        </div>
      </div>

      {/* Aviso de IA */}
      {estado === 'ok' && mensajes.length <= 1 && (
        <div
          className="flex-shrink-0 mx-4 mt-3 rounded-2xl px-4 py-3 text-xs leading-relaxed text-center"
          style={{
            background: 'color-mix(in oklab, var(--accent) 6%, transparent)',
            color: 'var(--text-tertiary)',
            border: '1px solid color-mix(in oklab, var(--accent) 12%, transparent)',
          }}
        >
          Victoria es una IA. Sus respuestas son orientación espiritual, no asesoría profesional.
        </div>
      )}

      {/* Cuerpo */}
      {estado === 'pro_required' ? (
        <ProGate onUpgrade={() => router.push('/app/perfil')} />
      ) : (
        <>
          {/* Lista de mensajes — scroll interno, crece hasta llenar espacio disponible */}
          <div
            className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4 min-h-0"
            style={{ paddingBottom: 16 }}
          >
            <AnimatePresence initial={false}>
              {mensajes.map((msg, i) => (
                <BurbujaMensaje key={msg.id} msg={msg} idx={i} />
              ))}
              {enviando && <TypingIndicator key="typing" />}
            </AnimatePresence>

            {estado === 'limit_reached' && (
              <motion.div
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl px-4 py-4 text-sm text-center leading-relaxed"
                style={{ background: 'color-mix(in oklab, var(--accent) 8%, transparent)', color: 'var(--text-secondary)' }}
              >
                Llegaste al límite de {limite} mensajes este mes ✦<br />
                <span style={{ color: 'var(--text-tertiary)', fontSize: 12 }}>
                  El 1 del mes se renueva automáticamente.
                </span>
              </motion.div>
            )}

            <div ref={bottomRef} aria-hidden="true" />
          </div>

          {/* Composer — pegado al fondo, sobre el teclado */}
          {estado !== 'limit_reached' && (
            <div
              ref={composerRef}
              className="flex-shrink-0 px-4"
              style={{
                paddingTop: 12,
                paddingBottom: `max(16px, env(safe-area-inset-bottom))`,
                background: 'var(--bg)',
                borderTop: '1px solid color-mix(in oklab, var(--text-tertiary) 12%, transparent)',
              }}
            >
              {/* Sugerencias rápidas (solo al inicio) */}
              {mensajes.length <= 1 && (
                <div className="flex gap-2 mb-2 overflow-x-auto pb-1 scrollbar-none">
                  {[
                    '¿Cómo va mi proceso?',
                    'Dame una afirmación de hoy',
                    'Necesito motivación',
                  ].map((sug) => (
                    <button
                      key={sug}
                      type="button"
                      onClick={() => { setInput(sug); textareaRef.current?.focus(); }}
                      className="shrink-0 rounded-full px-3 py-1.5 text-xs font-medium [touch-action:manipulation]"
                      style={{
                        background: 'var(--surface)',
                        color: 'var(--text-secondary)',
                        border: '1px solid color-mix(in oklab, var(--text-tertiary) 20%, transparent)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              )}

              <div
                className="flex items-end gap-2 rounded-2xl px-4 py-3"
                style={{ background: 'var(--surface)' }}
              >
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={handleInput}
                  onKeyDown={handleKeyDown}
                  onFocus={scrollBottom}
                  placeholder="Escríbele a Victoria…"
                  rows={1}
                  className="flex-1 resize-none bg-transparent text-sm leading-relaxed outline-none"
                  style={{ color: 'var(--text-primary)', maxHeight: 120 }}
                  aria-label="Mensaje para Victoria"
                />
                <motion.button
                  type="button"
                  onClick={handleEnviar}
                  disabled={!input.trim() || enviando}
                  whileTap={{ scale: 0.88 }}
                  className="flex size-9 shrink-0 items-center justify-center rounded-full [touch-action:manipulation]"
                  style={{
                    background: input.trim() && !enviando ? 'var(--accent)' : 'color-mix(in oklab, var(--text-tertiary) 15%, transparent)',
                    transition: 'background 0.2s',
                  }}
                  aria-label="Enviar mensaje"
                >
                  <Send size={15} color={input.trim() && !enviando ? 'white' : 'var(--text-tertiary)'} strokeWidth={2} />
                </motion.button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
