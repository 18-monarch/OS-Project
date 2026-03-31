import { useState } from 'react';
import { BookOpen, MonitorPlay, BarChart2, HelpCircle } from 'lucide-react';
import { TheorySection } from './components/Theory/TheorySection';
import { SimulationEngine } from './components/Simulator/SimulationEngine';
import { ComparisonMode } from './components/Comparison/ComparisonMode';
import { QuizMode } from './components/Quiz/QuizMode';

type TabType = 'theory' | 'simulator' | 'comparison' | 'quiz';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('simulator');

  const tabs = [
    { id: 'theory', label: 'Theory & Concepts', icon: BookOpen },
    { id: 'simulator', label: 'Interactive Simulator', icon: MonitorPlay },
    { id: 'comparison', label: 'Algorithm Comparison', icon: BarChart2 },
    { id: 'quiz', label: 'Knowledge Quiz', icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-surface-50 text-surface-900 font-sans">
      <header className="bg-primary-600 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <MonitorPlay className="w-8 h-8 text-primary-100" />
              <h1 className="text-xl font-bold tracking-tight">OS Scheduler Tutor</h1>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-white border-b border-surface-100 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`
                  whitespace-nowrap pb-4 pt-5 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors
                  ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-surface-600 hover:text-surface-900 hover:border-surface-300'
                  }
                `}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'theory' && <TheorySection />}
        {activeTab === 'simulator' && <SimulationEngine />}
        {activeTab === 'comparison' && <ComparisonMode />}
        {activeTab === 'quiz' && <QuizMode />}
      </main>

    </div>
  );
}

export default App;
