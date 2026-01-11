import { useEffect, useState } from "react"
import { API } from "../api/api"
import { useNavigate } from "react-router-dom"
import BottomNav from "../components/BottomNav";

function Users() {
  const [users, setUsers] = useState([])
  const token = localStorage.getItem("token")
  const navigate = useNavigate()

  useEffect(() => {
    API.get("/users", {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => setUsers(res.data.users))
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 pb-16 p-4">
      <h1 className="text-xl font-bold mb-4">Suggested Friends</h1>

      {users.map(u => (
        <div key={u._id} className="flex items-center justify-between bg-white p-3 rounded mb-3">
          <div className="flex items-center gap-3">
            <img
              src={u.dp ? `http://localhost:5000/upload/dp/${u.dp}` : "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
              className="w-12 h-12 rounded-full"
              onClick={()=> navigate(`/profile/${u._id}`)}
            />
            <div>
              <p className="font-semibold">{u.username}</p>
              <p className="text-xs text-gray-500">{u.fullName}</p>
            </div>
          </div>

          <button
            onClick={async () => {
              const res = await API.post(`/${u._id}/follow`, {}, {
                headers: { Authorization: `Bearer ${token}` }
              })
              alert(res.data.message)
            }}
            className="bg-blue-500 text-white text-sm px-3 py-1 rounded"
          >
            Follow
          </button>
        </div>
      ))}
       <div>
           <BottomNav/>
            </div>
    </div>
  )
}

export default Users
