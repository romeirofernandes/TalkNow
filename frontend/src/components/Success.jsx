import React from "react";

function Success({ username, handleSignOut, navigate, setIsHovering }) {
  return (
    <div className="bg-black/60 backdrop-blur-md border border-gray-800 p-8 rounded-xl shadow-2xl text-center">
      <div className="mb-6">
        <h2
          className="text-2xl font-bold text-white tracking-tight"
          style={{
            fontFamily: "Bricolage Grotesque, system-ui, sans-serif",
          }}
        >
          Welcome, {username || "User"}!
        </h2>
        <p
          className="text-gray-300 mt-2"
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontWeight: 300,
            lineHeight: 1.5,
          }}
        >
          You're successfully signed in to TalkNow
        </p>
      </div>

      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={() => navigate("/dashboard")}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          className="bg-gradient-to-r from-indigo-500/90 to-violet-500/90 
          hover:from-indigo-600/90 hover:to-violet-600/90 text-white px-4 py-2 
          rounded-lg text-sm font-medium transition-all duration-300 transform cursor-pointer"
        >
          Go to Dashboard
        </button>

        <button
          onClick={handleSignOut}
          className="bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 
          px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default Success;
