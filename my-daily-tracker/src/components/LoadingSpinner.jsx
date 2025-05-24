// src/components/LoadingSpinner.jsx
import React from 'react';

const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 my-4 bg-white rounded-xl shadow-md">
      <div className="text-3xl mb-2 animate-bounce">🧸</div>
      <p className="text-lg text-gray-600">{message}</p>
    </div>
  );
};

export default LoadingSpinner;