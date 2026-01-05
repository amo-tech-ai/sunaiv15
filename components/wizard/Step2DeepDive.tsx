
import React from 'react';
import { Button } from '../ui';
import { BottleneckQuestion } from '../../types';
import { ArrowRight, CheckCircle } from 'lucide-react';

interface Step2DeepDiveProps {
  questions: BottleneckQuestion[];
  answers: Record<string, string[]>;
  setAnswers: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  onNext: () => void;
  onBack: () => void;
  loading: boolean;
}

export const Step2DeepDive: React.FC<Step2DeepDiveProps> = ({ questions, answers, setAnswers, onNext, onBack, loading }) => {
  
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
    <div className="space-y-12">
      {questions.map((q, idx) => (
        <div key={q.id} className="animate-slide-up" style={{ animationDelay: `${idx * 150}ms` }}>
          <div className="mb-6 border-l-4 border-brand-500 pl-4">
            <span className="text-xs font-bold text-brand-600 uppercase tracking-widest mb-1 block">
               Section 0{idx + 1}
            </span>
            <h3 className="text-xl font-medium text-slate-900">{q.category}</h3>
          </div>
          
          <div className="mb-4">
            <p className="text-lg font-medium text-slate-800">{q.text}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {q.options?.map(opt => {
              const isSelected = answers[q.id]?.includes(opt);
              return (
                <label 
                  key={opt} 
                  className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all shadow-sm hover:shadow-md ${isSelected ? 'bg-brand-50 border-brand-500 ring-1 ring-brand-500' : 'bg-white border-slate-200 hover:border-slate-300'} ${loading ? 'opacity-60 pointer-events-none' : ''}`}
                  onClick={() => handleSelect(q.id, opt, q.type)}
                >
                  <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${isSelected ? 'border-brand-500 bg-brand-500' : 'border-slate-300 bg-white'}`}>
                    {isSelected && <CheckCircle className="w-3 h-3 text-white" />}
                  </div>
                  <span className={`text-sm leading-relaxed ${isSelected ? 'text-brand-900 font-medium' : 'text-slate-600'}`}>{opt}</span>
                </label>
              );
            })}
          </div>
          
          {q.rationale && (
            <div className="mt-3 flex items-center gap-2 text-xs text-slate-400 bg-slate-50 py-2 px-3 rounded-md w-fit">
              <span className="font-semibold uppercase tracking-wider text-[10px] text-slate-500">Why we ask</span>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <span>{q.rationale}</span>
            </div>
          )}
        </div>
      ))}
      
      <div className="pt-8 border-t border-slate-200 flex gap-4">
        <Button variant="outline" onClick={onBack} disabled={loading} className="w-1/3 text-lg py-4">
          Back
        </Button>
        <Button loading={loading} onClick={onNext} className="flex-1 text-lg py-4">
          Continue to System Selection <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
};
