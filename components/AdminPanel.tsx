import React, { useState, useEffect } from 'react';
import { useAdmin } from '../contexts/AdminContext';
import { getInteractionCounts, getCTAShownSections, resetTracking, InteractionCounts } from '../services/trackingService';

const INTERACTION_LABELS: Record<string, string> = {
  day1_slide_view: 'Día 1: Slides vistos',
  day1_card_flip: 'Día 1: Cards giradas',
  day2_prompt_enhance: 'Día 2: Prompts mejorados',
  day2_image_generate: 'Día 2: Imágenes generadas',
  day2_video_generate: 'Día 2: Videos generados',
  day3_chat_message: 'Día 3: Mensajes chat',
  day4_analysis_complete: 'Día 4: Análisis completados',
  agents_prompt_copy: 'Agentes: Prompts copiados',
  agents_card_flip: 'Agentes: Cards giradas',
};

const AdminPanel: React.FC = () => {
  const { isAdmin } = useAdmin();
  const [isOpen, setIsOpen] = useState(false);
  const [counts, setCounts] = useState<InteractionCounts>({});
  const [ctaSections, setCTASections] = useState<string[]>([]);

  // Poll for updates
  useEffect(() => {
    if (!isAdmin || !isOpen) return;
    const update = () => {
      setCounts(getInteractionCounts());
      setCTASections(getCTAShownSections());
    };
    update();
    const interval = setInterval(update, 2000);
    return () => clearInterval(interval);
  }, [isAdmin, isOpen]);

  if (!isAdmin) return null;

  const totalInteractions = Object.values(counts).reduce((s, v) => s + v, 0);

  return (
    <>
      {/* Floating toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 w-12 h-12 rounded-full bg-amber-500 text-white shadow-lg hover:bg-amber-600 transition-all flex items-center justify-center text-lg font-bold hover:scale-110"
        title="Panel Admin"
      >
        {isOpen ? '×' : '📊'}
      </button>

      {/* Panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 z-50 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
          style={{ animation: 'slideUp .2s ease-out' }}
        >
          {/* Header */}
          <div className="bg-amber-500 text-white px-4 py-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm">Panel Admin — Analytics</h3>
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">{totalInteractions} total</span>
            </div>
          </div>

          {/* Counts */}
          <div className="p-4 space-y-2 max-h-72 overflow-y-auto">
            {Object.entries(INTERACTION_LABELS).map(([key, label]) => {
              const count = counts[key] || 0;
              return (
                <div key={key} className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 truncate mr-2">{label}</span>
                  <span className={`font-bold tabular-nums min-w-[2rem] text-right ${count > 0 ? 'text-emerald-600' : 'text-slate-300'}`}>
                    {count}
                  </span>
                </div>
              );
            })}
          </div>

          {/* CTA Status */}
          {ctaSections.length > 0 && (
            <div className="px-4 pb-3 pt-1 border-t border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">CTAs mostrados</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {ctaSections.map(s => (
                  <span key={s} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-100 text-pink-600">{s}</span>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="px-4 py-3 border-t border-slate-100">
            <button
              onClick={() => {
                resetTracking();
                setCounts({});
                setCTASections([]);
              }}
              className="text-xs text-red-500 font-bold hover:underline"
            >
              Reset contadores
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminPanel;
