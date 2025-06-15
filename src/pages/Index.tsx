
import { useState } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import BottomNav from '@/components/BottomNav';
import Tracker from '@/components/Tracker';
import HabitTracker from '@/components/HabitTracker';

const Index = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="antialiased">
      <div className="relative min-h-screen w-full">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="pt-20 pb-24">
          <HabitTracker />
          <Tracker />
        </main>
        
        <BottomNav />
      </div>
    </div>
  );
};

export default Index;

