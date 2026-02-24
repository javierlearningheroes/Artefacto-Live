import { useState, useEffect, useRef } from "react";

// ═══════════════════════════════════════════════════════════════
// ESCALETA INTERACTIVA — DÍAS 5, 6 y 7 — IA HEROES LIVE 14
// Herramienta interna para formadores Learning Heroes
// ═══════════════════════════════════════════════════════════════

const COLORS = {
  cyan: "#61F2F2",
  magenta: "#FF2878",
  dark: "#243F4C",
  black: "#000000",
  white: "#FFFFFF",
};

// ─── Datos ────────────────────────────────────────────────────

const DAY5 = {
  num: 5,
  title: "Gana dinero gracias a los agentes de IA",
  date: "27 Feb 2026",
  icon: "💰",
  gradient: `linear-gradient(135deg, ${COLORS.dark} 0%, #1a5c6e 50%, ${COLORS.cyan} 100%)`,
  blocks: [
    {
      id: "intro5",
      name: "Introducción",
      icon: "🎬",
      time: "19:05 — 5'",
      items: [
        { topic: "Bienvenida + recap Día 4", desc: "Ayer vimos IA generativa y creatividad. Hoy: cómo GANAR DINERO con IA.", type: "talk" },
        { topic: "Enhorabuena", desc: "Sois los que de verdad queréis resultados.", type: "talk" },
        { topic: "¿Qué veremos hoy?", desc: "Consultoría IA, auditoría de negocio real, ROI, vibe coding.", type: "talk" },
        { topic: "Recordar Regalos — Golden Ticket", desc: "", type: "promo" },
      ],
    },
    {
      id: "consultoria",
      name: "El valor de la consultoría IA",
      icon: "🧠",
      time: "15'",
      items: [
        { topic: "Repaso de Agentes del Jueves", desc: "¿Cómo convertir los agentes que vimos en un negocio real?", type: "talk", mins: 5 },
        { topic: "Cómo creamos valor con IA", desc: "Dos caminos: mejorar un proceso existente o proveer una solución IA nueva.", type: "concept", mins: 5 },
        { topic: "Concepto de ROI", desc: "Si la IA ahorra 10.000€/mes al cliente, puedes cobrar un 20-30% de ese ahorro. Modelo de negocio del consultor IA.", type: "concept", mins: 5 },
      ],
    },
    {
      id: "auditoria",
      name: "Auditoría Zara / Inditex",
      icon: "🔍",
      time: "23'",
      items: [
        { topic: "Auditoría a mano", desc: "El proceso del consultor IA paso a paso. Identificar cuellos de botella en operaciones, supply chain, atención al cliente.", type: "demo", mins: 8 },
        { topic: "Auditoría con artefacto IA Heroes", desc: "Deep Research + análisis automatizado de Zara. Demo en directo del artefacto.", type: "demo", mins: 10 },
        { topic: "Propuesta de agentes", desc: "Workforce de Relevance AI para Zara. Cómo presentar la propuesta de valor al cliente.", type: "demo", mins: 5 },
      ],
    },
    {
      id: "venta5",
      name: "IA Heroes PRO",
      icon: "🎓",
      time: "12'",
      items: [
        { topic: "Programa completo", desc: "8 meses, 60 ECTS, título universitario.", type: "venta" },
        { topic: "Titulación + Masterclass", desc: "Universidad + masterclass exclusivas con expertos del sector.", type: "venta" },
        { topic: "Precio y objeciones", desc: "Inversión, formas de pago, ¿podré conseguirlo?, ¿es para mí?", type: "venta" },
        { topic: "Reserva tu plaza", desc: "CTA con equipo de admisiones.", type: "cta" },
      ],
    },
    {
      id: "vibecoding5",
      name: "Vibe Coding (Preview)",
      icon: "💻",
      time: "25'",
      items: [
        { topic: "¿Estos agentes dónde viven?", desc: "Necesitan un hogar digital. Intro al concepto de Vibe Coding.", type: "talk", mins: 5 },
        { topic: "Demo: Web en Lovable", desc: "Crear una web con prompt de ChatGPT + Lovable. El agente necesita una casa.", type: "demo", mins: 10 },
        { topic: "Integrar agentes en la web", desc: "Conectar el agente al producto digital.", type: "demo", mins: 5 },
        { topic: "Stack de herramientas", desc: "Herramientas empresa: edición, reunión virtual, productividad.", type: "talk", mins: 5 },
      ],
    },
    {
      id: "cierre5",
      name: "Despedida",
      icon: "👋",
      time: "5'",
      items: [
        { topic: "Despedida Final", desc: "Motivación + anticipo Día 6: mañana Vibe Coding a fondo, vamos a CONSTRUIR.", type: "talk" },
      ],
    },
  ],
};

const DAY6 = {
  num: 6,
  title: "Vibe Coding: crea apps sin saber programar",
  date: "28 Feb 2026",
  icon: "⚡",
  gradient: `linear-gradient(135deg, ${COLORS.dark} 0%, #4a1942 50%, ${COLORS.magenta} 100%)`,
  blocks: [
    {
      id: "intro6",
      name: "Introducción",
      icon: "🎬",
      time: "8'",
      items: [
        { topic: "Bienvenida + recap Día 5", desc: "Ayer vimos cómo auditar un negocio. Hoy vamos a CONSTRUIR.", type: "talk", mins: 5 },
        { topic: "¿Qué es el Vibe Coding?", desc: "Programar sin saber programar. La revolución 2025-2026.", type: "concept", mins: 3 },
      ],
    },
    {
      id: "anatomia",
      name: "Anatomía de un Producto Digital",
      icon: "🧬",
      time: "10'",
      items: [
        { topic: "Frontend, Backend, API", desc: "Lo que ve el usuario, la lógica interna, la conexión. Explicación visual muy simple.", type: "concept", mins: 5 },
        { topic: "El flujo correcto", desc: "1) PRD → 2) Preview/Prototipo → 3) App completa. No saltar pasos.", type: "concept", mins: 3 },
        { topic: "Presentamos el reto", desc: "Javier y Alex crean el MISMO producto digital, cada uno con sus herramientas.", type: "talk", mins: 2 },
      ],
    },
    {
      id: "demoA",
      name: "Demo A — ChatGPT Canvas",
      icon: "🔵",
      time: "18'",
      trainer: "Javier",
      items: [
        { topic: "PRD en ChatGPT", desc: "Crea un Product Requirements Document dentro de ChatGPT. Objetivo, funcionalidades, usuario target, flujo.", type: "demo", mins: 10 },
        { topic: "Preview en ChatGPT Canvas", desc: "Genera una preview/prototipo visual a partir del PRD. Resultado interactivo.", type: "demo", mins: 8 },
      ],
    },
    {
      id: "demoB",
      name: "Demo B — Claude Artifacts",
      icon: "🟣",
      time: "18'",
      trainer: "Alex",
      items: [
        { topic: "PRD en Claude", desc: "Crea el mismo PRD dentro de Claude. Diferencias de enfoque respecto a ChatGPT.", type: "demo", mins: 10 },
        { topic: "Preview en Claude Artifacts", desc: "Genera una preview interactiva a partir del PRD. Compara resultado.", type: "demo", mins: 8 },
      ],
    },
    {
      id: "comparacion1",
      name: "Comparación + Venta",
      icon: "⚖️",
      time: "15'",
      items: [
        { topic: "Comparación resultados", desc: "Arnau compara ambos en pantalla. Dos caminos, mismo destino. Ventajas de cada uno.", type: "talk", mins: 3 },
        { topic: "IA Heroes PRO — Venta", desc: "En el programa aprenderás a construir productos digitales, automatizar negocios y monetizar la IA.", type: "venta", mins: 12 },
      ],
    },
    {
      id: "descanso6",
      name: "Descanso",
      icon: "⏸️",
      time: "5'",
      items: [
        { topic: "Pausa + Encuesta", desc: "¿Qué herramienta te ha gustado más? ChatGPT Canvas vs Claude Artifacts.", type: "break" },
      ],
    },
    {
      id: "vibecoding2",
      name: "Vibe Coding II — Apps Reales",
      icon: "🚀",
      time: "31'",
      items: [
        { topic: "Intro parte 2", desc: "Ahora viene lo potente: convertir esos prototipos en apps reales.", type: "talk", mins: 2 },
        { topic: "Javier → Google AI Studio", desc: "Lleva el artefacto de ChatGPT Canvas a Google AI Studio. App funcional paso a paso.", type: "demo", mins: 12, trainer: "Javier" },
        { topic: "Alex → Lovable", desc: "Lleva el artefacto de Claude a Lovable. App funcional con deploy en vivo.", type: "demo", mins: 12, trainer: "Alex" },
        { topic: "Comparación apps finales", desc: "Google AI Studio vs Lovable: pros, contras, cuándo usar cada una.", type: "talk", mins: 5 },
      ],
    },
    {
      id: "cierre6",
      name: "Cierre",
      icon: "🏁",
      time: "11'",
      items: [
        { topic: "ROI del Vibe Coding", desc: "Desarrollo tradicional: 5.000-15.000€. Con Vibe Coding: TÚ lo haces en horas. Datos reales de mercado.", type: "concept", mins: 5 },
        { topic: "La muerte del SaaS", desc: "Las herramientas genéricas serán reemplazadas por soluciones a medida creadas con IA.", type: "concept", mins: 3 },
        { topic: "Despedida + anticipo Día 7", desc: "Mañana: las novedades más impactantes de IA y cómo MONETIZARLAS.", type: "talk", mins: 3 },
      ],
    },
  ],
};

const DAY7 = {
  num: 7,
  title: "Lo último en IA que puede hacerte ganar dinero",
  date: "1 Mar 2026",
  icon: "🔮",
  gradient: `linear-gradient(135deg, ${COLORS.dark} 0%, #0d3320 50%, #00cc66 100%)`,
  categories: [
    {
      id: "voz",
      name: "Agentes de Voz",
      icon: "🎙️",
      color: "#61F2F2",
      tools: ["ElevenLabs Conversational AI", "Synthflow"],
      trainer: "Alex",
      demo: "Crea un agente de voz en directo: recepcionista, asistente de ventas o soporte. Demo con llamada real al agente.",
      monetization: {
        service: "Agentes de voz para negocios locales",
        clients: "Clínicas, restaurantes, inmobiliarias, hoteles",
        price: "500 — 2.000€/mes",
        cost: "~50€/mes en API",
        margin: "90-97%",
      },
    },
    {
      id: "video",
      name: "Generación de Vídeo",
      icon: "🎬",
      color: "#FF2878",
      tools: ["Kling 3.0", "Veo 3.1", "Sora 2"],
      trainer: "Javier",
      demo: "Genera un vídeo profesional con IA: spot publicitario o vídeo corporativo. 4K, diálogo natural, calidad cinematográfica.",
      monetization: {
        service: "Producción de vídeo con IA para empresas",
        clients: "Marcas, agencias, e-commerce, PYMEs",
        price: "1.500 — 3.000€ por vídeo",
        cost: "Tiempo + ~20€ API",
        margin: "95%+",
      },
    },
    {
      id: "auto",
      name: "Automatización IA",
      icon: "⚙️",
      color: "#61F2F2",
      tools: ["Make.com", "n8n", "Zapier AI"],
      trainer: "Alex",
      demo: "Workflow real: lead entra por formulario → IA cualifica → respuesta personalizada → CRM actualizado. Todo automático.",
      monetization: {
        service: "Automatizaciones IA para PYMEs",
        clients: "Cualquier PYME con procesos repetitivos",
        price: "300-1.500€ setup + 200-500€/mes",
        cost: "~30€/mes herramientas",
        margin: "85-95%",
      },
    },
    {
      id: "asistentes",
      name: "Asistentes Inteligentes",
      icon: "🤖",
      color: "#FF2878",
      tools: ["NotebookLM", "Chatbase", "Voiceflow"],
      trainer: "Javier + Alex",
      demo: "Javier: sube documentos a NotebookLM y genera un podcast/briefing automático. Alex: crea un chatbot para web entrenado con datos del negocio.",
      monetization: {
        service: "Chatbots + Informes IA para empresas",
        clients: "E-commerce, servicios profesionales, consultoría",
        price: "500-2.000€ setup + 100-300€/mes",
        cost: "~20-50€/mes APIs",
        margin: "85-95%",
      },
    },
    {
      id: "nocode",
      name: "Desarrollo Sin Código",
      icon: "🏗️",
      color: "#61F2F2",
      tools: ["Lovable", "Bolt.new", "Replit Agent", "Vercel v0"],
      trainer: "Javier",
      demo: "Crea una landing page o micro-SaaS completa en directo en 5 minutos. Deploy incluido. El público no se lo creerá.",
      monetization: {
        service: "Desarrollo web y micro-SaaS con IA",
        clients: "Emprendedores, startups, PYMEs",
        price: "Landing: 800-2.000€ · Micro-SaaS: 3.000-10.000€",
        cost: "Tiempo + ~20€/mes hosting",
        margin: "90%+",
      },
    },
  ],
};

// ─── Componentes auxiliares ───────────────────────────────────

const FadeIn = ({ children, delay = 0 }) => {
  const [v, setV] = useState(false);
  useEffect(() => { const t = setTimeout(() => setV(true), delay); return () => clearTimeout(t); }, [delay]);
  return (
    <div style={{ opacity: v ? 1 : 0, transform: `translateY(${v ? 0 : 24}px)`, transition: "all 0.6s cubic-bezier(.34,1.56,.64,1)" }}>
      {children}
    </div>
  );
};

const Badge = ({ text, color = COLORS.cyan }) => (
  <span style={{ background: color, color: color === COLORS.cyan ? COLORS.dark : COLORS.white, padding: "4px 14px", borderRadius: 999, fontSize: 13, fontWeight: 600, letterSpacing: ".5px", textTransform: "uppercase" }}>
    {text}
  </span>
);

const TypeBadge = ({ type }) => {
  const map = {
    talk: { label: "CHARLA", bg: COLORS.dark, fg: COLORS.white },
    concept: { label: "CONCEPTO", bg: COLORS.cyan, fg: COLORS.dark },
    demo: { label: "DEMO EN VIVO", bg: COLORS.magenta, fg: COLORS.white },
    venta: { label: "VENTA", bg: "#FFD700", fg: COLORS.dark },
    cta: { label: "CTA", bg: COLORS.magenta, fg: COLORS.white },
    promo: { label: "PROMO", bg: "#FFD700", fg: COLORS.dark },
    break: { label: "PAUSA", bg: "#ccc", fg: COLORS.dark },
  };
  const s = map[type] || map.talk;
  return <span style={{ background: s.bg, color: s.fg, padding: "3px 10px", borderRadius: 6, fontSize: 11, fontWeight: 700, letterSpacing: ".5px" }}>{s.label}</span>;
};

const AnimatedCounter = ({ end, suffix = "", duration = 1800 }) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0; const steps = 50; const inc = end / steps; const ms = duration / steps;
    const t = setInterval(() => { start += inc; if (start >= end) { setVal(end); clearInterval(t); } else setVal(Math.floor(start)); }, ms);
    return () => clearInterval(t);
  }, [end, duration]);
  return <span style={{ fontWeight: 700 }}>{val.toLocaleString("es-ES")}{suffix}</span>;
};

// ─── Vista Home ───────────────────────────────────────────────

const HomeView = ({ onSelectDay }) => {
  const [hovered, setHovered] = useState(null);
  const days = [DAY5, DAY6, DAY7];

  return (
    <div style={{ minHeight: "100vh", background: COLORS.dark, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40, position: "relative", overflow: "hidden" }}>
      {/* Decorative circles */}
      <div style={{ position: "absolute", width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, ${COLORS.cyan}15, transparent 70%)`, top: -200, right: -200 }} />
      <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle, ${COLORS.magenta}15, transparent 70%)`, bottom: -150, left: -150 }} />

      <FadeIn>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <div style={{ fontSize: 14, letterSpacing: 6, color: COLORS.cyan, marginBottom: 16, textTransform: "uppercase", fontWeight: 600 }}>
            IA Heroes Live 14 — Herramienta Interna
          </div>
          <h1 style={{ fontSize: 56, fontWeight: 700, color: COLORS.white, margin: 0, lineHeight: 1.1 }}>
            Escaleta <span style={{ color: COLORS.magenta }}>Días 5-7</span>
          </h1>
          <p style={{ fontSize: 20, color: `${COLORS.white}99`, marginTop: 16 }}>
            Selecciona un día para ver la escaleta completa con contenido, timings y estructura.
          </p>
        </div>
      </FadeIn>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28, maxWidth: 1100, width: "100%" }}>
        {days.map((day, i) => (
          <FadeIn key={day.num} delay={200 + i * 150}>
            <button
              onClick={() => onSelectDay(day.num)}
              onMouseEnter={() => setHovered(day.num)}
              onMouseLeave={() => setHovered(null)}
              style={{
                background: hovered === day.num ? day.gradient : `${COLORS.white}08`,
                border: `2px solid ${hovered === day.num ? COLORS.cyan : COLORS.white + "20"}`,
                borderRadius: 24,
                padding: "48px 32px",
                cursor: "pointer",
                transition: "all 0.4s cubic-bezier(.34,1.56,.64,1)",
                transform: hovered === day.num ? "translateY(-8px) scale(1.02)" : "none",
                boxShadow: hovered === day.num ? `0 20px 60px ${COLORS.black}40` : "none",
                textAlign: "left",
                width: "100%",
              }}
            >
              <div style={{ fontSize: 56, marginBottom: 20 }}>{day.icon}</div>
              <div style={{ fontSize: 13, color: COLORS.cyan, fontWeight: 600, letterSpacing: 2, marginBottom: 8, textTransform: "uppercase" }}>
                Día {day.num} · {day.date}
              </div>
              <h2 style={{ fontSize: 24, fontWeight: 700, color: COLORS.white, margin: 0, lineHeight: 1.3 }}>
                {day.title}
              </h2>
              <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 8, color: `${COLORS.white}80`, fontSize: 14 }}>
                <span>{day.num === 7 ? `${day.categories.length} categorías` : `${day.blocks.length} bloques`}</span>
                <span style={{ color: COLORS.magenta }}>→</span>
              </div>
            </button>
          </FadeIn>
        ))}
      </div>
    </div>
  );
};

// ─── Vista Día 5 / Día 6 (bloques) ───────────────────────────

const DayBlocksView = ({ day, onBack }) => {
  const [openBlock, setOpenBlock] = useState(null);
  const [scrollY, setScrollY] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handleScroll = () => setScrollY(el.scrollTop);
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  const totalMins = day.blocks.reduce((acc, b) => {
    return acc + b.items.reduce((a, it) => a + (it.mins || 0), 0);
  }, 0);

  return (
    <div ref={containerRef} style={{ minHeight: "100vh", background: COLORS.white, overflowY: "auto", maxHeight: "100vh" }}>
      {/* Hero header */}
      <div style={{
        background: day.gradient,
        padding: "48px 48px 40px",
        position: "sticky",
        top: 0,
        zIndex: 20,
        transition: "padding 0.3s",
        ...(scrollY > 50 ? { padding: "16px 48px" } : {}),
      }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <button onClick={onBack} style={{ background: "none", border: "none", color: `${COLORS.white}80`, cursor: "pointer", fontSize: 14, marginBottom: scrollY > 50 ? 0 : 12, display: "flex", alignItems: "center", gap: 6 }}>
              ← Volver
            </button>
            {scrollY <= 50 && (
              <h1 style={{ fontSize: 40, fontWeight: 700, color: COLORS.white, margin: 0 }}>
                <span style={{ marginRight: 16 }}>{day.icon}</span>
                Día {day.num}
              </h1>
            )}
            {scrollY > 50 && (
              <span style={{ fontSize: 18, fontWeight: 600, color: COLORS.white }}>
                {day.icon} Día {day.num} — {day.title}
              </span>
            )}
          </div>
          {scrollY <= 50 && (
            <div style={{ textAlign: "right" }}>
              <div style={{ color: COLORS.cyan, fontSize: 14, fontWeight: 600 }}>{day.date}</div>
              <div style={{ color: `${COLORS.white}80`, fontSize: 13, marginTop: 4 }}>{day.blocks.length} bloques · ~{totalMins || "—"}min contenido</div>
            </div>
          )}
        </div>
      </div>

      {/* Subtitle */}
      <div style={{ background: `${COLORS.dark}08`, padding: "20px 48px", borderBottom: `1px solid ${COLORS.dark}15` }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <p style={{ fontSize: 20, color: COLORS.dark, margin: 0, fontWeight: 500 }}>{day.title}</p>
        </div>
      </div>

      {/* Blocks */}
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 48px 80px" }}>
        {day.blocks.map((block, bi) => {
          const isOpen = openBlock === block.id;
          return (
            <FadeIn key={block.id} delay={bi * 80}>
              <div style={{
                marginBottom: 16,
                border: `2px solid ${isOpen ? COLORS.magenta : COLORS.dark + "15"}`,
                borderRadius: 16,
                overflow: "hidden",
                transition: "border-color 0.3s",
              }}>
                {/* Block header */}
                <button
                  onClick={() => setOpenBlock(isOpen ? null : block.id)}
                  style={{
                    width: "100%",
                    padding: "20px 24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: isOpen ? `${COLORS.magenta}08` : COLORS.white,
                    border: "none",
                    cursor: "pointer",
                    transition: "background 0.3s",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <span style={{ fontSize: 28 }}>{block.icon}</span>
                    <div style={{ textAlign: "left" }}>
                      <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.dark }}>{block.name}</div>
                      {block.trainer && <div style={{ fontSize: 13, color: COLORS.magenta, fontWeight: 600 }}>Formador: {block.trainer}</div>}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <Badge text={block.time} color={COLORS.cyan} />
                    <span style={{
                      fontSize: 20, color: COLORS.dark, transition: "transform 0.3s",
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                      display: "inline-block",
                    }}>▾</span>
                  </div>
                </button>

                {/* Block content */}
                {isOpen && (
                  <div style={{ padding: "8px 24px 24px", background: `${COLORS.dark}03` }}>
                    {block.items.map((item, ii) => (
                      <div key={ii} style={{
                        padding: "16px 20px",
                        marginTop: 8,
                        background: COLORS.white,
                        borderRadius: 12,
                        borderLeft: `4px solid ${item.type === "demo" ? COLORS.magenta : item.type === "venta" ? "#FFD700" : COLORS.cyan}`,
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 16,
                      }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                            <TypeBadge type={item.type} />
                            {item.mins && <span style={{ fontSize: 13, color: `${COLORS.dark}80` }}>{item.mins}'</span>}
                            {item.trainer && <span style={{ fontSize: 12, color: COLORS.magenta, fontWeight: 600 }}>👤 {item.trainer}</span>}
                          </div>
                          <div style={{ fontSize: 17, fontWeight: 600, color: COLORS.dark }}>{item.topic}</div>
                          {item.desc && <div style={{ fontSize: 15, color: `${COLORS.dark}99`, marginTop: 4, lineHeight: 1.5 }}>{item.desc}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </FadeIn>
          );
        })}
      </div>
    </div>
  );
};

// ─── Vista Día 7 (categorías) ─────────────────────────────────

const Day7View = ({ onBack }) => {
  const [activeCat, setActiveCat] = useState(null);
  const [showMap, setShowMap] = useState(false);

  return (
    <div style={{ minHeight: "100vh", background: COLORS.white, overflowY: "auto", maxHeight: "100vh" }}>
      {/* Hero header */}
      <div style={{ background: DAY7.gradient, padding: "48px 48px 40px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <button onClick={onBack} style={{ background: "none", border: "none", color: `${COLORS.white}80`, cursor: "pointer", fontSize: 14, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
            ← Volver
          </button>
          <h1 style={{ fontSize: 40, fontWeight: 700, color: COLORS.white, margin: 0 }}>
            {DAY7.icon} Día 7 — {DAY7.title}
          </h1>
          <div style={{ color: `${COLORS.white}80`, fontSize: 15, marginTop: 8 }}>
            {DAY7.date} · {DAY7.categories.length} categorías · Formato: Demo → Monetización
          </div>
        </div>
      </div>

      {/* Estructura global */}
      <div style={{ background: `${COLORS.dark}06`, padding: "20px 48px", borderBottom: `1px solid ${COLORS.dark}10` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <Badge text="INTRO 8'" color={COLORS.dark} />
          {DAY7.categories.map((c, i) => (
            <span key={c.id} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Badge text={`${c.icon} ${c.name}`} color={c.color} />
              {i === 2 && <Badge text="💰 VENTA 12'" color="#FFD700" />}
              {i < DAY7.categories.length - 1 && i !== 2 && <span style={{ color: `${COLORS.dark}40` }}>→</span>}
            </span>
          ))}
          <Badge text="📊 CIERRE 13'" color={COLORS.dark} />
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 48px 40px" }}>
        {/* Category cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16, marginBottom: 32 }}>
          {DAY7.categories.map((cat, i) => (
            <FadeIn key={cat.id} delay={i * 100}>
              <button
                onClick={() => setActiveCat(activeCat === cat.id ? null : cat.id)}
                style={{
                  width: "100%",
                  padding: "28px 20px",
                  borderRadius: 16,
                  border: `2px solid ${activeCat === cat.id ? cat.color : COLORS.dark + "15"}`,
                  background: activeCat === cat.id ? `${cat.color}12` : COLORS.white,
                  cursor: "pointer",
                  textAlign: "center",
                  transition: "all 0.3s",
                  transform: activeCat === cat.id ? "translateY(-4px)" : "none",
                  boxShadow: activeCat === cat.id ? `0 8px 32px ${cat.color}25` : "none",
                }}
              >
                <div style={{ fontSize: 36, marginBottom: 12 }}>{cat.icon}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.dark, lineHeight: 1.3 }}>{cat.name}</div>
                <div style={{ fontSize: 12, color: `${COLORS.dark}60`, marginTop: 6 }}>
                  {cat.tools.length} herramientas
                </div>
              </button>
            </FadeIn>
          ))}
        </div>

        {/* Active category detail */}
        {activeCat && (() => {
          const cat = DAY7.categories.find(c => c.id === activeCat);
          if (!cat) return null;
          return (
            <FadeIn key={cat.id}>
              <div style={{
                border: `2px solid ${cat.color}`,
                borderRadius: 20,
                overflow: "hidden",
                marginBottom: 32,
              }}>
                {/* Detail header */}
                <div style={{
                  background: `linear-gradient(135deg, ${COLORS.dark}, ${cat.color}30)`,
                  padding: "28px 32px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}>
                  <div>
                    <h3 style={{ fontSize: 26, fontWeight: 700, color: COLORS.white, margin: 0 }}>
                      {cat.icon} {cat.name}
                    </h3>
                    <div style={{ color: `${COLORS.white}80`, fontSize: 14, marginTop: 4 }}>
                      Formador: <span style={{ color: cat.color, fontWeight: 600 }}>{cat.trainer}</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {cat.tools.map(t => (
                      <span key={t} style={{
                        background: `${COLORS.white}15`,
                        color: COLORS.white,
                        padding: "6px 14px",
                        borderRadius: 8,
                        fontSize: 13,
                        fontWeight: 500,
                        border: `1px solid ${COLORS.white}25`,
                      }}>{t}</span>
                    ))}
                  </div>
                </div>

                {/* Demo + Monetization */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
                  {/* Demo */}
                  <div style={{ padding: "28px 32px", borderRight: `1px solid ${COLORS.dark}10` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                      <TypeBadge type="demo" />
                      <span style={{ fontSize: 14, color: `${COLORS.dark}60` }}>Demo en vivo</span>
                    </div>
                    <p style={{ fontSize: 16, color: COLORS.dark, lineHeight: 1.6, margin: 0 }}>{cat.demo}</p>
                  </div>

                  {/* Monetization */}
                  <div style={{ padding: "28px 32px", background: `${cat.color}06` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                      <span style={{ background: "#FFD700", color: COLORS.dark, padding: "3px 10px", borderRadius: 6, fontSize: 11, fontWeight: 700 }}>💰 MONETIZACIÓN</span>
                    </div>
                    <div style={{ fontSize: 15, color: COLORS.dark, lineHeight: 1.8 }}>
                      <div><strong>Servicio:</strong> {cat.monetization.service}</div>
                      <div><strong>Clientes:</strong> {cat.monetization.clients}</div>
                      <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                        <div style={{ background: COLORS.white, borderRadius: 10, padding: "12px 16px", border: `1px solid ${COLORS.dark}10` }}>
                          <div style={{ fontSize: 12, color: `${COLORS.dark}60`, marginBottom: 4 }}>Precio de mercado</div>
                          <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.magenta }}>{cat.monetization.price}</div>
                        </div>
                        <div style={{ background: COLORS.white, borderRadius: 10, padding: "12px 16px", border: `1px solid ${COLORS.dark}10` }}>
                          <div style={{ fontSize: 12, color: `${COLORS.dark}60`, marginBottom: 4 }}>Coste real</div>
                          <div style={{ fontSize: 18, fontWeight: 700, color: "#00cc66" }}>{cat.monetization.cost}</div>
                        </div>
                      </div>
                      <div style={{ marginTop: 8, background: COLORS.dark, borderRadius: 10, padding: "10px 16px", textAlign: "center" }}>
                        <span style={{ color: `${COLORS.white}80`, fontSize: 13 }}>Margen: </span>
                        <span style={{ color: "#00ff88", fontSize: 22, fontWeight: 700 }}>{cat.monetization.margin}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          );
        })()}

        {/* Summary map toggle */}
        <div style={{ textAlign: "center", marginTop: 16 }}>
          <button
            onClick={() => setShowMap(!showMap)}
            style={{
              background: showMap ? COLORS.magenta : COLORS.dark,
              color: COLORS.white,
              border: "none",
              padding: "14px 32px",
              borderRadius: 12,
              fontSize: 16,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.3s",
            }}
          >
            {showMap ? "Ocultar" : "📊 Ver"} Mapa Resumen de Servicios Monetizables
          </button>
        </div>

        {showMap && (
          <FadeIn>
            <div style={{ marginTop: 24, borderRadius: 20, overflow: "hidden", border: `2px solid ${COLORS.dark}15` }}>
              <div style={{ background: COLORS.dark, padding: "20px 28px" }}>
                <h3 style={{ fontSize: 22, fontWeight: 700, color: COLORS.white, margin: 0 }}>
                  📊 Mapa de Servicios IA Monetizables
                </h3>
                <p style={{ color: `${COLORS.white}70`, fontSize: 14, margin: "6px 0 0" }}>
                  Slide de cierre de Arnau — Los 5 servicios que puedes vender MAÑANA
                </p>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                  <thead>
                    <tr style={{ background: `${COLORS.dark}08` }}>
                      {["Servicio", "Precio", "Coste", "Margen", "Clientes"].map(h => (
                        <th key={h} style={{ padding: "14px 20px", textAlign: "left", fontWeight: 700, color: COLORS.dark, borderBottom: `2px solid ${COLORS.dark}15` }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {DAY7.categories.map((cat, i) => (
                      <tr key={cat.id} style={{ background: i % 2 ? `${COLORS.dark}03` : COLORS.white }}>
                        <td style={{ padding: "14px 20px", fontWeight: 600, color: COLORS.dark, borderBottom: `1px solid ${COLORS.dark}08` }}>
                          {cat.icon} {cat.monetization.service}
                        </td>
                        <td style={{ padding: "14px 20px", color: COLORS.magenta, fontWeight: 700, borderBottom: `1px solid ${COLORS.dark}08` }}>{cat.monetization.price}</td>
                        <td style={{ padding: "14px 20px", color: "#00cc66", fontWeight: 600, borderBottom: `1px solid ${COLORS.dark}08` }}>{cat.monetization.cost}</td>
                        <td style={{ padding: "14px 20px", borderBottom: `1px solid ${COLORS.dark}08` }}>
                          <span style={{ background: COLORS.dark, color: "#00ff88", padding: "4px 12px", borderRadius: 6, fontWeight: 700, fontSize: 13 }}>{cat.monetization.margin}</span>
                        </td>
                        <td style={{ padding: "14px 20px", color: `${COLORS.dark}80`, borderBottom: `1px solid ${COLORS.dark}08` }}>{cat.monetization.clients}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </FadeIn>
        )}
      </div>
    </div>
  );
};

// ─── App Principal ────────────────────────────────────────────

export default function EscaletaDias567() {
  const [view, setView] = useState("home"); // home | day5 | day6 | day7

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  return (
    <div style={{ fontFamily: '"Space Grotesk", sans-serif', minHeight: "100vh" }}>
      {view === "home" && <HomeView onSelectDay={(n) => setView(`day${n}`)} />}
      {view === "day5" && <DayBlocksView day={DAY5} onBack={() => setView("home")} />}
      {view === "day6" && <DayBlocksView day={DAY6} onBack={() => setView("home")} />}
      {view === "day7" && <Day7View onBack={() => setView("home")} />}

      <style>{`
        @keyframes slideIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        * { box-sizing: border-box; margin: 0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${COLORS.dark}30; border-radius: 3px; }
        button { font-family: inherit; }
      `}</style>
    </div>
  );
}
