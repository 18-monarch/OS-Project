import React from 'react';
import type { Process, StepState } from '../../utils/schedulingAlgorithms';
import { Plus, Trash2 } from 'lucide-react';

interface ProcessTableProps {
  processes: Process[];
  currentStep: StepState | null;
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: keyof Process, value: number) => void;
  showPriority: boolean;
}

export function ProcessTable({ processes, currentStep, onAdd, onRemove, onUpdate, showPriority }: ProcessTableProps) {
  
  const isSimulating = currentStep !== null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-surface-100 overflow-hidden">
      <div className="p-4 border-b border-surface-100 flex justify-between items-center bg-surface-50">
        <h3 className="font-bold text-surface-800">Process Table</h3>
        {!isSimulating && (
          <button 
            onClick={onAdd}
            disabled={processes.length >= 8}
            className="text-xs bg-surface-200 hover:bg-surface-300 px-2 py-1 rounded flex items-center space-x-1 font-medium transition disabled:opacity-50"
          >
            <Plus className="w-3 h-3" /> <span>Add</span>
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-surface-100 text-surface-600 uppercase text-xs">
            <tr>
              <th className="px-3 py-3">Process</th>
              <th className="px-3 py-3">AT</th>
              <th className="px-3 py-3">BT</th>
              {showPriority && <th className="px-3 py-3">Pri</th>}
              <th className="px-3 py-3 bg-primary-50 text-primary-700">RT</th>
              <th className="px-3 py-3 bg-secondary-50 text-secondary-700">WT</th>
              {!isSimulating && <th className="px-2 py-3"></th>}
            </tr>
          </thead>
          <tbody>
            {processes.map(p => {
              const remainingTime = currentStep ? currentStep.remainingTimes[p.id] : p.burstTime;
              const waitingTime = currentStep ? currentStep.waitingTimes[p.id] : 0;
              const isActive = currentStep?.activeProcessId === p.id;
              const isWaiting = currentStep?.readyQueue.includes(p.id);
              const isDone = currentStep && remainingTime === 0 && currentStep.time >= p.arrivalTime;

              let rowClass = "border-b border-surface-50 last:border-none transition-colors ";
              if (isActive) rowClass += "bg-primary-50 ";
              else if (isWaiting) rowClass += "bg-yellow-50 ";
              else if (isDone) rowClass += "bg-green-50 opacity-50 ";

              return (
                <tr key={p.id} className={rowClass}>
                  <td className="px-3 py-2 font-bold flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }} />
                    {p.name}
                  </td>
                  <td className="px-3 py-2">
                    {isSimulating ? p.arrivalTime : (
                      <input type="number" min="0" value={p.arrivalTime} onChange={(e) => onUpdate(p.id, 'arrivalTime', parseInt(e.target.value) || 0)} className="w-12 bg-surface-50 border border-surface-200 rounded p-1 text-center outline-none" />
                    )}
                  </td>
                  <td className="px-3 py-2">
                    {isSimulating ? p.burstTime : (
                      <input type="number" min="1" value={p.burstTime} onChange={(e) => onUpdate(p.id, 'burstTime', parseInt(e.target.value) || 1)} className="w-12 bg-surface-50 border border-surface-200 rounded p-1 text-center outline-none" />
                    )}
                  </td>
                  {showPriority && (
                    <td className="px-3 py-2">
                      {isSimulating ? p.priority : (
                        <input type="number" min="1" value={p.priority} onChange={(e) => onUpdate(p.id, 'priority', parseInt(e.target.value) || 1)} className="w-12 bg-surface-50 border border-surface-200 rounded p-1 text-center outline-none" />
                      )}
                    </td>
                  )}
                  <td className="px-3 py-2 font-mono font-semibold text-primary-700">{remainingTime}</td>
                  <td className="px-3 py-2 font-mono font-semibold text-secondary-700">{waitingTime}</td>
                  {!isSimulating && (
                    <td className="px-2 py-2">
                      <button onClick={() => onRemove(p.id)} className="text-red-400 hover:text-red-600 transition">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="bg-surface-50 p-2 text-[10px] text-surface-500 uppercase flex justify-around border-t border-surface-100">
        <span>AT: Arrival Time</span>
        <span>BT: Burst Time</span>
        <span>RT: Remaining Time</span>
        <span>WT: Waiting Time</span>
      </div>
    </div>
  );
}
