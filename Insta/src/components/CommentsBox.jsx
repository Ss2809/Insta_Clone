import { useEffect, useState } from "react";
import { API } from "../api/api";
import { Send } from "lucide-react";

export default function CommentBox({ postId,onNewComment  }) {
  const [text, setText] = useState("");
  const [comments, setComments] = useState([]);

  const load = async () => {
    try {
      const res = await API.get(`/post/comment/${postId}`);
      setComments(res.data || []);
    } catch (err) {
      console.log("Comment load error", err);
    }
  };

  useEffect(() => {
    if (postId) load();
  }, [postId]);

  const send = async () => {
    if (!text) return;
    try {
      await API.post(`/post/comment/${postId}`, { text });
      
      setText("");
      onNewComment(); 
      load();
    } catch (err) {
      console.log("Comment send error", err);
    }
  };

  return (
  <div className="bg-gray-50 p-3 border-t">
   <div>

   </div>
    {/* COMMENTS */}
    <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
      {comments.map((c) => (
        <div key={c._id} className="text-sm">
          <span className="font-semibold mr-1">
            {c.user?.username || "user"}
          </span>
          <span>{c.text}</span>
        </div>
      ))}
    </div>

    {/* INPUT */}
    <div className="flex items-center gap-2 mt-3">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a comment..."
        className="flex-1 bg-transparent outline-none text-sm"
      />

      <button
        onClick={send}
        className={`text-sm font-semibold ${
          text ? "text-blue-500" : "text-blue-300"
        }`}
      >
        Post
      </button>
    </div>
  </div>
);

}
