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
      desc: "Domina la teoría y los conceptos clave de la IA.",
      icon: "🧠",
      color: "from-blue-500 to-cyan-400",
      highlight: "La revolución exponencial"
    },
    {
      id: AppRoute.DAY_2,
      title: "Día 2: Taller de Prompts",
      desc: "Crea prompts profesionales y descubre tus casos de uso.",
      icon: "🎨",
      color: "from-purple-500 to-pink-400",
      highlight: "Prompt Engineering + Agentes"
    },
    {
      id: AppRoute.DAY_3,
      title: "Día 3: Consultoría IA",
      desc: "Asesoramiento de carrera personalizado con IA.",
      icon: "💼",
      color: "from-amber-500 to-orange-400",
      highlight: "Tu futuro profesional"
    },
    {
      id: AppRoute.DAY_4,
      title: "Día 4: Negocio + IA",
      desc: "Auditoría y agentes IA para tu negocio real.",
      icon: "🚀",
      color: "from-emerald-500 to-teal-400",
      highlight: "ROI inmediato"
    },
  ];

  const stats = [
    { value: '13.000+', label: 'Alumnos formados' },
    { value: '500K+', label: 'Comunidad' },
    { value: '4.6★', label: 'Trustpilot' },
    { value: '60', label: 'Créditos ECTS' },
  ];

  return (
    <Layout title="">
      <div className="flex flex-col items-center">

        {/* Hero Section */}
        <div className="text-center max-w-5xl mb-8 md:mb-10 animate-fade-in-up pt-4 md:pt-8">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200/60 text-pink-700 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-5">
            <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
            Semana de Lanzamiento — IA Heroes
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-slate-800 mb-4 md:mb-6 leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#243F4C] to-[#FF2878]">
              Tu Transformación con IA
            </span>
            <br />
            Empieza Aquí
          </h1>
          <p className="text-lg md:text-xl text-slate-600 mb-2 leading-relaxed px-4 max-w-2xl mx-auto">
            4 días de experiencia inmersiva con herramientas reales de Inteligencia Artificial. Aprende, practica y transforma tu forma de trabajar.
          </p>
        </div>

        {/* Admin Badge */}
        {isAdmin && (
          <div className="mb-4 px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-semibold border border-amber-300">
            Modo Admin — Todos los días desbloqueados
          </div>
        )}

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full max-w-5xl mb-8 px-2 md:px-4">
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

                {/* Highlight badge */}
                {unlocked && (
                  <div className="mt-3 relative z-10">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-gradient-to-r ${day.color} text-white opacity-80`}>
                      {day.highlight}
                    </span>
                  </div>
                )}
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

        {/* Stats bar */}
        <div className="w-full max-w-5xl px-2 md:px-4 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 md:p-5 text-center border border-slate-100 shadow-sm">
                <div className="text-2xl md:text-3xl font-black text-[#243F4C] mb-1">{stat.value}</div>
                <div className="text-xs md:text-sm text-slate-500 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* What you'll learn section */}
        <div className="w-full max-w-5xl px-2 md:px-4 mb-8">
          <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-200 p-6 md:p-8">
            <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-6 text-center">¿Qué vas a aprender esta semana?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { icon: '⚡', title: 'Fundamentos de IA Generativa', desc: 'Qué es, cómo funciona y por qué cambia las reglas del juego.' },
                { icon: '✍️', title: 'Prompt Engineering', desc: 'Técnicas para comunicarte eficazmente con cualquier modelo de IA.' },
                { icon: '🤖', title: 'Agentes de IA', desc: 'Crea empleados virtuales que trabajan por ti las 24 horas.' },
                { icon: '📊', title: 'IA aplicada a tu negocio', desc: 'Analiza tu empresa y descubre oportunidades de automatización.' },
                { icon: '🎨', title: 'Generación de contenido', desc: 'Crea imágenes y videos con IA para marketing y comunicación.' },
                { icon: '🎯', title: 'Tu caso de uso personal', desc: 'Descubre cómo la IA puede transformar tu día a día y tu carrera.' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-white border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all">
                  <span className="text-2xl flex-shrink-0 mt-0.5">{item.icon}</span>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm mb-1">{item.title}</h4>
                    <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="w-full max-w-5xl px-2 md:px-4 mb-8">
          <div className="bg-gradient-to-br from-[#243F4C] to-[#1a3040] rounded-2xl p-6 md:p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#FF2878] opacity-10 blur-3xl rounded-full -mr-16 -mt-16" />
            <h3 className="text-xl md:text-2xl font-bold mb-6 text-center relative z-10">Lo que dicen nuestros alumnos</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
              {[
                { name: 'Marisa', flag: '🇦🇷', age: 62, quote: 'Si yo, con 62 años, pude dominarlo... tú también puedes. Ha cambiado cómo trabajo cada día.' },
                { name: 'Ivette', flag: '🇬🇧', age: 55, quote: 'Sentí que me abrían una puerta a otro mundo. Los agentes me ayudan a automatizar tareas que me llevaban horas.' },
                { name: 'Edgar', flag: '🇻🇪', age: 64, quote: 'Pensaba que la IA no era para mí. Ahora es mi herramienta número uno de trabajo.' },
              ].map((t, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
                  <p className="text-sm text-slate-200 leading-relaxed mb-4 italic">"{t.quote}"</p>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{t.flag}</span>
                    <div>
                      <p className="font-bold text-white text-sm">{t.name}</p>
                      <p className="text-[11px] text-slate-400">{t.age} años, alumna IA Heroes</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Powered by */}
        <div className="text-center mb-6">
          <p className="text-sm text-slate-400">
            Creado por <a href="https://learningheroes.com" target="_blank" rel="noopener noreferrer" className="font-bold text-slate-500 hover:text-[#FF2878] transition-colors">Learning Heroes</a> — Formación en IA para profesionales
          </p>
        </div>

      </div>
    </Layout>
  );
};

export default Home;
