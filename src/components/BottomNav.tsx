
import { List, Calendar, Timer, StickyNote } from 'lucide-react';

const navItems = [
  { name: 'Tracker', icon: List, active: true },
  { name: 'Calendar', icon: Calendar, active: false },
  { name: 'Notes', icon: StickyNote, active: false },
  { name: 'Promodo', icon: Timer, active: false },
];

const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-20 bg-white/40 backdrop-blur-lg border-t border-white/30 z-20">
      <div className="flex justify-around items-center h-full max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.name}
              className={`flex flex-col items-center justify-center gap-1 w-20 transition-all duration-300 ${
                item.active ? 'text-primary' : 'text-gray-500'
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs font-medium">{item.name}</span>
              {item.active && (
                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
