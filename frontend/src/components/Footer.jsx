import React from "react";

function Footer() {
  return (
    <div
      className="absolute bottom-6 w-full text-center text-gray-500 text-xs"
      style={{ fontFamily: "Inter, system-ui, sans-serif" }}
    >
      © {new Date().getFullYear()} BigRom BigCompany. All rights reserved.
    </div>
  );
}

export default Footer;
