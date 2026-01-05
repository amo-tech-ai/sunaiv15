
import React from 'react';
import { Button, Card, Badge } from '../ui';
import { SystemRecommendation } from '../../types';
import { ArrowRight, CheckCircle } from 'lucide-react';

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
    } else if (selectedSystems.length < 3) {
      setSelectedSystems([...selectedSystems, sysId]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        {systems.map((sys, idx) => {
          const isSelected = selectedSystems.includes(sys.id);
          return (
            <div 
              key={sys.id} 
              onClick={() => handleToggleSystem(sys.id)}
              className={`cursor-pointer group relative animate-slide-up ${loading ? 'opacity-60 pointer-events-none' : ''}`} 
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <Card active={isSelected} className="h-full hover:scale-[1.01] transition-transform">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant={sys.isRecommended ? 'brand' : 'neutral'}>{sys.category}</Badge>
                  {isSelected && <CheckCircle className="w-6 h-6 text-brand-500" />}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-1">{sys.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{sys.benefit}</p>
              </Card>
            </div>
          );
        })}
      </div>
      <Button loading={loading} onClick={onNext} disabled={selectedSystems.length === 0} className="w-full">
        Review Readiness <ArrowRight className="w-4 h-4" />
      </Button>
    </div>
  );
};
