import { useState } from "react"
import { API } from "../api/api"
import { Link } from "react-router-dom"

function Forgetpassword() {
  const [email, setEmail] = useState("")

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const res = await API.post("/reset-request-password", { email })
      alert(res.data.message)
    } catch (err) {
      alert(err.response?.data?.message || "Email not found")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center  pb-16 bg-gray-100">
      <form onSubmit={handleSubmit} className="w-80 space-y-3">
        <h2 className="text-xl font-bold text-center">Forgot Password</h2>
        <input
          type="email"
          placeholder="Enter your email"
          className="border p-2 w-full"
          onChange={e => setEmail(e.target.value)}
          required
        />
        <button className="bg-black text-white w-full py-2">
          Send Reset Link
        </button>
        <Link to="/login" className="block text-center text-sm">
          Back to Login
        </Link>
      </form>
    </div>
  )
}

export default Forgetpassword
