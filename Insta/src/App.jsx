import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Notification from "./pages/Notification";
import Users from "./pages/Users";
import Upload from "./pages/Upload";
import Forgetpassword from "./pages/Forgetpassword";
import ResetPassword from "./pages/ResetPassword";
import UploadStory from "./pages/UploadStory";
import Stories from "./pages/Stories";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/Upload" element={<Upload />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/notification" element={<Notification />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/users" element={<Users />} />
        <Route path="/forgetpassword" element={<Forgetpassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/add-story" element={<UploadStory />} />
        <Route path="/stories/:id" element={<Stories />} />


      </Routes>
    </BrowserRouter>
  );
}
