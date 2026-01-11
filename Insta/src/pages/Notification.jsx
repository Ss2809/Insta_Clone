import { useEffect, useState } from "react";
import { API } from "../api/api";

export default function Notification() {
  const [notes, setNotes] = useState([]);
const [followed, setFollowed] = useState([]);

  const token = localStorage.getItem("token");
  const myId = token ? JSON.parse(atob(token.split(".")[1]))._id : null;

  useEffect(() => {
    if (!myId) return;
    API.get(`/${myId}/notifications`).then((res) => setNotes(res.data));
  }, [myId]);

  const markAllRead = async () => {
    await API.patch(`/${myId}/notifications/seen`);
    window.location.reload();
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen border">
      <div className="flex justify-between items-center p-3 border-b font-semibold">
        <span>Notifications</span>
        <button onClick={markAllRead} className="text-xs text-blue-500">
          Mark all as read
        </button>
      </div>

      {notes.length === 0 && (
        <p className="text-center text-gray-400 mt-10">No notifications</p>
      )}

      {notes.map((n) => (
        <div
          key={n._id}
          className={`flex items-center justify-between p-3 border-b hover:bg-gray-50 ${
            !n.seen ? "bg-blue-50" : ""
          }`}
        >
          <div className="flex items-center gap-3">
            <img
              src={
                n.from && n.from.dp
                  ? `http://localhost:5000/upload/dp/${n.from.dp}`
                  : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              className="w-10 h-10 rounded-full"
            />

            <div className="text-sm leading-tight">
              <b>{n.from?.username || "User"}</b>{" "}
              {n.type === "follow" && "started following you"}
              {n.type === "request" && "sent you a follow request"}
              {n.type === "accept" && "accepted your request"}
              {n.type === "like" && "liked your post"}

              {/* Follow back button */}
             {n.type === "follow" && (
  <button
    disabled={followed.includes(n.from._id)}
    onClick={async () => {
      const res = await API.post(`/${n.from._id}/follow`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(res.data.message);
      setFollowed((prev) => [...prev, n.from._id]);
    }}
    className={`ml-2 text-xs px-3 py-1 rounded-full ${
      followed.includes(n.from._id)
        ? "bg-gray-300 text-black"
        : "bg-blue-500 text-white"
    }`}
  >
    {followed.includes(n.from._id) ? "Following" : "Follow back"}
  </button>
)}


              <p className="text-xs text-gray-400">
                {new Date(n.createdAt).toLocaleString()}
              </p>
            </div>
          </div>

          {n.type === "like" && n.post && (
            <img
              src={`http://localhost:5000/upload/post/${n.post.media?.[0]?.name}`}
              className="w-11 h-11 object-cover rounded"
            />
          )}
        </div>
      ))}
    </div>
  );
}
