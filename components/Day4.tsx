import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Layout from './Layout';
import CTAModal from './CTAModal';
import { AppRoute } from '../types';
import { COLORS } from '../constants';
import { analyzeBusiness } from '../services/geminiService';

interface Day4Props {
  setRoute: (route: AppRoute) => void;
}

const cleanGeminiOutput = (text: string) => {
  if (!text) return "";
  let cleaned = text.replace(/^thought\s+[\s\S]*?(\n\n|$)/i, '');
  return cleaned.trim();
};

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button onClick={handleCopy} className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white transition-colors" title="Copiar Prompt">
      {copied ? (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-green-400">Copiado</span>
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

const Day4: React.FC<Day4Props> = ({ setRoute }) => {
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [sources, setSources] = useState<any[]>([]);
  const [showCTA, setShowCTA] = useState(false);

  const handleAnalyze = async () => {
    if (!url.trim()) return;
    setIsAnalyzing(true);
    setAnalysis(null);
    setSources([]);

    try {
      const result = await analyzeBusiness(url);
      const cleanedText = cleanGeminiOutput(result.text || "");

      setAnalysis(cleanedText || "No se pudo generar el análisis. Inténtalo de nuevo.");
      setSources(result.sources || []);

      setTimeout(() => setShowCTA(true), 1500);

    } catch (error) {
      console.error(error);
      setAnalysis("Hubo un error al conectar con el servidor de análisis. Asegúrate de que la URL es correcta.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const parseResult = (text: string) => {
    if (!text) return { intro: '', agents: [] };
    const parts = text.split(/(?=### Agente)/i);
    return {
      intro: parts[0],
      agents: parts.slice(1)
    };
  };

  const { intro, agents } = analysis ? parseResult(analysis) : { intro: '', agents: [] };

  return (
    <Layout title="Día 4: Auditoría de Negocio con IA" onBack={() => setRoute(AppRoute.HOME)}>
      <CTAModal isOpen={showCTA} onClose={() => setShowCTA(false)}
        title="¡Imagina el ROI!"
        message="Estos agentes son solo ideas. En IA Heroes Pro, te enseñamos a construirlos e implementarlos en tu negocio en menos de 8 meses."
      />

      <div className="space-y-8 pb-10">

        {/* Input Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 mb-2">Descubre tu potencial de automatización</h2>
          <p className="text-slate-600 mb-4">
            Introduce la URL de tu sitio web (o el de un competidor). La IA analizará el modelo de negocio y diseñará 3 agentes personalizados para aumentar la rentabilidad.
          </p>

          <div className="flex flex-col gap-3">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.mi-negocio.com"
              className="w-full p-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-pink-500 outline-none text-lg bg-white text-slate-900 placeholder-slate-400"
            />
            <button onClick={handleAnalyze} disabled={isAnalyzing || !url} className="w-full py-4 rounded-xl font-bold text-white text-lg shadow-lg transition hover:brightness-110 disabled:opacity-50 flex justify-center items-center gap-2" style={{ backgroundColor: COLORS.primary }}>
              {isAnalyzing ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analizando la web en tiempo real...
                </>
              ) : (
                '🔍 Analizar Negocio'
              )}
            </button>
          </div>
        </div>

        {/* Results Section */}
        {analysis && (
          <div className="space-y-8 animate-fade-in">

             {/* 1. General Analysis (Intro) */}
             {intro.trim() && (
               <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-[#243F4C]">
                 <h3 className="font-bold text-lg text-[#243F4C] mb-3 flex items-center gap-2">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                     <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                   </svg>
                   Análisis del Negocio
                 </h3>
                 <div className="max-w-none text-slate-600">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        p: ({node, ...props}) => <p className="text-slate-600 mb-4 leading-relaxed" {...props} />,
                        strong: ({node, ...props}) => <strong className="font-bold text-[#243F4C]" {...props} />,
                        ul: ({node, ...props}) => <ul className="list-disc list-outside ml-4 mb-4 text-slate-600 space-y-1" {...props} />,
                        ol: ({node, ...props}) => <ol className="list-decimal list-outside ml-4 mb-4 text-slate-600 space-y-1" {...props} />,
                        table: ({node, ...props}) => <div className="overflow-x-auto my-4 rounded-lg border border-slate-200"><table className="w-full text-sm text-left" {...props} /></div>,
                        thead: ({node, ...props}) => <thead className="bg-[#243F4C] text-white text-xs uppercase tracking-wider" {...props} />,
                        tbody: ({node, ...props}) => <tbody className="divide-y divide-slate-200" {...props} />,
                        tr: ({node, ...props}) => <tr className="hover:bg-slate-50 transition-colors" {...props} />,
                        th: ({node, ...props}) => <th className="px-4 py-3 font-semibold whitespace-nowrap" {...props} />,
                        td: ({node, ...props}) => <td className="px-4 py-3 text-slate-600" {...props} />,
                        h3: ({node, ...props}) => <h3 className="text-lg font-bold text-[#243F4C] mt-4 mb-2" {...props} />,
                        h4: ({node, ...props}) => <h4 className="text-base font-semibold text-[#243F4C] mt-3 mb-2" {...props} />,
                      }}
                    >
                      {intro}
                    </ReactMarkdown>
                 </div>
               </div>
             )}

             {/* 2. Agents Grid */}
             {agents.length > 0 && (
               <div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-6 px-2">Agentes Propuestos</h3>
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    {agents.map((agentText, index) => (
                      <div key={index} className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden flex flex-col hover:shadow-xl transition-shadow duration-300">
                        <div className="h-2 w-full bg-gradient-to-r from-[#243F4C] to-[#FF2878]"></div>

                        <div className="p-6 flex-1 flex flex-col">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                h3: ({node, ...props}) => <h3 className="text-xl font-bold text-[#243F4C] mb-4 pb-3 border-b border-slate-100" {...props} />,
                                p: ({node, ...props}) => <p className="text-slate-600 mb-4 text-sm leading-relaxed" {...props} />,
                                strong: ({node, ...props}) => <span className="font-bold text-[#243F4C] bg-blue-50 px-2 py-1 rounded inline-block mb-1" {...props} />,
                                ul: ({node, ...props}) => <ul className="list-disc list-outside ml-4 mb-4 text-sm text-slate-600 space-y-1" {...props} />,
                                ol: ({node, ...props}) => <ol className="list-decimal list-outside ml-4 mb-4 text-sm text-slate-600 space-y-1" {...props} />,
                                table: ({node, ...props}) => <div className="overflow-x-auto my-4 rounded-lg border border-slate-200"><table className="w-full text-sm text-left" {...props} /></div>,
                                thead: ({node, ...props}) => <thead className="bg-[#243F4C] text-white text-xs uppercase tracking-wider" {...props} />,
                                tbody: ({node, ...props}) => <tbody className="divide-y divide-slate-200" {...props} />,
                                tr: ({node, ...props}) => <tr className="hover:bg-slate-50 transition-colors" {...props} />,
                                th: ({node, ...props}) => <th className="px-4 py-3 font-semibold whitespace-nowrap" {...props} />,
                                td: ({node, ...props}) => <td className="px-4 py-3 text-slate-600" {...props} />,
                                code: ({node, inline, className, children, ...props}: any) => {
                                  if (inline) return <code className="bg-slate-100 text-pink-600 px-1 rounded font-mono text-xs" {...props}>{children}</code>;

                                  const content = String(children).replace(/\n$/, '');

                                  const lines = content.split('\n');
                                  const formattedContent = lines.map((line, i) => {
                                    const trimmed = line.trim();
                                    if (trimmed.startsWith('#')) {
                                      return (
                                        <span key={i} className="block font-bold mt-4 mb-1 first:mt-0" style={{ color: COLORS.accent }}>
                                          {line}
                                        </span>
                                      );
                                    }
                                    if (trimmed.startsWith('-') || trimmed.startsWith('•')) {
                                       return <span key={i} className="block text-slate-300 pl-2">{line}</span>;
                                    }
                                    return <span key={i} className="block text-slate-200">{line}</span>;
                                  });

                                  return (
                                    <div className="bg-[#0F172A] rounded-xl overflow-hidden shadow-inner border border-slate-800 mt-auto">
                                      <div className="flex items-center justify-between px-4 py-2 bg-[#1e293b] border-b border-slate-700">
                                        <div className="flex items-center gap-2">
                                          <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                                          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                                          <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                                          <span className="ml-2 text-[10px] font-mono text-slate-400 uppercase tracking-widest">System Prompt</span>
                                        </div>
                                        <CopyButton text={content} />
                                      </div>

                                      <div className="p-4 overflow-x-auto">
                                        <pre className="font-mono text-sm leading-relaxed whitespace-pre-wrap">
                                          {formattedContent}
                                        </pre>
                                      </div>
                                    </div>
                                  );
                                }
                             }}
                          >
                            {agentText}
                          </ReactMarkdown>
                        </div>
                      </div>
                    ))}
                  </div>
               </div>
             )}

             {/* 3. Sources */}
             {sources.length > 0 && (
               <div className="pt-6 border-t border-slate-200">
                 <h4 className="text-xs font-bold text-slate-400 uppercase mb-3 tracking-wider">Fuentes Analizadas</h4>
                 <div className="flex flex-wrap gap-2">
                   {sources.map((chunk, idx) => (
                     chunk.web?.uri ? (
                       <a key={idx} href={chunk.web.uri} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs hover:bg-slate-200 transition-colors">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                         </svg>
                         {chunk.web.title || new URL(chunk.web.uri).hostname}
                       </a>
                     ) : null
                   ))}
                 </div>
               </div>
             )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Day4;
