
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { Settings as SettingsIcon, User, FileText, LogOut } from 'lucide-react';

const menuItems = [
  { name: 'Profile', icon: User },
  { name: 'Terms & Conditions', icon: FileText },
  { name: 'Logout', icon: LogOut },
];

export function Settings() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <button className="flex flex-col items-center justify-center gap-1 w-20 transition-all duration-300 text-gray-500">
          <SettingsIcon className="w-6 h-6" />
          <span className="text-xs font-medium">Settings</span>
        </button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="p-4 mx-auto w-full max-w-md">
          <DrawerHeader>
            <DrawerTitle className="text-center">Settings</DrawerTitle>
          </DrawerHeader>
          <nav className="mt-4">
            <ul className="space-y-2">
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
        </div>
      </DrawerContent>
    </Drawer>
  );
}
