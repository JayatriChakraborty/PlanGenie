
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Settings as SettingsIcon, User, FileText, LogOut } from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { toast } from "sonner";

export function Settings() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const toastId = toast.loading("Logging out...");
    try {
      await signOut(auth);
      toast.success("Logged out successfully", { id: toastId });
      navigate('/login');
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to log out", { id: toastId });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex flex-col items-center justify-center gap-1 w-20 transition-all duration-300 text-gray-500">
          <SettingsIcon className="w-6 h-6" />
          <span className="text-xs font-medium">Settings</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" align="center" className="mb-2 w-56">
        <DropdownMenuItem asChild>
          <Link to="/profile" className="cursor-pointer w-full flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href="#" className="cursor-pointer w-full flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <span>Terms & Conditions</span>
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
          <div className="w-full flex items-center gap-2">
            <LogOut className="h-5 w-5 text-primary" />
            <span>Logout</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
