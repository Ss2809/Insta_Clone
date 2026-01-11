import { useState } from "react";
import { API } from "../api/api";
import { useNavigate } from "react-router-dom";
import { ImagePlus } from "lucide-react";

export default function Upload() {
  const [files, setFiles] = useState([]);
  const [caption, setCaption] = useState("");
  const [tags, setTags] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const selectFiles = (e) => {
    setFiles([...e.target.files]);
  };

  const uploadPost = async () => {
    if (files.length === 0) return alert("Select images or videos!");

    const form = new FormData();
    files.forEach((file) => form.append("media", file));
    form.append("caption", caption);
    form.append("tags", tags);
    form.append("location", location);

    try {
      setLoading(true);
      await API.post("/post", form);
      alert("Post uploaded!");
      navigate("/home");
    } catch (err) {
      alert(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="max-w-md mx-auto mt-6 bg-white rounded-2xl shadow border overflow-hidden">

  {/* Header */}
  <div className="text-center font-semibold py-3 border-b">
    Create New Post
  </div>

  <div className="p-4 space-y-4">

    {/* Preview */}
    {files.length > 0 && (
      <div className="grid grid-cols-3 gap-2">
        {files.map((file, i) => (
          <div key={i} className="relative group rounded overflow-hidden">
            {file.type.includes("video") ? (
              <video
                src={URL.createObjectURL(file)}
                className="h-28 w-full object-cover"
                controls
              />
            ) : (
              <img
                src={URL.createObjectURL(file)}
                className="h-28 w-full object-cover"
              />
            )}
            <button
              onClick={() => setFiles(files.filter((_, index) => index !== i))}
              className="absolute top-1 right-1 bg-black/60 text-white text-xs px-2 py-1 rounded-full hidden group-hover:block"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    )}

    {/* Upload Box */}
    <label className="flex flex-col items-center justify-center gap-2 border border-dashed rounded-xl py-8 cursor-pointer hover:bg-gray-50 text-gray-500">
      <ImagePlus size={36} />
      <span className="text-sm">Select photos or videos</span>
      <input type="file" multiple hidden onChange={selectFiles} />
    </label>

    {/* Inputs */}
    <input
      placeholder="Write a caption..."
      className="w-full border rounded-lg px-3 py-2 focus:outline-none"
      value={caption}
      onChange={(e) => setCaption(e.target.value)}
    />

    <input
      placeholder="#tags"
      className="w-full border rounded-lg px-3 py-2 focus:outline-none"
      value={tags}
      onChange={(e) => setTags(e.target.value)}
    />

    <input
      placeholder="Location"
      className="w-full border rounded-lg px-3 py-2 focus:outline-none"
      value={location}
      onChange={(e) => setLocation(e.target.value)}
    />

    {/* Share Button */}
    <button
      onClick={uploadPost}
      disabled={loading}
      className="w-full py-2 rounded-full font-semibold text-white bg-gradient-to-r from-pink-500 to-purple-500 disabled:opacity-50"
    >
      {loading ? "Uploading..." : "Share"}
    </button>

  </div>
</div>
  )
}
