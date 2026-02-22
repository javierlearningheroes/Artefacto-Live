import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import Layout from './Layout';
import { AppRoute } from '../types';
import { COLORS } from '../constants';
import {
  ArrowRight, ArrowLeft, CheckCircle, Brain, Sparkles, Cpu,
  Target, Lightbulb, TrendingUp, DollarSign,
  Bot, Database, Wrench, Zap, MessageSquare, Mail, Globe,
  Calendar, FileText, MessageCircle, ChevronDown, Eye, Copy,
  BookOpen, Layers, Shield, Clock, Play, User, Send, Search
} from 'lucide-react';

// ════════════════════════════════════════════════════════════════
// SECTION DATA
// ════════════════════════════════════════════════════════════════

const SECTIONS = [
  { id: 'welcome', title: 'Bienvenida', icon: '🚀', color: '#FF2878' },
  { id: 'what-is-ai', title: '¿Qué es la IA?', icon: '🧠', color: '#6366f1' },
  { id: 'prompting', title: 'Prompt Engineering', icon: '🗣️', color: '#10b981' },
  { id: 'salaries', title: 'Salarios', icon: '💰', color: '#f59e0b' },
  { id: 'agents', title: 'Agentes IA', icon: '🤖', color: '#8b5cf6' },
  { id: 'agent-demo', title: 'Demo en Vivo', icon: '⚡', color: '#ec4899' },
  { id: 'quiz', title: 'Test Final', icon: '🎯', color: '#243F4C' },
];

// Chart data for investment waves
const chartData = [
  { year: 1950, Computers: 0, Software: 0, AI: 0 },
  { year: 1970, Computers: 0.3, Software: 0.1, AI: 0 },
  { year: 1990, Computers: 1.2, Software: 0.8, AI: 0 },
  { year: 2000, Computers: 1.4, Software: 1.5, AI: 0 },
  { year: 2010, Computers: 1.6, Software: 1.8, AI: 0.1 },
  { year: 2020, Computers: 2.0, Software: 2.2, AI: 0.5 },
  { year: 2024, Computers: 2.2, Software: 2.5, AI: 2.0 },
  { year: 2026, Computers: 2.3, Software: 2.8, AI: 4.5 },
  { year: 2028, Computers: 2.4, Software: 3.0, AI: 6.5 },
  { year: 2030, Computers: 2.5, Software: 3.2, AI: 8.1 },
];

// Salary data
const salaryData = [
  { role: 'Prompt Engineer Jr.', min: 45, max: 75, avg: 60 },
  { role: 'Prompt Engineer Sr.', min: 80, max: 150, avg: 126 },
  { role: 'AI Strategist', min: 120, max: 200, avg: 160 },
  { role: 'Head of AI', min: 180, max: 335, avg: 250 },
];

// Quiz questions
const quizQuestions = [
  {
    q: '¿Cómo genera texto la IA generativa?',
    options: [
      'Buscando en internet la respuesta exacta',
      'Prediciendo la siguiente palabra más probable',
      'Copiando textos de una base de datos',
      'Usando reglas gramaticales programadas',
    ],
    correct: 1,
    explanation: 'Los LLMs predicen el token (palabra) más probable a partir del contexto. No "piensan": calculan probabilidades.',
  },
  {
    q: '¿Cuáles son los 3 elementos de la técnica de Cebado?',
    options: [
      'Título + Cuerpo + Cierre',
      'Pregunta + Respuesta + Ejemplo',
      'Rol + Contexto + Instrucción',
      'Input + Proceso + Output',
    ],
    correct: 2,
    explanation: 'La técnica de Cebado (Priming) asigna un ROL experto, da CONTEXTO de la situación y una INSTRUCCIÓN clara.',
  },
  {
    q: '¿Qué componente de un agente IA equivale a la "descripción de puesto"?',
    options: [
      'El Modelo (LLM)',
      'Las Herramientas (Tools)',
      'El System Prompt',
      'Los Triggers',
    ],
    correct: 2,
    explanation: 'El System Prompt define quién es el agente, cómo debe comportarse y qué puede hacer — como una descripción de puesto.',
  },
  {
    q: '¿Qué son los "Triggers" en un agente de IA?',
    options: [
      'Los errores que puede cometer',
      'Los eventos que activan al agente para trabajar',
      'Las respuestas que genera',
      'Los costes de operación',
    ],
    correct: 1,
    explanation: 'Los Triggers son los desencadenantes: un mensaje de WhatsApp, un email, una hora del día, un evento en el CRM...',
  },
];

// Agent architecture components
const agentComponents = [
  {
    id: 'model',
    name: 'Modelo (LLM)',
    subtitle: 'El Cerebro',
    desc: 'El motor de inteligencia que razona, planifica y toma decisiones. Ejemplos: GPT-4o, Claude 4, Gemini 2.5.',
    icon: Brain,
    color: 'from-violet-500 to-purple-600',
    bgLight: 'bg-violet-50',
    textColor: 'text-violet-600',
    borderColor: 'border-violet-200',
    analogy: 'Como el cerebro de un empleado',
  },
  {
    id: 'system-prompt',
    name: 'System Prompt',
    subtitle: 'La Descripción de Puesto',
    desc: 'Las instrucciones que definen quién es el agente, cómo debe hablar, qué puede hacer y qué no. Es su personalidad y sus reglas.',
    icon: FileText,
    color: 'from-blue-500 to-cyan-600',
    bgLight: 'bg-blue-50',
    textColor: 'text-blue-600',
    borderColor: 'border-blue-200',
    analogy: 'Como el contrato y manual del empleado',
  },
  {
    id: 'tools',
    name: 'Herramientas (Tools)',
    subtitle: 'Las Manos',
    desc: 'Las conexiones externas que le permiten actuar: Gmail, CRM, Calendar, Slack, bases de datos, APIs.',
    icon: Wrench,
    color: 'from-emerald-500 to-teal-600',
    bgLight: 'bg-emerald-50',
    textColor: 'text-emerald-600',
    borderColor: 'border-emerald-200',
    analogy: 'Como las herramientas de un artesano',
  },
  {
    id: 'knowledge',
    name: 'Knowledge Base',
    subtitle: 'El Contexto',
    desc: 'La información específica que el agente necesita para trabajar bien: catálogos, precios, políticas, historial de clientes.',
    icon: Database,
    color: 'from-amber-500 to-orange-600',
    bgLight: 'bg-amber-50',
    textColor: 'text-amber-600',
    borderColor: 'border-amber-200',
    analogy: 'Como el dossier de formación del empleado',
  },
  {
    id: 'triggers',
    name: 'Triggers',
    subtitle: 'Los Desencadenantes',
    desc: 'Los eventos que activan al agente: un nuevo email, un mensaje de WhatsApp, una hora del día, una venta en el CRM.',
    icon: Zap,
    color: 'from-rose-500 to-pink-600',
    bgLight: 'bg-rose-50',
    textColor: 'text-rose-600',
    borderColor: 'border-rose-200',
    analogy: 'Como el horario de trabajo o la llamada del jefe',
  },
];

// Demo chat steps
const demoChatSteps = [
  { tool: 'trigger', icon: Globe, label: 'Trigger', action: 'Un paciente visita el sitio web y abre el chat.', color: 'text-rose-500' },
  { tool: 'bot', icon: Bot, label: 'Agente', action: '¡Hola! Soy Ana, asistente de Clínica Sonrisas. ¿Cómo te llamas?', color: 'text-blue-500' },
  { tool: 'user', icon: User, label: 'Usuario', action: 'Hola, soy Carlos.', color: 'text-slate-500' },
  { tool: 'system', icon: Brain, label: 'System Prompt', action: 'Identifica nombre → actualiza contexto → pregunta por interés.', color: 'text-violet-500' },
  { tool: 'bot', icon: Bot, label: 'Agente', action: 'Encantada Carlos. ¿En qué tratamiento estás interesado?', color: 'text-blue-500' },
  { tool: 'user', icon: User, label: 'Usuario', action: 'Quiero un blanqueamiento dental.', color: 'text-slate-500' },
  { tool: 'tool', icon: Database, label: 'CRM Tool', action: 'Registra lead: Carlos — Interés: Blanqueamiento.', color: 'text-amber-500' },
  { tool: 'bot', icon: Bot, label: 'Agente', action: '¡Perfecto! ¿Te gustaría agendar una cita de valoración gratuita?', color: 'text-blue-500' },
  { tool: 'user', icon: User, label: 'Usuario', action: 'Sí, por favor.', color: 'text-slate-500' },
  { tool: 'tool', icon: Calendar, label: 'Calendar Tool', action: 'Consulta disponibilidad → genera link de reserva.', color: 'text-emerald-500' },
  { tool: 'bot', icon: Bot, label: 'Agente', action: 'Aquí tienes mi calendario para elegir tu hora: cal.com/sonrisas', color: 'text-blue-500' },
];

// ════════════════════════════════════════════════════════════════
// ANIMATED COMPONENTS
// ════════════════════════════════════════════════════════════════

// Animated counter
const AnimatedCounter = ({ end, duration = 2000, prefix = '', suffix = '' }: { end: number; duration?: number; prefix?: string; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const steps = 60;
    const increment = end / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [started, end, duration]);

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
};

// Token Predictor
const TokenPredictor = () => {
  const [step, setStep] = useState(0);
  const predictions = [
    { word: 'herramienta', prob: 85, color: '#10b981' },
    { word: 'amenaza', prob: 10, color: '#ef4444' },
    { word: 'moda', prob: 5, color: '#f59e0b' },
  ];

  return (
    <div className="bg-slate-900 rounded-2xl p-5 md:p-6 text-white shadow-2xl border border-slate-700/50 w-full relative overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)', backgroundSize: '16px 16px' }} />

      <div className="flex items-center gap-2 mb-4 border-b border-slate-700/50 pb-3 relative z-10">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
          <Cpu className="w-4 h-4" />
        </div>
        <div>
          <span className="text-xs font-bold text-slate-300 block">Motor de Predicción</span>
          <span className="text-[10px] text-slate-500 font-mono">LLM · 175B parámetros</span>
        </div>
      </div>

      <div className="font-mono text-lg md:text-xl mb-6 relative z-10">
        <span className="text-slate-400">La IA es una </span>
        {step === 2 && (
          <span className="text-emerald-400 font-bold bg-emerald-400/10 px-1.5 py-0.5 rounded-lg animate-pulse">
            herramienta
          </span>
        )}
        {step === 0 && <span className="animate-pulse text-pink-500 font-bold">|</span>}
      </div>

      {step === 1 && (
        <div className="space-y-3 mb-4 relative z-10">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-3">Calculando probabilidades...</p>
          {predictions.map((p, i) => (
            <div key={i} className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-mono text-slate-300">"{p.word}"</span>
                <span className="font-bold" style={{ color: p.color }}>{p.prob}%</span>
              </div>
              <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${p.prob}%`, backgroundColor: p.color, transitionDelay: `${i * 200}ms` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 flex justify-end relative z-10">
        {step !== 1 && (
          <button
            onClick={() => { if (step === 2) setStep(0); else { setStep(1); setTimeout(() => setStep(2), 1800); } }}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
              step === 2
                ? 'bg-slate-700 hover:bg-slate-600 text-white'
                : 'bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white shadow-lg shadow-pink-500/25'
            }`}
          >
            {step === 2 ? 'Reiniciar' : 'Predecir Token'}
            {step === 0 && <Sparkles className="w-4 h-4" />}
          </button>
        )}
        {step === 1 && (
          <div className="px-4 py-2 text-sm text-slate-400 flex items-center gap-2">
            <div className="w-2 h-2 bg-pink-500 rounded-full animate-ping" />
            Procesando...
          </div>
        )}
      </div>
    </div>
  );
};

// Priming Builder Interactive
const PrimingBuilder = () => {
  const [activeField, setActiveField] = useState<string | null>(null);
  const [filled, setFilled] = useState<Record<string, boolean>>({});

  const fields = [
    {
      id: 'rol',
      label: 'ROL',
      placeholder: 'Eres un experto en marketing digital con 15 años de experiencia en e-commerce y estrategia de contenidos.',
      color: 'from-violet-500 to-purple-600',
      bgColor: 'bg-violet-50',
      borderColor: 'border-violet-300',
      icon: User,
    },
    {
      id: 'contexto',
      label: 'CONTEXTO',
      placeholder: 'Trabajo en una tienda online de productos ecológicos. Tenemos 500 productos y vendemos en España y Latinoamérica. Nuestro público objetivo son mujeres de 30-50 años.',
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-300',
      icon: BookOpen,
    },
    {
      id: 'instruccion',
      label: 'INSTRUCCIÓN',
      placeholder: 'Crea un calendario editorial de 30 días para Instagram con: fecha, tema, tipo de contenido (reel/carrusel/story), copy del post y 5 hashtags relevantes.',
      color: 'from-emerald-500 to-teal-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-300',
      icon: Target,
    },
  ];

  const allFilled = Object.keys(filled).length === 3;

  return (
    <div className="w-full space-y-3">
      <div className="text-center mb-4">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 text-pink-700 text-xs font-bold px-3 py-1.5 rounded-full">
          <Target className="w-3 h-3" />
          Construye tu prompt paso a paso
        </div>
      </div>

      {fields.map((field) => (
        <div key={field.id} className="group">
          <button
            onClick={() => {
              setActiveField(activeField === field.id ? null : field.id);
              setFilled(prev => ({ ...prev, [field.id]: true }));
            }}
            className={`w-full text-left rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
              activeField === field.id
                ? `${field.borderColor} shadow-lg`
                : filled[field.id]
                  ? `${field.borderColor} border-opacity-50 shadow-sm`
                  : 'border-slate-200 hover:border-slate-300 shadow-sm'
            }`}
          >
            <div className={`flex items-center gap-3 p-4 ${filled[field.id] ? field.bgColor : 'bg-white'}`}>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${field.color} flex items-center justify-center text-white shadow-md flex-shrink-0`}>
                <field.icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-black text-sm tracking-wider text-slate-800">#{field.label}</span>
                  {filled[field.id] && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                </div>
              </div>
              <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${activeField === field.id ? 'rotate-180' : ''}`} />
            </div>

            {activeField === field.id && (
              <div className="px-4 pb-4 bg-white border-t border-slate-100">
                <div className="mt-3 p-3 bg-slate-900 rounded-xl text-sm text-slate-300 font-mono leading-relaxed">
                  <span className="text-pink-400 font-bold">›</span> {field.placeholder}
                </div>
              </div>
            )}
          </button>
        </div>
      ))}

      {allFilled && (
        <div className="mt-4 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl text-center animate-fade-in-up">
          <div className="flex items-center justify-center gap-2 text-emerald-700 font-bold">
            <Sparkles className="w-5 h-5" />
            ¡Prompt completo! Ahora la IA tiene el contexto necesario.
          </div>
          <p className="text-emerald-600 text-sm mt-1">Esta técnica es la base de todo buen prompt profesional.</p>
        </div>
      )}
    </div>
  );
};

// Agent Demo Chat
const AgentDemoChat = () => {
  const [currentStep, setCurrentStep] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isPlaying || currentStep >= demoChatSteps.length - 1) {
      if (currentStep >= demoChatSteps.length - 1) setIsPlaying(false);
      return;
    }
    const timer = setTimeout(() => setCurrentStep(prev => prev + 1), 2200);
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentStep]);

  const startDemo = () => {
    setCurrentStep(0);
    setIsPlaying(true);
  };

  const resetDemo = () => {
    setCurrentStep(-1);
    setIsPlaying(false);
  };

  const visibleSteps = demoChatSteps.slice(0, currentStep + 1);

  return (
    <div className="w-full bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden flex flex-col" style={{ maxHeight: '520px' }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-white font-bold text-sm">Ana — Clínica Sonrisas</div>
            <div className="text-slate-400 text-xs flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              Agente IA Activo
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {currentStep === -1 ? (
            <button onClick={startDemo} className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 hover:opacity-90 transition shadow-lg">
              <Play className="w-3 h-3" /> Iniciar Demo
            </button>
          ) : (
            <button onClick={resetDemo} className="px-3 py-1.5 bg-slate-700 text-slate-300 text-xs font-bold rounded-lg hover:bg-slate-600 transition">
              Reiniciar
            </button>
          )}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50 min-h-[300px]" style={{ maxHeight: '380px' }}>
        {currentStep === -1 && (
          <div className="h-full flex items-center justify-center text-center p-8">
            <div>
              <Bot className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">Pulsa "Iniciar Demo" para ver cómo un agente atiende a un paciente en tiempo real</p>
            </div>
          </div>
        )}

        {visibleSteps.map((step, idx) => {
          const Icon = step.icon;
          const isUser = step.tool === 'user';
          const isSystem = step.tool === 'system' || step.tool === 'tool' || step.tool === 'trigger';

          if (isSystem) {
            return (
              <div key={idx} className="flex justify-center animate-fade-in-up">
                <div className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-full px-3 py-1.5 shadow-sm">
                  <Icon className={`w-3.5 h-3.5 ${step.color}`} />
                  <span className="text-[11px] font-semibold text-slate-500">{step.label}:</span>
                  <span className="text-[11px] text-slate-600">{step.action}</span>
                </div>
              </div>
            );
          }

          return (
            <div key={idx} className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${
                isUser
                  ? 'bg-gradient-to-r from-slate-700 to-slate-800 text-white rounded-br-md'
                  : 'bg-white border border-slate-200 text-slate-700 rounded-bl-md'
              }`}>
                {!isUser && (
                  <div className="flex items-center gap-1.5 mb-1">
                    <Icon className={`w-3.5 h-3.5 ${step.color}`} />
                    <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">{step.label}</span>
                  </div>
                )}
                <p className="text-sm leading-relaxed">{step.action}</p>
              </div>
            </div>
          );
        })}

        {isPlaying && currentStep < demoChatSteps.length - 1 && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-md px-4 py-2 shadow-sm flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>
          </div>
        )}

        {currentStep >= demoChatSteps.length - 1 && currentStep >= 0 && (
          <div className="flex justify-center pt-2 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-4 py-2.5 shadow-sm">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-bold">Lead captado en 45 segundos — 0% intervención humana</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════════

interface Day1Props {
  setRoute: (route: AppRoute) => void;
}

const Day1: React.FC<Day1Props> = ({ setRoute }) => {
  const [activeSection, setActiveSection] = useState(0);
  const [expandedAgent, setExpandedAgent] = useState<string | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const goNext = () => setActiveSection(prev => Math.min(prev + 1, SECTIONS.length - 1));
  const goPrev = () => setActiveSection(prev => Math.max(prev - 1, 0));

  // Keyboard nav
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); goNext(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); goPrev(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [activeSection]);

  const progress = ((activeSection + 1) / SECTIONS.length) * 100;
  const section = SECTIONS[activeSection];
  const quizScore = Object.entries(quizAnswers).filter(([qIdx, ans]) => quizQuestions[Number(qIdx)].correct === ans).length;

  return (
    <Layout title="Día 1: Fundamentos de IA" onBack={() => setRoute(AppRoute.HOME)}>
      <style>{`
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes glow { 0%, 100% { box-shadow: 0 0 5px rgba(255,40,120,0.3); } 50% { box-shadow: 0 0 20px rgba(255,40,120,0.6); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes gradient { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-glow { animation: glow 2s ease-in-out infinite; }
        .animate-slide-up { animation: slideUp 0.5s ease-out forwards; }
        .animate-gradient { background-size: 200% 200%; animation: gradient 3s ease infinite; }
      `}</style>

      <div className="flex flex-col items-center w-full max-w-5xl mx-auto px-2 md:px-4">

        {/* ── Progress + Section Nav ── */}
        <div className="w-full mb-6">
          {/* Progress bar */}
          <div className="w-full bg-slate-200 rounded-full h-1.5 mb-4">
            <div className="h-1.5 rounded-full transition-all duration-500 bg-gradient-to-r from-pink-500 to-purple-600" style={{ width: `${progress}%` }} />
          </div>

          {/* Section pills - scrollable on mobile */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {SECTIONS.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setActiveSection(idx)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  idx === activeSection
                    ? 'bg-slate-800 text-white shadow-lg scale-105'
                    : idx < activeSection
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-slate-100 text-slate-400'
                }`}
              >
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
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-3xl bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 flex items-center justify-center text-5xl md:text-6xl shadow-2xl animate-float">
                  🚀
                </div>
                <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 blur-xl -z-10" />
              </div>

              <div className="max-w-2xl space-y-4">
                <h1 className="text-3xl md:text-5xl font-black text-slate-800 leading-tight">
                  Bienvenido a la{' '}
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF2878] to-[#6366f1] animate-gradient">
                    Era de la IA
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-slate-500 leading-relaxed">
                  En los próximos minutos vas a entender qué es la IA, cómo hablarle para obtener resultados profesionales, y cómo construir tu primer empleado digital.
                </p>
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-2xl">
                {[
                  { icon: Brain, label: 'IA Generativa', value: 'ChatGPT, Claude...' },
                  { icon: Target, label: 'Prompting', value: 'Hablarle bien' },
                  { icon: DollarSign, label: 'Salarios', value: '$126K-$335K' },
                  { icon: Bot, label: 'Agentes IA', value: 'Tu empleado digital' },
                ].map((item, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm hover:shadow-md transition-shadow">
                    <item.icon className="w-6 h-6 text-slate-400 mb-2" />
                    <div className="text-xs font-bold text-slate-800">{item.label}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{item.value}</div>
                  </div>
                ))}
              </div>

              {/* Investment chart */}
              <div className="w-full bg-white rounded-2xl border border-slate-100 shadow-sm p-4 md:p-6">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-indigo-500" />
                  <h3 className="font-bold text-slate-800">Inversión en IA vs. Otras Tecnologías</h3>
                  <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full text-slate-500 font-mono ml-auto">ARK Invest, 2024</span>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="year" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} domain={[0, 9]} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }} />
                      <Legend />
                      <Line type="monotone" dataKey="Computers" stroke="#94a3b8" strokeWidth={2} dot={false} opacity={0.5} />
                      <Line type="monotone" dataKey="Software" stroke="#eab308" strokeWidth={2} dot={false} opacity={0.6} />
                      <Line type="monotone" dataKey="AI" name="IA" stroke="#6366f1" strokeWidth={4} dot={false} activeDot={{ r: 6, strokeWidth: 0 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-xs text-slate-400 mt-2 text-center">La IA está creciendo más rápido que cualquier tecnología anterior. Fuente: ARK Investment Management.</p>
              </div>
            </div>
          )}

          {/* ═══════ SECTION 1: WHAT IS AI ═══════ */}
          {activeSection === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-3">
                  ¿Qué es la <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-purple-600">IA Generativa</span>?
                </h2>
                <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                  ChatGPT, Claude, Gemini, Grok... todos funcionan igual por dentro.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Explanation */}
                <div className="space-y-4">
                  {[
                    { icon: Brain, title: 'Predice, no piensa', text: 'La IA genera texto prediciendo la siguiente palabra más probable. Miles de millones de parámetros calculan qué token viene después.', color: 'text-violet-500', bg: 'bg-violet-50' },
                    { icon: Eye, title: 'Caja negra', text: 'Su funcionamiento interno es opaco: no sabemos exactamente por qué elige cada palabra. Por eso puede "alucinar" datos falsos.', color: 'text-amber-500', bg: 'bg-amber-50' },
                    { icon: Target, title: 'Tú decides la calidad', text: 'El resultado depende de CÓMO le hablas. Un prompt vago da resultados mediocres. Un prompt profesional da resultados expertos.', color: 'text-emerald-500', bg: 'bg-emerald-50' },
                  ].map((item, i) => (
                    <div key={i} className={`${item.bg} border border-slate-100 rounded-2xl p-5 shadow-sm`}>
                      <div className="flex items-center gap-3 mb-2">
                        <item.icon className={`w-6 h-6 ${item.color}`} />
                        <h3 className="font-bold text-slate-800">{item.title}</h3>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed">{item.text}</p>
                    </div>
                  ))}
                </div>

                {/* Token Predictor */}
                <div className="flex flex-col justify-center">
                  <div className="text-center mb-4">
                    <span className="inline-flex items-center gap-1 bg-slate-800 text-white text-xs font-bold px-3 py-1 rounded-full">
                      <Cpu className="w-3 h-3" /> Pruébalo tú mismo
                    </span>
                  </div>
                  <TokenPredictor />
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2">
                    <Shield className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-700">
                      <strong>Importante:</strong> Nunca confíes ciegamente en la IA. Siempre verifica datos críticos. La IA es una herramienta, no un oráculo.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ═══════ SECTION 2: PROMPTING ═══════ */}
          {activeSection === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-4">
                <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-3">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">Prompt Engineering</span>
                </h2>
                <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                  El arte de hablarle a la IA para obtener resultados de nivel experto. No necesitas programar.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Left: Explanation */}
                <div className="space-y-4">
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                    <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                      <Target className="w-5 h-5 text-pink-500" />
                      La Técnica de Cebado (Priming)
                    </h3>
                    <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                      Es LA técnica fundamental. Antes de pedirle nada a la IA, le das contexto con 3 ingredientes:
                    </p>

                    <div className="space-y-3">
                      {[
                        { num: '1', label: 'ROL', desc: 'Dile quién es: "Eres un experto en..."', color: 'bg-violet-500' },
                        { num: '2', label: 'CONTEXTO', desc: 'Explica tu situación: "Trabajo en..."', color: 'bg-blue-500' },
                        { num: '3', label: 'INSTRUCCIÓN', desc: 'Di exactamente qué quieres: "Crea un..."', color: 'bg-emerald-500' },
                      ].map((item) => (
                        <div key={item.num} className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-lg ${item.color} text-white flex items-center justify-center font-black text-sm flex-shrink-0 shadow-sm`}>
                            {item.num}
                          </div>
                          <div>
                            <span className="font-bold text-slate-800 text-sm">{item.label}</span>
                            <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bad vs good prompt comparison */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                      <div className="text-[10px] font-bold text-red-400 uppercase tracking-wider mb-2">Prompt mediocre</div>
                      <p className="text-xs text-red-700 font-mono">"Hazme un plan de marketing"</p>
                    </div>
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                      <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider mb-2">Prompt profesional</div>
                      <p className="text-xs text-emerald-700 font-mono">"Eres un CMO con 15 años en e-commerce. Mi tienda vende... Crea un plan de 90 días con..."</p>
                    </div>
                  </div>
                </div>

                {/* Right: Interactive builder */}
                <PrimingBuilder />
              </div>
            </div>
          )}

          {/* ═══════ SECTION 3: SALARIES ═══════ */}
          {activeSection === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-4">
                <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-3">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">¿Cuánto gana</span> un Prompt Engineer?
                </h2>
                <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                  El mercado valora esta habilidad. No necesitas ser programador.
                </p>
              </div>

              {/* Salary bars */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 md:p-8">
                <div className="space-y-6">
                  {salaryData.map((role, i) => {
                    const maxVal = 350;
                    return (
                      <div key={i} className="group">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-sm text-slate-700">{role.role}</span>
                          <span className="text-sm font-mono font-bold text-slate-800">
                            ${role.min}K – ${role.max}K
                          </span>
                        </div>
                        <div className="h-8 bg-slate-100 rounded-full overflow-hidden relative">
                          {/* Min range */}
                          <div
                            className="absolute top-0 h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r from-amber-300 to-amber-400"
                            style={{ left: `${(role.min / maxVal) * 100}%`, width: `${((role.max - role.min) / maxVal) * 100}%`, transitionDelay: `${i * 200}ms` }}
                          />
                          {/* Average marker */}
                          <div
                            className="absolute top-0 h-full w-1 bg-orange-600 shadow-md z-10 transition-all duration-1000 ease-out"
                            style={{ left: `${(role.avg / maxVal) * 100}%`, transitionDelay: `${i * 200 + 400}ms` }}
                          />
                          <div
                            className="absolute -top-6 text-[10px] font-bold text-orange-600 transition-all duration-1000"
                            style={{ left: `${(role.avg / maxVal) * 100}%`, transform: 'translateX(-50%)', transitionDelay: `${i * 200 + 400}ms` }}
                          >
                            ${role.avg}K avg
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { label: 'Crecimiento anual', value: '+15%', icon: TrendingUp, color: 'text-emerald-600' },
                    { label: 'No requiere programar', value: '✓', icon: CheckCircle, color: 'text-blue-600' },
                    { label: 'Demanda hasta', value: '2030+', icon: Calendar, color: 'text-purple-600' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-slate-50 rounded-xl p-3 text-center">
                      <stat.icon className={`w-5 h-5 ${stat.color} mx-auto mb-1`} />
                      <div className={`text-lg font-black ${stat.color}`}>{stat.value}</div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase">{stat.label}</div>
                    </div>
                  ))}
                </div>

                <p className="text-xs text-slate-400 mt-4 text-center">Fuente: Glassdoor, LinkedIn, Indeed — Datos para EE.UU. 2024-2025</p>
              </div>
            </div>
          )}

          {/* ═══════ SECTION 4: AGENTS ═══════ */}
          {activeSection === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-4">
                <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-3">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-purple-600">Anatomía de un Agente IA</span>
                </h2>
                <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                  De "la IA me responde" a "la IA hace cosas por mí". Estos son los 5 ingredientes.
                </p>
              </div>

              {/* Agent architecture - 5 components */}
              <div className="space-y-3">
                {agentComponents.map((comp, idx) => {
                  const Icon = comp.icon;
                  const isExpanded = expandedAgent === comp.id;

                  return (
                    <button
                      key={comp.id}
                      onClick={() => setExpandedAgent(isExpanded ? null : comp.id)}
                      className={`w-full text-left rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
                        isExpanded
                          ? `${comp.borderColor} shadow-lg`
                          : 'border-slate-200 hover:border-slate-300 shadow-sm'
                      }`}
                      style={{ animationDelay: `${idx * 100}ms` }}
                    >
                      <div className={`flex items-center gap-4 p-4 md:p-5 ${isExpanded ? comp.bgLight : 'bg-white'}`}>
                        {/* Number */}
                        <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${comp.color} text-white flex items-center justify-center font-black text-sm shadow-md flex-shrink-0`}>
                          {idx + 1}
                        </div>

                        {/* Icon */}
                        <div className={`w-12 h-12 rounded-xl ${comp.bgLight} ${comp.textColor} flex items-center justify-center flex-shrink-0`}>
                          <Icon className="w-6 h-6" />
                        </div>

                        {/* Text */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-slate-800">{comp.name}</span>
                            <span className={`text-xs font-semibold ${comp.textColor} bg-white px-2 py-0.5 rounded-full border ${comp.borderColor}`}>
                              {comp.subtitle}
                            </span>
                          </div>
                          {!isExpanded && (
                            <p className="text-xs text-slate-500 mt-0.5 truncate">{comp.analogy}</p>
                          )}
                        </div>

                        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`} />
                      </div>

                      {isExpanded && (
                        <div className="px-5 pb-5 bg-white border-t border-slate-100">
                          <p className="text-sm text-slate-600 leading-relaxed mt-3 mb-3">{comp.desc}</p>
                          <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2">
                            <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0" />
                            <p className="text-xs text-slate-600"><strong>Analogía:</strong> {comp.analogy}</p>
                          </div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Visual summary */}
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 md:p-6 text-center">
                <p className="text-slate-400 text-xs uppercase tracking-wider font-bold mb-3">Fórmula del Agente</p>
                <div className="flex items-center justify-center gap-2 flex-wrap text-white">
                  {agentComponents.map((comp, idx) => (
                    <React.Fragment key={comp.id}>
                      <div className={`px-3 py-1.5 rounded-lg bg-gradient-to-r ${comp.color} text-xs font-bold shadow-md`}>
                        {comp.subtitle}
                      </div>
                      {idx < agentComponents.length - 1 && <span className="text-slate-500 font-bold">+</span>}
                    </React.Fragment>
                  ))}
                  <span className="text-slate-500 font-bold">=</span>
                  <div className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 text-sm font-black shadow-lg animate-glow">
                    🤖 Agente IA
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ═══════ SECTION 5: AGENT DEMO ═══════ */}
          {activeSection === 5 && (
            <div className="space-y-6">
              <div className="text-center mb-4">
                <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-3">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">Demo en Vivo</span>: Agente de Clínica Dental
                </h2>
                <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                  Mira cómo un agente real atiende a un paciente, captura el lead y agenda la cita — sin intervención humana.
                </p>
              </div>

              <div className="grid md:grid-cols-5 gap-4">
                {/* Chat - 3 columns */}
                <div className="md:col-span-3">
                  <AgentDemoChat />
                </div>

                {/* Architecture panel - 2 columns */}
                <div className="md:col-span-2 space-y-3">
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Componentes del Agente</h4>
                    <div className="space-y-2">
                      {[
                        { icon: Brain, label: 'Modelo', value: 'GPT-4o', color: 'text-violet-500' },
                        { icon: FileText, label: 'System Prompt', value: 'Asistente dental amable', color: 'text-blue-500' },
                        { icon: Wrench, label: 'Tools', value: 'CRM + Calendar', color: 'text-emerald-500' },
                        { icon: Database, label: 'Knowledge', value: 'Catálogo de servicios', color: 'text-amber-500' },
                        { icon: Zap, label: 'Trigger', value: 'Chat del sitio web', color: 'text-rose-500' },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-slate-50">
                          <item.icon className={`w-4 h-4 ${item.color} flex-shrink-0`} />
                          <span className="text-xs font-bold text-slate-700">{item.label}</span>
                          <span className="text-xs text-slate-500 ml-auto">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-4">
                    <h4 className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2">Impacto</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center">
                        <div className="text-2xl font-black text-emerald-700">45s</div>
                        <div className="text-[10px] text-emerald-600 font-bold">Tiempo de respuesta</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-black text-emerald-700">0%</div>
                        <div className="text-[10px] text-emerald-600 font-bold">Intervención humana</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-black text-emerald-700">24/7</div>
                        <div className="text-[10px] text-emerald-600 font-bold">Disponibilidad</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-black text-emerald-700">+40%</div>
                        <div className="text-[10px] text-emerald-600 font-bold">Conversión leads</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-800 rounded-2xl p-4 text-center">
                    <p className="text-xs text-slate-400 mb-2">Plataformas para crearlo:</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {['Voiceflow', 'Stack AI', 'n8n', 'Make'].map(p => (
                        <span key={p} className="px-2 py-1 bg-slate-700 text-slate-300 rounded text-xs font-bold">{p}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ═══════ SECTION 6: QUIZ ═══════ */}
          {activeSection === 6 && (
            <div className="space-y-6">
              <div className="text-center mb-4">
                <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-3">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-700 to-slate-900">Test Final</span>
                </h2>
                <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                  Comprueba cuánto has aprendido. 4 preguntas rápidas.
                </p>
              </div>

              <div className="space-y-4 max-w-2xl mx-auto">
                {quizQuestions.map((q, qIdx) => {
                  const answered = quizAnswers[qIdx] !== undefined;
                  const isCorrect = quizAnswers[qIdx] === q.correct;

                  return (
                    <div key={qIdx} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                      <div className="p-4 md:p-5">
                        <div className="flex items-start gap-3 mb-4">
                          <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                            {qIdx + 1}
                          </div>
                          <h3 className="font-bold text-slate-800 text-sm md:text-base">{q.q}</h3>
                        </div>

                        <div className="space-y-2 ml-11">
                          {q.options.map((opt, optIdx) => {
                            const isSelected = quizAnswers[qIdx] === optIdx;
                            const showResult = quizSubmitted || answered;
                            const optCorrect = optIdx === q.correct;

                            return (
                              <button
                                key={optIdx}
                                onClick={() => {
                                  if (quizSubmitted) return;
                                  setQuizAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
                                }}
                                disabled={quizSubmitted}
                                className={`w-full text-left p-3 rounded-xl border-2 text-sm transition-all ${
                                  showResult && optCorrect
                                    ? 'bg-emerald-50 border-emerald-400 text-emerald-800'
                                    : showResult && isSelected && !optCorrect
                                      ? 'bg-red-50 border-red-300 text-red-700'
                                      : isSelected
                                        ? 'bg-indigo-50 border-indigo-400 text-indigo-800'
                                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  {showResult && optCorrect && <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />}
                                  {opt}
                                </div>
                              </button>
                            );
                          })}
                        </div>

                        {quizSubmitted && (
                          <div className={`mt-3 ml-11 p-3 rounded-xl text-xs ${
                            isCorrect ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                          }`}>
                            <strong>{isCorrect ? '¡Correcto!' : 'Respuesta correcta:'}</strong> {q.explanation}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {!quizSubmitted && Object.keys(quizAnswers).length === quizQuestions.length && (
                  <button
                    onClick={() => setQuizSubmitted(true)}
                    className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition text-lg flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" /> Comprobar Respuestas
                  </button>
                )}

                {quizSubmitted && (
                  <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-center text-white shadow-xl">
                    <div className="text-5xl font-black mb-2">
                      {quizScore}/{quizQuestions.length}
                    </div>
                    <p className="text-slate-400 mb-4">
                      {quizScore === quizQuestions.length
                        ? '¡Perfecto! Dominas los fundamentos.'
                        : quizScore >= 3
                          ? '¡Muy bien! Casi lo tienes todo.'
                          : '¡Buen intento! Revisa las secciones anteriores.'}
                    </p>
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => { setQuizAnswers({}); setQuizSubmitted(false); }}
                        className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-xl text-sm font-bold transition"
                      >
                        Reintentar
                      </button>
                      <button
                        onClick={() => setRoute(AppRoute.HOME)}
                        className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl text-sm font-bold transition shadow-lg"
                      >
                        Volver al inicio
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* ── Bottom Navigation ── */}
        <div className="w-full flex justify-between items-center mt-8 mb-4 px-2">
          <button
            onClick={goPrev}
            disabled={activeSection === 0}
            className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all disabled:opacity-0 text-slate-500 hover:text-slate-800 hover:bg-slate-100"
          >
            <ArrowLeft className="w-4 h-4" /> Anterior
          </button>

          <span className="text-xs text-slate-400 font-bold">
            {activeSection + 1} / {SECTIONS.length}
          </span>

          {activeSection < SECTIONS.length - 1 ? (
            <button
              onClick={goNext}
              className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg hover:shadow-xl hover:scale-105"
            >
              Siguiente <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => setRoute(AppRoute.HOME)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm bg-slate-800 text-white shadow-lg hover:bg-slate-700 transition"
            >
              Finalizar <CheckCircle className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>
    </Layout>
  );
};

export default Day1;
