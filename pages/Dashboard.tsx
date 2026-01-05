import React, { useContext } from 'react';
import { AppContext } from '../App';
import { Badge, Card, Button } from '../components/ui';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Calendar, 
  FileText, 
  Settings, 
  Bell, 
  ChevronRight, 
  MoreHorizontal,
  Zap,
  Clock,
  User,
  AlertCircle,
  BrainCircuit
} from 'lucide-react';

export default function Dashboard() {
  const { appState } = useContext(AppContext);
  const businessName = appState.businessName || "Acme Inc.";
  const phase = appState.phases[0] || { name: 'Foundation', timelineWeeks: '2-4' };

  // Mock Deliverables
  const deliverables = [
    { name: "CRM Data Migration", status: "In Progress", eta: "2 Days", owner: "AI Agent" },
    { name: "Email Automation Setup", status: "Pending", eta: "5 Days", owner: "Team" },
    { name: "Executive Report Template", status: "Done", eta: "-", owner: "System" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row font-sans text-slate-900 overflow-hidden">
      
      {/* 1. LEFT PANEL: CONTEXT SIDEBAR */}
      <aside className="w-full lg:w-72 border-r border-slate-200 bg-white flex-shrink-0 flex flex-col h-screen">
        <div className="p-6 border-b border-slate-100">
          <h1 className="text-xl font-bold text-brand-600 tracking-wider">SUN AI</h1>
        </div>
        
        <div className="p-6">
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

        <div className="mt-auto p-6 border-t border-slate-100">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-500 to-orange-400" />
             <div className="text-sm">
                <div className="text-slate-900 font-medium">Jane Doe</div>
                <div className="text-slate-400 text-xs">Admin</div>
             </div>
          </div>
        </div>
      </aside>

      {/* 2. CENTER PANEL: WORK SURFACE */}
      <main className="flex-1 overflow-y-auto h-screen p-6 lg:p-10 scrollbar-hide">
        <header className="flex justify-between items-center mb-10">
           <div>
             <h1 className="text-2xl font-display text-slate-900">Project Overview</h1>
             <p className="text-slate-500 text-sm mt-1">Last updated: Just now</p>
           </div>
           <div className="flex gap-3">
             <Button variant="outline" className="text-xs px-4 py-2 bg-white">Share Report</Button>
             <Button variant="primary" className="text-xs px-4 py-2 shadow-none">
                <Zap className="w-3 h-3 mr-2 text-white" /> Quick Action
             </Button>
           </div>
        </header>

        <div className="space-y-10">
          {/* Phase Summary */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Current Phase Goals</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="flex flex-col justify-between">
                <span className="text-slate-500 text-sm">Target Outcome</span>
                <span className="text-xl text-slate-900 font-medium mt-2">Data Integrity</span>
              </Card>
              <Card className="flex flex-col justify-between">
                <span className="text-slate-500 text-sm">Systems Online</span>
                <span className="text-xl text-slate-900 font-medium mt-2">1/3</span>
              </Card>
               <Card className="flex flex-col justify-between">
                <span className="text-slate-500 text-sm">Next Milestone</span>
                <span className="text-xl text-slate-900 font-medium mt-2">CRM Import</span>
              </Card>
            </div>
          </section>

          {/* Action Items */}
          <section>
             <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Needs Attention</h3>
             <Card className="bg-amber-50 border-amber-200 flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-slate-900 font-medium">Connect Google Analytics</h4>
                    <p className="text-sm text-slate-500">Required for traffic analysis in Phase 2.</p>
                  </div>
                </div>
                <Button variant="secondary" className="text-xs border-amber-200 text-amber-700 hover:bg-amber-100">Authorize</Button>
             </Card>
          </section>

          {/* Deliverables */}
          <section>
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Deliverables Tracker</h3>
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
               <table className="w-full text-left text-sm">
                 <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                   <tr>
                     <th className="p-4 font-medium">Deliverable</th>
                     <th className="p-4 font-medium">Status</th>
                     <th className="p-4 font-medium">ETA</th>
                     <th className="p-4 font-medium">Owner</th>
                     <th className="p-4"></th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                   {deliverables.map((d, i) => (
                     <tr key={i} className="hover:bg-slate-50 transition-colors">
                       <td className="p-4 font-medium text-slate-900">{d.name}</td>
                       <td className="p-4">
                         <Badge variant={d.status === 'Done' ? 'success' : d.status === 'In Progress' ? 'brand' : 'neutral'}>
                           {d.status}
                         </Badge>
                       </td>
                       <td className="p-4 text-slate-500">{d.eta}</td>
                       <td className="p-4 text-slate-500 flex items-center gap-2">
                         {d.owner === 'AI Agent' ? <Zap className="w-3 h-3 text-brand-500" /> : <User className="w-3 h-3" />}
                         {d.owner}
                       </td>
                       <td className="p-4 text-right">
                         <button className="text-slate-400 hover:text-slate-600"><MoreHorizontal className="w-4 h-4" /></button>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
            </div>
          </section>
        </div>
      </main>

      {/* 3. RIGHT PANEL: INTELLIGENCE */}
      <aside className="w-full lg:w-80 border-l border-slate-200 bg-white p-8 hidden xl:block h-screen overflow-y-auto">
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

    </div>
  );
}