
import React, { useContext, useState } from 'react';
import { AppContext } from '../App';
import { Button } from '../components/ui';
import { Zap } from 'lucide-react';
import { DashboardSidebar } from '../components/dashboard/DashboardSidebar';
import { DashboardRightPanel } from '../components/dashboard/DashboardRightPanel';
import { MobileHeader } from '../components/dashboard/MobileHeader';
import { PhaseSummary } from '../components/dashboard/widgets/PhaseSummary';
import { ActionItems } from '../components/dashboard/widgets/ActionItems';
import { DeliverablesTracker } from '../components/dashboard/widgets/DeliverablesTracker';
import { MobileIntelligence } from '../components/dashboard/widgets/MobileIntelligence';

export default function Dashboard() {
  const { appState } = useContext(AppContext);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const businessName = appState.businessName || "Acme Inc.";
  const phase = appState.phases[0] || { name: 'Foundation', timelineWeeks: '2-4' };

  // Mock Deliverables
  const deliverables = [
    { name: "CRM Data Migration", status: "In Progress", eta: "2 Days", owner: "AI Agent" },
    { name: "Email Automation Setup", status: "Pending", eta: "5 Days", owner: "Team" },
    { name: "Executive Report Template", status: "Done", eta: "-", owner: "System" },
  ];

  return (
    <div className="h-screen bg-slate-50 flex font-sans text-slate-900 overflow-hidden relative">
      
      {/* MOBILE OVERLAY */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <DashboardSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        businessName={businessName} 
        phase={phase} 
      />

      <main className="flex-1 flex flex-col h-full overflow-hidden w-full relative bg-slate-50">
        <MobileHeader 
          businessName={businessName} 
          onOpenSidebar={() => setSidebarOpen(true)} 
        />

        <div className="flex-1 overflow-y-auto p-4 lg:p-10 scrollbar-hide">
            {/* Desktop Page Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-display text-slate-900">Project Overview</h1>
                    <p className="text-slate-500 text-sm mt-1">Last updated: Just now</p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <Button variant="outline" className="text-xs px-4 py-2 bg-white flex-1 md:flex-none">Share Report</Button>
                    <Button variant="primary" className="text-xs px-4 py-2 shadow-none flex-1 md:flex-none">
                        <Zap className="w-3 h-3 mr-2 text-white" /> Quick Action
                    </Button>
                </div>
            </header>

            <div className="space-y-8">
                <PhaseSummary />
                <ActionItems />
                <DeliverablesTracker deliverables={deliverables} />
                <MobileIntelligence />
            </div>
        </div>
      </main>

      <DashboardRightPanel />

    </div>
  );
}
