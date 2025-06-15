
import { useUser } from '@/hooks/useUser';

const Header = () => {
  const { user, isLoading } = useUser();

  const displayName = user?.firstName || 'there';

  return (
    <header className="fixed top-0 left-0 right-0 p-4 flex justify-between items-center z-20 bg-background">
      <h1 className="text-2xl font-bold text-foreground font-serif">Hello, {isLoading ? '...' : displayName}</h1>
    </header>
  );
};

export default Header;
