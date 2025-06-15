
import { useState } from 'react';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import Tracker from '@/components/Tracker';
import HabitTracker from '@/components/HabitTracker';
import NotesPage from '@/pages/NotesPage';
import CalendarPage from '@/pages/CalendarPage';
import PromodoPage from '@/pages/PromodoPage';
import AssignmentTracker from '@/components/AssignmentTracker';

const Index = () => {
  const [activeView, setActiveView] = useState('Tracker');

  return (
    <div className="antialiased">
      <div className="relative min-h-screen w-full">
        <Header />
        
        <main className="pt-20 pb-24">
          {activeView === 'Tracker' && (
            <>
              <HabitTracker />
              <AssignmentTracker />
              <Tracker />
            </>
          )}
          {activeView === 'Calendar' && <CalendarPage />}
          {activeView === 'Notes' && <NotesPage />}
          {activeView === 'Promodo' && <PromodoPage />}
        </main>
        
        <BottomNav activeView={activeView} setActiveView={setActiveView} />
      </div>
    </div>
  );
};

export default Index;
