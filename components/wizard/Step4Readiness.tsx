
import React from 'react';
import { Button, Card } from '../ui';
import { ReadinessAssessment } from '../../types';
import { ArrowRight, AlertTriangle, CheckCircle2, BarChart3, Database, Users, Settings, TrendingUp } from 'lucide-react';

interface Step4ReadinessProps {
  readiness: ReadinessAssessment | null;
  onNext: () => void;
  loading: boolean;
}

export const Step4Readiness: React.FC<Step4ReadinessProps> = ({ readiness, onNext, loading }) => {
  if (!readiness) return null;

  const getScoreColor = (score: number) => {
    if (score >= 75) return { text: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', stroke: '#059669' };
    if (score >= 50) return { text: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', stroke: '#d97706' };
    return { text: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200', stroke: '#e11d48' };
  };

  const colors = getScoreColor(readiness.score);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Score Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 flex flex-col md:flex-row items-center gap-8">
          
          {/* Radial Chart */}
          <div className="relative w-40 h-40 flex-shrink-0">
             <svg className="w-full h-full transform -rotate-90">
                <circle cx="80" cy="80" r="70" stroke="#f1f5f9" strokeWidth="12" fill="transparent" />
                <circle 
                  cx="80" cy="80" r="70" 
                  stroke={colors.stroke} 
                  strokeWidth="12" 
                  fill="transparent" 
                  strokeDasharray={`${(readiness.score / 100) * 440} 440`} 
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
             </svg>
             <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-4xl font-display font-bold ${colors.text}`}>{readiness.score}</span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Ready</span>
             </div>
          </div>

          {/* Text Content */}
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              {readiness.score >= 75 ? "System-Ready" : readiness.score >= 50 ? "Foundation Needed" : "Preparation Required"}
            </h2>
            <p className="text-slate-600 leading-relaxed mb-6">
               {readiness.score >= 75 
                 ? "Your business structure supports immediate AI deployment. We can proceed with the standard implementation timeline."
                 : "We've identified key operational gaps that should be addressed during Phase 1 to ensure AI agents can function correctly."}
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
               {Object.entries(readiness.breakdown).map(([key, val]) => (
                 <div key={key} className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200">
                    <div className={`w-2 h-2 rounded-full ${val > 60 ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                    <span className="text-xs font-bold text-slate-700 uppercase">{key}</span>
                    <span className="text-xs font-mono text-slate-400">{val}%</span>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        
        {/* Critical Gaps */}
        <div className="bg-white rounded-xl border border-rose-100 shadow-sm p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-rose-500" />
          <h3 className="flex items-center gap-2 text-rose-700 font-bold uppercase tracking-wider text-sm mb-4">
            <AlertTriangle className="w-4 h-4" /> Critical Gaps
          </h3>
          <ul className="space-y-4">
            {readiness.criticalGaps.map((gap, i) => (
              <li key={i} className="flex gap-3 text-sm text-slate-700">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-xs">!</span>
                <span className="leading-relaxed">{gap}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Wins */}
        <div className="bg-white rounded-xl border border-emerald-100 shadow-sm p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
          <h3 className="flex items-center gap-2 text-emerald-700 font-bold uppercase tracking-wider text-sm mb-4">
            <TrendingUp className="w-4 h-4" /> Quick Wins
          </h3>
          <ul className="space-y-4">
            {readiness.quickWins.map((win, i) => (
              <li key={i} className="flex gap-3 text-sm text-slate-700">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </span>
                <span className="leading-relaxed">{win}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="pt-4">
        <Button loading={loading} onClick={onNext} className="w-full text-lg py-4">
          Generate Strategy <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
};
