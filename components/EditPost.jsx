"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

// React Quill φορτώνεται dynamic για Next.js
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

export default function EditPost({ post }) {
  const [title, setTitle] = useState(post?.title || "");
  const [excerpt, setExcerpt] = useState(post?.excerpt || "");
  const [content, setContent] = useState(post?.content || "");
  const [image, setImage] = useState(post?.image || "");

  // Toolbar options (σαν Word)
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ align: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ color: [] }, { background: [] }],
      ["link", "image", "video"],
      ["clean"],
    ],
  };

  const handleSubmit = async () => {
    // Εδώ κάνεις το POST/PATCH στο API σου
    const res = await fetch("/api/posts/" + post.id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, excerpt, content, image }),
    });

    if (res.ok) {
      alert("✅ Άρθρο αποθηκεύτηκε!");
    } else {
      alert("❌ Κάτι πήγε στραβά");
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">✍️ Edit Article</h1>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="w-full p-2 border rounded"
      />

      <input
        type="text"
        value={excerpt}
        onChange={(e) => setExcerpt(e.target.value)}
        placeholder="Short description..."
        className="w-full p-2 border rounded"
      />

      {/* Image Upload + Preview */}
      <div className="space-y-2">
        <input
          type="text"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="Paste image URL"
          className="w-full p-2 border rounded"
        />
        {image && (
          <div className="relative">
            <img src={image} alt="Preview" className="max-h-60 rounded" />
            <button
              onClick={() => setImage("")}
              className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded"
            >
              ❌ Remove
            </button>
          </div>
        )}
      </div>

      {/* Word-like Editor */}
      <ReactQuill
        value={content}
        onChange={setContent}
        modules={modules}
        theme="snow"
        placeholder="Write your article..."
      />

      {/* Live Preview */}
      <div className="mt-6 p-4 border rounded bg-gray-50">
        <h2 className="font-semibold text-lg">👀 Preview:</h2>
        <h3 className="text-xl">{title}</h3>
        <p className="text-gray-600">{excerpt}</p>
        <div dangerouslySetInnerHTML={{ __html: content }} />
        {image && <img src={image} alt="Preview" className="mt-4 max-h-60" />}
      </div>

      <button
        onClick={handleSubmit}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        💾 Save Changes
      </button>
    </div>
  );
}
