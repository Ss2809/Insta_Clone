import { AiFillHome, AiOutlinePlusCircle, AiOutlineBell, AiOutlineUser } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { API } from "../api/api";

function BottomNav() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const myId = token ? JSON.parse(atob(token.split(".")[1]))._id : null;

  const [count, setCount] = useState(0);

  const refreshCount = () => {
    if (!myId) return;
    API.get(`/${myId}/notifications/unseen-count`)
      .then((res) => setCount(res.data.count))
      .catch(() => {});
  };

  useEffect(() => {
    refreshCount();
  }, [myId]);

  useEffect(() => {
    const id = setInterval(refreshCount, 3000); // auto refresh every 3 sec
    return () => clearInterval(id);
  }, [myId]);

  return (
    <div className="fixed bottom-0 left-0 right-0 h-14 bg-white border-t flex justify-around items-center z-50">

      <button onClick={() => navigate("/home")}>
        <AiFillHome size={26} />
      </button>

      <button onClick={() => navigate("/Upload")}>
        <AiOutlinePlusCircle size={28} />
      </button>

      <button onClick={() => navigate("/notification")} className="relative">
        <AiOutlineBell size={26} />
        {count > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
            {count}
          </span>
        )}
      </button>

      <button onClick={() => navigate("/profile")}>
        <AiOutlineUser size={26} />
      </button>
    </div>
  );
}

export default BottomNav;
