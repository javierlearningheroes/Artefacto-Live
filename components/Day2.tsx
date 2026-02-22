import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import CTAModal from './CTAModal';
import { AppRoute } from '../types';
import { COLORS } from '../constants';
import { enhancePrompt, enhanceAgentPrompt } from '../services/geminiService';
import { AgentTemplate, WORK_AGENTS, PERSONAL_AGENTS } from './agentMenuData';

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

const AgentCard = ({ agent, onClick }: { agent: AgentTemplate; onClick: () => void }) => (
  <button
    onClick={onClick}
    className="group bg-white rounded-2xl p-4 border-2 border-slate-100 hover:border-pink-200 hover:shadow-lg transition-all duration-300 text-left flex flex-col gap-2 hover:scale-[1.02] active:scale-[0.98]"
  >
    <div className="text-3xl">{agent.icon}</div>
    <h4 className="font-bold text-slate-800 text-sm leading-tight group-hover:text-pink-600 transition-colors">{agent.name}</h4>
    <p className="text-xs text-slate-400 leading-snug">{agent.description}</p>
    <div className="mt-auto pt-2">
      <span className="text-[10px] font-bold uppercase tracking-widest text-pink-400 group-hover:text-pink-600 transition-colors">Ver prompt &rarr;</span>
    </div>
  </button>
);

const AgentModal = ({ agent, onClose }: { agent: AgentTemplate | null; onClose: () => void }) => {
  useEffect(() => {
    if (agent) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [agent]);

  if (!agent) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full sm:max-w-2xl max-h-[90vh] flex flex-col bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden"
        style={{ animation: 'slideUp .3s ease-out' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-shrink-0 p-5 pb-4 border-b border-slate-100" style={{ background: `linear-gradient(135deg, ${COLORS.primary}08, ${COLORS.accent}08)` }}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="text-4xl bg-white rounded-2xl p-3 shadow-sm border border-slate-100">{agent.icon}</div>
              <div>
                <h3 className="font-bold text-lg text-slate-800">{agent.name}</h3>
                <p className="text-sm text-slate-500">{agent.description}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          <div className="bg-[#0F172A] rounded-2xl overflow-hidden border border-slate-700">
            <div className="flex items-center justify-between px-4 py-3 bg-[#1e293b] border-b border-slate-700">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                <span className="ml-2 text-[10px] font-mono text-slate-400 uppercase tracking-widest">System Prompt</span>
              </div>
              <CopyButton text={agent.systemPrompt} />
            </div>
            <div className="p-5 overflow-x-auto">
              <pre className="font-mono text-sm leading-relaxed whitespace-pre-wrap text-slate-200">{agent.systemPrompt}</pre>
            </div>
          </div>
        </div>
        <div className="flex-shrink-0 px-5 py-3 bg-amber-50 border-t border-amber-100">
          <p className="text-xs text-amber-700 text-center">
            <strong>Tip:</strong> Copia este prompt y p&eacute;galo como instrucciones del sistema en ChatGPT, Gemini o Claude para crear tu propio agente.
          </p>
        </div>
      </div>
    </div>
  );
};

const AgentMenuSection = ({ title, subtitle, icon, agents, color, onSelectAgent }: {
  title: string; subtitle: string; icon: string; agents: AgentTemplate[]; color: 'blue' | 'violet'; onSelectAgent: (a: AgentTemplate) => void;
}) => {
  const c = color === 'blue'
    ? { bg: 'bg-gradient-to-br from-blue-50 to-cyan-50', border: 'border-blue-100', title: 'text-blue-900', sub: 'text-blue-600', badge: 'bg-blue-100 text-blue-700' }
    : { bg: 'bg-gradient-to-br from-violet-50 to-fuchsia-50', border: 'border-violet-100', title: 'text-violet-900', sub: 'text-violet-600', badge: 'bg-violet-100 text-violet-700' };

  return (
    <div className={`${c.bg} border ${c.border} rounded-2xl p-5 md:p-6 space-y-5`}>
      <div className="flex items-center gap-3">
        <span className="text-3xl">{icon}</span>
        <div>
          <h3 className={`font-bold text-lg ${c.title}`}>{title}</h3>
          <p className={`text-sm ${c.sub}`}>{subtitle}</p>
        </div>
        <span className={`ml-auto ${c.badge} text-xs font-bold px-3 py-1 rounded-full`}>{agents.length} agentes</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {agents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} onClick={() => onSelectAgent(agent)} />
        ))}
      </div>
    </div>
  );
};

const Day2: React.FC<Day2Props> = ({ setRoute }) => {
  const [mode, setMode] = useState<'image' | 'video' | 'agent'>('image');
  const [prompt, setPrompt] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isOptimized, setIsOptimized] = useState(false);
  const [showCTA, setShowCTA] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<AgentTemplate | null>(null);

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
      setTimeout(() => setShowCTA(true), 1500);
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
      setTimeout(() => setShowCTA(true), 1500);
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

  const handleTabChange = (newMode: 'image' | 'video' | 'agent') => {
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
        title="¡Prompt mejorado!"
        message="Crear buenos prompts es una habilidad clave. En IA Heroes Pro aprenderás técnicas avanzadas de prompt engineering para imagen, video y agentes."
      />
      <AgentModal agent={selectedAgent} onClose={() => setSelectedAgent(null)} />

      <div className="space-y-6 pb-10">

        {/* Mode Toggles */}
        <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-200 flex">
          <button onClick={() => handleTabChange('image')}
            className={`flex-1 py-3 px-2 rounded-lg text-sm md:text-base font-bold transition-all ${mode === 'image' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            📸 Imagen
          </button>
          <button onClick={() => handleTabChange('video')}
            className={`flex-1 py-3 px-2 rounded-lg text-sm md:text-base font-bold transition-all ${mode === 'video' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            🎥 Video
          </button>
          <button onClick={() => handleTabChange('agent')}
            className={`flex-1 py-3 px-2 rounded-lg text-sm md:text-base font-bold transition-all ${mode === 'agent' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            🤖 Agentes
          </button>
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
                Rellena los 3 campos para definir tu agente. La IA mejorará tu prompt convirtiéndolo en un system prompt profesional.
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
                <p className="text-xs text-slate-400 mb-2">Define quién es el agente. Su identidad y expertise.</p>
                <textarea
                  value={agentRol}
                  onChange={(e) => setAgentRol(e.target.value)}
                  placeholder="Ej: Eres un experto en marketing digital con 10 años de experiencia en estrategias de growth hacking para startups SaaS..."
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
                  placeholder="Ej: Trabajas para una clínica dental que quiere aumentar sus citas online. El público objetivo son profesionales de 30-50 años..."
                  className="w-full p-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none min-h-[80px] text-sm md:text-base bg-white text-slate-900 placeholder-slate-400"
                />
              </div>

              {/* INSTRUCCIÓN */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">
                  <span className="inline-flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">3</span>
                    Instrucción
                  </span>
                </label>
                <p className="text-xs text-slate-400 mb-2">Qué debe hacer exactamente. Las tareas, el formato de respuesta, y las reglas.</p>
                <textarea
                  value={agentInstruccion}
                  onChange={(e) => setAgentInstruccion(e.target.value)}
                  placeholder="Ej: Genera 5 ideas de posts para Instagram. Cada post debe incluir: hook, cuerpo, CTA y 5 hashtags relevantes. Usa un tono profesional pero cercano..."
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

            {/* Divider */}
            <div className="flex items-center gap-4 pt-4">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Men&uacute; de Agentes Listos</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>
            <p className="text-center text-sm text-slate-500 -mt-3">
              Haz clic en cualquier agente para ver su System Prompt y copiarlo directamente.
            </p>

            {/* Work Agents */}
            <AgentMenuSection title="Agentes para mi Trabajo" subtitle="15 agentes listos para potenciar tu productividad profesional"
              icon="💼" agents={WORK_AGENTS} color="blue" onSelectAgent={setSelectedAgent} />

            {/* Personal Agents */}
            <AgentMenuSection title="Agentes para mi Vida Personal" subtitle="15 agentes para simplificar y mejorar tu día a día"
              icon="🏡" agents={PERSONAL_AGENTS} color="violet" onSelectAgent={setSelectedAgent} />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Day2;
