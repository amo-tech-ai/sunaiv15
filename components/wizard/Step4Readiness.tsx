import React from 'react';
import { Button, Card, Badge } from '../ui';
import { ReadinessAssessment } from '../../types';
import { ArrowRight, AlertTriangle, CheckCircle2, BarChart3, Database, Users, Settings } from 'lucide-react';

interface Step4ReadinessProps {
  readiness: ReadinessAssessment | null;
  onNext: () => void;
  loading: boolean;
}

export const Step4Readiness: React.FC<Step4ReadinessProps> = ({ readiness, onNext, loading }) => {
  if (!readiness) return null;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Score Section */}
      <div className="flex flex-col md:flex-row items-center gap-8 p-8 bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="relative w-32 h-32 flex items-center justify-center flex-shrink-0">
          <svg className="transform -rotate-90 w-32 h-32">
            <circle cx="64" cy="64" r="56" stroke="#f1f5f9" strokeWidth="8" fill="transparent" />
            <circle 
              cx="64" cy="64" r="56" 
              stroke={readiness.score > 70 ? "#10b981" : readiness.score > 50 ? "#f59e0b" : "#ef4444"} 
              strokeWidth="8" 
              fill="transparent" 
              strokeDasharray={`${readiness.score * 3.51} 351`} 
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-3xl font-bold text-slate-900">{readiness.score}</span>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Score</span>
          </div>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">Readiness Assessment</h3>
          <p className="text-slate-600 leading-relaxed">
            {readiness.score > 75 
              ? "Your business is well-positioned for AI adoption. We can move fast on execution." 
              : "We found some foundational gaps to address, but your high-leverage areas are ready for pilot programs."}
          </p>
        </div>
      </div>

      {/* Breakdown Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Tech', value: readiness.breakdown.tech, icon: Settings },
          { label: 'Process', value: readiness.breakdown.process, icon: BarChart3 },
          { label: 'Data', value: readiness.breakdown.data, icon: Database },
          { label: 'Team', value: readiness.breakdown.team, icon: Users },
        ].map((item) => (
          <Card key={item.label} className="p-4 flex flex-col items-center justify-center text-center gap-2">
            <item.icon className={`w-5 h-5 ${item.value > 70 ? 'text-emerald-500' : 'text-amber-500'}`} />
            <div className="text-2xl font-bold text-slate-900">{item.value}%</div>
            <div className="text-xs text-slate-500 uppercase font-semibold">{item.label}</div>
          </Card>
        ))}
      </div>

      {/* Gaps & Wins */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" /> Critical Gaps
          </h4>
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 space-y-3">
            {readiness.criticalGaps.map((gap, i) => (
              <div key={i} className="flex gap-3 text-sm text-amber-900">
                <span className="font-bold">•</span>
                {gap}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Quick Wins
          </h4>
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 space-y-3">
            {readiness.quickWins.map((win, i) => (
              <div key={i} className="flex gap-3 text-sm text-emerald-900">
                <span className="font-bold">•</span>
                {win}
              </div>
            ))}
          </div>
        </div>
      </div>

      <Button loading={loading} onClick={onNext} className="w-full text-lg mt-4">
        Generate Strategy <ArrowRight className="w-5 h-5 ml-2" />
      </Button>
    </div>
  );
};