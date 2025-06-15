
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Settings as SettingsIcon, User, FileText, LogOut } from 'lucide-react';

const menuItems = [
  { name: 'Profile', icon: User },
  { name: 'Terms & Conditions', icon: FileText },
  { name: 'Logout', icon: LogOut },
];

export function Settings() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex flex-col items-center justify-center gap-1 w-20 transition-all duration-300 text-gray-500">
          <SettingsIcon className="w-6 h-6" />
          <span className="text-xs font-medium">Settings</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" align="center" className="mb-2 w-56">
        {menuItems.map((item) => (
          <DropdownMenuItem key={item.name} className="gap-2" asChild>
            <a href="#" className="cursor-pointer">
              <item.icon className="h-5 w-5 text-primary" />
              <span>{item.name}</span>
            </a>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
