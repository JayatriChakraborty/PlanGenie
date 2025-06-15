
import { useState, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Camera, Trash2, User as UserIcon, Upload } from 'lucide-react';
import { toast } from 'sonner';

const ProfilePage = () => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  const takePictureRef = useRef<HTMLInputElement>(null);
  const uploadGalleryRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setProfileImage(URL.createObjectURL(file));
      toast.success("Profile picture updated!");
    }
  };

  const handleDeleteAccount = () => {
    // Here you would typically show a confirmation dialog first
    toast.error("Account deletion is not implemented yet.");
  };

  return (
    <div className="container mx-auto max-w-2xl py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Profile</h1>

      <div className="flex justify-center mb-8">
        <Dialog>
          <DialogTrigger asChild>
            <button className="relative group">
              <Avatar className="h-32 w-32 cursor-pointer border-2 border-primary/50">
                <AvatarImage src={profileImage || undefined} alt="Profile Picture" />
                <AvatarFallback>
                  <UserIcon className="h-16 w-16 text-muted-foreground" />
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="h-8 w-8 text-white" />
              </div>
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Update Profile Picture</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Button onClick={() => takePictureRef.current?.click()}>
                <Camera className="mr-2 h-4 w-4" /> Take a Picture
              </Button>
              <Button onClick={() => uploadGalleryRef.current?.click()}>
                <Upload className="mr-2 h-4 w-4" /> Upload from Gallery
              </Button>
              <input
                type="file"
                accept="image/*"
                capture="user"
                ref={takePictureRef}
                className="hidden"
                onChange={handleFileChange}
              />
              <input
                type="file"
                accept="image/*"
                ref={uploadGalleryRef}
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="John" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Doe" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john.doe@example.com" />
        </div>
        
        <div className="border-t pt-6 mt-6">
            <h3 className="text-lg font-medium text-destructive">Danger Zone</h3>
            <p className="text-sm text-muted-foreground mb-4">This action cannot be undone.</p>
            <Button variant="destructive" onClick={handleDeleteAccount}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Account
            </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

