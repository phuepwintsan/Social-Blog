"use client";

import { useState } from "react";

const API_URL = "https://api.phuepwintsan.com";

export default function CreatePost({ refreshPosts, closeModal }) {

  const [form, setForm] = useState({
    title: "",
    description: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // ----------------------
  // HANDLERS
  // ----------------------

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImage(null);
    setPreview(null);
  };

  const resetForm = () => {
    setForm({ title: "", description: "" });
    setImage(null);
    setPreview(null);
  };

  // ----------------------
  // SUBMIT
  // ----------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("post_title", form.title);
      formData.append("post_description", form.description);

      if (image) formData.append("post_image", image);

      const res = await fetch(`${API_URL}/api/posts/`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Create failed");

      await refreshPosts();
      resetForm();
      closeModal();

    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ----------------------
  // UI
  // ----------------------

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-gray-100 p-8 rounded-2xl shadow-lg space-y-6"
    >

      {/* TITLE */}
      <InputField
        label="Post Title"
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Enter blog title..."
      />

      {/* DESCRIPTION */}
      <TextAreaField
        label="Description"
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Write your blog description..."
      />

      {/* IMAGE */}
      <ImageUpload
        preview={preview}
        onChange={handleImageChange}
        onRemove={removeImage}
      />

      {/* BUTTON */}
      <SubmitButton loading={loading} />

    </form>
  );
}

// ----------------------
// SMALL COMPONENTS
// ----------------------

function InputField({ label, ...props }) {
  return (
    <div>
      <label className="text-sm text-gray-600 block mb-1">{label}</label>
      <input
        {...props}
        className="w-full border border-gray-300 text-gray-800 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
      />
    </div>
  );
}

function TextAreaField({ label, ...props }) {
  return (
    <div>
      <label className="text-sm text-gray-600 block mb-1">{label}</label>
      <textarea
        rows="4"
        {...props}
        className="w-full border border-gray-300 rounded-xl text-gray-800 px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
      />
    </div>
  );
}

function ImageUpload({ preview, onChange, onRemove }) {
  return (
    <div>
      <label className="text-sm text-gray-600 block mb-2">
        Upload Image
      </label>

      {preview ? (
        <div className="relative">
          <img
            src={preview}
            className="w-full h-48 object-cover rounded-xl border"
          />
          <button
            type="button"
            onClick={onRemove}
            className="absolute top-2 right-2 bg-red-500 text-white text-xs px-3 py-1 rounded-lg"
          >
            Remove
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-gray-50 transition">
          <span className="text-gray-800 text-sm">Click to upload</span>
          <input type="file" onChange={onChange} className="hidden" />
        </label>
      )}
    </div>
  );
}

function SubmitButton({ loading }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2"
    >
      {loading && (
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      )}
      {loading ? "Creating..." : "Create Post"}
    </button>
  );
}