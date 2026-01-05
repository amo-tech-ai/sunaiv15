
import React from 'react';
import { Button, Card, Badge } from '../ui';
import { SystemRecommendation } from '../../types';
import { ArrowRight, CheckCircle, Info, Zap } from 'lucide-react';

interface Step3SystemsProps {
  systems: SystemRecommendation[];
  selectedSystems: string[];
  setSelectedSystems: React.Dispatch<React.SetStateAction<string[]>>;
  onNext: () => void;
  loading: boolean;
}

export const Step3Systems: React.FC<Step3SystemsProps> = ({ systems, selectedSystems, setSelectedSystems, onNext, loading }) => {
  
  const handleToggleSystem = (sysId: string) => {
    if (loading) return;
    if (selectedSystems.includes(sysId)) {
      setSelectedSystems(selectedSystems.filter(id => id !== sysId));
    } else {
      if (selectedSystems.length < 3) {
        setSelectedSystems([...selectedSystems, sysId]);
      }
    }
  };

  const isMaxSelected = selectedSystems.length >= 3;

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="flex items-center justify-between bg-brand-50 p-4 rounded-lg border border-brand-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-600">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <p className="text-sm font-bold text-brand-900">Outcome-Based Selection</p>
            <p className="text-xs text-brand-700">Select the systems that solve your immediate bottlenecks.</p>
          </div>
        </div>
        <div className="text-right">
           <span className={`text-2xl font-bold ${isMaxSelected ? 'text-brand-600' : 'text-slate-400'}`}>
             {selectedSystems.length}
           </span>
           <span className="text-sm text-slate-400 font-medium">/3</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {systems.map((sys, idx) => {
          const isSelected = selectedSystems.includes(sys.id);
          const isRecommended = sys.isRecommended;
          
          // Disable interaction if max selected and this item isn't selected
          const isDisabled = isMaxSelected && !isSelected;

          return (
            <div 
              key={sys.id} 
              onClick={() => !isDisabled && handleToggleSystem(sys.id)}
              className={`
                relative cursor-pointer transition-all duration-300 animate-slide-up
                ${isDisabled ? 'opacity-50 grayscale-[0.5] cursor-not-allowed' : 'hover:-translate-y-1'}
              `} 
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className={`
                h-full p-6 rounded-xl border-2 transition-all shadow-sm
                ${isSelected 
                  ? 'bg-white border-brand-500 ring-4 ring-brand-500/10 shadow-xl shadow-brand-500/10' 
                  : isRecommended
                    ? 'bg-slate-50 border-brand-200 hover:border-brand-300'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }
              `}>
                
                {/* Header */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex flex-col gap-2">
                     <Badge variant={isRecommended ? 'brand' : 'neutral'}>
                        {isRecommended ? 'Recommended' : sys.category}
                     </Badge>
                  </div>
                  <div className={`
                    w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
                    ${isSelected 
                      ? 'bg-brand-500 border-brand-500 text-white' 
                      : 'border-slate-300 bg-white text-transparent'
                    }
                  `}>
                    <CheckCircle className="w-4 h-4" />
                  </div>
                </div>

                {/* Content */}
                <h3 className={`text-lg font-bold mb-2 ${isSelected ? 'text-brand-900' : 'text-slate-900'}`}>
                  {sys.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-4 min-h-[40px]">
                  {sys.benefit}
                </p>

                {/* Footer / Meta */}
                {isRecommended && (
                  <div className="flex items-center gap-1.5 text-xs font-medium text-brand-600">
                    <Zap className="w-3 h-3" />
                    <span>High Impact</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {isMaxSelected && (
        <div className="text-center text-xs text-amber-600 font-medium animate-fade-in bg-amber-50 p-2 rounded">
          Maximum of 3 systems reached. Unselect one to choose another.
        </div>
      )}

      <div className="pt-6 border-t border-slate-200">
        <Button 
          loading={loading} 
          onClick={onNext} 
          disabled={selectedSystems.length === 0} 
          className="w-full text-lg py-4"
        >
          Review Readiness <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
};
