import React, { useState, useEffect, useMemo } from 'react';
import Layout from './Layout';
import { AppRoute } from '../types';
import { COLORS } from '../constants';
import { CATALOG_AGENTS, DIFFICULTY_CONFIG, TAG_LIST, CatalogAgent, AgentCategory, Difficulty } from './agentCatalogData';

interface AgentCatalogProps {
  setRoute: (route: AppRoute) => void;
}

// ─── Copy Button ────────────────────────────────────────────────────────
const CopyButton = ({ text, variant = 'default' }: { text: string; variant?: 'default' | 'large' }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };
  const isLarge = variant === 'large';
  return (
    <button onClick={handleCopy}
      className={`inline-flex items-center gap-2 font-bold transition-all active:scale-95 ${
        isLarge
          ? 'py-3 px-6 rounded-xl text-base shadow-lg'
          : 'py-2 px-4 rounded-lg text-sm'
      } ${
        copied
          ? 'bg-emerald-500 text-white'
          : isLarge
            ? 'bg-[#FF2878] text-white hover:bg-[#e01b63] shadow-pink-200'
            : 'bg-white text-slate-600 border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
      }`}
    >
      {copied ? (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          {isLarge ? 'Prompt Copiado' : 'Copiado'}
        </>
      ) : (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          {isLarge ? 'Copiar System Prompt' : 'Copiar'}
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

// ─── Agent Card ─────────────────────────────────────────────────────────
const AgentCard = ({ agent, onClick, index }: { agent: CatalogAgent; onClick: () => void; index: number }) => {
  const isWork = agent.category === 'work';

  return (
    <button
      onClick={onClick}
      className="group relative bg-white rounded-2xl p-5 text-left transition-all duration-300 hover:shadow-xl hover:-translate-y-1 active:scale-[0.98] border border-slate-100 hover:border-slate-200 overflow-hidden"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      {/* Top gradient accent */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${isWork ? 'bg-gradient-to-r from-[#243F4C] to-blue-400' : 'bg-gradient-to-r from-[#FF2878] to-amber-400'}`} />

      {/* Icon + Difficulty */}
      <div className="flex items-start justify-between mb-3">
        <div className="text-3xl p-2 bg-slate-50 rounded-xl group-hover:scale-110 transition-transform duration-300">{agent.icon}</div>
        <DifficultyBadge difficulty={agent.difficulty} />
      </div>

      {/* Name */}
      <h3 className="font-bold text-slate-800 text-base leading-tight mb-1.5 group-hover:text-[#243F4C] transition-colors">
        {agent.name}
      </h3>

      {/* Description */}
      <p className="text-sm text-slate-500 leading-relaxed mb-3 line-clamp-2">{agent.description}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {agent.tags.slice(0, 3).map(tag => (
          <span key={tag} className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">{tag}</span>
        ))}
      </div>

      {/* CTA */}
      <div className="flex items-center gap-1.5 text-[#FF2878] font-bold text-sm group-hover:gap-2.5 transition-all">
        <span>Ver prompt</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </div>
    </button>
  );
};

// ─── Agent Detail Modal ─────────────────────────────────────────────────
const AgentDetailModal = ({ agent, onClose }: { agent: CatalogAgent | null; onClose: () => void }) => {
  useEffect(() => {
    if (agent) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [agent]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  if (!agent) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full sm:max-w-2xl max-h-[92vh] flex flex-col bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden"
        style={{ animation: 'slideUp .3s cubic-bezier(0.16, 1, 0.3, 1)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex-shrink-0 p-5 pb-4 border-b border-slate-100 bg-gradient-to-br from-slate-50 to-white">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="text-4xl bg-white rounded-2xl p-3.5 shadow-sm border border-slate-100">{agent.icon}</div>
              <div>
                <h3 className="font-bold text-xl text-slate-800">{agent.name}</h3>
                <p className="text-sm text-slate-500 mt-0.5">{agent.longDescription}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          {/* Meta badges */}
          <div className="flex items-center flex-wrap gap-2 mt-4">
            <DifficultyBadge difficulty={agent.difficulty} />
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${agent.category === 'work' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}>
              {agent.category === 'work' ? 'Profesional' : 'Personal'}
            </span>
            {agent.tags.map(tag => (
              <span key={tag} className="text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-full bg-slate-100 text-slate-500">{tag}</span>
            ))}
          </div>
        </div>

        {/* Body — scrollable */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">

          {/* Use Cases */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100">
            <h4 className="font-bold text-blue-900 text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Casos de uso
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {agent.useCases.map((uc, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-blue-800">
                  <span className="text-blue-400 mt-0.5 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </span>
                  {uc}
                </div>
              ))}
            </div>
          </div>

          {/* How to Use */}
          <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-4 border border-emerald-100">
            <h4 className="font-bold text-emerald-900 text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Cómo usar este agente
            </h4>
            <div className="space-y-2.5">
              {agent.howToUse.map((step, i) => (
                <div key={i} className="flex items-start gap-3 text-sm text-emerald-800">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-200 text-emerald-700 flex items-center justify-center text-xs font-bold">{i + 1}</span>
                  {step}
                </div>
              ))}
            </div>
          </div>

          {/* System Prompt */}
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
            <div className="p-5 overflow-x-auto max-h-64">
              <pre className="font-mono text-sm leading-relaxed whitespace-pre-wrap text-slate-200">{agent.systemPrompt}</pre>
            </div>
          </div>

          {/* Large Copy CTA */}
          <div className="text-center pt-2">
            <CopyButton text={agent.systemPrompt} variant="large" />
          </div>
        </div>

        {/* Footer tip */}
        <div className="flex-shrink-0 px-5 py-3 bg-amber-50 border-t border-amber-100">
          <p className="text-xs text-amber-700 text-center">
            <strong>Tip:</strong> Copia este prompt y pégalo como instrucciones del sistema en <strong>ChatGPT</strong>, <strong>Gemini</strong> o <strong>Claude</strong> para crear tu propio agente.
          </p>
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
  const [selectedAgent, setSelectedAgent] = useState<CatalogAgent | null>(null);
  const [showFilters, setShowFilters] = useState(false);

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

  const workCount = filteredAgents.filter(a => a.category === 'work').length;
  const personalCount = filteredAgents.filter(a => a.category === 'personal').length;

  return (
    <Layout title="Tu Ejército de Agentes IA" onBack={() => setRoute(AppRoute.HOME)}>
      <AgentDetailModal agent={selectedAgent} onClose={() => setSelectedAgent(null)} />

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
              <span className="text-xs font-bold uppercase tracking-widest text-pink-300 bg-pink-500/20 px-3 py-1 rounded-full">{CATALOG_AGENTS.length} agentes listos</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black mb-2 leading-tight">
              Tus empleados virtuales,
              <span className="text-[#FF2878]"> listos para trabajar</span>
            </h2>
            <p className="text-slate-300 text-sm md:text-base max-w-xl leading-relaxed">
              Cada agente tiene un System Prompt profesional que puedes copiar y usar en ChatGPT, Claude o Gemini. Solo copia, pega y empieza a delegar.
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
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none text-sm md:text-base"
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
                <div className="flex gap-2">
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
                <div className="flex gap-2">
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
            {workCount > 0 && personalCount > 0 && (
              <span className="text-slate-400"> ({workCount} profesionales, {personalCount} personales)</span>
            )}
          </span>
        </div>

        {/* Work Agents Section */}
        {workCount > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">💼</span>
                <h3 className="font-bold text-lg text-slate-800">Agentes Profesionales</h3>
              </div>
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">{workCount}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAgents.filter(a => a.category === 'work').map((agent, idx) => (
                <AgentCard key={agent.id} agent={agent} index={idx} onClick={() => setSelectedAgent(agent)} />
              ))}
            </div>
          </div>
        )}

        {/* Personal Agents Section */}
        {personalCount > 0 && (
          <div className={workCount > 0 ? 'mt-8' : ''}>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">🏡</span>
                <h3 className="font-bold text-lg text-slate-800">Agentes Personales</h3>
              </div>
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">{personalCount}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAgents.filter(a => a.category === 'personal').map((agent, idx) => (
                <AgentCard key={agent.id} agent={agent} index={idx} onClick={() => setSelectedAgent(agent)} />
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
              En IA Heroes Pro aprenderás a construir agentes avanzados con herramientas, memoria y automatización. Tus propios empleados virtuales.
            </p>
            <a href="https://live.learningheroes.com/iah-artefact" target="_blank" rel="noopener noreferrer"
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
