import React from 'react';
import type { StepState } from '../../utils/schedulingAlgorithms';
import { Info, AlertTriangle, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function StepExplanation({ step }: { step: StepState | null }) {
  if (!step) {
    return (
      <div className="bg-surface-50 rounded-xl border border-surface-200 p-6 flex flex-col items-center justify-center text-center">
        <Lightbulb className="w-8 h-8 text-surface-400 mb-2" />
        <h3 className="font-semibold text-surface-700">Tutor Panel</h3>
        <p className="text-sm text-surface-500 max-w-sm mt-1">
          Start the simulation to see step-by-step explanations of the scheduling decisions.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-surface-100 overflow-hidden">
      <div className="p-4 border-b border-surface-100 flex items-center space-x-2 bg-primary-50">
        <Info className="w-5 h-5 text-primary-600" />
        <h3 className="font-bold text-primary-900">Live Explanation</h3>
      </div>
      
      <div className="p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={step.time}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="text-lg font-medium text-surface-800"
          >
            {step.explanation}
          </motion.div>
        </AnimatePresence>

        {step.insights.length > 0 && (
          <div className="mt-6 space-y-3">
            <h4 className="text-xs font-bold text-surface-500 uppercase tracking-wider">Insights & Warnings</h4>
            {step.insights.map((insight, idx) => {
              const isWarning = insight.toLowerCase().includes('starvation') || insight.toLowerCase().includes('convoy');
              return (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex items-start space-x-3 p-3 rounded-lg border ${
                    isWarning 
                      ? 'bg-red-50 border-red-100 text-red-800' 
                      : 'bg-yellow-50 border-yellow-100 text-yellow-800'
                  }`}
                >
                  <AlertTriangle className={`w-5 h-5 shrink-0 ${isWarning ? 'text-red-500' : 'text-yellow-600'}`} />
                  <span className="text-sm font-medium">{insight}</span>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
