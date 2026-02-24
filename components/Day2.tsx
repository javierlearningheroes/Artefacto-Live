import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Layout from './Layout';
import CTAModal from './CTAModal';
import { AppRoute, ChatMessage } from '../types';
import { COLORS } from '../constants';
import { enhancePrompt, enhanceAgentPrompt, sendPersonalUseCaseMessage, sendProfessionalUseCaseMessage } from '../services/geminiService';
import { trackInteraction, getCTAConfig } from '../services/trackingService';
import { CATALOG_AGENTS } from './agentCatalogData';
import {
  ArrowRight, ArrowLeft, CheckCircle, Brain, Sparkles, Cpu,
  Target, Lightbulb, TrendingUp, Bot, Wrench, Zap, MessageSquare,
  ChevronDown, Eye, Copy, BookOpen, Layers, Play, User, Send,
  Image, Video, Wand2, ArrowUpRight, RotateCcw, Star, Briefcase, Home as HomeIcon,
  ArrowUp, Mic
} from 'lucide-react';

// ════════════════════════════════════════════════════════════════
// SECTION DATA
// ════════════════════════════════════════════════════════════════

const SECTIONS = [
  { id: 'welcome', title: 'Bienvenida', icon: '🎯', color: '#FF2878' },
  { id: 'gallery', title: 'Antes vs Después', icon: '🔄', color: '#6366f1' },
  { id: 'workshop', title: 'Taller Creativo', icon: '🎨', color: '#61F2F2' },
  { id: 'agents', title: 'Crea tu Agente', icon: '🤖', color: '#8b5cf6' },
  { id: 'usecases', title: 'Tus Casos de Uso', icon: '💡', color: '#ec4899' },
];

// Before/After prompt examples
const PROMPT_EXAMPLES = [
  {
    category: 'Marketing',
    icon: '📣',
    bad: 'Hazme un plan de marketing',
    good: 'Eres un CMO con 15 años de experiencia en e-commerce de moda sostenible. Mi tienda online vende ropa ecológica para mujeres de 30-45 años en España, facturamos 200K€/año y queremos crecer un 40%. Crea un plan de marketing digital de 90 días con: canales prioritarios, presupuesto sugerido por canal, KPIs semanales, y 3 campañas estacionales detalladas.',
    annotations: [
      { label: 'ROL', text: 'CMO con 15 años en e-commerce', color: 'bg-[#243F4C]' },
      { label: 'CONTEXTO', text: 'Tienda eco, 200K€, público definido', color: 'bg-slate-500' },
      { label: 'INSTRUCCIÓN', text: 'Plan 90 días con KPIs y campañas', color: 'bg-slate-400' },
    ],
  },
  {
    category: 'Ventas',
    icon: '💼',
    bad: 'Escríbeme un email para un cliente',
    good: 'Eres un director comercial experto en ventas B2B de software SaaS. Mi empresa vende un CRM para clínicas dentales a 99€/mes. El cliente "Dr. García" pidió una demo hace 3 días pero no ha respondido al seguimiento. Escribe un email de follow-up de máximo 100 palabras que: reconozca su tiempo limitado, mencione un caso de éxito de otra clínica, y proponga 2 horarios concretos esta semana.',
    annotations: [
      { label: 'ROL', text: 'Director comercial B2B SaaS', color: 'bg-[#243F4C]' },
      { label: 'CONTEXTO', text: 'CRM dental, follow-up post-demo', color: 'bg-slate-500' },
      { label: 'INSTRUCCIÓN', text: 'Email ≤100 palabras, caso éxito, 2 horarios', color: 'bg-slate-400' },
    ],
  },
  {
    category: 'Contenido',
    icon: '✍️',
    bad: 'Dame ideas para posts de Instagram',
    good: 'Eres un social media manager especializado en cuentas de fitness para mujeres mayores de 40 años. Mi cuenta @vidafit40 tiene 12K seguidores, el engagement rate actual es del 2.3% y queremos llegar al 5%. Genera un calendario de 7 días con: tipo de contenido (reel/carrusel/story), hook de cada post, copy completo, 5 hashtags nicho, y mejor hora de publicación según mi audiencia española.',
    annotations: [
      { label: 'ROL', text: 'Social media manager fitness 40+', color: 'bg-[#243F4C]' },
      { label: 'CONTEXTO', text: '12K seguidores, 2.3% engagement', color: 'bg-slate-500' },
      { label: 'INSTRUCCIÓN', text: 'Calendario 7 días con métricas y horarios', color: 'bg-slate-400' },
    ],
  },
  {
    category: 'Estrategia',
    icon: '🧩',
    bad: 'Ayúdame a mejorar mi negocio',
    good: 'Eres un consultor de estrategia empresarial con experiencia en transformación digital de PYMEs. Mi restaurante italiano en Madrid tiene 45 mesas, factura 500K€/año con margen del 12%. Los costes de personal han subido un 18% este año y las reseñas en Google han bajado de 4.5 a 4.1 estrellas. Diagnostica los 3 problemas principales, propón 5 acciones concretas con timeline y coste estimado, y dame los KPIs que debería monitorizar semanalmente.',
    annotations: [
      { label: 'ROL', text: 'Consultor estratégico PYMEs', color: 'bg-[#243F4C]' },
      { label: 'CONTEXTO', text: 'Restaurante, 500K€, márgenes bajando', color: 'bg-slate-500' },
      { label: 'INSTRUCCIÓN', text: '3 problemas, 5 acciones, KPIs semanales', color: 'bg-slate-400' },
    ],
  },
];

// Creative challenges
const IMAGE_CHALLENGES = [
  { title: 'Logo de tu negocio', prompt: 'Un logo minimalista y moderno para...', hint: 'Describe tu negocio, tus colores de marca, y el estilo que buscas (plano, 3D, vintage...)' },
  { title: 'Post para redes', prompt: 'Una imagen profesional para Instagram de...', hint: 'Incluye estilo fotográfico, colores, composición y mood' },
  { title: 'Imagen de producto', prompt: 'Una fotografía publicitaria de...', hint: 'Describe el producto, fondo, iluminación y ángulo de cámara' },
];

const VIDEO_CHALLENGES = [
  { title: 'Intro de marca', prompt: 'Un video corto mostrando el logo de...', hint: 'Describe movimiento de cámara, transiciones y estilo visual' },
  { title: 'Producto en acción', prompt: 'Un video de 5 segundos mostrando...', hint: 'Incluye la acción principal, el tono y los efectos deseados' },
  { title: 'Testimonial visual', prompt: 'Una escena cinematográfica de...', hint: 'Describe el entorno, la iluminación y el movimiento' },
];

// Agent templates (top 6 from catalog for quick pick)
const AGENT_TEMPLATES = CATALOG_AGENTS.slice(0, 8).map(a => ({
  id: a.id,
  icon: a.icon,
  name: a.name,
  description: a.description,
  category: a.category,
  // Extract ROL, CONTEXTO, INSTRUCCION from systemPrompt
  rol: a.systemPrompt.split('#CONTEXTO')[0]?.replace('#ROL', '').trim() || '',
  contexto: (a.systemPrompt.split('#CONTEXTO')[1]?.split('#PASOS')[0] || a.systemPrompt.split('#CONTEXTO')[1]?.split('#INSTRUCCIONES')[0] || '').trim(),
  instruccion: (a.systemPrompt.split('#PASOS A SEGUIR')[1]?.split('#NOTAS')[0] || a.systemPrompt.split('#PASOS A SEGUIR')[1]?.split('#RESTRICCIONES')[0] || '').trim(),
}));

// ════════════════════════════════════════════════════════════════
// SUBCOMPONENTS
// ════════════════════════════════════════════════════════════════

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy} className="flex items-center gap-1.5 py-2 px-3 rounded-xl border-2 border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-colors text-xs">
      {copied ? <><CheckCircle className="w-3.5 h-3.5 text-cyan-500" /> Copiado</> : <><Copy className="w-3.5 h-3.5" /> Copiar</>}
    </button>
  );
};

// ── Use Case Chat (Clean White Floating UI) ──
const UseCaseChat = ({ type }: { type: 'personal' | 'professional' }) => {
  const isPersonal = type === 'personal';

  const initialMessage = isPersonal
    ? '¡Hola! Soy tu consultor de casos de uso personales, creado por Learning Heroes. Mi objetivo es ayudarte a descubrir cómo la IA generativa puede mejorar tu día a día. Más adelante, en el programa, aprenderás a crear agentes como yo.\n\nPara empezar, **cuéntame: ¿cómo es un día normal en tu vida? ¿Qué rutinas tienes por la mañana?**'
    : '¡Hola! Soy tu consultor de casos de uso profesionales, creado por Learning Heroes. Mi objetivo es ayudarte a descubrir cómo la IA generativa puede transformar tu productividad y tu negocio. Más adelante, en el programa, aprenderás a crear agentes como yo.\n\nPara empezar, **cuéntame: ¿a qué te dedicas y en qué sector trabaja tu empresa?**';

  const [messages, setMessages] = useState<ChatMessage[]>([{ role: 'model', text: initialMessage }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '24px';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [input]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);
    try {
      const history = messages.map(m => ({ role: m.role, parts: [{ text: m.text }] }));
      const sendFn = isPersonal ? sendPersonalUseCaseMessage : sendProfessionalUseCaseMessage;
      const reply = await sendFn(history, userMsg);
      if (reply) {
        setMessages(prev => [...prev, { role: 'model', text: reply }]);
        trackInteraction('day2_prompt_enhance');
      }
    } catch {
      setMessages(prev => [...prev, { role: 'model', text: 'Lo siento, tuve un problema. ¿Podrías repetirlo?', isError: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Speech-to-text with microphone
  const toggleListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Tu navegador no soporta el dictado por voz. Usa Chrome o Edge.');
      return;
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'es-ES';
    recognition.continuous = false;
    recognition.interimResults = true;
    recognitionRef.current = recognition;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join('');
      setInput(transcript);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const accentColor = isPersonal ? '#FF2878' : '#243F4C';

  return (
    <div className="relative flex flex-col h-[65vh] md:h-[60vh]">
      {/* Animated background blobs */}
      <div className="absolute inset-0 -m-4 overflow-hidden rounded-3xl">
        <div className="absolute w-72 h-72 bg-pink-300/30 rounded-full blur-3xl -top-20 -left-20 animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute w-80 h-80 bg-blue-300/20 rounded-full blur-3xl -bottom-20 -right-20 animate-pulse" style={{ animationDuration: '8s', animationDelay: '2s' }} />
        <div className="absolute w-60 h-60 bg-purple-300/20 rounded-full blur-3xl top-1/3 right-1/4 animate-pulse" style={{ animationDuration: '7s', animationDelay: '1s' }} />
        <div className="absolute w-48 h-48 bg-cyan-300/15 rounded-full blur-3xl bottom-1/4 left-1/3 animate-pulse" style={{ animationDuration: '9s', animationDelay: '3s' }} />
      </div>

      {/* White floating card */}
      <div className="relative z-10 flex flex-col h-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
          <img src="/agents-icon.png" alt="Agente IA" className="w-10 h-10 rounded-xl object-contain" />
          <div className="flex-1">
            <div className="font-bold text-sm text-gray-800">
              {isPersonal ? 'Consultor Personal IA' : 'Consultor Profesional IA'}
            </div>
            <div className="text-[11px] text-gray-400 font-medium">Learning Heroes · Agente Inteligente</div>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: accentColor }} />
            <span className="text-[10px] text-gray-400 font-medium">En línea</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.map((msg, idx) => {
            const isUser = msg.role === 'user';
            return (
              <div key={idx} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                {!isUser && (
                  <img src="/agents-icon.png" alt="" className="w-7 h-7 rounded-lg mr-2.5 mt-1 flex-shrink-0 object-contain" />
                )}
                <div className={`max-w-[82%] px-4 py-3 text-[13px] leading-relaxed ${
                  isUser
                    ? 'text-white rounded-2xl rounded-br-md shadow-md'
                    : 'bg-gray-50 text-gray-700 rounded-2xl rounded-tl-md border border-gray-100'
                } ${msg.isError ? 'bg-red-50 border-red-200 text-red-600' : ''}`}
                  style={isUser ? { backgroundColor: accentColor } : undefined}
                >
                  <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
                    p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                    strong: ({node, ...props}) => <strong className={`font-semibold ${isUser ? 'text-white' : 'text-gray-900'}`} {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc pl-4 mb-2 space-y-1" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal pl-4 mb-2 space-y-1" {...props} />,
                    table: ({node, ...props}) => <div className="overflow-x-auto my-3 rounded-lg border border-gray-200 shadow-sm"><table className="w-full border-collapse text-xs" {...props} /></div>,
                    thead: ({node, ...props}) => <thead className="bg-[#243F4C] text-white text-[11px] uppercase tracking-wider" {...props} />,
                    tbody: ({node, ...props}) => <tbody className="divide-y divide-gray-100" {...props} />,
                    tr: ({node, ...props}) => <tr className="hover:bg-gray-50/50 transition-colors" {...props} />,
                    th: ({node, ...props}) => <th className="px-3 py-2 text-left font-semibold whitespace-nowrap" {...props} />,
                    td: ({node, ...props}) => <td className="px-3 py-2 text-gray-600" {...props} />,
                  }}>{msg.text}</ReactMarkdown>
                </div>
              </div>
            );
          })}

          {/* Typing indicator */}
          {isLoading && (
            <div className="flex justify-start items-end">
              <img src="/agents-icon.png" alt="" className="w-7 h-7 rounded-lg mr-2.5 flex-shrink-0 object-contain" />
              <div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-tl-md px-4 py-3 flex items-center gap-2">
                <span className="text-[11px] text-gray-400 font-medium">Pensando</span>
                <div className="flex items-center gap-1">
                  {[0, 1, 2].map(i => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce"
                      style={{ animationDelay: `${i * 150}ms`, animationDuration: '1s' }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area — clean white */}
        <div className="px-4 pb-4 pt-2 border-t border-gray-50">
          <div className="flex items-end gap-2 bg-gray-50 rounded-xl border border-gray-200 p-3 focus-within:border-gray-300 focus-within:ring-1 focus-within:ring-gray-200 transition-all">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder={isPersonal ? 'Cuéntame sobre tu día a día...' : 'Cuéntame sobre tu trabajo...'}
              rows={1}
              className="flex-1 bg-transparent text-gray-800 text-sm placeholder:text-gray-400 outline-none resize-none min-h-[24px] max-h-[120px] leading-relaxed"
            />

            {/* Mic button */}
            <button
              onClick={toggleListening}
              className={`flex-shrink-0 p-2 rounded-lg transition-all duration-200 ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse shadow-md'
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
              }`}
              title={isListening ? 'Detener dictado' : 'Dictar por voz'}
            >
              <Mic className="w-4 h-4" />
            </button>

            {/* Send button */}
            <button onClick={handleSend} disabled={isLoading || !input.trim()}
              className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200 ${
                input.trim()
                  ? 'text-white shadow-md hover:opacity-90 active:scale-95'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
              style={input.trim() ? { backgroundColor: accentColor } : undefined}
            >
              {isLoading ? (
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <ArrowUp className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════════

interface Day2Props {
  setRoute: (route: AppRoute) => void;
}

const Day2: React.FC<Day2Props> = ({ setRoute }) => {
  const [activeSection, setActiveSection] = useState(0);
  const [showCTA, setShowCTA] = useState(false);
  const [ctaConfig, setCTAConfig] = useState<{ title: string; message: string; url: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Gallery state
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [showAnnotations, setShowAnnotations] = useState(false);

  // Workshop state
  const [workshopMode, setWorkshopMode] = useState<'image' | 'video'>('image');
  const [selectedChallenge, setSelectedChallenge] = useState(0);
  const [prompt, setPrompt] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isOptimized, setIsOptimized] = useState(false);

  // Agent state
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [agentRol, setAgentRol] = useState('');
  const [agentContexto, setAgentContexto] = useState('');
  const [agentInstruccion, setAgentInstruccion] = useState('');
  const [agentResult, setAgentResult] = useState<string | null>(null);

  // Use case state
  const [useCaseMode, setUseCaseMode] = useState<'personal' | 'professional'>('personal');

  const goNext = () => setActiveSection(prev => Math.min(prev + 1, SECTIONS.length - 1));
  const goPrev = () => setActiveSection(prev => Math.max(prev - 1, 0));

  // Keyboard nav
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); goNext(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); goPrev(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [activeSection]);

  const progress = ((activeSection + 1) / SECTIONS.length) * 100;

  const handleEnhance = async () => {
    if (!prompt.trim()) return;
    setIsEnhancing(true);
    setError(null);
    try {
      const betterPrompt = await enhancePrompt(prompt);
      setPrompt(betterPrompt);
      setIsOptimized(true);
      const trigger = trackInteraction('day2_prompt_enhance');
      if (trigger) {
        const cfg = getCTAConfig(trigger);
        if (cfg) { setCTAConfig(cfg); setTimeout(() => setShowCTA(true), 1500); }
      }
    } catch (err: any) {
      setError(err?.message || 'Error al mejorar el prompt. Revisa tu API key.');
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleAgentEnhance = async () => {
    if (!agentRol.trim() && !agentContexto.trim() && !agentInstruccion.trim()) return;
    setIsEnhancing(true);
    setError(null);
    try {
      const betterPrompt = await enhanceAgentPrompt(agentRol, agentContexto, agentInstruccion);
      setAgentResult(betterPrompt);
      const trigger = trackInteraction('day2_prompt_enhance');
      if (trigger) {
        const cfg = getCTAConfig(trigger);
        if (cfg) { setCTAConfig(cfg); setTimeout(() => setShowCTA(true), 1500); }
      }
    } catch (err: any) {
      setError(err?.message || 'Error al generar el system prompt.');
    } finally {
      setIsEnhancing(false);
    }
  };

  const loadTemplate = (idx: number) => {
    const t = AGENT_TEMPLATES[idx];
    setSelectedTemplate(idx);
    setAgentRol(t.rol);
    setAgentContexto(t.contexto);
    setAgentInstruccion(t.instruccion);
    setAgentResult(null);
  };

  const clearAgent = () => {
    setSelectedTemplate(null);
    setAgentRol('');
    setAgentContexto('');
    setAgentInstruccion('');
    setAgentResult(null);
  };

  const challenges = workshopMode === 'image' ? IMAGE_CHALLENGES : VIDEO_CHALLENGES;

  return (
    <Layout title="Día 2: Taller de Prompts" onBack={() => setRoute(AppRoute.HOME)}>
      <CTAModal isOpen={showCTA} onClose={() => setShowCTA(false)}
        title={ctaConfig?.title || '¡Prompt mejorado!'}
        message={ctaConfig?.message || 'Crear buenos prompts es una habilidad clave. En IA Heroes Pro aprenderás técnicas avanzadas.'}
        ctaUrl={ctaConfig?.url} ctaSource="day2"
      />

      <style>{`
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slide-up { animation: slideUp 0.5s ease-out forwards; }
      `}</style>

      <div className="flex flex-col items-center w-full max-w-5xl mx-auto px-2 md:px-4">

        {/* ── Progress + Section Nav ── */}
        <div className="w-full mb-6">
          <div className="w-full bg-slate-200 rounded-full h-1.5 mb-4">
            <div className="h-1.5 rounded-full transition-all duration-500 bg-[#243F4C]" style={{ width: `${progress}%` }} />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {SECTIONS.map((s, idx) => (
              <button key={s.id} onClick={() => setActiveSection(idx)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  idx === activeSection ? 'bg-slate-800 text-white shadow-lg scale-105'
                    : idx < activeSection ? 'bg-cyan-100 text-cyan-700' : 'bg-slate-100 text-slate-400'
                }`}>
                <span>{s.icon}</span>
                <span className="hidden md:inline">{s.title}</span>
                {idx < activeSection && <CheckCircle className="w-3 h-3" />}
              </button>
            ))}
          </div>
        </div>

        {/* ── CONTENT AREA ── */}
        <div className="w-full min-h-[60vh] animate-slide-up" key={activeSection}>

          {/* ═══════ SECTION 0: WELCOME ═══════ */}
          {activeSection === 0 && (
            <div className="flex flex-col items-center text-center space-y-8">
              <div className="relative">
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-3xl bg-gradient-to-br from-slate-700 via-slate-600 to-slate-500 flex items-center justify-center text-5xl md:text-6xl shadow-2xl" style={{ animation: 'float 3s ease-in-out infinite' }}>
                  🎯
                </div>
                <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-slate-400/10 to-slate-500/10 blur-xl -z-10" />
              </div>

              <div className="max-w-2xl space-y-4">
                <h1 className="text-3xl md:text-5xl font-black text-slate-800 leading-tight">
                  De la teoría a la{' '}
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#243F4C] to-slate-500">
                    práctica
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-slate-500 leading-relaxed">
                  Ayer aprendiste qué es la IA y la técnica de Cebado. Hoy vas a <strong className="text-slate-700">practicar</strong> con herramientas reales y descubrir casos de uso personalizados para ti.
                </p>
              </div>

              {/* What you'll do */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-3xl">
                {[
                  { icon: Eye, label: 'Galería', desc: 'Antes vs Después reales', color: 'text-slate-500' },
                  { icon: Image, label: 'Taller', desc: 'Mejora prompts con IA', color: 'text-slate-500' },
                  { icon: Bot, label: 'Agentes', desc: 'Crea tu primer agente', color: 'text-slate-500' },
                  { icon: Lightbulb, label: 'Casos de Uso', desc: 'Descubre los tuyos', color: 'text-slate-500' },
                ].map((item, i) => (
                  <button key={i} onClick={() => setActiveSection(i + 1)}
                    className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all text-left group">
                    <item.icon className={`w-6 h-6 ${item.color} mb-2 group-hover:scale-110 transition-transform`} />
                    <div className="text-xs font-bold text-slate-800">{item.label}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{item.desc}</div>
                  </button>
                ))}
              </div>

              {/* Connection to Day 1 */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 max-w-2xl w-full">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-[#243F4C] flex items-center justify-center text-white shadow-md">
                    <Brain className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-slate-800 text-sm">Recuerda del Día 1</h3>
                    <p className="text-xs text-slate-500">La técnica de Cebado (Priming)</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  {['ROL', 'CONTEXTO', 'INSTRUCCIÓN'].map((label, i) => (
                    <div key={label} className={`flex-1 text-center py-2 rounded-xl text-xs font-bold shadow-sm ${
                      i === 0 ? 'bg-[#243F4C] text-white' : i === 1 ? 'bg-slate-200 text-slate-700' : 'bg-slate-100 text-slate-600'
                    }`}>{label}</div>
                  ))}
                </div>
                <p className="text-xs text-slate-600 mt-3 text-center">Estos 3 ingredientes son la base de todo lo que vas a practicar hoy.</p>
              </div>
            </div>
          )}

          {/* ═══════ SECTION 1: GALLERY ═══════ */}
          {activeSection === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-4">
                <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-3">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#243F4C] to-slate-500">Antes vs Después</span>
                </h2>
                <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                  Mira la diferencia entre un prompt mediocre y uno profesional. La técnica de Cebado en acción.
                </p>
              </div>

              {/* Example selector pills */}
              <div className="flex gap-2 justify-center flex-wrap">
                {PROMPT_EXAMPLES.map((ex, idx) => (
                  <button key={idx} onClick={() => { setGalleryIndex(idx); setShowAnnotations(false); }}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                      galleryIndex === idx ? 'bg-[#243F4C] text-white shadow-md' : 'bg-white border border-slate-200 text-slate-500 hover:border-slate-300'
                    }`}>
                    <span>{ex.icon}</span> {ex.category}
                  </button>
                ))}
              </div>

              {/* Before/After comparison */}
              {(() => {
                const example = PROMPT_EXAMPLES[galleryIndex];
                return (
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* BAD */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                      <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-100 flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Prompt mediocre</span>
                      </div>
                      <div className="p-5">
                        <p className="font-mono text-sm text-slate-600 leading-relaxed bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                          "{example.bad}"
                        </p>
                        <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Sin rol, sin contexto, instrucción vaga
                        </div>
                      </div>
                    </div>

                    {/* GOOD */}
                    <div className="bg-white rounded-2xl border border-[#243F4C]/20 shadow-sm overflow-hidden">
                      <div className="bg-[#243F4C]/[0.03] px-4 py-2.5 border-b border-[#243F4C]/10 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full bg-[#243F4C]/60" />
                          <span className="text-xs font-bold text-[#243F4C]/70 uppercase tracking-wider">Prompt profesional</span>
                        </div>
                        <button onClick={() => setShowAnnotations(!showAnnotations)}
                          className={`text-[10px] font-bold px-2 py-1 rounded-full transition-all ${
                            showAnnotations ? 'bg-[#243F4C] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}>
                          {showAnnotations ? '✕ Ocultar' : '🔍 Analizar'}
                        </button>
                      </div>
                      <div className="p-5">
                        <p className="font-mono text-sm text-slate-700 leading-relaxed bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                          "{example.good}"
                        </p>

                        {/* Annotations */}
                        {showAnnotations && (
                          <div className="mt-4 space-y-2 animate-slide-up">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Técnica de Cebado detectada:</p>
                            {example.annotations.map((ann, i) => (
                              <div key={i} className="flex items-center gap-2">
                                <span className={`${ann.color} text-white text-[10px] font-bold px-2 py-0.5 rounded-md`}>{ann.label}</span>
                                <span className="text-xs text-slate-600">{ann.text}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Copy good prompt */}
              <div className="flex justify-center">
                <CopyButton text={PROMPT_EXAMPLES[galleryIndex].good} />
              </div>
            </div>
          )}

          {/* ═══════ SECTION 2: WORKSHOP ═══════ */}
          {activeSection === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-4">
                <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-3">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#243F4C] to-slate-500">Taller Creativo</span>
                </h2>
                <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                  Elige un reto, escribe tu prompt y deja que la IA lo mejore. Practica la técnica de Cebado en tiempo real.
                </p>
              </div>

              {/* Mode toggle */}
              <div className="flex justify-center gap-2">
                <button onClick={() => { setWorkshopMode('image'); setSelectedChallenge(0); setPrompt(''); setIsOptimized(false); }}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    workshopMode === 'image' ? 'bg-slate-800 text-white shadow-lg' : 'bg-white border border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}>
                  <Image className="w-4 h-4" /> Imagen
                </button>
                <button onClick={() => { setWorkshopMode('video'); setSelectedChallenge(0); setPrompt(''); setIsOptimized(false); }}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    workshopMode === 'video' ? 'bg-slate-800 text-white shadow-lg' : 'bg-white border border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}>
                  <Video className="w-4 h-4" /> Video
                </button>
              </div>

              <div className="grid md:grid-cols-5 gap-4">
                {/* Left: Challenges */}
                <div className="md:col-span-2 space-y-3">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Elige un reto:</p>
                  {challenges.map((ch, idx) => (
                    <button key={idx} onClick={() => { setSelectedChallenge(idx); setPrompt(ch.prompt); setIsOptimized(false); }}
                      className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                        selectedChallenge === idx
                          ? 'border-slate-400 bg-slate-50 shadow-md'
                          : 'border-slate-200 bg-white hover:border-slate-300 shadow-sm'
                      }`}>
                      <div className="flex items-center gap-2 mb-1">
                        <Star className={`w-4 h-4 ${selectedChallenge === idx ? 'text-[#243F4C]' : 'text-slate-300'}`} />
                        <span className="font-bold text-sm text-slate-800">{ch.title}</span>
                      </div>
                      <p className="text-xs text-slate-500">{ch.hint}</p>
                    </button>
                  ))}

                  {/* Tips */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Tips para {workshopMode === 'image' ? 'imágenes' : 'videos'}</h4>
                    <ul className="space-y-1.5">
                      {(workshopMode === 'image'
                        ? ['Describe el sujeto principal con detalle', 'Incluye estilo artístico (fotorealista, acuarela...)', 'Menciona iluminación y composición']
                        : ['Describe la acción/movimiento principal', 'Incluye transiciones o efectos de cámara', 'Menciona el tono (épico, profesional...)']
                      ).map((tip, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-xs text-slate-600">
                          <CheckCircle className="w-3 h-3 text-slate-400 mt-0.5 flex-shrink-0" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Right: Prompt area */}
                <div className="md:col-span-3 space-y-4">
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                    <div className="flex justify-between items-center mb-3">
                      <label className="text-sm font-bold text-slate-700">Tu prompt:</label>
                      {isOptimized && (
                        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-full flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Mejorado por IA
                        </span>
                      )}
                    </div>

                    <textarea value={prompt}
                      onChange={(e) => { setPrompt(e.target.value); setIsOptimized(false); }}
                      placeholder={challenges[selectedChallenge]?.prompt || 'Escribe tu prompt aquí...'}
                      className={`w-full p-4 rounded-xl border focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none min-h-[160px] text-sm bg-white text-slate-900 placeholder-slate-400 transition-colors ${
                        isOptimized ? 'border-slate-400 ring-1 ring-slate-100' : 'border-slate-300'
                      }`}
                    />

                    <div className="flex gap-2 mt-3">
                      <button onClick={handleEnhance} disabled={isEnhancing || !prompt.trim()}
                        className="flex-1 py-3 px-4 rounded-xl font-bold text-white disabled:opacity-50 shadow-lg flex justify-center items-center gap-2 transition-all active:scale-95 text-sm"
                        style={{ backgroundColor: COLORS.accent }}>
                        {isEnhancing ? (
                          <><svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg> Mejorando...</>
                        ) : (
                          <><Wand2 className="w-4 h-4" /> Mejorar con IA</>
                        )}
                      </button>
                      {isOptimized && <CopyButton text={prompt} />}
                    </div>

                    {error && <p className="text-red-500 text-center text-xs font-medium mt-2">{error}</p>}
                  </div>

                  {/* What changed explanation */}
                  {isOptimized && (
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 animate-slide-up">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-slate-500" />
                        <span className="text-xs font-bold text-slate-600">¿Qué ha mejorado la IA?</span>
                      </div>
                      <ul className="space-y-1">
                        {['Más detalle visual y descriptivo', 'Mejor estructura y especificidad', 'Vocabulario optimizado para generación IA'].map((t, i) => (
                          <li key={i} className="flex items-center gap-1.5 text-xs text-slate-500">
                            <CheckCircle className="w-3 h-3 flex-shrink-0" /> {t}
                          </li>
                        ))}
                      </ul>
                      <p className="text-[10px] text-slate-400 mt-2">Copia el prompt y pégalo en tu generador de IA favorito (Midjourney, DALL-E, Runway...)</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ═══════ SECTION 3: AGENTS ═══════ */}
          {activeSection === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-4">
                <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-3">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#243F4C] to-slate-500">Crea tu Agente IA</span>
                </h2>
                <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                  Elige una plantilla del catálogo o empieza desde cero. La IA convertirá tus ideas en un System Prompt profesional.
                </p>
              </div>

              {/* Template picker */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Plantillas rápidas</p>
                  {selectedTemplate !== null && (
                    <button onClick={clearAgent} className="text-xs font-bold text-rose-500 hover:underline flex items-center gap-1">
                      <RotateCcw className="w-3 h-3" /> Empezar de cero
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {AGENT_TEMPLATES.map((t, idx) => (
                    <button key={t.id} onClick={() => loadTemplate(idx)}
                      className={`text-left p-3 rounded-xl border-2 transition-all ${
                        selectedTemplate === idx
                          ? 'border-slate-400 bg-slate-50 shadow-md'
                          : 'border-slate-200 bg-white hover:border-slate-300 shadow-sm'
                      }`}>
                      <span className="text-xl">{t.icon}</span>
                      <div className="text-xs font-bold text-slate-800 mt-1 truncate">{t.name}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5 line-clamp-2">{t.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Agent builder */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 md:p-6 space-y-4">
                {/* ROL */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-md bg-[#243F4C] text-white flex items-center justify-center text-[10px] font-bold">1</span>
                      Rol
                    </span>
                  </label>
                  <textarea value={agentRol} onChange={(e) => setAgentRol(e.target.value)}
                    placeholder="Ej: Soy un experto en marketing digital con 10 años de experiencia..."
                    className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none min-h-[70px] text-sm bg-white text-slate-900 placeholder-slate-400"
                  />
                </div>

                {/* CONTEXTO */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-md bg-slate-500 text-white flex items-center justify-center text-[10px] font-bold">2</span>
                      Contexto
                    </span>
                  </label>
                  <textarea value={agentContexto} onChange={(e) => setAgentContexto(e.target.value)}
                    placeholder="Ej: Trabajo en el departamento de marketing de una clínica dental..."
                    className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none min-h-[70px] text-sm bg-white text-slate-900 placeholder-slate-400"
                  />
                </div>

                {/* INSTRUCCIÓN */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-md bg-slate-400 text-white flex items-center justify-center text-[10px] font-bold">3</span>
                      Pasos a Seguir
                    </span>
                  </label>
                  <textarea value={agentInstruccion} onChange={(e) => setAgentInstruccion(e.target.value)}
                    placeholder="Ej: 1) Analiza el contenido. 2) Genera 5 ideas. 3) Presenta en tabla..."
                    className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none min-h-[70px] text-sm bg-white text-slate-900 placeholder-slate-400"
                  />
                </div>

                {/* Generate button */}
                <button onClick={handleAgentEnhance}
                  disabled={isEnhancing || (!agentRol.trim() && !agentContexto.trim() && !agentInstruccion.trim())}
                  className="w-full py-3.5 rounded-xl font-bold text-white disabled:opacity-50 shadow-lg flex justify-center items-center gap-2 transition-all active:scale-95 text-sm"
                  style={{ backgroundColor: COLORS.accent }}>
                  {isEnhancing ? (
                    <><svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg> Generando System Prompt...</>
                  ) : (
                    <><Sparkles className="w-4 h-4" /> Generar System Prompt con IA</>
                  )}
                </button>
                {error && <p className="text-red-500 text-center text-xs font-medium">{error}</p>}
              </div>

              {/* Agent Result */}
              {agentResult && (
                <div className="bg-[#0F172A] rounded-2xl overflow-hidden shadow-lg border border-slate-700 animate-slide-up">
                  <div className="flex items-center justify-between px-4 py-3 bg-[#1e293b] border-b border-slate-700">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-500" />
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                      <span className="ml-2 text-[10px] font-mono text-slate-400 uppercase tracking-widest">System Prompt</span>
                    </div>
                    <CopyButton text={agentResult} />
                  </div>
                  <div className="p-5 overflow-x-auto max-h-[400px] overflow-y-auto">
                    <pre className="font-mono text-sm leading-relaxed whitespace-pre-wrap text-slate-200">{agentResult}</pre>
                  </div>
                  <div className="px-5 pb-4">
                    <div className="bg-white/[0.04] border border-white/10 rounded-xl p-3 flex items-start gap-2">
                      <Lightbulb className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-slate-400">
                        <strong>Siguiente paso:</strong> Copia este System Prompt y pégalo en ChatGPT, Claude o Gemini como "instrucciones personalizadas". ¡Tu agente está listo!
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ═══════ SECTION 4: USE CASES ═══════ */}
          {activeSection === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-4">
                <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-3">
                  Descubre{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#243F4C] to-slate-500">Tus Casos de Uso</span>
                </h2>
                <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                  Estos agentes están diseñados para conocerte y proponerte aplicaciones concretas de IA personalizadas para tu vida.
                </p>
              </div>

              {/* Mode toggle */}
              <div className="flex justify-center gap-3">
                <button onClick={() => setUseCaseMode('personal')}
                  className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold transition-all ${
                    useCaseMode === 'personal'
                      ? 'bg-[#243F4C] text-white shadow-lg scale-[1.02]'
                      : 'bg-white border border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}>
                  <HomeIcon className="w-4 h-4" /> Mi Vida Personal
                </button>
                <button onClick={() => setUseCaseMode('professional')}
                  className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold transition-all ${
                    useCaseMode === 'professional'
                      ? 'bg-[#243F4C] text-white shadow-lg scale-[1.02]'
                      : 'bg-white border border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}>
                  <Briefcase className="w-4 h-4" /> Mi Carrera Profesional
                </button>
              </div>

              {/* Info card */}
              <div className="rounded-2xl p-4 border bg-slate-50 border-slate-200">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{useCaseMode === 'personal' ? '🏡' : '💼'}</span>
                  <div>
                    <h3 className="font-bold text-sm text-slate-700">
                      {useCaseMode === 'personal' ? '¿Cómo puede la IA mejorar tu día a día?' : '¿Cómo puede la IA transformar tu trabajo?'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Cuéntale sobre tu vida y te propondrá al menos 10 aplicaciones concretas con prompts listos para usar.
                    </p>
                  </div>
                </div>
              </div>

              {/* Chat */}
              <UseCaseChat key={useCaseMode} type={useCaseMode} />
            </div>
          )}

        </div>

        {/* ── Bottom Navigation ── */}
        <div className="w-full flex justify-between items-center mt-8 mb-4 px-2">
          <button onClick={goPrev} disabled={activeSection === 0}
            className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all disabled:opacity-0 text-slate-500 hover:text-slate-800 hover:bg-slate-100">
            <ArrowLeft className="w-4 h-4" /> Anterior
          </button>

          <span className="text-xs text-slate-400 font-bold">
            {activeSection + 1} / {SECTIONS.length}
          </span>

          {activeSection < SECTIONS.length - 1 ? (
            <button onClick={goNext}
              className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all bg-[#243F4C] text-white shadow-lg hover:shadow-xl hover:bg-[#1a3040]">
              Siguiente <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={() => setRoute(AppRoute.HOME)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm bg-slate-800 text-white shadow-lg hover:bg-slate-700 transition">
              Finalizar <CheckCircle className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>
    </Layout>
  );
};

export default Day2;
