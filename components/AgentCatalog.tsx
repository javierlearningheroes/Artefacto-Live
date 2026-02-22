import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import Layout from './Layout';
import CTAModal from './CTAModal';
import { AppRoute } from '../types';
import { CATALOG_AGENTS, DIFFICULTY_CONFIG, TAG_LIST, CatalogAgent, AgentCategory, Difficulty } from './agentCatalogData';
import { trackInteraction, getCTAConfig, trackCTAClick, buildCTAUrl } from '../services/trackingService';

interface AgentCatalogProps {
  setRoute: (route: AppRoute) => void;
}

// ─── Copy Button ────────────────────────────────────────────────────────
const CopyButton = ({ text, label = 'Copiar', copiedLabel = 'Copiado', className = '', onCopy }: { text: string; label?: string; copiedLabel?: string; className?: string; onCopy?: () => void }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
    onCopy?.();
  };
  return (
    <button onClick={handleCopy}
      className={`inline-flex items-center gap-2 font-bold transition-all active:scale-95 ${
        copied ? 'bg-[#243F4C] text-white' : 'bg-[#243F4C] text-white hover:bg-[#1a3040]'
      } ${className}`}
    >
      {copied ? (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          {copiedLabel}
        </>
      ) : (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          {label}
        </>
      )}
    </button>
  );
};

// ─── Difficulty Badge ───────────────────────────────────────────────────
const DifficultyBadge = ({ difficulty }: { difficulty: Difficulty }) => {
  const cfg = DIFFICULTY_CONFIG[difficulty];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${cfg.bg} ${cfg.color}`}>
      <span className="flex gap-0.5">
        {Array.from({ length: 3 }).map((_, i) => (
          <span key={i} className={`w-1.5 h-1.5 rounded-full ${i < cfg.dots ? 'bg-current' : 'bg-current opacity-20'}`} />
        ))}
      </span>
      {cfg.label}
    </span>
  );
};

// ─── Flip Card ──────────────────────────────────────────────────────────
const FlipCard = ({ agent, index, onInteraction }: { agent: CatalogAgent; index: number; onInteraction?: (type: 'flip' | 'copy') => void }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const backRef = useRef<HTMLDivElement>(null);
  const isWork = agent.category === 'work';

  const handleFlip = useCallback(() => {
    setIsFlipped(f => {
      if (!f) onInteraction?.('flip');
      return !f;
    });
  }, [onInteraction]);

  // Reset scroll when flipping back
  useEffect(() => {
    if (!isFlipped && backRef.current) {
      backRef.current.scrollTop = 0;
    }
  }, [isFlipped]);

  return (
    <div
      className="flip-card-container"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className={`flip-card-inner ${isFlipped ? 'flip-card-flipped' : ''}`}>

        {/* ───── FRONT SIDE ───── */}
        <div className="flip-card-front" onClick={handleFlip}>
          <div className="relative h-full bg-white rounded-2xl border border-slate-200/80 overflow-hidden flex flex-col transition-shadow duration-300 hover:shadow-xl hover:border-slate-300 cursor-pointer group">

            {/* Top gradient accent */}
            <div className={`h-1.5 w-full ${isWork ? 'bg-gradient-to-r from-[#243F4C] via-blue-500 to-cyan-400' : 'bg-gradient-to-r from-[#FF2878] via-pink-400 to-rose-400'}`} />

            {/* Card body */}
            <div className="flex flex-col flex-1 p-5">

              {/* Header row: Icon + badges */}
              <div className="flex items-start justify-between mb-4">
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200/60 flex items-center justify-center text-3xl shadow-sm group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
                    {agent.icon}
                  </div>
                  {/* Subtle glow on hover */}
                  <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl ${isWork ? 'bg-blue-400' : 'bg-pink-400'}`} />
                </div>
                <DifficultyBadge difficulty={agent.difficulty} />
              </div>

              {/* Name */}
              <h3 className="font-bold text-slate-800 text-lg leading-tight mb-2 group-hover:text-[#243F4C] transition-colors">
                {agent.name}
              </h3>

              {/* Description */}
              <p className="text-sm text-slate-500 leading-relaxed mb-4 line-clamp-2 flex-grow">{agent.description}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {agent.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-400 border border-slate-200/50">
                    {tag}
                  </span>
                ))}
              </div>

              {/* CTA row */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <span className={`text-sm font-bold ${isWork ? 'text-[#243F4C]' : 'text-[#FF2878]'} group-hover:gap-2.5 transition-all flex items-center gap-1.5`}>
                  Ver System Prompt
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </span>
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ───── BACK SIDE ───── */}
        <div className="flip-card-back">
          <div className="relative h-full bg-[#0F172A] rounded-2xl border border-slate-700 overflow-hidden flex flex-col">

            {/* Back header */}
            <div className="flex-shrink-0 p-4 pb-3 border-b border-slate-700/80 bg-gradient-to-r from-[#1e293b] to-[#0f172a]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-2xl flex-shrink-0">{agent.icon}</span>
                  <div className="min-w-0">
                    <h3 className="font-bold text-white text-base leading-tight truncate">{agent.name}</h3>
                    <span className={`text-xs font-semibold ${isWork ? 'text-blue-400' : 'text-pink-400'}`}>
                      {isWork ? 'Profesional' : 'Personal'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleFlip}
                  className="flex-shrink-0 p-2 rounded-xl hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
                  aria-label="Cerrar"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Scrollable content */}
            <div ref={backRef} className="flex-1 overflow-y-auto p-4 space-y-3 flip-card-scroll">

              {/* Description */}
              <p className="text-slate-300 text-sm leading-relaxed">{agent.longDescription}</p>

              {/* Use cases */}
              <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Casos de uso</h4>
                <div className="space-y-1.5">
                  {agent.useCases.map((uc, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                      <span className="text-cyan-400 mt-0.5 flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </span>
                      <span>{uc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* System Prompt */}
              <div className="bg-black/40 rounded-xl overflow-hidden border border-white/10">
                <div className="flex items-center justify-between px-3 py-2 bg-white/5 border-b border-white/10">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <div className="w-2 h-2 rounded-full bg-yellow-500" />
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="ml-2 text-[9px] font-mono text-slate-500 uppercase tracking-widest">System Prompt</span>
                  </div>
                </div>
                <div className="p-3 max-h-40 overflow-y-auto flip-card-scroll">
                  <pre className="font-mono text-[11px] leading-relaxed whitespace-pre-wrap text-slate-300">{agent.systemPrompt}</pre>
                </div>
              </div>
            </div>

            {/* Fixed bottom: Copy CTA */}
            <div className="flex-shrink-0 p-3 border-t border-slate-700/80 bg-[#1e293b]">
              <CopyButton
                text={agent.systemPrompt}
                label="Copiar System Prompt"
                copiedLabel="Prompt Copiado"
                className="w-full justify-center py-3 px-4 rounded-xl text-sm shadow-lg shadow-slate-500/10"
                onCopy={() => onInteraction?.('copy')}
              />
              <p className="text-[10px] text-slate-500 text-center mt-2">
                Pega en ChatGPT, Claude o Gemini como instrucciones del sistema
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main Catalog Component ─────────────────────────────────────────────
const AgentCatalog: React.FC<AgentCatalogProps> = ({ setRoute }) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | AgentCategory>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | Difficulty>('all');
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [ctaOpen, setCTAOpen] = useState(false);
  const [ctaConfig, setCTAConfig] = useState<{ title: string; message: string; url: string } | null>(null);

  const handleInteraction = useCallback((type: 'flip' | 'copy') => {
    const interactionType = type === 'copy' ? 'agents_prompt_copy' : 'agents_card_flip';
    const triggerSection = trackInteraction(interactionType);
    if (triggerSection) {
      const config = getCTAConfig(triggerSection);
      if (config) {
        setCTAConfig(config);
        // Small delay so the flip animation finishes first
        setTimeout(() => setCTAOpen(true), 800);
      }
    }
  }, []);

  // Filtered agents
  const filteredAgents = useMemo(() => {
    return CATALOG_AGENTS.filter(agent => {
      if (categoryFilter !== 'all' && agent.category !== categoryFilter) return false;
      if (difficultyFilter !== 'all' && agent.difficulty !== difficultyFilter) return false;
      if (tagFilter && !agent.tags.includes(tagFilter)) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return agent.name.toLowerCase().includes(q) ||
               agent.description.toLowerCase().includes(q) ||
               agent.tags.some(t => t.toLowerCase().includes(q));
      }
      return true;
    });
  }, [search, categoryFilter, difficultyFilter, tagFilter]);

  // Active tags based on current filtered results
  const activeTags = useMemo(() => {
    const tagCounts: Record<string, number> = {};
    const baseAgents = CATALOG_AGENTS.filter(a => {
      if (categoryFilter !== 'all' && a.category !== categoryFilter) return false;
      if (difficultyFilter !== 'all' && a.difficulty !== difficultyFilter) return false;
      return true;
    });
    baseAgents.forEach(a => a.tags.forEach(t => { tagCounts[t] = (tagCounts[t] || 0) + 1; }));
    return TAG_LIST.filter(t => tagCounts[t] > 0).map(t => ({ tag: t, count: tagCounts[t] }));
  }, [categoryFilter, difficultyFilter]);

  const clearFilters = () => {
    setSearch('');
    setCategoryFilter('all');
    setDifficultyFilter('all');
    setTagFilter(null);
  };

  const hasFilters = search || categoryFilter !== 'all' || difficultyFilter !== 'all' || tagFilter;

  const workAgents = filteredAgents.filter(a => a.category === 'work');
  const personalAgents = filteredAgents.filter(a => a.category === 'personal');

  return (
    <Layout title="Tu Ejército de Agentes IA" onBack={() => setRoute(AppRoute.HOME)}>
      <CTAModal
        isOpen={ctaOpen}
        onClose={() => setCTAOpen(false)}
        title={ctaConfig?.title}
        message={ctaConfig?.message}
        ctaUrl={ctaConfig?.url}
        ctaSource="agents"
      />
      <div className="space-y-6 pb-10">

        {/* Hero banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#243F4C] via-[#1a3040] to-[#0f2028] p-6 md:p-8 text-white">
          {/* Decorative */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF2878] opacity-10 blur-3xl rounded-full -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400 opacity-10 blur-3xl rounded-full -ml-16 -mb-16" />
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">🤖</span>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-300 bg-white/10 px-3 py-1 rounded-full">{CATALOG_AGENTS.length} agentes listos</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black mb-2 leading-tight">
              Tus empleados virtuales,
              <span className="text-[#FF2878]"> listos para trabajar</span>
            </h2>
            <p className="text-slate-300 text-sm md:text-base max-w-xl leading-relaxed">
              Cada agente tiene un System Prompt profesional. Haz clic en cualquier tarjeta para ver el prompt completo y copiarlo en segundos.
            </p>
          </div>
        </div>

        {/* Search + filter bar */}
        <div className="space-y-3">
          <div className="flex gap-2">
            {/* Search */}
            <div className="flex-1 relative">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar agente por nombre o función..."
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-[#243F4C]/30 focus:border-transparent outline-none text-sm md:text-base"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              )}
            </div>
            {/* Filter toggle */}
            <button onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-3 rounded-xl border text-sm font-bold transition-all flex items-center gap-2 ${
                showFilters || hasFilters ? 'bg-[#243F4C] text-white border-[#243F4C]' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span className="hidden sm:inline">Filtros</span>
              {hasFilters && <span className="w-2 h-2 rounded-full bg-[#FF2878]" />}
            </button>
          </div>

          {/* Expanded filters */}
          {showFilters && (
            <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-4 shadow-sm">
              {/* Category */}
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Categoría</span>
                <div className="flex gap-2 flex-wrap">
                  {([['all', 'Todos', `${CATALOG_AGENTS.length}`], ['work', 'Profesional', '15'], ['personal', 'Personal', '15']] as const).map(([val, label, count]) => (
                    <button key={val} onClick={() => setCategoryFilter(val)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${categoryFilter === val ? 'bg-[#243F4C] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                      {label} <span className="opacity-60 text-xs">({count})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty */}
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Dificultad</span>
                <div className="flex gap-2 flex-wrap">
                  <button onClick={() => setDifficultyFilter('all')}
                    className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${difficultyFilter === 'all' ? 'bg-[#243F4C] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                  >Todos</button>
                  {(['beginner', 'intermediate', 'advanced'] as const).map(d => (
                    <button key={d} onClick={() => setDifficultyFilter(d)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${difficultyFilter === d ? `${DIFFICULTY_CONFIG[d].bg} ${DIFFICULTY_CONFIG[d].color}` : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                      {DIFFICULTY_CONFIG[d].label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Temática</span>
                <div className="flex flex-wrap gap-1.5">
                  {activeTags.map(({ tag, count }) => (
                    <button key={tag} onClick={() => setTagFilter(tagFilter === tag ? null : tag)}
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${tagFilter === tag ? 'bg-[#FF2878] text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                    >
                      {tag} <span className="opacity-60">({count})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear */}
              {hasFilters && (
                <button onClick={clearFilters} className="text-sm text-[#FF2878] font-bold hover:underline">
                  Limpiar filtros
                </button>
              )}
            </div>
          )}
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between text-sm text-slate-500 px-1">
          <span>
            Mostrando <strong className="text-slate-800">{filteredAgents.length}</strong> agente{filteredAgents.length !== 1 ? 's' : ''}
            {workAgents.length > 0 && personalAgents.length > 0 && (
              <span className="text-slate-400"> ({workAgents.length} profesionales, {personalAgents.length} personales)</span>
            )}
          </span>
        </div>

        {/* How it works mini-guide */}
        <div className="flex items-center gap-4 px-4 py-3 bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl border border-rose-200/60 text-sm">
          <span className="text-2xl flex-shrink-0">💡</span>
          <p className="text-rose-800">
            <strong>Toca cualquier tarjeta</strong> para girarla y ver el System Prompt completo. Copia y pega en tu IA favorita.
          </p>
        </div>

        {/* Work Agents Section */}
        {workAgents.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="flex items-center gap-2">
                <span className="text-xl">💼</span>
                <h3 className="font-bold text-lg text-slate-800">Agentes Profesionales</h3>
              </div>
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">{workAgents.length}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {workAgents.map((agent, idx) => (
                <FlipCard key={agent.id} agent={agent} index={idx} onInteraction={handleInteraction} />
              ))}
            </div>
          </div>
        )}

        {/* Personal Agents Section */}
        {personalAgents.length > 0 && (
          <div className={workAgents.length > 0 ? 'mt-10' : ''}>
            <div className="flex items-center gap-3 mb-5">
              <div className="flex items-center gap-2">
                <span className="text-xl">🏡</span>
                <h3 className="font-bold text-lg text-slate-800">Agentes Personales</h3>
              </div>
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">{personalAgents.length}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {personalAgents.map((agent, idx) => (
                <FlipCard key={agent.id} agent={agent} index={idx} onInteraction={handleInteraction} />
              ))}
            </div>
          </div>
        )}

        {/* No results */}
        {filteredAgents.length === 0 && (
          <div className="text-center py-16 space-y-4">
            <span className="text-5xl block">🔍</span>
            <p className="text-slate-500 text-lg">No se encontraron agentes con esos filtros.</p>
            <button onClick={clearFilters} className="text-[#FF2878] font-bold hover:underline">Limpiar filtros</button>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="bg-gradient-to-r from-[#FF2878] to-[#ff4a90] rounded-2xl p-6 md:p-8 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '20px 20px' }} />
          <div className="relative z-10">
            <h3 className="text-xl md:text-2xl font-black mb-2">¿Quieres crear agentes más potentes?</h3>
            <p className="text-white/80 text-sm md:text-base mb-5 max-w-lg mx-auto">
              En IA Heroes Pro aprenderás a construir agentes avanzados con herramientas, memoria y automatización.
            </p>
            <a href={buildCTAUrl('agents-bottom')} target="_blank" rel="noopener noreferrer"
              onClick={() => trackCTAClick('agents-bottom')}
              className="inline-block bg-white text-[#FF2878] font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              Descubre IA Heroes Pro
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AgentCatalog;
