
import React from 'react';

interface WizardLayoutProps {
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  children: React.ReactNode;
}

export const WizardLayout: React.FC<WizardLayoutProps> = ({ leftPanel, rightPanel, children }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex h-screen overflow-hidden">
      {leftPanel}
      
      {/* CENTER PANEL: WORK SURFACE */}
      <div className="flex-1 h-full overflow-y-auto p-4 md:p-8 lg:p-12 xl:p-16 scrollbar-hide">
        <div className="max-w-2xl mx-auto pb-20">
          {children}
        </div>
      </div>

      {rightPanel}
    </div>
  );
};
