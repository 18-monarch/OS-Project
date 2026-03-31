import React, { useMemo } from 'react';
import { runSchedulingAlgorithm, type AlgorithmType, type Process } from '../../utils/schedulingAlgorithms';
import { BarChart2 } from 'lucide-react';

const COMPARE_PROCESSES: Process[] = [
  { id: 'p1', name: 'P1', arrivalTime: 0, burstTime: 5, priority: 2, color: '#3b82f6' },
  { id: 'p2', name: 'P2', arrivalTime: 1, burstTime: 3, priority: 1, color: '#10b981' },
  { id: 'p3', name: 'P3', arrivalTime: 2, burstTime: 8, priority: 3, color: '#f59e0b' },
  { id: 'p4', name: 'P4', arrivalTime: 3, burstTime: 6, priority: 4, color: '#ec4899' },
];

const ALGORITHMS: { id: AlgorithmType, label: string }[] = [
  { id: 'FCFS', label: 'First Come First Serve' },
  { id: 'SJF', label: 'Shortest Job First (NP)' },
  { id: 'SRTF', label: 'Shortest Remaining Time First (P)' },
  { id: 'RR', label: 'Round Robin (Q=2)' },
  { id: 'PRIORITY_NP', label: 'Priority (NP)' },
  { id: 'PRIORITY_P', label: 'Priority (P)' },
];

export function ComparisonMode() {
  
  const results = useMemo(() => {
    return ALGORITHMS.map(algo => {
      const result = runSchedulingAlgorithm(algo.id, COMPARE_PROCESSES, 2);
      return {
        ...algo,
        avgWaitingTime: result.averages.avgWaitingTime,
        avgTurnaroundTime: result.averages.avgTurnaroundTime,
      };
    });
  }, []);

  // Find mins to highlight best
  const minWT = Math.min(...results.map(r => r.avgWaitingTime));
  const minTAT = Math.min(...results.map(r => r.avgTurnaroundTime));

  const maxVal = Math.max(...results.map(r => Math.max(r.avgWaitingTime, r.avgTurnaroundTime)));

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white rounded-xl shadow-sm border border-surface-100 p-8">
        <div className="flex items-center space-x-3 mb-6">
          <BarChart2 className="w-6 h-6 text-primary-600" />
          <h2 className="text-2xl font-bold text-surface-900">Algorithm Performance Comparison</h2>
        </div>
        
        <p className="text-surface-600 mb-8 max-w-2xl">
          This chart compares how each algorithm performs on a standard set of 4 processes.
          Different workloads will yield different results, but typically SJF and SRTF provide the best waiting times.
        </p>

        <div className="overflow-hidden border border-surface-200 rounded-lg">
          <table className="w-full text-left">
            <thead className="bg-surface-50 text-surface-700">
              <tr>
                <th className="p-4 border-b border-surface-200">Algorithm</th>
                <th className="p-4 border-b border-surface-200">Average Waiting Time</th>
                <th className="p-4 border-b border-surface-200">Average Turnaround Time</th>
              </tr>
            </thead>
            <tbody>
              {results.map((res, i) => (
                <tr key={res.id} className={i % 2 === 0 ? 'bg-white' : 'bg-surface-50'}>
                  <td className="p-4 font-medium text-surface-800 border-b border-surface-100">{res.label}</td>
                  <td className="p-4 border-b border-surface-100">
                    <span className={`font-mono text-lg ${res.avgWaitingTime === minWT ? 'font-bold text-green-600' : 'text-surface-700'}`}>
                      {res.avgWaitingTime.toFixed(2)}
                    </span>
                    {res.avgWaitingTime === minWT && <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Best</span>}
                    
                    {/* Tiny bar */}
                    <div className="w-full h-1.5 bg-surface-200 rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-secondary-500" style={{ width: `${(res.avgWaitingTime / maxVal) * 100}%` }} />
                    </div>
                  </td>
                  <td className="p-4 border-b border-surface-100">
                    <span className={`font-mono text-lg ${res.avgTurnaroundTime === minTAT ? 'font-bold text-green-600' : 'text-surface-700'}`}>
                      {res.avgTurnaroundTime.toFixed(2)}
                    </span>
                    {res.avgTurnaroundTime === minTAT && <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Best</span>}

                    <div className="w-full h-1.5 bg-surface-200 rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-primary-500" style={{ width: `${(res.avgTurnaroundTime / maxVal) * 100}%` }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
