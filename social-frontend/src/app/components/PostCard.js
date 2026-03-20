"use client";
import { useState } from "react";

export default function PostCard({ post, refreshPosts }) {

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [title, setTitle] = useState(post.post_title);
  const [description, setDescription] = useState(post.post_description);

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(post.post_image || null);

  const [loading, setLoading] = useState(false);

  const API_URL = "https://phuepwintsan.pythonanywhere.com";

  // IMAGE CHANGE
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // REMOVE IMAGE
  const removeImage = () => {
    setImage(null);
    setPreview(null);
  };

  // UPDATE POST
  const updatePost = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("post_title", title);
      formData.append("post_description", description);

      if (image) {
        formData.append("post_image", image);
      }

      const res = await fetch(`${API_URL}/api/posts/${post.id}/`, {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) {
        console.error("Update failed");
      }

      setShowModal(false);
      await refreshPosts();

    } catch (error) {
      console.error("Update error:", error);
    } finally {
      setLoading(false);
    }
  };

  // DELETE POST
  const deletePost = async () => {
    try {
      const res = await fetch(`${API_URL}/api/posts/${post.id}/`, {
        method: "DELETE",
      });

      if (!res.ok) {
        console.error("Delete failed");
      }

      setShowDeleteModal(false);
      await refreshPosts();

    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return (
    <>
      {/* BLOG CARD */}
      <div className="flex bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden mb-6">

        {post.post_image && (
          <div className="w-48 h-32">
            <img src={post.post_image} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="p-4 flex-1">

          <h2 className="text-lg font-semibold text-gray-700">
            {post.post_title}
          </h2>

          <p className="text-gray-600 text-sm line-clamp-2">
            {post.post_description}
          </p>

          <div className="flex gap-2 mt-3">

            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
            >
              Edit
            </button>

            <button
              onClick={() => setShowDeleteModal(true)}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
            >
              Delete
            </button>

          </div>
        </div>
      </div>

      {/* EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">

          <div className="bg-white rounded-xl w-full max-w-2xl p-6">

            <h2 className="text-xl font-semibold mb-4">Edit Post</h2>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border p-2 mb-3 rounded"
            />

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border p-2 mb-3 rounded"
            />

            {preview ? (
              <div className="relative mb-3">
                <img src={preview} className="w-full h-40 object-cover rounded" />
                <button
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs rounded"
                >
                  Remove
                </button>
              </div>
            ) : (
              <input type="file" onChange={handleImageChange} />
            )}

            <div className="flex justify-end gap-3 mt-4">

              <button onClick={() => setShowModal(false)}>
                Cancel
              </button>

              <button
                onClick={updatePost}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                {loading ? "Updating..." : "Update"}
              </button>

            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">

          <div className="bg-white p-6 rounded-lg">

            <p className="mb-4">Delete this post?</p>

            <div className="flex gap-3 justify-end">

              <button onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>

              <button
                onClick={deletePost}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Delete
              </button>

            </div>
          </div>
        </div>
      )}

    </>
  );
}