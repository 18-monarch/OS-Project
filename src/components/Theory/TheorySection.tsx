import React from 'react';

export function TheorySection() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-white rounded-xl shadow-sm border border-surface-100 p-8">
        <h2 className="text-2xl font-bold text-surface-900 mb-4">What is Process Scheduling?</h2>
        <p className="text-surface-600 leading-relaxed mb-6">
          Process scheduling is an essential function of a multiprogramming operating system. The objective 
          of multiprogramming is to have some process running at all times, to maximize CPU utilization. 
          The CPU scheduler dictates which process gets the processor when there is a choice to be made.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-primary-50 border border-primary-100 rounded-lg p-5">
            <h3 className="font-semibold text-primary-700 mb-2">Preemptive Scheduling</h3>
            <p className="text-sm text-primary-800">
              The OS can interrupt a currently executing process and allocate the CPU to another process.
              Examples: SRTF, Round Robin.
            </p>
          </div>
          <div className="bg-secondary-50 border border-secondary-100 rounded-lg p-5">
            <h3 className="font-semibold text-secondary-700 mb-2">Non-preemptive Scheduling</h3>
            <p className="text-sm text-secondary-800">
              Once the CPU has been allocated to a process, the process keeps the CPU until it releases it 
              either by terminating or by switching to the waiting state.
              Examples: FCFS, SJF.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-surface-100 p-8">
        <h2 className="text-2xl font-bold text-surface-900 mb-6">Scheduling Objectives & Metrics</h2>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <MetricCard 
            title="CPU Utilization" 
            desc="Keeping the CPU as busy as possible (ideally 100%)."
          />
          <MetricCard 
            title="Throughput" 
            desc="Number of processes that complete their execution per time unit."
          />
          <MetricCard 
            title="Turnaround Time" 
            desc="Total time taken from submission of a process to its completion."
            formula="Completion Time - Arrival Time"
          />
          <MetricCard 
            title="Waiting Time" 
            desc="Amount of time a process has been waiting in the ready queue."
            formula="Turnaround Time - Burst Time"
          />
          <MetricCard 
            title="Response Time" 
            desc="Time from the submission of a request until the first response is produced."
          />
          <MetricCard 
            title="Fairness" 
            desc="Each process should get a fair share of the CPU without starvation."
          />
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, desc, formula }: { title: string, desc: string, formula?: string }) {
  return (
    <div className="p-5 bg-surface-50 rounded-lg border border-surface-200">
      <h3 className="font-semibold text-surface-900 mb-2">{title}</h3>
      <p className="text-sm text-surface-600 mb-3">{desc}</p>
      {formula && (
        <div className="text-xs font-mono bg-surface-100 p-2 rounded text-surface-800 flex flex-col gap-1">
          <span className="font-semibold uppercase text-[10px] text-surface-500 tracking-wider">Formula</span>
          <span>{formula}</span>
        </div>
      )}
    </div>
  );
}
