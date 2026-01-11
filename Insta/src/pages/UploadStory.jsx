import { useState } from "react";
import { API } from "../api/api";
import { useNavigate } from "react-router-dom";

function UploadStory() {
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const uploadStory = async () => {
    if (!file) return alert("Select photo or video");

    const fd = new FormData();
    fd.append("media", file); // MUST be media

    await API.post("/story/upload", fd);
    alert("Story uploaded");
    navigate("/home");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-xl font-bold mb-4">Add Story</h1>

      <input type="file" onChange={(e) => setFile(e.target.files[0])} />

      <button
        onClick={uploadStory}
        className="mt-4 bg-pink-500 text-white px-6 py-2 rounded"
      >
        Upload Story
      </button>
    </div>
  );
}

export default UploadStory;
