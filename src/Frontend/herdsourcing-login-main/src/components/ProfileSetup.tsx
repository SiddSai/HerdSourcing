import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProfileSetupProps {
  onComplete: () => void;
  onSkip: () => void;
}

const ProfileSetup = ({ onComplete, onSkip }: ProfileSetupProps) => {
  const [formData, setFormData] = useState({
    name: "",
    major: "",
    year: "",
    skills: "",
    interests: "",
    availability: "",
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Profile data:", formData);
    onComplete();
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-background via-background to-secondary/50 p-4">
      <Card className="w-full max-w-2xl shadow-lg fade-in rounded-2xl">
        <CardHeader className="space-y-3 text-center pb-6 pt-10">
          <CardTitle className="text-4xl font-semibold tracking-tight text-foreground">
            Set up your profile
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground font-light">
            Tell us about you so we can match you with projects.
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-10 px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your full name"
                className="bg-card border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="major" className="text-foreground">Major / Field of Study</Label>
              <Input
                id="major"
                value={formData.major}
                onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                placeholder="e.g., Computer Science, Design, Biology"
                className="bg-card border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="year" className="text-foreground">Year</Label>
              <Select value={formData.year} onValueChange={(value) => setFormData({ ...formData, year: value })}>
                <SelectTrigger id="year" className="bg-card border-border">
                  <SelectValue placeholder="Select your year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="first-year">First-year</SelectItem>
                  <SelectItem value="second-year">Second-year</SelectItem>
                  <SelectItem value="third-year">Third-year</SelectItem>
                  <SelectItem value="fourth-year">Fourth-year</SelectItem>
                  <SelectItem value="graduate">Graduate</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="skills" className="text-foreground">Skills</Label>
              <Textarea
                id="skills"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                placeholder="Python, Figma, writing, leadership…"
                className="bg-card border-border min-h-24"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="interests" className="text-foreground">Interests</Label>
              <Textarea
                id="interests"
                value={formData.interests}
                onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                placeholder="What are you passionate about?"
                className="bg-card border-border min-h-24"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="availability" className="text-foreground">Availability</Label>
              <Input
                id="availability"
                value={formData.availability}
                onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                placeholder="e.g., 5–7 hours/week"
                className="bg-card border-border"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                size="lg"
                className="flex-1 bg-primary hover:bg-primary/80 text-primary-foreground shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 font-medium"
              >
                Save profile
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="lg"
                onClick={onSkip}
                className="flex-1 hover:bg-accent/50"
              >
                Skip for now
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSetup;
