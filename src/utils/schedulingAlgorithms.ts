export interface Process {
  id: string;
  name: string;
  arrivalTime: number;
  burstTime: number;
  priority?: number; 
  color: string;
}

export interface StepState {
  time: number;
  activeProcessId: string | null;
  readyQueue: string[];
  remainingTimes: Record<string, number>;
  waitingTimes: Record<string, number>;
  explanation: string;
  insights: string[];
  isCompleted: boolean;
}

export interface GanttBlock {
  processId: string | null;
  startTime: number;
  endTime: number;
  color?: string;
}

export interface Metric {
  processId: string;
  turnaroundTime: number;
  waitingTime: number;
  completionTime: number;
  responseTime: number;
}

export interface SchedulingResult {
  steps: StepState[];
  ganttChart: GanttBlock[];
  metrics: Metric[];
  averages: {
    avgTurnaroundTime: number;
    avgWaitingTime: number;
    avgResponseTime: number;
    cpuUtilization: number;
    throughput: number;
  };
}

export type AlgorithmType = 'FCFS' | 'SJF' | 'SRTF' | 'RR' | 'PRIORITY_NP' | 'PRIORITY_P';

function initializeState(processes: Process[]) {
  const remainingTimes: Record<string, number> = {};
  const waitingTimes: Record<string, number> = {};
  const responseTimes: Record<string, number> = {};
  processes.forEach(p => {
    remainingTimes[p.id] = p.burstTime;
    waitingTimes[p.id] = 0;
    responseTimes[p.id] = -1;
  });
  return { remainingTimes, waitingTimes, responseTimes };
}

function processMetrics(processes: Process[], completionTimes: Record<string, number>, responseTimes: Record<string, number>, totalTime: number): SchedulingResult['metrics'] | any {
  let totalTAT = 0;
  let totalWT = 0;
  let totalRT = 0;

  const metrics = processes.map(p => {
    const ct = completionTimes[p.id];
    const tat = ct - p.arrivalTime;
    const wt = tat - p.burstTime;
    const rt = responseTimes[p.id] !== -1 ? responseTimes[p.id] - p.arrivalTime : 0;
    
    totalTAT += tat;
    totalWT += Math.max(0, wt);
    totalRT += Math.max(0, rt);
    return { processId: p.id, turnaroundTime: tat, waitingTime: Math.max(0, wt), completionTime: ct, responseTime: Math.max(0, rt) };
  });

  const n = processes.length;
  const idleTime = totalTime - processes.reduce((acc, p) => acc + p.burstTime, 0);
  
  return {
    metrics,
    averages: {
      avgTurnaroundTime: totalTAT / n,
      avgWaitingTime: totalWT / n,
      avgResponseTime: totalRT / n,
      cpuUtilization: ((totalTime - idleTime) / totalTime) * 100,
      throughput: (n / totalTime)
    }
  };
}

export function runSchedulingAlgorithm(algo: AlgorithmType, processes: Process[], quantum: number = 2): SchedulingResult {
  const n = processes.length;
  if (n === 0) return { steps: [], ganttChart: [], metrics: [], averages: { avgTurnaroundTime: 0, avgWaitingTime: 0, avgResponseTime: 0, cpuUtilization: 0, throughput: 0 } };

  const procs = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
  const { remainingTimes, waitingTimes, responseTimes } = initializeState(procs);
  const completionTimes: Record<string, number> = {};
  
  const steps: StepState[] = [];
  const ganttChart: GanttBlock[] = [];
  
  let currentTime = 0;
  let completed = 0;

  let activeProcess: Process | null = null;
  let currentQuantum = 0;

  const readyQueue: Process[] = [];

  while (completed < n) {
    const freshlyArrived = procs.filter(p => p.arrivalTime === currentTime && remainingTimes[p.id] > 0);
    // Add to ready queue according to algorithm specifics
    if (freshlyArrived.length > 0) {
      if (algo === 'RR') {
        readyQueue.push(...freshlyArrived);
      } else {
        readyQueue.push(...freshlyArrived);
      }
    }

    let explanation = '';
    const insights: string[] = [];

    // Preemption checks
    if (activeProcess) {
      if (algo === 'RR') {
        if (remainingTimes[activeProcess.id] === 0) {
          activeProcess = null;
          currentQuantum = 0;
        } else if (currentQuantum === quantum) {
          explanation = `Time quantum expired. Preempting ${activeProcess.name}.`;
          insights.push('Context Switch');
          readyQueue.push(activeProcess);
          activeProcess = null;
          currentQuantum = 0;
        }
      } else if (algo === 'SRTF') {
        if (remainingTimes[activeProcess.id] === 0) {
          activeProcess = null;
        } else {
          // Check if newly arrived has shorter time
          const shortestReady = [...readyQueue].sort((a, b) => remainingTimes[a.id] - remainingTimes[b.id])[0];
          if (shortestReady && remainingTimes[shortestReady.id] < remainingTimes[activeProcess.id]) {
            explanation = `Preempting ${activeProcess.name} for ${shortestReady.name} (shorter remaining time).`;
            insights.push('Context Switch');
            readyQueue.push(activeProcess);
            activeProcess = null;
          }
        }
      } else if (algo === 'PRIORITY_P') {
        if (remainingTimes[activeProcess.id] === 0) {
          activeProcess = null;
        } else {
          const highestPriorityReady = [...readyQueue].sort((a, b) => (a.priority || 0) - (b.priority || 0))[0];
          if (highestPriorityReady && (highestPriorityReady.priority || 0) < (activeProcess.priority || 0)) {
            explanation = `Preempting ${activeProcess.name} for ${highestPriorityReady.name} (higher priority).`;
            insights.push('Context Switch');
            readyQueue.push(activeProcess);
            activeProcess = null;
          }
        }
      } else {
        // Non-preemptive finishes naturally
        if (remainingTimes[activeProcess.id] === 0) {
          activeProcess = null;
        }
      }
    }

    // Sort ready queue if non-RR and NO active process
    if (!activeProcess && readyQueue.length > 0) {
      if (algo === 'SJF' || algo === 'SRTF') {
        readyQueue.sort((a, b) => {
          if (remainingTimes[a.id] === remainingTimes[b.id]) return a.arrivalTime - b.arrivalTime;
          return remainingTimes[a.id] - remainingTimes[b.id];
        });
      } else if (algo === 'PRIORITY_NP' || algo === 'PRIORITY_P') {
        readyQueue.sort((a, b) => {
          if (a.priority === b.priority) return a.arrivalTime - b.arrivalTime;
          return (a.priority || 0) - (b.priority || 0);
        });
      }
      activeProcess = readyQueue.shift()!;
      if (!explanation) explanation = `Selected ${activeProcess.name}.`;
      
      if (responseTimes[activeProcess.id] === -1) {
        responseTimes[activeProcess.id] = currentTime;
      }
    }

    if (activeProcess) {
      if (!explanation) explanation = `Executing ${activeProcess.name} (${algo}). Remaining: ${remainingTimes[activeProcess.id]}`;
      
      // Execute 1 unit
      remainingTimes[activeProcess.id]--;
      currentQuantum++;

      readyQueue.forEach(p => {
        waitingTimes[p.id]++;
        
        // Starvation logic
        if (algo === 'SJF' || algo.includes('PRIORITY')) {
          if (waitingTimes[p.id] > 20) {
            if (!insights.includes(`Starvation risk for ${p.name}`)) {
              insights.push(`Starvation risk for ${p.name}`);
            }
          }
        }
      });
      
      // Convoy check for FCFS
      if (algo === 'FCFS' && activeProcess.burstTime > 15 && readyQueue.length >= 2) {
        if (currentTime === activeProcess.arrivalTime + 1) { // early execution
          insights.push(`Convoy Effect detected: Long process ${activeProcess.name} blocks others.`);
        }
      }

      if (remainingTimes[activeProcess.id] === 0) {
        completed++;
        completionTimes[activeProcess.id] = currentTime + 1;
        explanation += ` → Process completed.`;
      }

      // Update Gantt
      if (ganttChart.length > 0 && ganttChart[ganttChart.length - 1].processId === activeProcess.id) {
        ganttChart[ganttChart.length - 1].endTime = currentTime + 1;
      } else {
        ganttChart.push({ processId: activeProcess.id, startTime: currentTime, endTime: currentTime + 1, color: activeProcess.color });
      }

    } else {
      explanation = 'CPU Idle.';
      if (ganttChart.length > 0 && ganttChart[ganttChart.length - 1].processId === null) {
        ganttChart[ganttChart.length - 1].endTime = currentTime + 1;
      } else {
        ganttChart.push({ processId: null, startTime: currentTime, endTime: currentTime + 1 });
      }
    }

    steps.push({
      time: currentTime,
      activeProcessId: activeProcess ? activeProcess.id : null,
      readyQueue: readyQueue.map(p => p.id),
      remainingTimes: { ...remainingTimes },
      waitingTimes: { ...waitingTimes },
      explanation,
      insights,
      isCompleted: completed === n
    });

    currentTime++;
  }

  const { metrics, averages } = processMetrics(procs, completionTimes, responseTimes, currentTime);

  return { steps, ganttChart, metrics, averages };
}
