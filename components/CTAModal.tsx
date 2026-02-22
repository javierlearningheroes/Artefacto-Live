import React from 'react';
import { COLORS } from '../constants';
import { trackCTAClick } from '../services/trackingService';

interface CTAModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  ctaUrl?: string;
  ctaSource?: string;
}

const CTAModal: React.FC<CTAModalProps> = ({ isOpen, onClose, title, message, ctaUrl, ctaSource = 'generic' }) => {
  if (!isOpen) return null;

  const url = ctaUrl || "https://live.learningheroes.com/iah-artefact";

  const handleCTAClick = () => {
    trackCTAClick(ctaSource);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop with blur */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

      {/* Modal Content */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all scale-100 animate-fade-in-up">

        {/* Decorative Header */}
        <div className="h-32 bg-gradient-to-r from-[#243F4C] to-[#2a4d5e] relative flex items-center justify-center overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF2878] rounded-full blur-3xl opacity-20 -mr-10 -mt-10"></div>
           <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-400 rounded-full blur-2xl opacity-20 -ml-5 -mb-5"></div>
           <span className="text-6xl animate-bounce-slow relative z-10">🚀</span>

           <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
               <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
             </svg>
           </button>
        </div>

        <div className="p-8 text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            {title || "¿Te ha gustado la experiencia?"}
          </h2>
          <p className="text-slate-600 mb-8 text-lg leading-relaxed">
            {message || "Esto es solo el 1% de lo que puedes lograr. Si quieres dominar la IA y transformar tu carrera, únete a la élite."}
          </p>

          <div className="space-y-3">
            <a href={url} target="_blank" rel="noopener noreferrer"
              onClick={handleCTAClick}
              className="block w-full py-4 px-6 rounded-xl font-bold text-white text-lg shadow-lg hover:shadow-xl hover:brightness-110 transition-all transform hover:scale-[1.02]"
              style={{ backgroundColor: COLORS.accent }}
            >
              👉 Reserva tu Plaza en IA Heroes Pro
            </a>

            <button onClick={onClose} className="block w-full py-3 px-6 rounded-xl font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors">
              Continuar explorando la app
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTAModal;
