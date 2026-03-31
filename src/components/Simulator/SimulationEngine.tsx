import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, RotateCcw, Settings } from 'lucide-react';
import { runSchedulingAlgorithm, type Process, type AlgorithmType, type StepState, type GanttBlock, type SchedulingResult } from '../../utils/schedulingAlgorithms';
import { GanttChart } from './GanttChart';
import { ProcessTable } from './ProcessTable';
import { StepExplanation } from './StepExplanation';
import { MetricsPanel } from './MetricsPanel';

const INITIAL_PROCESSES: Process[] = [
  { id: 'p1', name: 'P1', arrivalTime: 0, burstTime: 5, priority: 2, color: '#3b82f6' },
  { id: 'p2', name: 'P2', arrivalTime: 1, burstTime: 3, priority: 1, color: '#10b981' },
  { id: 'p3', name: 'P3', arrivalTime: 2, burstTime: 8, priority: 3, color: '#f59e0b' },
  { id: 'p4', name: 'P4', arrivalTime: 3, burstTime: 6, priority: 4, color: '#ec4899' },
];

export function SimulationEngine() {
  const [processes, setProcesses] = useState<Process[]>(INITIAL_PROCESSES);
  const [algorithm, setAlgorithm] = useState<AlgorithmType>('FCFS');
  const [quantum, setQuantum] = useState(2);
  
  const [result, setResult] = useState<SchedulingResult | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Generate simulation result when processes or algorithm changes
    const newResult = runSchedulingAlgorithm(algorithm, processes, quantum);
    setResult(newResult);
    setCurrentStepIndex(-1);
    setIsPlaying(false);
  }, [processes, algorithm, quantum]);

  useEffect(() => {
    let timer: number;
    if (isPlaying && result && currentStepIndex < result.steps.length - 1) {
      timer = window.setInterval(() => {
        setCurrentStepIndex(prev => prev + 1);
      }, 1500); // 1.5s per step
    } else if (result && currentStepIndex >= result.steps.length - 1) {
      setIsPlaying(false);
    }
    return () => clearInterval(timer);
  }, [isPlaying, currentStepIndex, result]);

  const currentStep: StepState | null = currentStepIndex >= 0 && result ? result.steps[currentStepIndex] : null;

  const handleNext = () => {
    if (result && currentStepIndex < result.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > -1) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleReset = () => {
    setCurrentStepIndex(-1);
    setIsPlaying(false);
  };

  const addProcess = () => {
    if (processes.length >= 8) return;
    const colors = ['#8b5cf6', '#ef4444', '#14b8a6', '#f97316'];
    const newId = `p${processes.length + 1}`;
    setProcesses([...processes, {
      id: newId,
      name: `P${processes.length + 1}`,
      arrivalTime: 0,
      burstTime: 1,
      priority: 1,
      color: colors[processes.length % colors.length]
    }]);
  };

  const removeProcess = (id: string) => {
    setProcesses(processes.filter(p => p.id !== id));
  };

  const updateProcess = (id: string, field: keyof Process, value: number) => {
    setProcesses(processes.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
      
      {/* LEFT COLUMN: Controls & Processes */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-surface-100 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Settings className="w-5 h-5 text-primary-600" />
            <h3 className="text-lg font-bold">Simulator Settings</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Algorithm</label>
              <select 
                value={algorithm}
                onChange={(e) => setAlgorithm(e.target.value as AlgorithmType)}
                className="w-full bg-surface-50 border border-surface-200 rounded-md p-2 focus:ring-2 focus:ring-primary-500 outline-none"
              >
                <option value="FCFS">First Come First Serve (FCFS)</option>
                <option value="SJF">Shortest Job First (SJF) - NP</option>
                <option value="SRTF">Shortest Remaining Time First (SRTF) - P</option>
                <option value="RR">Round Robin (RR)</option>
                <option value="PRIORITY_NP">Priority (Non-Preemptive)</option>
                <option value="PRIORITY_P">Priority (Preemptive)</option>
              </select>
            </div>

            {algorithm === 'RR' && (
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">Time Quantum: {quantum}</label>
                <input 
                  type="range" min="1" max="10" value={quantum} 
                  onChange={(e) => setQuantum(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            )}
          </div>
        </div>

        <ProcessTable 
          processes={processes} 
          currentStep={currentStep}
          onAdd={addProcess}
          onRemove={removeProcess}
          onUpdate={updateProcess}
          showPriority={algorithm.includes('PRIORITY')}
        />
      </div>

      {/* RIGHT COLUMN: Simulator Display */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Playback Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-surface-100 p-4 flex items-center justify-between">
          <div className="font-mono bg-surface-100 px-4 py-2 rounded text-surface-800 font-semibold">
            TIME: {currentStep ? currentStep.time : 0}
          </div>
          <div className="flex space-x-2">
            <button onClick={handleReset} className="p-2 text-surface-600 hover:bg-surface-100 rounded-md transition" title="Reset">
              <RotateCcw className="w-5 h-5" />
            </button>
            <button onClick={handlePrev} disabled={currentStepIndex === -1} className="p-2 text-surface-600 hover:bg-surface-100 rounded-md disabled:opacity-50 transition" title="Previous Step">
              <SkipBack className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setIsPlaying(!isPlaying)} 
              className="p-2 bg-primary-600 text-white hover:bg-primary-700 rounded-md transition shadow-sm w-12 flex justify-center"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>
            <button onClick={handleNext} disabled={!result || currentStepIndex >= result.steps.length - 1} className="p-2 text-surface-600 hover:bg-surface-100 rounded-md disabled:opacity-50 transition" title="Next Step">
              <SkipForward className="w-5 h-5" />
            </button>
          </div>
        </div>

        <GanttChart ganttBlocks={result?.ganttChart || []} currentStepIndex={currentStepIndex} />
        
        <StepExplanation step={currentStep} />

        {currentStep && currentStep.isCompleted && result && (
          <MetricsPanel metrics={result.metrics} averages={result.averages} />
        )}

      </div>
    </div>
  );
}
