import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({ 
  children, 
  variant = 'primary', 
  onClick, 
  disabled, 
  className = '',
  loading = false
}: { 
  children?: React.ReactNode; 
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'; 
  onClick?: () => void; 
  disabled?: boolean;
  className?: string;
  loading?: boolean;
}) => {
  const baseStyle = "px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-500/30 disabled:bg-slate-200 disabled:text-slate-400",
    secondary: "bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-sm",
    outline: "border border-slate-300 hover:border-slate-400 text-slate-600 hover:text-slate-900 bg-transparent",
    ghost: "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
  };

  return (
    <button 
      onClick={onClick} 
      disabled={disabled || loading} 
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
};

export const Card = ({ children, className = '', active = false }: { children?: React.ReactNode; className?: string; active?: boolean }) => (
  <div className={`p-6 rounded-xl border transition-all duration-300 ${active ? 'bg-white ring-2 ring-brand-500/50 shadow-xl shadow-brand-500/10 border-transparent' : 'bg-white border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300'} ${className}`}>
    {children}
  </div>
);

export const Input = ({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) => (
  <div className="flex flex-col gap-2">
    <label className="text-xs uppercase tracking-wider text-slate-500 font-semibold">{label}</label>
    <input 
      className="bg-white border border-slate-300 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all placeholder:text-slate-400 shadow-sm"
      {...props}
    />
  </div>
);

export const Select = ({ label, options, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { label: string, options: string[] }) => (
  <div className="flex flex-col gap-2">
    <label className="text-xs uppercase tracking-wider text-slate-500 font-semibold">{label}</label>
    <div className="relative">
      <select 
        className="w-full appearance-none bg-white border border-slate-300 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all cursor-pointer shadow-sm"
        {...props}
      >
        <option value="" disabled>Select an option</option>
        {options.map(opt => <option key={opt} value={opt} className="bg-white text-slate-900">{opt}</option>)}
      </select>
      <div className="absolute right-4 top-3.5 pointer-events-none text-slate-500">
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  </div>
);

export const TextArea = ({ label, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) => (
  <div className="flex flex-col gap-2">
    <label className="text-xs uppercase tracking-wider text-slate-500 font-semibold">{label}</label>
    <textarea 
      className="bg-white border border-slate-300 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all placeholder:text-slate-400 resize-none min-h-[120px] shadow-sm"
      {...props}
    />
  </div>
);

export const Badge = ({ children, variant = 'neutral' }: { children?: React.ReactNode; variant?: 'success' | 'warning' | 'neutral' | 'brand' }) => {
  const styles = {
    neutral: 'bg-slate-100 text-slate-600 border-slate-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    brand: 'bg-brand-50 text-brand-700 border-brand-200',
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${styles[variant]}`}>
      {children}
    </span>
  );
};