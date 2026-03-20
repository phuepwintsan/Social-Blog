"use client"
import { useState } from "react"

export default function PostCard({ post, refreshPosts }) {

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const [title, setTitle] = useState(post.post_title)
  const [description, setDescription] = useState(post.post_description)

  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(post.post_image || null)

  const [loading, setLoading] = useState(false)


  // IMAGE CHANGE
  const handleImageChange = (e) => {

    const file = e.target.files[0]

    if (!file) return

    setImage(file)
    setPreview(URL.createObjectURL(file))
  }


  // REMOVE IMAGE
  const removeImage = () => {

    setImage(null)
    setPreview(null)

  }


  // UPDATE POST
  const updatePost = async () => {

  if (!selectedPost) return;

  setLoading(true);

  const formData = new FormData();

  formData.append("post_title", title);
  formData.append("post_description", description);

  if (image) {
    formData.append("post_image", image);
  }

  const res = await fetch(
    `https://phuepwintsan.pythonanywhere.com/api/posts/${selectedPost.id}/`,
    {
      method: "PUT",
      body: formData
    }
  );

  setLoading(false);
  setShowModal(false);

  if (res.ok) {
    await refreshPosts();
  }
};


  // DELETE POST
  const deletePost = async () => {

  if (!selectedPost) return;

  await fetch(
    `https://phuepwintsan.pythonanywhere.com/api/posts/${selectedPost.id}/`,
    {
      method: "DELETE"
    }
  );

  setShowDeleteModal(false);

  await refreshPosts();
};


  return (
    <>
      {/* BLOG CARD */}

      <div className="flex bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden mb-6">

        {post.post_image && (
          <div className="w-48 h-32">
            <img
              src={post.post_image}
              className="w-full h-full object-cover"
            />
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

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">

          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-8">

            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Edit Post
            </h2>

            {/* TITLE */}

            <div className="mb-4">

              <label className="block text-sm font-medium text-gray-600 mb-1">
                Post Title
              </label>

              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none text-gray-700"
              />

            </div>


            {/* DESCRIPTION */}

            <div className="mb-4">

              <label className="block text-sm font-medium text-gray-600 mb-1">
                Description
              </label>

              <textarea
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none text-gray-700"
              />

            </div>


            {/* IMAGE */}

            <div className="mb-6">

              <label className="block text-sm font-medium text-gray-600 mb-2">
                Upload Image
              </label>

              {preview ? (

                <div className="relative">

                  <img
                    src={preview}
                    className="w-full h-48 object-cover rounded-lg"
                  />

                  <button
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded"
                  >
                    Remove
                  </button>

                </div>

              ) : (

                <input
                  type="file"
                  onChange={handleImageChange}
                />

              )}

            </div>


            {/* BUTTONS */}

            <div className="flex justify-end gap-3">

              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={updatePost}
                disabled={loading}
                className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
              >

                {loading && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                )}

                {loading ? "Updating..." : "Update Post"}

              </button>

            </div>

          </div>

        </div>

      )}


      {/* DELETE MODAL */}

      {showDeleteModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">

            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Delete Post
            </h2>

            <p className="text-gray-600 text-sm mb-6">
              Are you sure you want to delete this post?
            </p>

            <div className="flex justify-end gap-3">

              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={deletePost}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>

            </div>

          </div>

        </div>

      )}

    </>
  )
}