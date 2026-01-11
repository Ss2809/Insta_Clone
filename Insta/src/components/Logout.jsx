import { useNavigate } from "react-router-dom"
import { API } from "../api/api"

function LogoutButton() {
  const navigate = useNavigate()

  const logout = async () => {
    await API.post("/logout")
    localStorage.removeItem("token")
    navigate("/login")
  }

  return (
    <button
      onClick={logout}
      className="fixed top-3 right-3 z-50 bg-red-500 text-white px-4 py-1 rounded-full shadow-md hover:bg-red-600"
    >
      Logout
    </button>
  )
}

export default LogoutButton
