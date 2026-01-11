import { useState } from "react";
import { API } from "../api/api";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    fullName: "",
    username: "",
    password: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/Signup", form);
      alert(res.data.message);
      localStorage.setItem("token", res.data.accesstoken)
       navigate("/home");
    } catch (err) {
        alert(err.response.data.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-cente pb-16 bg-gray-100r">
      <form onSubmit={handleSubmit} className="w-80 space-y-3">
        <h2 className="text-2xl font-bold text-center">Create Account</h2>
        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          name="fullName"
          placeholder="Full Name"
          onChange={handleChange}
          required
        />
        <input
          name="username"
          placeholder="Username"
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        <button className="w-full bg-black text-white py-2">Signup</button>
        <p className="text-center text-sm">
          Already have account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}
