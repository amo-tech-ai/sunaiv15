
import React from 'react';
import { Button, Card } from '../ui';
import { StrategyPhase } from '../../types';
import { Calendar, CheckSquare, ArrowRight, Rocket, PlayCircle } from 'lucide-react';

interface Step5StrategyProps {
  strategy: StrategyPhase[];
  onFinish: () => void;
  loading?: boolean;
}

export const Step5Strategy: React.FC<Step5StrategyProps> = ({ strategy, onFinish, loading }) => {
  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="relative">
        {/* Vertical Line for Desktop */}
        <div className="absolute left-[39px] top-8 bottom-8 w-0.5 bg-slate-200 hidden md:block" />

        <div className="space-y-8">
          {strategy.map((phase, idx) => (
            <div key={idx} className="relative md:pl-28 group">
              
              {/* Timeline Marker (Desktop) */}
              <div className="hidden md:flex absolute left-0 top-0 flex-col items-center w-20">
                 <div className={`
                    w-20 h-20 rounded-2xl flex flex-col items-center justify-center border-2 z-10 bg-white transition-colors
                    ${idx === 0 ? 'border-brand-500 text-brand-600 shadow-lg shadow-brand-500/20' : 'border-slate-200 text-slate-400 group-hover:border-brand-300 group-hover:text-brand-400'}
                 `}>
                    <span className="text-[10px] uppercase font-bold tracking-widest">Phase</span>
                    <span className="text-3xl font-display font-bold">{phase.phase}</span>
                 </div>
                 {idx === 0 && (
                   <div className="mt-2 px-2 py-1 bg-brand-100 text-brand-700 text-[10px] font-bold uppercase rounded-full">
                     Start
                   </div>
                 )}
              </div>

              {/* Mobile Marker */}
              <div className="md:hidden flex items-center gap-3 mb-3">
                 <div className="px-3 py-1 bg-brand-100 text-brand-700 rounded-lg text-xs font-bold uppercase">
                    Phase {phase.phase}
                 </div>
                 <span className="text-sm font-medium text-slate-500">{phase.timelineWeeks} Weeks</span>
              </div>

              {/* Card Content */}
              <Card className={`
                relative transition-all duration-300 border-l-4 
                ${idx === 0 ? 'border-l-brand-500 shadow-lg ring-1 ring-brand-100' : 'border-l-slate-300 hover:border-l-brand-400'}
              `}>
                <div className="flex flex-col gap-4">
                   <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">{phase.name}</h3>
                        <p className="text-slate-500 mt-1 text-sm">{phase.description}</p>
                      </div>
                      <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
                         <Calendar className="w-3.5 h-3.5" />
                         {phase.timelineWeeks} Weeks
                      </div>
                   </div>

                   {/* Deliverables */}
                   <div className="bg-slate-50 rounded-lg p-4 mt-2">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <CheckSquare className="w-3.5 h-3.5" /> Core Deliverables
                      </h4>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {phase.deliverables.map((item, i) => (
                          <div key={i} className="flex items-start gap-2.5">
                             <div className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${idx === 0 ? 'bg-brand-500' : 'bg-slate-400'}`} />
                             <span className="text-sm text-slate-700 font-medium leading-relaxed">{item}</span>
                          </div>
                        ))}
                      </div>
                   </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-slate-200 lg:static lg:bg-transparent lg:border-none lg:p-0">
         <div className="max-w-2xl mx-auto lg:mx-0">
            <Button onClick={onFinish} className="w-full bg-slate-900 hover:bg-slate-800 text-white text-lg py-4 shadow-xl shadow-slate-900/10">
              <Rocket className="w-5 h-5 mr-2" /> 
              Approve Plan & Launch Dashboard
            </Button>
            <p className="text-center text-xs text-slate-400 mt-3">
              By launching, you agree to the 90-day execution roadmap.
            </p>
         </div>
      </div>
    </div>
  );
};
