import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";

interface EditProfilePopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialProfile: {
    name: string;
    email: string;
    major: string;
    year: string;
    interests: string;
    availability: string;
    avatarUrl?: string;
  };
  onSave: (updatedProfile: {
    name: string;
    email: string;
    major: string;
    year: string;
    interests: string;
    availability: string;
    avatarUrl?: string;
  }) => void;
}

const EditProfilePopup = ({ open, onOpenChange, initialProfile, onSave }: EditProfilePopupProps) => {
  const [name, setName] = useState(initialProfile.name);
  const [email, setEmail] = useState(initialProfile.email);
  const [major, setMajor] = useState(initialProfile.major);
  const [year, setYear] = useState(initialProfile.year);
  const [interests, setInterests] = useState(initialProfile.interests);
  const [availability, setAvailability] = useState(initialProfile.availability);
  
  // This input lets the user choose a profile picture file from their computer.
  // For now, we only create a local preview URL. Later, this is where we will
  // upload the file to storage and save its URL in the database.
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | undefined>(initialProfile.avatarUrl);

  useEffect(() => {
    setName(initialProfile.name);
    setEmail(initialProfile.email);
    setMajor(initialProfile.major);
    setYear(initialProfile.year);
    setInterests(initialProfile.interests);
    setAvailability(initialProfile.availability);
    setAvatarPreviewUrl(initialProfile.avatarUrl);
    setAvatarFile(null);
  }, [initialProfile]);

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      // Create a local preview URL for the selected image
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreviewUrl(previewUrl);
    }
  };

  const handleSave = () => {
    // TODO: Upload avatarFile to storage (Supabase or backend) and get the URL
    // For now, we just pass the preview URL
    onSave({ name, email, major, year, interests, availability, avatarUrl: avatarPreviewUrl });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showClose={false} className="sm:max-w-[500px] rounded-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-[#2C2B28]">
            Edit Profile
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {/* Profile Picture Upload */}
          <div className="space-y-2">
            <Label className="text-[#2C2B28]">Profile Picture</Label>
            <div className="flex items-center gap-4">
              {/* Current avatar preview - larger size so images are visible */}
              {avatarPreviewUrl ? (
                <img 
                  src={avatarPreviewUrl} 
                  alt="Profile preview"
                  className="w-20 h-20 rounded-full object-cover border-2 border-[#E0D7C8]"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-[#A9C4A4]/20 flex items-center justify-center text-2xl font-semibold text-[#2C2B28] border-2 border-[#E0D7C8]">
                  {name.charAt(0)}
                </div>
              )}
              <div className="flex-1">
                <Input
                  id="avatarFile"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarFileChange}
                  className="bg-[#FAFAF7] border-[#E0D7C8] focus:border-[#A9C4A4] rounded-lg"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Choose an image from your computer
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name" className="text-[#2C2B28]">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-[#FAFAF7] border-[#E0D7C8] focus:border-[#A9C4A4] rounded-lg"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-[#2C2B28]">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-[#FAFAF7] border-[#E0D7C8] focus:border-[#A9C4A4] rounded-lg"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="major" className="text-[#2C2B28]">
              Major
            </Label>
            <Input
              id="major"
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              className="bg-[#FAFAF7] border-[#E0D7C8] focus:border-[#A9C4A4] rounded-lg"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="year" className="text-[#2C2B28]">
              Year
            </Label>
            <Input
              id="year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="bg-[#FAFAF7] border-[#E0D7C8] focus:border-[#A9C4A4] rounded-lg"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="interests" className="text-[#2C2B28]">
              Interests
            </Label>
            <Textarea
              id="interests"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              className="bg-[#FAFAF7] border-[#E0D7C8] focus:border-[#A9C4A4] rounded-lg min-h-[80px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="availability" className="text-[#2C2B28]">
              Availability
            </Label>
            <Input
              id="availability"
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              className="bg-[#FAFAF7] border-[#E0D7C8] focus:border-[#A9C4A4] rounded-lg"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-full border-[#E0D7C8] text-[#2C2B28]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="rounded-full bg-[#A9C4A4] text-[#1F3A26] hover:bg-[#A9C4A4]/90"
          >
            Save changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfilePopup;
