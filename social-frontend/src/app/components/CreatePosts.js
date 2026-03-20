"use client"

import { useState } from "react"

// export default function CreatePost() {
export default function CreatePost({ refreshPosts, closeModal }) {

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [image, setImage] = useState(null)

 const handleSubmit = async (e) => {

  e.preventDefault()

  const formData = new FormData()

  formData.append("post_title", title)
  formData.append("post_description", description)

  if (image) {
    formData.append("post_image", image)
  }

  const res = await fetch("https://phuepwintsan.pythonanywhere.com/api/posts/", {
    method: "POST",
    body: formData
  })

  if (res.ok) {
    refreshPosts()
    closeModal()
  }

}

  return (

    <form
      onSubmit={handleSubmit}
      className="bg-white border border-gray-200 p-8 rounded-2xl shadow-md mb-8 space-y-5"
    >

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Post Title
        </label>

        <input
          type="text"
          placeholder="Enter blog title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Post Description
        </label>

        <textarea
          rows="4"
          placeholder="Write your blog description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Upload Image */}
      <div>

        <label className="block text-sm font-medium text-gray-700 mb-2">
          Blog Image
        </label>

        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-gray-50 transition">

          <span className="text-gray-500 text-sm">
            Click to upload image
          </span>

          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            className="hidden"
          />

        </label>

      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        Create Post
      </button>

    </form>

  )
}