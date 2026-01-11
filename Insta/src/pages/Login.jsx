import { useState } from "react"
import { API } from "../api/api"
import { useNavigate, Link } from "react-router-dom"

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: "", password: "" })

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const res = await API.post("/login", form)
     localStorage.setItem("token", res.data.accesstoken)

      alert("Login success")
      navigate("/home")
    } catch (err) {
      alert(err.response?.data?.message || "Login failed")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 pb-16">
      <form onSubmit={handleSubmit} className="w-80 space-y-3">
        <h2 className="text-2xl font-bold text-center">Login</h2>
        <input name="username" placeholder="Username" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
        <button className="w-full bg-black text-white py-2">Login</button>

        <Link to="/forgetpassword" className="block text-center text-sm text-blue-600">
          Forgot Password?
        </Link>

        <p className="text-center text-sm">
          Don't have account? <Link to="/">Signup</Link>
        </p>
      </form>
    </div>
  )
}
