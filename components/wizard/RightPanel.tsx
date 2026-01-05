import React from 'react';
import { Card, Badge } from '../ui';
import { BusinessAnalysis } from '../../types';
import { Loader2, Sparkles, Search, Briefcase, Layers, Lightbulb, Target, ShieldCheck } from 'lucide-react';

interface RightPanelProps {
  step: number;
  loading: boolean;
  loadingText: string;
  analysis: BusinessAnalysis | null;
}

export const RightPanel: React.FC<RightPanelProps> = ({ step, loading, loadingText, analysis }) => {
  return (
    <div className="hidden xl:flex flex-col border-l border-slate-200 bg-white w-96 h-full p-8 flex-shrink-0 overflow-y-auto">
      <div className="flex items-center gap-2 text-brand-600 mb-8">
        <Sparkles className="w-5 h-5" />
        <span className="text-xs font-bold tracking-widest uppercase">Sun AI Intelligence</span>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 text-center animate-fade-in px-4">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-brand-100 rounded-full animate-ping opacity-75"></div>
            <div className="relative bg-white p-3 rounded-full border border-brand-100 shadow-sm">
              <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
            </div>
          </div>
          <p className="text-sm text-slate-900 font-medium mb-1">{loadingText}</p>
          <p className="text-xs text-slate-400">Processing real-time insights...</p>
        </div>
      ) : (
        <div className="space-y-8 animate-fade-in">
          {step === 1 && !analysis && (
            <div className="text-center py-10 px-4 border-2 border-dashed border-slate-100 rounded-xl">
               <Search className="w-8 h-8 text-slate-300 mx-auto mb-3" />
               <p className="text-sm text-slate-500 font-medium">
                 Waiting for input...
               </p>
               <p className="text-xs text-slate-400 mt-2">
                 We'll use Google Search grounding to verify your business details instantly.
               </p>
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