
import React from 'react';
import { Card } from '../../ui';

export const PhaseSummary: React.FC = () => {
  return (
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
  );
};
