
import React from 'react';
import { Button } from '../ui';
import { BottleneckQuestion } from '../../types';
import { ArrowRight, CheckCircle } from 'lucide-react';

interface Step2DeepDiveProps {
  questions: BottleneckQuestion[];
  answers: Record<string, string[]>; // Changed to explicit string array for consistency
  setAnswers: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  onNext: () => void;
  loading: boolean;
}

export const Step2DeepDive: React.FC<Step2DeepDiveProps> = ({ questions, answers, setAnswers, onNext, loading }) => {
  
  const handleSelect = (qId: string, option: string, type: 'single' | 'multi' | 'slider') => {
    const current = answers[qId] || [];
    let newAnswers: string[];

    // Even for single select, we use an array for consistent state structure
    if (type === 'single') {
        newAnswers = [option];
    } else {
        if (current.includes(option)) {
            newAnswers = current.filter((i: string) => i !== option);
        } else {
            newAnswers = [...current, option];
        }
    }
    setAnswers({ ...answers, [qId]: newAnswers });
  };

  return (
    <div className="space-y-10">
      {questions.map((q, idx) => (
        <div key={q.id} className="animate-slide-up" style={{ animationDelay: `${idx * 150}ms` }}>
          <div className="mb-4">
            <span className="text-xs font-bold text-brand-600 uppercase tracking-widest mb-2 block">{q.category}</span>
            <h3 className="text-xl font-medium text-slate-900">{q.text}</h3>
          </div>
          
          <div className="space-y-3">
            {q.options?.map(opt => {
              const isSelected = answers[q.id]?.includes(opt);
              return (
                <label 
                  key={opt} 
                  className={`flex items-center gap-4 p-5 rounded-xl border cursor-pointer transition-all shadow-sm hover:shadow-md ${isSelected ? 'bg-brand-50 border-brand-500 ring-1 ring-brand-500' : 'bg-white border-slate-200 hover:border-slate-300'} ${loading ? 'opacity-60 pointer-events-none' : ''}`}
                  onClick={() => handleSelect(q.id, opt, q.type)}
                >
                  <div className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${isSelected ? 'border-brand-500 bg-brand-500' : 'border-slate-300 bg-white'}`}>
                    {isSelected && <CheckCircle className="w-4 h-4 text-white" />}
                  </div>
                  <span className={`text-base ${isSelected ? 'text-brand-900 font-medium' : 'text-slate-600'}`}>{opt}</span>
                </label>
              );
            })}
          </div>
          
          {q.rationale && (
            <div className="mt-3 flex items-start gap-2 text-sm text-slate-500 px-2">
              <div className="w-1 h-1 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
              <span className="italic">{q.rationale}</span>
            </div>
          )}
        </div>
      ))}
      
      <div className="pt-6">
        <Button loading={loading} onClick={onNext} className="w-full text-lg">
          Continue to System Selection <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
};
