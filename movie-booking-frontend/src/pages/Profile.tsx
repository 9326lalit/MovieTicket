// import React, { useEffect, useState } from "react";
import { auth } from "../config/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { Button } from "../components/ui/button";
import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { useNavigate } from "react-router-dom";

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        navigate("/auth"); // Redirect if not logged in
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/auth");
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <img
              src={user.photoURL || ""}
              alt="Profile"
              className="w-24 h-24 rounded-full mx-auto border"
            />
            <h2 className="text-xl font-semibold mt-2">{user.displayName}</h2>
            <p className="text-muted-foreground">{user.email}</p>
          </div>

          <div className="text-center">
            <Button onClick={handleLogout} variant="destructive">
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
