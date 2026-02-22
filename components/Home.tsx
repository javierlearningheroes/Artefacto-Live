import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import { AppRoute } from '../types';
import { COLORS } from '../constants';
import { isDayUnlocked, getUnlockLabel, getTimeUntilUnlock } from '../utils/unlockSystem';
import { useAdmin } from '../contexts/AdminContext';

interface HomeProps {
  setRoute: (route: AppRoute) => void;
}

const Home: React.FC<HomeProps> = ({ setRoute }) => {
  const { isAdmin } = useAdmin();
  const [, setTick] = useState(0);

  // Update countdown every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 30000);
    return () => clearInterval(interval);
  }, []);

  const days = [
    {
      id: AppRoute.DAY_1,
      title: "Día 1: Fundamentos",
      desc: "Domina la teoría y los conceptos clave.",
      icon: "🧠",
      color: "from-blue-500 to-cyan-400"
    },
    {
      id: AppRoute.DAY_2,
      title: "Día 2: Estudio Creativo",
      desc: "Crea imágenes y videos de impacto.",
      icon: "🎨",
      color: "from-purple-500 to-pink-400"
    },
    {
      id: AppRoute.DAY_3,
      title: "Día 3: Consultoría",
      desc: "Asesoramiento de carrera personalizado.",
      icon: "💼",
      color: "from-amber-500 to-orange-400"
    },
    {
      id: AppRoute.DAY_4,
      title: "Día 4: Negocio IA",
      desc: "Auditoría y automatización empresarial.",
      icon: "🚀",
      color: "from-emerald-500 to-teal-400"
    },
  ];

  return (
    <Layout title="">
      <div className="flex flex-col items-center">

        {/* Hero Section */}
        <div className="text-center max-w-5xl mb-8 md:mb-12 animate-fade-in-up pt-4 md:pt-8">
          <h1 className="text-4xl md:text-6xl font-black text-slate-800 mb-4 md:mb-6 leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#243F4C] to-[#FF2878]">
              Tu Transformación Exponencial
            </span>
            <br />
            Empieza Aquí
          </h1>
          <p className="text-lg md:text-xl text-slate-600 mb-6 md:mb-8 leading-relaxed px-4">
            Una experiencia inmersiva de 4 días diseñada para empresarios y emprendedores que quieren liderar la revolución de la Inteligencia Artificial.
          </p>
        </div>

        {/* Admin Badge */}
        {isAdmin && (
          <div className="mb-4 px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-semibold border border-amber-300">
            Modo Admin — Todos los días desbloqueados
          </div>
        )}

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full max-w-5xl mb-12 md:mb-16 px-2 md:px-4">
          {days.map((day, idx) => {
            const unlocked = isDayUnlocked(day.id, isAdmin);

            return (
              <button key={day.id}
                onClick={() => unlocked && setRoute(day.id)}
                disabled={!unlocked}
                className={`group relative overflow-hidden rounded-3xl p-6 md:p-8 text-left transition-all duration-300 bg-white/80 backdrop-blur-md border shadow-lg ${
                  unlocked
                    ? 'border-white/50 hover:shadow-2xl hover:-translate-y-2 cursor-pointer'
                    : 'border-slate-200 opacity-60 grayscale cursor-not-allowed'
                }`}
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                {/* Gradient background on hover (only when unlocked) */}
                {unlocked && (
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 bg-gradient-to-br ${day.color}`} />
                )}

                {/* Lock overlay for locked days */}
                {!unlocked && (
                  <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-slate-800/80 text-white px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                    {getUnlockLabel(day.id)}
                  </div>
                )}

                <div className="flex items-start justify-between mb-4 md:mb-6 relative z-10">
                  <span className="text-4xl md:text-5xl filter drop-shadow-sm">{day.icon}</span>
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center bg-slate-50 transition-all duration-300 transform shadow-inner ${
                    unlocked
                      ? 'text-slate-300 group-hover:text-white group-hover:scale-110 group-hover:rotate-12'
                      : 'text-slate-200'
                  }`} style={{ backgroundColor: 'rgba(36, 63, 76, 0.05)' }}>
                     {unlocked ? (
                       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6 group-hover:stroke-[#FF2878]">
                         <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                       </svg>
                     ) : (
                       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6">
                         <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                       </svg>
                     )}
                  </div>
                </div>

                <h2 className={`text-xl md:text-2xl font-bold mb-2 md:mb-3 transition-colors relative z-10 ${
                  unlocked ? 'text-slate-800 group-hover:text-[#243F4C]' : 'text-slate-500'
                }`}>
                  {day.title}
                </h2>
                <p className="text-slate-500 text-base md:text-lg relative z-10">
                  {unlocked ? day.desc : (
                    <span className="flex items-center gap-2">
                      <span>Disponible: {getUnlockLabel(day.id)}</span>
                      <span className="text-sm text-slate-400">({getTimeUntilUnlock(day.id)})</span>
                    </span>
                  )}
                </p>
              </button>
            );
          })}
        </div>

        {/* Agent Catalog Banner */}
        <div className="w-full max-w-5xl px-2 md:px-4 mb-8">
          <button onClick={() => setRoute(AppRoute.AGENTS)}
            className="group w-full relative overflow-hidden rounded-2xl p-6 md:p-8 text-left transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 bg-gradient-to-br from-[#243F4C] via-[#1a3040] to-[#0f2028] border border-white/10"
          >
            {/* Decorative grid */}
            <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#FF2878] opacity-15 blur-3xl rounded-full -mr-16 -mt-16 group-hover:opacity-25 transition-opacity" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-400 opacity-10 blur-3xl rounded-full -ml-10 -mb-10" />

            <div className="relative z-10 flex items-center gap-5">
              <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-3xl md:text-4xl group-hover:scale-110 transition-transform duration-300">
                🤖
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-pink-300 bg-pink-500/20 px-2.5 py-0.5 rounded-full">30 agentes</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-300 bg-emerald-500/20 px-2.5 py-0.5 rounded-full">Siempre accesible</span>
                </div>
                <h3 className="text-xl md:text-2xl font-black text-white mb-1 leading-tight">
                  Tu Ejército de Agentes IA
                </h3>
                <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                  30 empleados virtuales con System Prompts profesionales listos para copiar y usar.
                </p>
              </div>
              <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 flex items-center justify-center text-white group-hover:bg-[#FF2878] transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-0.5 transition-transform">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </div>
            </div>
          </button>
        </div>

        {/* Value Proposition Section */}
        <div className="w-full max-w-6xl bg-[#243F4C] text-white rounded-[2rem] md:rounded-[2.5rem] p-6 py-10 md:p-16 shadow-2xl relative overflow-hidden mb-8 md:mb-12">
          {/* Decorative Circles */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-[#FF2878] opacity-10 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-blue-500 opacity-10 blur-3xl"></div>

          <div className="relative z-10 text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-4xl font-bold mb-4">¿Por qué IA Heroes Pro?</h2>
            <p className="text-slate-300 text-base md:text-lg max-w-2xl mx-auto">
              No es otro curso online. Es un programa universitario de transformación profesional.
            </p>
          </div>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 text-center">
            <div className="space-y-3 md:space-y-4">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto text-2xl md:text-3xl mb-4 backdrop-blur-sm">
                🎓
              </div>
              <h3 className="text-lg md:text-xl font-bold text-white">Titulación Universitaria</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                60 créditos ECTS avalados por la <strong>Western Europe University</strong>. Un título de prestigio para tu CV.
              </p>
            </div>
            <div className="space-y-3 md:space-y-4">
               <div className="w-14 h-14 md:w-16 md:h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto text-2xl md:text-3xl mb-4 backdrop-blur-sm">
                🤝
              </div>
              <h3 className="text-lg md:text-xl font-bold text-white">Comunidad de Élite</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Networking real con empresarios y emprendedores que, como tú, apuestan por el futuro.
              </p>
            </div>
            <div className="space-y-3 md:space-y-4">
               <div className="w-14 h-14 md:w-16 md:h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto text-2xl md:text-3xl mb-4 backdrop-blur-sm">
                💰
              </div>
              <h3 className="text-lg md:text-xl font-bold text-white">ROI Inmediato</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Enfoque 100% práctico. Crea agentes, automatiza procesos y recupera tu inversión aplicando lo aprendido.
              </p>
            </div>
          </div>

          <div className="relative z-10 mt-10 md:mt-12 text-center">
             <a href="https://live.learningheroes.com/iah-artefact" target="_blank" rel="noopener noreferrer" className="inline-block w-full md:w-auto bg-[#FF2878] text-white font-bold py-4 px-8 md:px-10 rounded-xl shadow-lg hover:shadow-xl hover:bg-[#e01b63] transition-all transform hover:scale-105">
               Reserva tu Plaza Ahora
             </a>
          </div>
        </div>

      </div>
    </Layout>
  );
};

export default Home;
