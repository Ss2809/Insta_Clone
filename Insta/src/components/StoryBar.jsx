import { useEffect, useState } from "react";
import { API } from "../api/api";
import { useNavigate } from "react-router-dom";

function StoryBar() {
  const navigate = useNavigate();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await API.get("/story/feed");
        const fetchedStories = Array.isArray(res.data?.stories) ? res.data.stories : [];

        // REMOVE broken records
        const safeStories = fetchedStories.filter(s => s.user && s.user._id);

        // Latest story per user
        const sortedStories = safeStories.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        const uniqueStories = Array.from(
          new Map(sortedStories.map(s => [s.user._id, s])).values()
        );

        setStories(uniqueStories);
      } catch (err) {
        console.error("Story load error:", err);
        setError("Failed to load stories");
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  if (loading) return <div className="p-3 text-center">Loading stories...</div>;
  if (error) return <div className="p-3 text-center text-red-500">{error}</div>;

  return (
    <div className="flex overflow-x-auto gap-4 p-3 bg-white border-b">
      {/* ADD STORY */}
      <div
        onClick={() => navigate("/add-story")}
        className="min-w-[70px] text-center cursor-pointer"
      >
        <div className="relative mx-auto w-16 h-16 rounded-full border-2 border-gray-400 flex items-center justify-center">
          <span className="text-3xl font-bold text-gray-500">+</span>
        </div>
        <p className="text-xs mt-1">Your Story</p>
      </div>

      {/* USER STORIES */}
      {stories.map(s => (
        <div key={s.user._id} className="text-center min-w-[70px]">
          <img
            onClick={() => navigate(`/stories/${s.user._id}`)}
           src={`http://localhost:5000/upload/story/${s.media}`}

            className="w-16 h-16 rounded-full border-2 border-pink-500 object-cover cursor-pointer"
          />
          <p className="text-xs mt-1">{s.user?.username || "User"}</p>
        </div>
      ))}
    </div>
  );
}

export default StoryBar;
