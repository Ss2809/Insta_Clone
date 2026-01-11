import BottomNav from "../components/BottomNav";
import PostFeed from "../components/PostFeed";
import StoryBar from "../components/StoryBar";
import { useEffect, useState } from "react";

// Updated Home with secure user parsing and error handling
function Home() {
  const [user, setUser] = useState(null);
  const [userError, setUserError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        // Basic JWT verification (replace with a library like jsonwebtoken for full security)
        const payload = JSON.parse(atob(token.split(".")[1]));
        // TODO: Verify signature here (e.g., using a secret key)
        setUser(payload);
      } catch (err) {
        console.error("Invalid token:", err);
        setUserError("Invalid session. Please log in again.");
        localStorage.removeItem("token");  // Clear invalid token
      }
    }
  }, []);

  if (userError) return <div className="p-4 text-center text-red-500">{userError}</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Top Stories */}
      <StoryBar />

      {/* Main feed */}
      <div className="p-4">
        <h1 className="text-xl font-semibold">
          Hello {user?.fullname || user?.username || "User"} 👋
        </h1>
      </div>

      {/* Feed */}
      <div className="flex-1 p-4">
        <PostFeed />
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}

export default Home;