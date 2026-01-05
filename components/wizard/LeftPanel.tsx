
import React from 'react';
import { Badge } from '../ui';
import { BusinessProfile, BusinessAnalysis } from '../../types';

interface LeftPanelProps {
  step: number;
  profile: BusinessProfile;
  analysis: BusinessAnalysis | null;
}

export const LeftPanel: React.FC<LeftPanelProps> = ({ step, profile, analysis }) => {
  return (
    <div className="hidden lg:flex flex-col border-r border-slate-200 bg-white w-72 h-full p-8 flex-shrink-0">
      <div className="mb-8">
         <h1 className="text-sm font-bold text-brand-600 tracking-wider uppercase mb-1">Sun AI Agency</h1>
         <div className="h-1 w-8 bg-brand-500 rounded-full"/>
      </div>

      <div className="space-y-6">
         <div className="flex items-center gap-3">
           <div className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-600 text-white font-bold text-sm shadow-md shadow-brand-200">
             {step}
           </div>
           <div>
             <div className="text-xs text-slate-400 uppercase font-semibold">Step {step} of 5</div>
             <div className="text-sm font-medium text-slate-900">
               {step === 1 && "Business Context"}
               {step === 2 && "Industry Deep Dive"}
               {step === 3 && "System Selection"}
               {step === 4 && "Readiness Check"}
               {step === 5 && "Execution Plan"}
             </div>
           </div>
         </div>

         {step > 1 && (
           <div className="pt-6 border-t border-slate-100 animate-fade-in space-y-4">
              <div>
                <div className="text-xs text-slate-400 uppercase font-semibold mb-1">Company</div>
                <div className="text-sm text-slate-900 font-medium truncate">{profile.companyName}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400 uppercase font-semibold mb-1">Industry</div>
                <div className="text-sm text-slate-900 font-medium truncate">{analysis?.detectedIndustry || profile.industry}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400 uppercase font-semibold mb-1">Model</div>
                <div className="text-sm text-slate-900 font-medium">
                  <Badge variant="brand">{analysis?.businessModel || "Analyzing..."}</Badge>
                </div>
              </div>
           </div>
         )}
      </div>
      
      <div className="mt-auto">
        <div className="text-xs text-slate-400 leading-relaxed">
          Need help? <br/> <a href="#" className="text-brand-600 hover:underline">Contact Consultant</a>
        </div>
      </div>
    </div>
  );
};
