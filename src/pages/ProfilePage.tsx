import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { Camera, Trash2, User as UserIcon, Upload, ChevronLeft, Save } from 'lucide-react';
import { toast } from 'sonner';
import { db, storage } from '@/lib/firebase';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const ProfilePage = () => {
  // Using a hardcoded user ID for now. In a real app, this would come from an auth context.
  const userId = 'testUser';

  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const takePictureRef = useRef<HTMLInputElement>(null);
  const uploadGalleryRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return;
      setIsLoading(true);
      try {
        const userDocRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          setFirstName(data.firstName || '');
          setLastName(data.lastName || '');
          setEmail(data.email || '');
          setProfileImage(data.profileImage || null);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (!userId) return;
      const toastId = toast.loading("Uploading profile picture...");

      try {
        const storageRef = ref(storage, `profile_images/${userId}/${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);

        const userDocRef = doc(db, 'users', userId);
        await setDoc(userDocRef, { profileImage: downloadURL }, { merge: true });

        setProfileImage(downloadURL);
        toast.success("Profile picture updated!", { id: toastId });
      } catch (error) {
        console.error("Error uploading file:", error);
        toast.error("Failed to update profile picture.", { id: toastId });
      }
    }
  };

  const handleSaveProfile = async () => {
    if (!userId) return;
    const toastId = toast.loading("Saving profile...");
    try {
      const userDocRef = doc(db, 'users', userId);
      await setDoc(userDocRef, { firstName, lastName, email }, { merge: true });
      toast.success("Profile saved successfully!", { id: toastId });
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to save profile.", { id: toastId });
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return;
    }
    if (!userId) return;
    const toastId = toast.loading("Deleting account...");
    try {
        const userDocRef = doc(db, 'users', userId);
        await deleteDoc(userDocRef);
        // Note: This does not delete associated data in Storage. A real implementation would need a Cloud Function for that.
        toast.success("Account deleted successfully.", { id: toastId });
        navigate('/');
    } catch (error) {
        console.error("Error deleting account:", error);
        toast.error("Failed to delete account.", { id: toastId });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl py-8 px-4">
      <div className="relative flex items-center justify-center mb-8">
        <Button variant="ghost" size="icon" className="absolute left-0" onClick={() => navigate(-1)}>
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-3xl font-bold">Profile</h1>
      </div>

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
        
        <div className="flex justify-end">
            <Button onClick={handleSaveProfile}>
                <Save className="mr-2 h-4 w-4" />
                Save Profile
            </Button>
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
