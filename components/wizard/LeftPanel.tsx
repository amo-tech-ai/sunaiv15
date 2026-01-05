
import React from 'react';
import { CheckCircle2, Circle, Disc } from 'lucide-react';
import { BusinessProfile, BusinessAnalysis } from '../../types';

interface LeftPanelProps {
  step: number;
  profile: BusinessProfile;
  analysis: BusinessAnalysis | null;
}

const STEPS = [
  { num: 1, label: "Business Context" },
  { num: 2, label: "Industry Deep Dive" },
  { num: 3, label: "System Selection" },
  { num: 4, label: "Readiness Check" },
  { num: 5, label: "Execution Plan" }
];

export const LeftPanel: React.FC<LeftPanelProps> = ({ step, profile, analysis }) => {
  const progressPercent = Math.max(5, (step / 5) * 100);

  return (
    <div className="hidden lg:flex flex-col border-r border-slate-200 bg-white w-72 h-full flex-shrink-0 transition-all duration-300">
      {/* Header */}
      <div className="p-8 pb-4">
         <div className="flex items-center gap-2 mb-6">
            <div className="w-6 h-6 rounded bg-brand-600 flex items-center justify-center shadow-md shadow-brand-200">
                <span className="text-white font-bold text-xs">S</span>
            </div>
            <span className="text-sm font-bold text-slate-900 tracking-wide uppercase">Sun AI Agency</span>
         </div>
         
         <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            <span>Setup</span>
            <span>Step {step} of 5</span>
         </div>
         
         {/* Progress Bar */}
         <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div 
                className="h-full bg-brand-500 transition-all duration-500 ease-out" 
                style={{ width: `${progressPercent}%` }}
            />
         </div>
      </div>

      {/* Steps List */}
      <div className="flex-1 overflow-y-auto py-4 px-6 space-y-1">
        {STEPS.map((s) => {
            const isActive = step === s.num;
            const isCompleted = step > s.num;
            
            return (
                <div 
                    key={s.num} 
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                        isActive ? 'bg-brand-50 text-brand-900 translate-x-1' : 'text-slate-500'
                    }`}
                >
                    <div className="flex-shrink-0">
                        {isCompleted ? (
                            <CheckCircle2 className="w-5 h-5 text-brand-600" />
                        ) : isActive ? (
                            <Disc className="w-5 h-5 text-brand-600 animate-pulse" />
                        ) : (
                            <Circle className="w-5 h-5 text-slate-300" />
                        )}
                    </div>
                    <span className={`text-sm font-medium ${isActive ? 'text-brand-900' : 'text-slate-600'}`}>
                        {s.label}
                    </span>
                </div>
            )
        })}
      </div>
      
      {/* Footer Info */}
      <div className="p-8 mt-auto border-t border-slate-100">
        <div className="text-xs text-slate-400">
          Need help? <a href="#" className="text-brand-600 hover:underline">Contact Support</a>
        </div>
      </div>
    </div>
  );
};
