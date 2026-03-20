"use client"
import Link from "next/link"
import { useEffect, useState } from "react"
import CreatePost from "@/app/components/CreatePosts"
import PostCard from "@/app/components/PostCard"

export default function BlogPage() {

  const [posts, setPosts] = useState([])
  const [showCreateModal, setShowCreateModal] = useState(false)

 const fetchPosts = async () => {
  try {
    const res = await fetch(
      "https://phuepwintsan.pythonanywhere.com/api/posts/",
      {
        cache: "no-store"
      }
    );

    const data = await res.json();
    setPosts(data);

  } catch (error) {
    console.error("Fetch error:", error);
  }
};


  useEffect(() => {
    fetchPosts()
  }, [])


  return (
<div className="min-h-screen bg-gray-100">

      {/* NAVBAR */}

      <div className="sticky top-0 z-40 bg-white border-b shadow-sm">

        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">

          <h1 className="text-2xl font-bold text-gray-800">
            Blog Lists
          </h1>

          <div className="flex gap-3">

            <Link href="/">
              <button className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 transition">
                Home
              </button>
            </Link>

            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition"
            >
              Create
            </button>

          </div>

        </div>

      </div>


      {/* PAGE CONTENT */}

      <div className="max-w-5xl mx-auto px-6 py-10">

        {posts.length === 0 ? (

          <p className="text-gray-500 text-center">
            No blog posts yet.
          </p>

        ) : (

          <div className="space-y-6">

            {posts.map((post) => (

              <PostCard
                key={post.id}
                post={post}
                refreshPosts={fetchPosts}
              />

            ))}

          </div>

        )}

      </div>


      {/* CREATE MODAL */}

      {showCreateModal && (

        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setShowCreateModal(false)}
        >

          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8"
            onClick={(e) => e.stopPropagation()}
          >

            {/* MODAL HEADER */}

            <div className="flex justify-between items-center mb-6 border-b pb-3">

              <h2 className="text-2xl font-semibold text-gray-800">
                Create Post
              </h2>

              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-700 text-xl"
              >
                ✕
              </button>

            </div>

            {/* FORM */}

            <CreatePost
              refreshPosts={fetchPosts}
              closeModal={() => setShowCreateModal(false)}
            />

          </div>

        </div>

      )}

    </div>

  )

}