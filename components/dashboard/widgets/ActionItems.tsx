
import React from 'react';
import { Card, Button } from '../../ui';
import { AlertCircle } from 'lucide-react';

export const ActionItems: React.FC = () => {
  return (
    <section>
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Needs Attention</h3>
        <Card className="bg-amber-50 border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 gap-4">
            <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 flex-shrink-0">
                <AlertCircle className="w-5 h-5" />
            </div>
            <div>
                <h4 className="text-slate-900 font-medium">Connect Google Analytics</h4>
                <p className="text-sm text-slate-500">Required for traffic analysis in Phase 2.</p>
            </div>
            </div>
            <Button variant="secondary" className="text-xs border-amber-200 text-amber-700 hover:bg-amber-100 w-full sm:w-auto">Authorize</Button>
        </Card>
    </section>
  );
};
