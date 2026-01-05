
import React from 'react';
import { BrainCircuit, CheckSquare } from 'lucide-react';

export const DashboardRightPanel: React.FC = () => {
  return (
    <aside className="w-80 border-l border-slate-200 bg-white p-8 hidden xl:block h-screen overflow-y-auto flex-shrink-0">
      <h3 className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-8 flex items-center gap-2">
         <BrainCircuit className="w-4 h-4" /> Intelligence
      </h3>

      <div className="space-y-8">
         <div>
           <h4 className="text-slate-900 font-medium mb-2">Why this phase matters</h4>
           <p className="text-sm text-slate-500 leading-relaxed">
             Establishing a clean data foundation now prevents 80% of automation errors later. We are building the "truth" source for your AI agents.
           </p>
         </div>

         <div>
           <h4 className="text-slate-900 font-medium mb-2">Predicted Risks</h4>
           <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex gap-3">
                 <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                 <p className="text-sm text-slate-600">Legacy SKU formats may conflict with the new PIM system.</p>
              </div>
           </div>
         </div>

         <div className="p-6 rounded-xl bg-gradient-to-b from-brand-50 to-transparent border border-brand-100 text-center">
            <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-600">
              <CheckSquare className="w-6 h-6" />
            </div>
            <h4 className="text-slate-900 font-medium mb-1">On Track</h4>
            <p className="text-xs text-slate-500">No major blockers detected. No action needed from you today.</p>
         </div>
      </div>
    </aside>
  );
};
