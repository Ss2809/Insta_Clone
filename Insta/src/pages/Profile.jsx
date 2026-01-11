import { useEffect, useState } from "react";
import { API } from "../api/api";
import { useParams, useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import Logout from "../components/Logout";

function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const myId = token ? JSON.parse(atob(token.split(".")[1]))._id : null;

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (!token) return navigate("/login");

    const load = async () => {
      try {
        if (id) {
          const u = await API.get(`/user/${id}`);
          const p = await API.get(`/post/user/${id}`);
          setUser(u.data.user);
          setPosts(p.data.post);
        } else {
          const u = await API.get("/user");
          const p = await API.get("/post/myposts");
          setUser(u.data.user);
          setPosts(p.data.post);
        }
      } catch {
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    load();
  }, [id]);

  if (!user) return <h1>Loading...</h1>;

  return (
    <div className="p-6">
      <div className="flex items-center gap-6">
        <img
          src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
          className="w-24 h-24 rounded-full"
        />

        <div>
          <h1 className="text-xl font-bold">@{user.username}</h1>
          <Logout />
          <div className="flex gap-4 mt-2 text-sm">
            <span>
              <b>{posts.length}</b> Posts
            </span>
            <span>
              <b>{user.followers.length}</b> Followers
            </span>
            <span>
              <b>{user.following.length}</b> Following
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <p className="font-semibold">{user.fullName}</p>
        <p className="text-gray-600 text-sm">{user.bio || "No bio yet"}</p>
      </div>

      {user._id === myId ? (
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => navigate("/edit-profile")}
            className="flex-1 border py-1 rounded font-semibold"
          >
            Edit Profile
          </button>

          <button
            onClick={() => navigate("/users")}
            className="flex-1 border py-1 rounded font-semibold"
          >
            Add Friends
          </button>
        </div>
      ) : (
        <div className="flex gap-3 mt-4">
          <button
            onClick={async () => {
              const res = await API.post(`/${user._id}/follow`);
              alert(res.data.message);
              window.location.reload();
            }}
            className="flex-1 bg-blue-500 text-white py-1 rounded"
          >
            Follow / Unfollow
          </button>

          <button className="flex-1 bg-gray-300 py-1 rounded">Message</button>
        </div>
      )}

      <div className="grid grid-cols-3 gap-2 mt-6">
        {posts.map((p) => (
          <div key={p._id} className="aspect-square overflow-hidden">
            <img
              src={`http://localhost:5000/upload/post/${p.media[0].name}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
      <div>
        <BottomNav />
      </div>
    </div>
  );
}

export default Profile;
