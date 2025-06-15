
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 p-4 flex justify-between items-center z-20 bg-transparent">
      <h1 className="text-xl font-bold text-gray-800">Hello, Alex</h1>
      <Button variant="ghost" size="icon" onClick={onMenuClick} className="rounded-full">
        <Menu className="h-6 w-6 text-gray-800" />
      </Button>
    </header>
  );
};

export default Header;
