import { useEffect, useState, useCallback, useRef } from "react";  // Added useRef for better interval management
import { API } from "../api/api";
import { Heart, MessageCircle, Bookmark } from "lucide-react";
import CommentBox from "./CommentsBox";

function PostFeed() {
  const [posts, setPosts] = useState(() => []);
  const [cursor, setCursor] = useState(null);
  const [latest, setLatest] = useState(null);  // This will now be initialized properly
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [openPost, setOpenPost] = useState(null);

  const token = localStorage.getItem("token");
  const myId = token ? JSON.parse(atob(token.split(".")[1]))._id : null;

  // Use a ref for latest to avoid restarting the interval on every update
  const latestRef = useRef(latest);
  useEffect(() => {
    latestRef.current = latest;
  }, [latest]);

  const loadPosts = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const res = await API.get(`/post/followingpost?cursor=${cursor || ""}`);
      const newPosts = Array.isArray(res.data?.post) ? res.data.post : [];
      const next = res.data?.nextCursor || null;

      if (newPosts.length === 0) setHasMore(false);

      setPosts((prev) => [...prev, ...newPosts]);
      setCursor(next);

      // Initialize latest with the newest post's createdAt if not set (fixes refresh bug)
      if (newPosts.length > 0 && !latestRef.current) {
        setLatest(newPosts[0].createdAt);
      }
    } catch (err) {
      console.log("Post load error", err);
      // Optionally: set an error state and display to user
    } finally {
      setLoading(false);
    }
  }, [cursor, loading, hasMore]);  // Removed 'latest' from deps since we use ref

  // Initial load
  useEffect(() => {
    loadPosts();
  }, []);  // loadPosts is stable due to useCallback

  // Infinite scroll - optimized with useCallback to avoid re-adding listener
  const onScroll = useCallback(() => {
    if (loading || !hasMore) return;
    if (
      window.innerHeight + window.scrollY + 80 >=
      document.body.offsetHeight
    ) {
      loadPosts();
    }
  }, [loadPosts, loading, hasMore]);

  useEffect(() => {
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  // Refresh new posts every 5 seconds - now stable and starts after latest is set
  useEffect(() => {
    const interval = setInterval(async () => {
      if (!latestRef.current) return;  // Skip if not initialized
      try {
        const res = await API.get(`/post/followingpost?latest=${latestRef.current}`);
        if (res.data.post.length) {
          setPosts((prev) => [...res.data.post, ...prev]);
          setLatest(res.data.post[0].createdAt);  // Update latest for next poll
        }
      } catch (err) {
        console.error("Refresh error:", err);  // Added error handling
        // Optionally: set an error state and display to user
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);  // No deps - interval runs once and stays stable

  const likePost = async (postId) => {
    try {
      const res = await API.post(`/post/like/${postId}`);
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId
            ? {
                ...p,
                likes: res.data.liked
                  ? [...p.likes, myId]
                  : p.likes.filter((id) => id !== myId),
              }
            : p
        )
      );
    } catch (err) {
      console.error("Like error:", err);  // Optional: add error handling here too
    }
  };

  const handleNewComment = (postId, newComment) => {
    setPosts((prev) =>
      prev.map((p) =>
        p._id === postId
          ? { ...p, comments: [...(p.comments || []), newComment] }  // Safer array handling
          : p
      )
    );
  };

  return (
    <div className="space-y-6">
      {posts.map((p) => (
        <div key={p._id} className="bg-white rounded shadow">
          <div className="flex items-center gap-3 p-3">
            <img
              src={
                p.user?.dp
                  ? `http://localhost:5000/upload/dp/${p.user.dp}`
                  : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              className="w-8 h-8 rounded-full"
            />
            <b className="text-sm">{p.user?.username || "User"}</b>
          </div>

          <img
            src={
              p.media?.length
                ? `http://localhost:5000/upload/post/${p.media[0].name}`
                : "https://via.placeholder.com/400x300?text=No+Image"
            }
            className="w-full max-h-[500px] object-cover"
          />

          <div className="flex items-center gap-4 p-3">
            <Heart
              onClick={() => likePost(p._id)}
              className={`cursor-pointer ${
                p.likes?.includes(myId) ? "text-red-500 fill-red-500" : ""
              }`}
            />
            <span>{p.likes?.length || 0}</span>

            <div
              onClick={() => setOpenPost(openPost === p._id ? null : p._id)}
              className="flex gap-1 cursor-pointer"
            >
              <MessageCircle />
              <span>{p.comments?.length || 0}</span>
            </div>

            <Bookmark className="ml-auto" />
          </div>

          {openPost === p._id && (
            <CommentBox
              postId={p._id}
              onNewComment={(c) => handleNewComment(p._id, c)}
            />
          )}

          <div className="px-3 pb-3">
            <p>
              <b>{p.user.username}</b> {p.caption}
            </p>
          </div>
        </div>
      ))}
      {loading && <p className="text-center text-gray-400">Loading...</p>}
      {!hasMore && <p className="text-center text-gray-300">No more posts</p>}
    </div>
  );
}

export default PostFeed;