
import { X, User, FileText, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { name: 'Profile', icon: User },
  { name: 'Terms & Conditions', icon: FileText },
  { name: 'Logout', icon: LogOut },
];

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 z-30"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-72 bg-white/80 backdrop-blur-lg shadow-2xl z-40 p-6"
          >
            <div className="flex justify-end mb-8">
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                <X className="h-6 w-6 text-gray-700" />
              </Button>
            </div>
            <nav>
              <ul>
                {menuItems.map((item) => (
                  <li key={item.name}>
                    <a
                      href="#"
                      className="flex items-center gap-4 p-3 rounded-lg text-lg font-medium text-gray-700 hover:bg-primary/10 transition-colors"
                    >
                      <item.icon className="h-5 w-5 text-primary" />
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
