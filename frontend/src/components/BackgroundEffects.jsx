import React from "react";

const BackgroundEffects = ({ mousePosition, isHovering }) => {
  return (
    <>
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
    </>
  );
};

export default BackgroundEffects;
