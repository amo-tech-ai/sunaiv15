
import React from 'react';
import { Menu } from 'lucide-react';

interface MobileHeaderProps {
  businessName: string;
  onOpenSidebar: () => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({ businessName, onOpenSidebar }) => {
  return (
    <header className="lg:hidden h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 flex-shrink-0 z-30">
       <div className="flex items-center gap-3">
         <button onClick={onOpenSidebar} className="text-slate-500 p-1 hover:bg-slate-100 rounded-md">
           <Menu className="w-6 h-6" />
         </button>
         <span className="font-bold text-slate-900 truncate max-w-[200px]">{businessName}</span>
       </div>
       <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-500 to-orange-400" />
    </header>
  );
};
