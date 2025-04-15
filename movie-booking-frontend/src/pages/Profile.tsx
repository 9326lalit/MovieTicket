import { useState } from "react";
import { Mail, Phone, UploadCloud, LogOut } from "lucide-react";
import {
  Card,
  CardContent,
} from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { cn } from "../lib/utils";

export function Profile() {
  const [profile, setProfile] = useState({
    name: "Lalit Khairnar",
    email: "lalit@example.com",
    phone: "9876543210",
    avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=Lalit",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleUpdate = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert("Profile updated successfully!");
    }, 1000);
  };

  const handleLogout = () => {
    alert("Logged out");
  };

  const handleAvatarUpload = () => {
    alert("Avatar upload not implemented yet.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl p-6 shadow-2xl rounded-2xl">
        <CardContent>
          <div className="flex flex-col md:flex-row gap-10">
            {/* LEFT SIDE */}
            <div className="flex flex-col items-center md:items-start gap-4 w-full md:w-1/3">
              <Avatar className="h-28 w-28 shadow-md">
                <AvatarImage src={profile.avatarUrl} />
                <AvatarFallback className="text-lg font-bold bg-purple-600 text-white">
                  LK
                </AvatarFallback>
              </Avatar>
              <Button
                variant="outline"
                className="text-sm flex gap-2"
                onClick={handleAvatarUpload}
              >
                <UploadCloud size={16} />
                Upload Photo
              </Button>

              <div className="text-center md:text-left">
                <h2 className="text-xl font-bold">{profile.name}</h2>
                <p className="text-gray-600 flex items-center justify-center md:justify-start gap-1">
                  <Mail size={14} /> {profile.email}
                </p>
                <p className="text-gray-600 flex items-center justify-center md:justify-start gap-1">
                  <Phone size={14} /> {profile.phone}
                </p>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex-1 space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  type="tel"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="flex flex-col md:flex-row gap-4 pt-4">
                <Button
                  className={cn("w-half", loading && "opacity-70")}
                  onClick={handleUpdate}
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Profile"}
                </Button>
                <Button
                  variant="outline"
                  className="w-half text-red-600 border-red-400 hover:bg-red-100"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2" size={16} />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
