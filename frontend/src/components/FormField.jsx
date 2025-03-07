import React from "react";

const FormField = ({ id, label, type, placeholder, value, onChange }) => {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-300 mb-1"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2 bg-gray-900/70 border border-gray-700 rounded-lg 
        focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 text-white"
      />
    </div>
  );
};

export default FormField;
