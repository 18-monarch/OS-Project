import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { GanttBlock } from '../../utils/schedulingAlgorithms';

interface GanttChartProps {
  ganttBlocks: GanttBlock[];
  currentStepIndex: number;
}

export function GanttChart({ ganttBlocks, currentStepIndex }: GanttChartProps) {
  // If no steps taken, show empty state
  if (currentStepIndex === -1) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-surface-100 p-6 min-h-[160px] flex flex-col justify-center items-center">
        <p className="text-surface-500 font-medium">Press Play or Next to start the simulation.</p>
        <div className="w-full bg-surface-100 h-16 mt-4 rounded-md border-2 border-dashed border-surface-200" />
      </div>
    );
  }

  // Filter out blocks that haven't happened yet based on the current step time.
  // The step time essentially represents the total real time elapsed.
  const activeTime = currentStepIndex + 1; 

  const visibleBlocks = ganttBlocks.filter(block => block.startTime < activeTime);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-surface-100 p-6 overflow-x-auto">
      <h3 className="text-lg font-bold text-surface-800 mb-4">Live Gantt Chart</h3>
      
      <div className="flex min-w-max relative mt-2 pb-6 pt-2">
        <AnimatePresence>
          {visibleBlocks.map((block, idx) => {
            const blockDuration = Math.min(block.endTime, activeTime) - block.startTime;
            const isLast = idx === visibleBlocks.length - 1;
            
            return (
              <motion.div
                key={`${block.processId}-${block.startTime}`}
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: `${blockDuration * 40}px` }}
                className={`h-16 flex flex-col items-center justify-center border-r border-y first:border-l ${block.processId ? 'text-white' : 'bg-surface-200 text-surface-600'}`}
                style={{ 
                  backgroundColor: block.color || undefined,
                  minWidth: `${blockDuration * 40}px`
                }}
              >
                <span className="font-bold">{block.processId ? block.processId.toUpperCase() : 'IDLE'}</span>
                
                {/* Time markers */}
                <div className="absolute -bottom-6 text-xs font-mono text-surface-500 -ml-4" style={{ left: 0 }}>
                  {idx === 0 && block.startTime.toString()}
                </div>
                {isLast && (
                  <div className="absolute -bottom-6 text-xs font-mono text-surface-500 -mr-4" style={{ right: 0 }}>
                    {Math.min(block.endTime, activeTime).toString()}
                  </div>
                )}
                {!isLast && (
                  <div className="absolute -bottom-6 text-xs font-mono text-surface-500 -mr-2 right-0">
                    {block.endTime.toString()}
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
