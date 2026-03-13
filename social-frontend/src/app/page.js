import Link from "next/link"

export default function Home() {

  return (

    <div
      className="min-h-screen bg-cover bg-center flex flex-col items-center px-4"
      style={{
        backgroundImage: "url('/Herobanner.png')"
      }}
    >

      {/* Overlay */}
      {/* <div className="absolute inset-0 bg-black/40"></div> */}

      {/* HERO SECTION */}
      <div className="relative text-center mt-32 mb-14 text-white">

        <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
          Social Blog
        </h1>

        <p className="text-lg max-w-xl mx-auto mb-8">
          Share your ideas, stories, and experiences with the world.
          Explore inspiring blogs created by other people.
        </p>

        <Link
          href="/posts"
          className="inline-block bg-blue-600 px-8 py-3 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
        >
          View Posts
        </Link>

      </div>

    </div>

  )

}