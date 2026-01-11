import { useEffect, useState } from "react"
import { API } from "../api/api"
import { useNavigate } from "react-router-dom"


function EditProfile() {
  const [form, setForm] = useState({ fullName: "", bio: "" })
  const token = localStorage.getItem("token")
  const navigate = useNavigate()

  useEffect(() => {
    API.get("/user", {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) =>
      setForm({
        fullName: res.data.user.fullName || "",
        bio: res.data.user.bio || "",
      })
    )
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await API.patch("/user/update", form, {
        headers: { Authorization: `Bearer ${token}` },
      })
      alert("Profile updated successfully")
      navigate("/profile")
    } catch (err) {
      alert(err.response?.data?.message || "Update failed")
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-xl font-bold mb-4">Edit Profile</h1>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          className="border p-2 w-full rounded"
          placeholder="Full Name"
          value={form.fullName}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
        />

        <textarea
          className="border p-2 w-full rounded"
          placeholder="Bio"
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
        />

        <button className="bg-black text-white w-full py-2 rounded">
          Save
        </button>
      </form>
    </div>
  )
}



export default EditProfile
