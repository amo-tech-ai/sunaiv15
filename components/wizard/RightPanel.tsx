
import React, { useRef, useEffect } from 'react';
import { Card, Badge } from '../ui';
import { BusinessAnalysis } from '../../types';
import { Loader2, Sparkles, Search, Briefcase, Layers, Lightbulb, Target, ShieldCheck, Check, Terminal } from 'lucide-react';

interface RightPanelProps {
  step: number;
  loading: boolean;
  loadingText: string;
  analysis: BusinessAnalysis | null;
  streamData?: string;
}

export const RightPanel: React.FC<RightPanelProps> = ({ step, loading, loadingText, analysis, streamData }) => {
  const terminalRef = useRef<HTMLDivElement>(null);

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [streamData]);

  return (
    <div className="hidden xl:flex flex-col border-l border-slate-200 bg-white w-96 h-full p-8 flex-shrink-0 overflow-y-auto">
      <div className="flex items-center gap-2 text-brand-600 mb-8">
        <Sparkles className="w-5 h-5" />
        <span className="text-xs font-bold tracking-widest uppercase">Sun AI Intelligence</span>
      </div>

      {loading ? (
        <div className="flex flex-col h-full animate-fade-in">
           {/* Primary Loading State */}
           <div className="mb-8">
             <div className="flex items-center gap-3 mb-4">
                <Loader2 className="w-5 h-5 text-brand-500 animate-spin" />
                <span className="text-sm font-semibold text-slate-900">{loadingText || "Processing..."}</span>
             </div>
             
             {/* Simulated Steps Visuals for Step 1 */}
             {step === 1 && (
               <div className="space-y-4 pl-2 mb-6 border-l-2 border-slate-100 ml-2">
                   <div className="flex items-center gap-3 text-sm text-slate-600">
                      <div className={`w-2 h-2 rounded-full ${loadingText.includes("Researching") || loadingText.includes("Identifying") ? 'bg-brand-500' : 'bg-slate-300 animate-pulse'}`} />
                      <span>Detecting industry context</span>
                   </div>
                   <div className="flex items-center gap-3 text-sm text-slate-600">
                      <div className={`w-2 h-2 rounded-full ${loadingText.includes("Identifying") ? 'bg-brand-500' : 'bg-slate-300'}`} />
                      <span>Reviewing digital footprint</span>
                   </div>
               </div>
             )}
           </div>

           {/* Live Agent Terminal */}
           <div className="flex-1 bg-slate-900 rounded-xl p-4 font-mono text-xs overflow-hidden flex flex-col shadow-inner">
             <div className="flex items-center gap-2 border-b border-slate-800 pb-2 mb-2 text-slate-500">
               <Terminal className="w-3 h-3" />
               <span className="uppercase tracking-wider text-[10px]">Agent Stream</span>
             </div>
             <div ref={terminalRef} className="flex-1 overflow-y-auto text-emerald-400 space-y-1 break-all whitespace-pre-wrap">
               {streamData ? (
                 <>
                   <span className="opacity-50">{"> Initializing Gemini 3..."}</span><br/>
                   <span className="opacity-50">{"> Connecting to Edge Runtime..."}</span><br/>
                   {streamData}
                   <span className="animate-pulse">_</span>
                 </>
               ) : (
                 <span className="text-slate-600 italic">Waiting for stream...</span>
               )}
             </div>
           </div>
        </div>
      ) : (
        <div className="space-y-8 animate-fade-in">
          {step === 1 && !analysis && (
            <div className="text-center py-12 px-6 border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/50">
               <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mx-auto mb-4 text-brand-500">
                 <Search className="w-6 h-6" />
               </div>
               <p className="text-sm text-slate-900 font-semibold mb-2">
                 Ready to analyze your business
               </p>
               <p className="text-xs text-slate-500 leading-relaxed">
                 We'll use Google Search grounding to verify your business details instantly.
               </p>
               
               <div className="mt-6 pt-6 border-t border-slate-200/50 text-left">
                  <p className="text-[10px] uppercase font-bold text-slate-400 mb-2">What we look for</p>
                  <ul className="space-y-2">
                    {['Industry classification', 'Business model (B2B/B2C)', 'Digital maturity signals'].map(item => (
                      <li key={item} className="flex items-center gap-2 text-xs text-slate-600">
                        <Check className="w-3 h-3 text-brand-400" /> {item}
                      </li>
                    ))}
                  </ul>
               </div>
            </div>
          )}

          {/* Persistent Analysis Summary (Small) for later steps */}
          {step > 1 && analysis && (
            <div className="pb-6 border-b border-slate-100">
               <div className="flex items-center justify-between mb-2">
                 <span className="text-xs font-bold text-slate-400 uppercase">Context</span>
                 <Badge variant="brand">{analysis.businessModel}</Badge>
               </div>
               <p className="text-sm font-medium text-slate-900 truncate">{analysis.detectedIndustry}</p>
            </div>
          )}

          {step === 1 && analysis && (
            <div className="animate-slide-up">
              <p className="text-xs text-slate-400 uppercase font-semibold mb-3">Detected Signals</p>
              <div className="space-y-3">
                 <Card className="p-4 bg-slate-50 border-slate-100">
                    <div className="flex items-start gap-3">
                      <Briefcase className="w-4 h-4 text-brand-500 mt-0.5" />
                      <div>
                        <div className="text-sm font-semibold text-slate-900">{analysis.detectedIndustry}</div>
                        <div className="text-xs text-slate-500 mt-1">Matched via Search</div>
                      </div>
                    </div>
                 </Card>
                 <Card className="p-4 bg-slate-50 border-slate-100">
                    <div className="flex items-start gap-3">
                      <Layers className="w-4 h-4 text-brand-500 mt-0.5" />
                      <div>
                        <div className="text-sm font-semibold text-slate-900">{analysis.businessModel} Model</div>
                        <div className="text-xs text-slate-500 mt-1">Inferred structure</div>
                      </div>
                    </div>
                 </Card>
              </div>
              
              <div className="mt-6">
                <p className="text-xs text-slate-400 uppercase font-semibold mb-3">Key Observations</p>
                <ul className="space-y-3">
                  {analysis.observations.map((obs, i) => (
                    <li key={i} className="text-sm text-slate-600 leading-relaxed flex gap-2">
                       <span className="text-brand-500 mt-1">•</span> {obs}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Other steps content... */}
          {step === 2 && (
             <div className="p-5 bg-gradient-to-br from-brand-50 to-white border border-brand-100 rounded-xl animate-slide-up shadow-sm">
              <Lightbulb className="w-5 h-5 text-brand-600 mb-3" />
              <p className="text-brand-900 text-sm font-medium mb-1">Why these questions?</p>
              <p className="text-slate-600 text-sm leading-relaxed">
                We've filtered out generic bottlenecks. These are the specific friction points common in {analysis?.detectedIndustry} businesses of your maturity level.
              </p>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-slide-up">
              <div>
                 <h4 className="text-sm font-medium text-slate-900 mb-2">Selection Logic</h4>
                 <p className="text-sm text-slate-500 leading-relaxed">
                   Based on your bottleneck selection, we are prioritizing systems that offer immediate time-to-value rather than long-term infrastructure projects.
                 </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                <div className="text-xs font-bold text-slate-400 uppercase mb-2">Focus Area</div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="neutral">Automation</Badge>
                  <Badge variant="neutral">Cost Reduction</Badge>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 animate-slide-up">
               <div className="p-5 bg-emerald-50 border border-emerald-100 rounded-xl">
                 <ShieldCheck className="w-5 h-5 text-emerald-600 mb-2" />
                 <h4 className="text-emerald-900 font-medium text-sm mb-1">Score Validation</h4>
                 <p className="text-emerald-800 text-sm">
                   Your score is calculated against 5,000+ similar businesses in {analysis?.detectedIndustry}.
                 </p>
               </div>
               <div>
                  <h4 className="text-sm font-medium text-slate-900 mb-2">What happens next?</h4>
                  <p className="text-sm text-slate-500">
                    We will generate a 90-day execution plan tailored to close your critical gaps first.
                  </p>
               </div>
            </div>
          )}

          {step === 5 && (
            <div className="animate-slide-up text-center pt-10">
               <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-900 text-white mb-4 shadow-xl shadow-slate-200">
                 <Target className="w-8 h-8" />
               </div>
               <h4 className="text-lg font-bold text-slate-900 mb-2">Ready to Launch</h4>
               <p className="text-sm text-slate-500 mb-6">
                 This strategy is saved to your dashboard. You can adjust timelines and assign owners once the project is created.
               </p>
            </div>
          )}

        </div>
      )}
    </div>
  );
};
