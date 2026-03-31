import type { Metric } from '../../utils/schedulingAlgorithms';
import { CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface MetricsPanelProps {
  metrics: Metric[];
  averages: {
    avgTurnaroundTime: number;
    avgWaitingTime: number;
    avgResponseTime: number;
    cpuUtilization: number;
    throughput: number;
  };
}

export function MetricsPanel({ metrics, averages }: MetricsPanelProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-xl shadow-sm border border-green-200 overflow-hidden"
    >
      <div className="p-4 border-b border-green-100 flex items-center space-x-2 bg-green-50">
        <CheckCircle2 className="w-5 h-5 text-green-600" />
        <h3 className="font-bold text-green-900">Simulation Complete - Final Metrics</h3>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-surface-50 p-4 rounded-lg border border-surface-200 text-center">
            <div className="text-xs text-surface-500 uppercase tracking-wide font-semibold mb-1">Avg Waiting Time</div>
            <div className="text-2xl font-bold text-surface-900">{averages.avgWaitingTime.toFixed(2)}</div>
          </div>
          <div className="bg-surface-50 p-4 rounded-lg border border-surface-200 text-center">
            <div className="text-xs text-surface-500 uppercase tracking-wide font-semibold mb-1">Avg Turnaround</div>
            <div className="text-2xl font-bold text-surface-900">{averages.avgTurnaroundTime.toFixed(2)}</div>
          </div>
          <div className="bg-surface-50 p-4 rounded-lg border border-surface-200 text-center">
            <div className="text-xs text-surface-500 uppercase tracking-wide font-semibold mb-1">CPU Utilization</div>
            <div className="text-2xl font-bold text-surface-900">{averages.cpuUtilization.toFixed(1)}%</div>
          </div>
          <div className="bg-surface-50 p-4 rounded-lg border border-surface-200 text-center">
            <div className="text-xs text-surface-500 uppercase tracking-wide font-semibold mb-1">Throughput</div>
            <div className="text-xl font-bold text-surface-900">{averages.throughput.toFixed(2)} / unit</div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-surface-100 text-surface-600">
              <tr>
                <th className="px-3 py-2">Process</th>
                <th className="px-3 py-2">Completion Time</th>
                <th className="px-3 py-2 text-primary-700">Turnaround Time</th>
                <th className="px-3 py-2 text-secondary-700">Waiting Time</th>
                <th className="px-3 py-2">Response Time</th>
              </tr>
            </thead>
            <tbody>
              {metrics.map(m => (
                <tr key={m.processId} className="border-b border-surface-50">
                  <td className="px-3 py-2 font-bold uppercase">{m.processId}</td>
                  <td className="px-3 py-2 font-mono">{m.completionTime}</td>
                  <td className="px-3 py-2 font-mono font-semibold text-primary-600">{m.turnaroundTime}</td>
                  <td className="px-3 py-2 font-mono font-semibold text-secondary-600">{m.waitingTime}</td>
                  <td className="px-3 py-2 font-mono">{m.responseTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
