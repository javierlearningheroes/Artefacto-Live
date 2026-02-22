import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import Layout from './Layout';
import CTAModal from './CTAModal';
import { AppRoute, ChatMessage } from '../types';
import { COLORS } from '../constants';
import { enhancePrompt, enhanceAgentPrompt, sendPersonalUseCaseMessage, sendProfessionalUseCaseMessage } from '../services/geminiService';
import { trackInteraction, getCTAConfig } from '../services/trackingService';

interface Day2Props {
  setRoute: (route: AppRoute) => void;
}

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button onClick={handleCopy} className="flex items-center gap-2 py-2 px-4 rounded-xl border-2 border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-colors text-sm">
      {copied ? (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Copiado
        </>
      ) : (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Copiar
        </>
      )}
    </button>
  );
};

// ─── Use Case Chat Component ─────────────────────────────────────────────
const UseCaseChat = ({ type }: { type: 'personal' | 'professional' }) => {
  const isPersonal = type === 'personal';
  const icon = isPersonal ? '🏡' : '💼';
  const title = isPersonal ? 'Descubre tus Casos de Uso Personales' : 'Descubre tus Casos de Uso Profesionales';
  const subtitle = isPersonal
    ? 'Conversa conmigo para descubrir cómo la IA puede mejorar tu día a día, tus hobbies y tu vida personal.'
    : 'Conversa conmigo para descubrir cómo la IA puede transformar tu carrera, tu negocio y tu productividad.';

  const initialMessage = isPersonal
    ? '¡Hola! Soy tu consultor de casos de uso personales, creado por Learning Heroes. Mi objetivo es ayudarte a descubrir cómo la IA generativa puede mejorar tu día a día. Más adelante, en el programa, aprenderás a crear agentes como yo.\n\nPara empezar, **cuéntame: ¿cómo es un día normal en tu vida? ¿Qué rutinas tienes por la mañana?**'
    : '¡Hola! Soy tu consultor de casos de uso profesionales, creado por Learning Heroes. Mi objetivo es ayudarte a descubrir cómo la IA generativa puede transformar tu productividad y tu negocio. Más adelante, en el programa, aprenderás a crear agentes como yo.\n\nPara empezar, **cuéntame: ¿a qué te dedicas y en qué sector trabaja tu empresa?**';

  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: initialMessage }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const sendFn = isPersonal ? sendPersonalUseCaseMessage : sendProfessionalUseCaseMessage;
      const reply = await sendFn(history, userMsg);
      if (reply) {
        setMessages(prev => [...prev, { role: 'model', text: reply }]);
        trackInteraction('day2_prompt_enhance');
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Lo siento, tuve un problema pensando la respuesta. ¿Podrías repetirlo?", isError: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const accentColor = isPersonal ? '#FF2878' : '#243F4C';

  return (
    <div className="space-y-4">
      {/* Info header */}
      <div className={`${isPersonal ? 'bg-pink-50 border-pink-200' : 'bg-blue-50 border-blue-200'} border rounded-2xl p-5`}>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{icon}</span>
          <div>
            <h3 className={`font-bold text-lg ${isPersonal ? 'text-pink-900' : 'text-blue-900'}`}>{title}</h3>
            <p className={`text-sm ${isPersonal ? 'text-pink-600' : 'text-blue-600'}`}>{subtitle}</p>
          </div>
        </div>
      </div>

      {/* Chat container */}
      <div className="flex flex-col h-[60vh] bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
          {messages.map((msg, idx) => {
            const isUser = msg.role === 'user';

            return (
              <div key={idx} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                {!isUser && (
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs mr-2 mt-1 shadow-sm flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${accentColor}, ${isPersonal ? '#ff4a90' : '#2a5d70'})` }}>
                    {icon}
                  </div>
                )}

                <div className={`max-w-[85%] md:max-w-[75%] p-4 rounded-2xl text-base shadow-sm leading-relaxed ${
                  isUser
                    ? 'bg-slate-800 text-white rounded-br-none'
                    : 'bg-white text-slate-700 border border-slate-200 rounded-tl-none'
                } ${msg.isError ? 'border-red-500 bg-red-50 text-red-800' : ''}`}>
                  <ReactMarkdown
                    components={{
                      p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                      strong: ({node, ...props}) => (
                        <strong className={`font-bold ${isUser ? 'text-white' : 'text-[#243F4C]'}`} {...props} />
                      ),
                      ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-2 space-y-1" {...props} />,
                      ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-2 space-y-1" {...props} />,
                      li: ({node, ...props}) => <li className="pl-1" {...props} />,
                      table: ({node, ...props}) => <div className="overflow-x-auto my-3"><table className="w-full border-collapse text-sm" {...props} /></div>,
                      thead: ({node, ...props}) => <thead className="bg-slate-100" {...props} />,
                      th: ({node, ...props}) => <th className="border border-slate-200 px-3 py-2 text-left font-bold text-slate-700" {...props} />,
                      td: ({node, ...props}) => <td className="border border-slate-200 px-3 py-2 text-slate-600" {...props} />,
                    }}
                  >
                    {msg.text}
                  </ReactMarkdown>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex justify-start items-end">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs mr-2 shadow-sm flex-shrink-0 mb-1"
                style={{ background: `linear-gradient(135deg, ${accentColor}, ${isPersonal ? '#ff4a90' : '#2a5d70'})` }}>
                {icon}
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 rounded-tl-none flex items-center gap-2 shadow-sm">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '75ms' }}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="p-3 md:p-4 bg-white border-t border-slate-200">
          <div className="flex gap-2 md:gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isPersonal ? "Cuéntame sobre tu día a día..." : "Cuéntame sobre tu trabajo..."}
              className="flex-1 p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none text-base bg-white text-slate-900 placeholder-slate-400 shadow-inner"
            />
            <button onClick={handleSend} disabled={isLoading || !input.trim()}
              className="px-4 md:px-6 py-3 rounded-xl font-bold text-white transition-all transform active:scale-95 hover:shadow-lg disabled:opacity-50"
              style={{ backgroundColor: accentColor }}>
              Enviar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main Day2 Component ─────────────────────────────────────────────────
const Day2: React.FC<Day2Props> = ({ setRoute }) => {
  const [mode, setMode] = useState<'image' | 'video' | 'agent' | 'usecase-personal' | 'usecase-pro'>('image');
  const [prompt, setPrompt] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isOptimized, setIsOptimized] = useState(false);
  const [showCTA, setShowCTA] = useState(false);
  const [ctaConfig, setCTAConfig] = useState<{ title: string; message: string; url: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Agent template fields
  const [agentRol, setAgentRol] = useState('');
  const [agentContexto, setAgentContexto] = useState('');
  const [agentInstruccion, setAgentInstruccion] = useState('');
  const [agentResult, setAgentResult] = useState<string | null>(null);

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
      console.error(err);
      setError(err?.message || "Error al mejorar el prompt. Revisa tu API key y conexión.");
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
      console.error(err);
      setError(err?.message || "Error al generar el system prompt. Revisa tu API key y conexión.");
    } finally {
      setIsEnhancing(false);
    }
  };

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
    setIsOptimized(false);
  };

  const handleTabChange = (newMode: typeof mode) => {
    setMode(newMode);
    setPrompt('');
    setIsOptimized(false);
    setAgentRol('');
    setAgentContexto('');
    setAgentInstruccion('');
    setAgentResult(null);
  };

  const placeholders: Record<string, string> = {
    image: "Ej: un robot futurista pintando un cuadro en un estudio lleno de luz natural...",
    video: "Ej: un gato conduciendo un coche deportivo de neón por una ciudad cyberpunk...",
  };

  const tips: Record<string, string[]> = {
    image: [
      "Describe el sujeto principal con detalle",
      "Incluye el estilo artístico (fotorealista, acuarela, 3D...)",
      "Menciona la iluminación y el ambiente",
      "Añade la composición (primer plano, vista aérea...)",
    ],
    video: [
      "Describe la acción/movimiento principal",
      "Especifica la duración aproximada de la escena",
      "Incluye transiciones o efectos de cámara",
      "Menciona el tono (épico, divertido, profesional...)",
    ],
  };

  return (
    <Layout title="Día 2: Taller de Prompts" onBack={() => setRoute(AppRoute.HOME)}>
      <CTAModal isOpen={showCTA} onClose={() => setShowCTA(false)}
        title={ctaConfig?.title || "¡Prompt mejorado!"}
        message={ctaConfig?.message || "Crear buenos prompts es una habilidad clave. En IA Heroes Pro aprenderás técnicas avanzadas de prompt engineering para imagen, video y agentes."}
        ctaUrl={ctaConfig?.url}
        ctaSource="day2"
      />

      <div className="space-y-6 pb-10">

        {/* Mode Toggles — 2 rows on mobile */}
        <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-200">
          {/* Top row: tools */}
          <div className="flex mb-1.5">
            <button onClick={() => handleTabChange('image')}
              className={`flex-1 py-2.5 px-2 rounded-lg text-sm font-bold transition-all ${mode === 'image' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              📸 Imagen
            </button>
            <button onClick={() => handleTabChange('video')}
              className={`flex-1 py-2.5 px-2 rounded-lg text-sm font-bold transition-all ${mode === 'video' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              🎥 Video
            </button>
            <button onClick={() => handleTabChange('agent')}
              className={`flex-1 py-2.5 px-2 rounded-lg text-sm font-bold transition-all ${mode === 'agent' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              🤖 Agentes
            </button>
          </div>
          {/* Bottom row: use case chats */}
          <div className="flex gap-1.5">
            <button onClick={() => handleTabChange('usecase-personal')}
              className={`flex-1 py-2.5 px-2 rounded-lg text-xs md:text-sm font-bold transition-all ${mode === 'usecase-personal' ? 'bg-[#FF2878] text-white' : 'text-slate-500 hover:bg-pink-50 border border-pink-200'}`}
            >
              🏡 Mi Caso Personal
            </button>
            <button onClick={() => handleTabChange('usecase-pro')}
              className={`flex-1 py-2.5 px-2 rounded-lg text-xs md:text-sm font-bold transition-all ${mode === 'usecase-pro' ? 'bg-[#243F4C] text-white' : 'text-slate-500 hover:bg-blue-50 border border-blue-200'}`}
            >
              💼 Mi Caso Profesional
            </button>
          </div>
        </div>

        {/* IMAGE / VIDEO tab */}
        {(mode === 'image' || mode === 'video') && (
          <div className="space-y-6">
            {/* Tips */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
              <h3 className="font-bold text-blue-800 text-sm uppercase tracking-wider mb-3">
                Tips para un buen prompt de {mode === 'image' ? 'imagen' : 'video'}
              </h3>
              <ul className="space-y-2">
                {tips[mode].map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-blue-700">
                    <span className="text-blue-400 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            {/* Prompt Area */}
            <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
              <div className="flex flex-wrap justify-between items-end gap-2">
                <label className="block text-base md:text-lg font-medium text-slate-700">
                  Escribe tu prompt:
                </label>
                {isOptimized && (
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full flex items-center gap-1 animate-pulse">
                    <span className="text-emerald-500">✨</span> Optimizado por IA
                  </span>
                )}
              </div>

              <textarea
                value={prompt}
                onChange={handlePromptChange}
                placeholder={placeholders[mode]}
                className={`w-full p-4 rounded-xl border focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none min-h-[140px] text-base md:text-lg bg-white text-slate-900 placeholder-slate-400 transition-colors ${isOptimized ? 'border-emerald-300 ring-1 ring-emerald-100' : 'border-slate-300'}`}
              />

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleEnhance}
                  disabled={isEnhancing || !prompt.trim()}
                  className="flex-1 py-3 px-4 rounded-xl font-bold text-white disabled:opacity-50 shadow-lg flex justify-center items-center gap-2 transition-transform active:scale-95 text-sm md:text-base"
                  style={{ backgroundColor: COLORS.accent }}
                >
                  {isEnhancing ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Mejorando...
                    </>
                  ) : (
                    '✨ Mejorar Prompt con IA'
                  )}
                </button>
                {isOptimized && <CopyButton text={prompt} />}
              </div>
              {error && <p className="text-red-500 text-center text-sm font-medium mt-2">{error}</p>}
            </div>
          </div>
        )}

        {/* AGENT tab */}
        {mode === 'agent' && (
          <div className="space-y-6">
            {/* Info */}
            <div className="bg-purple-50 border border-purple-100 rounded-2xl p-5">
              <h3 className="font-bold text-purple-800 text-sm uppercase tracking-wider mb-2">
                Plantilla para crear agentes de IA
              </h3>
              <p className="text-sm text-purple-700">
                Rellena los 3 campos para definir tu agente. La IA mejorará tu prompt convirtiéndolo en un system prompt profesional con estructura ROL + CONTEXTO + PASOS.
              </p>
            </div>

            {/* Template Fields */}
            <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100 space-y-5">
              {/* ROL */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">
                  <span className="inline-flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold">1</span>
                    Rol
                  </span>
                </label>
                <p className="text-xs text-slate-400 mb-2">Define quién es el agente en primera persona. Su identidad y expertise.</p>
                <textarea
                  value={agentRol}
                  onChange={(e) => setAgentRol(e.target.value)}
                  placeholder="Ej: Soy un experto en marketing digital con 10 años de experiencia en estrategias de growth hacking para startups SaaS..."
                  className="w-full p-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none min-h-[80px] text-sm md:text-base bg-white text-slate-900 placeholder-slate-400"
                />
              </div>

              {/* CONTEXTO */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">
                  <span className="inline-flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">2</span>
                    Contexto
                  </span>
                </label>
                <p className="text-xs text-slate-400 mb-2">Describe la situación, el negocio, o el problema que debe resolver.</p>
                <textarea
                  value={agentContexto}
                  onChange={(e) => setAgentContexto(e.target.value)}
                  placeholder="Ej: Trabajo en el departamento de marketing de una clínica dental que quiere aumentar sus citas online..."
                  className="w-full p-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none min-h-[80px] text-sm md:text-base bg-white text-slate-900 placeholder-slate-400"
                />
              </div>

              {/* INSTRUCCIÓN */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">
                  <span className="inline-flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">3</span>
                    Pasos a Seguir
                  </span>
                </label>
                <p className="text-xs text-slate-400 mb-2">Qué debe hacer exactamente: las tareas, el formato de respuesta, y las reglas.</p>
                <textarea
                  value={agentInstruccion}
                  onChange={(e) => setAgentInstruccion(e.target.value)}
                  placeholder="Ej: 1) Analiza el contenido que me proporcionan. 2) Genera 5 ideas de posts para Instagram con hook, cuerpo y CTA. 3) Presenta en formato tabla..."
                  className="w-full p-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none min-h-[80px] text-sm md:text-base bg-white text-slate-900 placeholder-slate-400"
                />
              </div>

              {/* Enhance Button */}
              <button
                onClick={handleAgentEnhance}
                disabled={isEnhancing || (!agentRol.trim() && !agentContexto.trim() && !agentInstruccion.trim())}
                className="w-full py-4 px-4 rounded-xl font-bold text-white disabled:opacity-50 shadow-lg flex justify-center items-center gap-2 transition-transform active:scale-95 text-sm md:text-base"
                style={{ backgroundColor: COLORS.accent }}
              >
                {isEnhancing ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generando System Prompt...
                  </>
                ) : (
                  '✨ Generar System Prompt con IA'
                )}
              </button>
              {error && <p className="text-red-500 text-center text-sm font-medium mt-2">{error}</p>}
            </div>

            {/* Agent Result */}
            {agentResult && (
              <div className="bg-[#0F172A] rounded-2xl overflow-hidden shadow-lg border border-slate-700 animate-fade-in">
                <div className="flex items-center justify-between px-4 py-3 bg-[#1e293b] border-b border-slate-700">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                    <span className="ml-2 text-[10px] font-mono text-slate-400 uppercase tracking-widest">System Prompt</span>
                  </div>
                  <CopyButton text={agentResult} />
                </div>
                <div className="p-5 overflow-x-auto">
                  <pre className="font-mono text-sm leading-relaxed whitespace-pre-wrap text-slate-200">
                    {agentResult}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}

        {/* USE CASE PERSONAL tab */}
        {mode === 'usecase-personal' && <UseCaseChat type="personal" />}

        {/* USE CASE PROFESSIONAL tab */}
        {mode === 'usecase-pro' && <UseCaseChat type="professional" />}
      </div>
    </Layout>
  );
};

export default Day2;
