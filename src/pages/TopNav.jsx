import React, { useEffect, useState } from "react";
import { Bell, User, Flame } from "lucide-react";
import { supabase } from "./supabase"; // Ensure correct import of Supabase client

const TopNav = () => {
  const [userName, setUserName] = useState("");
  const [streak, setStreak] = useState(0);
  const [showProfilePopup, setShowProfilePopup] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError || !userData?.user) return;

        const userId = userData.user.id;

        // Fetch user's name from registered_trackies table
        const { data: userDetails, error: fetchError } = await supabase
          .from("registered_trackies")
          .select("name, streak")
          .eq("user_id", userId)
          .single();

        if (fetchError) {
          console.error("Error fetching user data:", fetchError.message);
          return;
        }

        setUserName(userDetails?.name || "User");
        setStreak(userDetails?.streak || 0);
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <div className="flex justify-between items-center w-full bg-amber-50 p-4 rounded-md">
      <h1 className="text-xl font-bold">Welcome {userName}!</h1>
      <div className="flex items-center">
        <div className="relative">
          <button
            className="p-2 rounded-full hover:bg-gray-200"
            onClick={() => setShowProfilePopup(!showProfilePopup)}
          >
            <User size={24} />
          </button>
          {showProfilePopup && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg">
              <div className="p-4">
                <p className="font-bold">{userName}</p>
                <button
                  className="mt-2 w-full bg-red-500 text-white p-2 rounded-md"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="ml-4 text-center">
          <Flame size={24} />
          <p>{streak}</p>
        </div>
        <div className="ml-4">
          <button className="p-2 rounded-full hover:bg-gray-200">
            <Bell size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopNav;