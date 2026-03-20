"use client";
import { useState } from "react";

const API_URL = "https://phuepwintsan.pythonanywhere.com";

export default function PostCard({ post, refreshPosts }) {

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    title: post.post_title,
    description: post.post_description,
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(post.post_image || null);
  const [loading, setLoading] = useState(false);

  // -----------------------
  // HANDLERS
  // -----------------------

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

  // -----------------------
  // API ACTIONS
  // -----------------------

  const updatePost = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("post_title", form.title);
      formData.append("post_description", form.description);
      if (image) formData.append("post_image", image);

      const res = await fetch(`${API_URL}/api/posts/${post.id}/`, {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) throw new Error("Update failed");

      await refreshPosts();
      setShowModal(false);

    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async () => {
    try {
      const res = await fetch(`${API_URL}/api/posts/${post.id}/`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Delete failed");

      await refreshPosts();
      setShowDeleteModal(false);

    } catch (err) {
      console.error(err.message);
    }
  };

  // -----------------------
  // UI
  // -----------------------

  return (
    <>
      {/* CARD */}
      <div className="group flex bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden mb-6 border border-gray-100">

        {post.post_image && (
          <div className="w-48 h-32 overflow-hidden">
            <img
              src={post.post_image}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            />
          </div>
        )}

        <div className="p-5 flex-1 flex flex-col justify-between">

          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-1">
              {post.post_title}
            </h2>

            <p className="text-gray-800 text-sm line-clamp-2">
              {post.post_description}
            </p>
          </div>

          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setShowModal(true)}
              className="px-3 py-1.5 rounded-lg bg-blue-600 text-gray-500 text-sm hover:bg-blue-700"
            >
               Edit
            </button>

            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-3 py-1.5 rounded-lg bg-red-500 text-gray-500 text-sm hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* EDIT MODAL */}
      {showModal && (
        <Modal>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
           Edit Post
          </h2>

          <Input
            name="title"
            value={form.title}
            onChange={handleChange}
          />

          <Textarea
            name="description"
            value={form.description}
            onChange={handleChange}
          />

          <ImageUpload
            preview={preview}
            onChange={handleImageChange}
            onRemove={removeImage}
          />

          <div className="flex justify-end gap-3 mt-6">
            <Button onClick={() => setShowModal(false)}>Cancel</Button>

            <Button primary onClick={updatePost} disabled={loading}>
              {loading ? "Updating..." : "Update"}
            </Button>
          </div>
        </Modal>
      )}

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <Modal small>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
           Delete Post
          </h2>

          <p className="text-gray-500 mb-6">
            This action cannot be undone.
          </p>

          <div className="flex justify-end gap-3">
            <Button onClick={() => setShowDeleteModal(false)}>Cancel</Button>

            <Button danger onClick={deletePost}>
              Delete
            </Button>
          </div>
        </Modal>
      )}

    </>
  );
}

// -----------------------
// REUSABLE COMPONENTS
// -----------------------

function Modal({ children, small }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md">
      <div className={`bg-white w-full ${small ? "max-w-md" : "max-w-2xl"} rounded-2xl shadow-xl p-6`}>
        {children}
      </div>
    </div>
  );
}

function Input(props) {
  return (
    <input
      {...props}
      className="w-full mb-4 border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
    />
  );
}

function Textarea(props) {
  return (
    <textarea
      rows="4"
      {...props}
      className="w-full mb-4 border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 text-gray-500 focus:ring-blue-500 outline-none"
    />
  );
}

function ImageUpload({ preview, onChange, onRemove }) {
  return preview ? (
    <div className="relative mb-4">
      <img src={preview} className="w-full h-48 object-cover rounded-xl" />
      <button
        onClick={onRemove}
        className="absolute top-2 right-2 bg-red-500 text-gray-500 px-3 py-1 rounded-lg text-xs"
      >
        Remove
      </button>
    </div>
  ) : (
    <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 text-gray-500 rounded-xl cursor-pointer hover:border-blue-500">
      <span className="text-gray-500 text-sm">Upload Image</span>
      <input type="file" onChange={onChange} className="hidden" />
    </label>
  );
}

function Button({ children, primary, danger, ...props }) {
  let base = "px-4 py-2 rounded-lg";

  if (primary) base += " bg-blue-600 text-white";
  else if (danger) base += " bg-red-600 text-white";
  else base += " border text-gray-600";

  return (
    <button {...props} className={base}>
      {children}
    </button>
  );
}