import React, { useState } from 'react';
import { HelpCircle, CheckCircle, XCircle } from 'lucide-react';

const QUESTIONS = [
  {
    question: "Which scheduling algorithm typically provides the minimum average waiting time?",
    options: ["First Come First Serve", "Shortest Job First", "Round Robin", "Priority Scheduling"],
    correctIdx: 1,
    explanation: "SJF (and its preemptive version SRTF) is provably optimal for minimizing average waiting time, as it always executes the shortest tasks first."
  },
  {
    question: "What is the 'Convoy Effect' in operating systems?",
    options: [
      "When low priority processes wait indefinitely",
      "When short processes are stuck waiting behind a very long process",
      "When a process spends more time doing context switches than execution",
      "When multiple processes share the same priority"
    ],
    correctIdx: 1,
    explanation: "The Convoy effect occurs in non-preemptive algorithms like FCFS when a CPU-intensive process holds the processor, causing many short processes to wait in ready queue."
  },
  {
    question: "Which of the following describes Starvation?",
    options: [
      "A process is frequently preempted by higher priority tasks and never completes.",
      "The CPU remains idle despite there being tasks in the ready queue.",
      "A process terminates itself due to an error.",
      "The OS crashes when attempting a context switch."
    ],
    correctIdx: 0,
    explanation: "Starvation (or indefinite blocking) happens when a process is continuously passed over in favor of other processes (e.g., in strict priority scheduling or SJF)."
  },
  {
    question: "If the Time Quantum in Round Robin scheduling is extremely large, the algorithm conceptually behaves like:",
    options: ["SJF", "SRTF", "FCFS", "Priority Scheduling"],
    correctIdx: 2,
    explanation: "If the quantum is large enough that every process finishes within its first time slice, Round Robin effectively becomes First Come First Serve (FCFS)."
  }
];

export function QuizMode() {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState<Record<number, boolean>>({});

  const handleSelect = (qIdx: number, optIdx: number) => {
    if (submitted[qIdx]) return;
    setSelectedAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleSubmit = (qIdx: number) => {
    if (selectedAnswers[qIdx] !== undefined) {
      setSubmitted(prev => ({ ...prev, [qIdx]: true }));
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in duration-500">
      <div className="flex items-center space-x-3 mb-8">
        <HelpCircle className="w-8 h-8 text-primary-600" />
        <h2 className="text-3xl font-bold text-surface-900">Knowledge Quiz</h2>
      </div>

      {QUESTIONS.map((q, qIdx) => {
        const isSubmitted = submitted[qIdx];
        const isCorrect = selectedAnswers[qIdx] === q.correctIdx;

        return (
          <div key={qIdx} className="bg-white rounded-xl shadow-sm border border-surface-100 p-6">
            <h3 className="text-lg font-semibold text-surface-800 mb-4">{qIdx + 1}. {q.question}</h3>
            
            <div className="space-y-3">
              {q.options.map((opt, oIdx) => {
                let btnClass = "w-full text-left p-4 rounded-lg border transition-colors ";
                
                if (!isSubmitted) {
                  btnClass += selectedAnswers[qIdx] === oIdx 
                    ? "border-primary-500 bg-primary-50 text-primary-900" 
                    : "border-surface-200 hover:border-surface-300 hover:bg-surface-50 text-surface-700";
                } else {
                  if (oIdx === q.correctIdx) {
                    btnClass += "border-green-500 bg-green-50 text-green-900 font-medium";
                  } else if (selectedAnswers[qIdx] === oIdx) {
                    btnClass += "border-red-500 bg-red-50 text-red-900 line-through";
                  } else {
                    btnClass += "border-surface-200 text-surface-400 opacity-60";
                  }
                }

                return (
                  <button 
                    key={oIdx}
                    onClick={() => handleSelect(qIdx, oIdx)}
                    className={btnClass}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {!isSubmitted ? (
              <button 
                onClick={() => handleSubmit(qIdx)}
                disabled={selectedAnswers[qIdx] === undefined}
                className="mt-6 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition"
              >
                Submit Answer
              </button>
            ) : (
              <div className={`mt-6 p-4 rounded-lg flex items-start space-x-3 ${isCorrect ? 'bg-green-50 text-green-800' : 'bg-surface-50 text-surface-700'}`}>
                {isCorrect ? <CheckCircle className="w-6 h-6 text-green-600 shrink-0" /> : <XCircle className="w-6 h-6 text-red-500 shrink-0" />}
                <div>
                  <h4 className="font-bold mb-1">{isCorrect ? 'Correct!' : 'Incorrect.'}</h4>
                  <p className="text-sm">{q.explanation}</p>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
