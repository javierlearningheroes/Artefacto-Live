import React from 'react';
import Layout from './Layout';
import { AppRoute } from '../types';
import { COLORS } from '../constants';

interface HomeProps {
  setRoute: (route: AppRoute) => void;
}

const Home: React.FC<HomeProps> = ({ setRoute }) => {

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

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full max-w-5xl mb-12 md:mb-16 px-2 md:px-4">
          {days.map((day, idx) => (
            <button key={day.id} onClick={() => setRoute(day.id)}
              className="group relative overflow-hidden rounded-3xl p-6 md:p-8 text-left transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 bg-white/80 backdrop-blur-md border border-white/50 shadow-lg"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              {/* Gradient background on hover */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 bg-gradient-to-br ${day.color}`} />

              <div className="flex items-start justify-between mb-4 md:mb-6 relative z-10">
                <span className="text-4xl md:text-5xl filter drop-shadow-sm">{day.icon}</span>
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center bg-slate-50 text-slate-300 group-hover:text-white transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-12 shadow-inner" style={{ backgroundColor: 'rgba(36, 63, 76, 0.05)' }}>
                   {/* Arrow Icon */}
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6 group-hover:stroke-[#FF2878]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </div>
              </div>

              <h2 className="text-xl md:text-2xl font-bold mb-2 md:mb-3 text-slate-800 group-hover:text-[#243F4C] transition-colors relative z-10">
                {day.title}
              </h2>
              <p className="text-slate-500 text-base md:text-lg relative z-10">
                {day.desc}
              </p>
            </button>
          ))}
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
