import React from 'react';
import { Button, Card, Badge } from '../ui';
import { StrategyPhase } from '../../types';
import { Calendar, CheckSquare, ArrowRight, Rocket } from 'lucide-react';

interface Step5StrategyProps {
  strategy: StrategyPhase[];
  onFinish: () => void;
  loading?: boolean;
}

export const Step5Strategy: React.FC<Step5StrategyProps> = ({ strategy, onFinish, loading }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid gap-6">
        {strategy.map((phase, idx) => (
          <div key={idx} className="relative group">
            {/* Connector Line */}
            {idx !== strategy.length - 1 && (
              <div className="absolute left-8 top-16 bottom-[-24px] w-0.5 bg-slate-200 group-hover:bg-brand-200 transition-colors z-0" />
            )}
            
            <Card className="relative z-10 hover:border-brand-200 transition-all duration-300">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Phase Indicator */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-brand-50 border-2 border-brand-100 flex flex-col items-center justify-center text-brand-700">
                    <span className="text-xs font-bold uppercase tracking-wider">Phase</span>
                    <span className="text-xl font-bold">{phase.phase}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <h3 className="text-xl font-bold text-slate-900">{phase.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full w-fit">
                      <Calendar className="w-4 h-4" />
                      {phase.timelineWeeks} Weeks
                    </div>
                  </div>
                  
                  <p className="text-slate-600 leading-relaxed">{phase.description}</p>
                  
                  <div className="bg-slate-50 rounded-lg p-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <CheckSquare className="w-3 h-3" /> Key Deliverables
                    </h4>
                    <div className="grid sm:grid-cols-2 gap-y-2 gap-x-4">
                      {phase.deliverables.map((item, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm text-slate-700">
                          <div className="w-1.5 h-1.5 rounded-full bg-brand-400 mt-1.5 flex-shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>

      <div className="pt-4 sticky bottom-0 bg-gradient-to-t from-slate-50 to-transparent pb-4">
        <Button onClick={onFinish} className="w-full bg-emerald-600 hover:bg-emerald-500 text-lg shadow-emerald-500/20 shadow-xl">
          <Rocket className="w-5 h-5 mr-2" /> Create Project & Launch Dashboard
        </Button>
      </div>
    </div>
  );
};