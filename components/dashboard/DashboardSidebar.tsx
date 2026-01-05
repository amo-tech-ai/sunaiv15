
import React from 'react';
import { Card } from '../ui';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Calendar, 
  FileText, 
  Settings, 
  Clock,
  X
} from 'lucide-react';

interface DashboardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  businessName: string;
  phase: { name: string; timelineWeeks: string };
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ isOpen, onClose, businessName, phase }) => {
  return (
    <aside className={`
      fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:flex-shrink-0
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    `}>
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <h1 className="text-xl font-bold text-brand-600 tracking-wider">SUN AI</h1>
        <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-slate-600">
          <X className="w-6 h-6" />
        </button>
      </div>
      
      <div className="p-6 flex-1 overflow-y-auto">
        <div className="mb-8">
           <h2 className="text-slate-900 font-semibold text-lg truncate">{businessName}</h2>
           <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">Project Active</p>
        </div>

        <div className="space-y-6">
           <div>
             <p className="text-xs text-slate-400 uppercase font-semibold mb-3">Current Phase</p>
             <Card className="bg-slate-50 p-4 border-l-4 border-l-brand-500 rounded-r-lg border-y-0 border-r-0 rounded-l-none border-transparent">
               <div className="font-medium text-slate-900">{phase.name}</div>
               <div className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                 <Clock className="w-3 h-3" /> {phase.timelineWeeks} Weeks
               </div>
               <div className="mt-3 w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                 <div className="bg-brand-500 h-full w-[35%]" />
               </div>
               <div className="text-[10px] text-right text-slate-400 mt-1">35%</div>
             </Card>
           </div>

           <nav className="space-y-1">
             {[
               { icon: LayoutDashboard, label: 'Overview', active: true },
               { icon: CheckSquare, label: 'Deliverables' },
               { icon: Calendar, label: 'Timeline' },
               { icon: FileText, label: 'Reports' },
               { icon: Settings, label: 'Settings' }
             ].map((item) => (
               <button 
                key={item.label}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${item.active ? 'bg-slate-100 text-brand-600 font-semibold' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
               >
                 <item.icon className={`w-4 h-4 ${item.active ? 'text-brand-600' : 'text-slate-400'}`} />
                 <span className="text-sm">{item.label}</span>
               </button>
             ))}
           </nav>
        </div>
      </div>

      <div className="p-6 border-t border-slate-100 mt-auto">
        <div className="flex items-center gap-3">
           <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-500 to-orange-400" />
           <div className="text-sm">
              <div className="text-slate-900 font-medium">Jane Doe</div>
              <div className="text-slate-400 text-xs">Admin</div>
           </div>
        </div>
      </div>
    </aside>
  );
};
