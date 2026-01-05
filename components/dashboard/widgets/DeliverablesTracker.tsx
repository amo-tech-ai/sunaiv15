
import React from 'react';
import { Badge } from '../../ui';
import { Zap, User, MoreHorizontal } from 'lucide-react';

export interface Deliverable {
  name: string;
  status: string;
  eta: string;
  owner: string;
}

interface DeliverablesTrackerProps {
  deliverables: Deliverable[];
}

export const DeliverablesTracker: React.FC<DeliverablesTrackerProps> = ({ deliverables }) => {
  return (
    <section>
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Deliverables Tracker</h3>
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm overflow-x-auto">
        <table className="w-full text-left text-sm min-w-[600px]">
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
  );
};
