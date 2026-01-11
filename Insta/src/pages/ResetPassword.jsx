import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API } from "../api/api";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [Confirmpassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== Confirmpassword) {
      return alert("Password Mismatch!!");
      
    } else {
      try {
        const res = await API.post(`/reset-password/${token}`, { password });
        alert(res.data.message);
        navigate("/login");
      } catch (err) {
        alert("Invalid or expired link");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen pb-16 bg-gray-100">
      <form onSubmit={handleSubmit} className="w-80 space-y-3">
        <h2 className="text-xl font-bold text-center">Set New Password</h2>
        <input
          type="password"
          placeholder="Enter new password"
          className="border p-2 w-full"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <h2 className="text-xl font-bold text-center">Confirm Password</h2>
        <input
          type="password"
          placeholder="Enter new password"
          className="border p-2 w-full"
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button className="bg-black text-white w-full py-2">
          Reset Password
        </button>
      </form>
    </div>
  );
}

export default ResetPassword;
