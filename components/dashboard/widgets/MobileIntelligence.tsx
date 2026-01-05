
import React from 'react';
import { Card } from '../../ui';
import { BrainCircuit } from 'lucide-react';

export const MobileIntelligence: React.FC = () => {
  return (
    <section className="xl:hidden border-t border-slate-200 pt-8 mt-8">
       <h3 className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-6 flex items-center gap-2">
         <BrainCircuit className="w-4 h-4" /> Intelligence Insights
       </h3>
       <Card className="bg-white p-6 mb-4">
         <h4 className="text-slate-900 font-medium mb-2">Why this phase matters</h4>
         <p className="text-sm text-slate-500 leading-relaxed">
           Establishing a clean data foundation now prevents 80% of automation errors later. We are building the "truth" source for your AI agents.
         </p>
       </Card>
       <Card className="bg-slate-50 p-6 border-slate-200">
           <div className="flex gap-3">
               <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
               <p className="text-sm text-slate-600">Legacy SKU formats may conflict with the new PIM system.</p>
           </div>
       </Card>
    </section>
  );
};
