import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";

function Landing() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen w-full bg-black overflow-hidden flex flex-col items-center justify-center"
    >
      <div className="absolute inset-0 bg-black">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(to right, #1f2937 1px, transparent 1px), linear-gradient(to bottom, #1f2937 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div
        className="absolute -z-10 h-full w-full"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.1), transparent 40%)`,
        }}
      />

      <div className="absolute top-20 -left-20 w-72 h-72 bg-blue-600 rounded-full filter blur-[200px] opacity-20" />
      <div className="absolute bottom-20 -right-20 w-72 h-72 bg-indigo-600 rounded-full filter blur-[200px] opacity-20" />

      <div className="absolute inset-0 bg-black/20 [mask-image:radial-gradient(transparent,white)] -z-10" />

      {isHovering && (
        <div
          className="absolute h-px w-px -z-10"
          style={{
            left: `${mousePosition.x}px`,
            top: `${mousePosition.y}px`,
            boxShadow: "0 0 80px 30px rgba(59, 130, 246, 0.2)",
          }}
        />
      )}

      <div className="max-w-5xl mx-auto text-center px-4 relative z-10">
        <h1
          className="text-4xl md:text-4xl lg:text-5xl font-bold mb-6 text-white tracking-tight"
          style={{ fontFamily: "Bricolage Grotesque, system-ui, sans-serif" }}
        >
          Real-Time Communication for Everyone
        </h1>

        <p
          className="text-md md:text-xl mb-8 text-gray-300 max-w-2xl mx-auto"
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontWeight: 300,
            lineHeight: 1.6,
          }}
        >
          Hop on a call with your friends, family, or colleagues within seconds.
          No need to install any software.
        </p>

        <button
          className="bg-gradient-to-r from-indigo-500/90 to-violet-500/90 hover:from-indigo-600/90 hover:to-violet-600/90 text-white px-6 py-3 rounded-lg text-base font-medium transition-all duration-300 transform hover:scale-105 shadow-md cursor-pointer"
          style={{ fontFamily: "Inter, system-ui, sans-serif" }}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onClick={() => navigate("/auth")}
        >
          Get Started Now
        </button>
      </div>

      <Footer />
    </div>
  );
}

export default Landing;
