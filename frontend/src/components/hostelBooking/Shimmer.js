// Shimmer.js
import React from 'react';

const Shimmer = ({ width, height }) => {
  return (
    <div
      className={`animate-pulse bg-gray-700`}
      style={{ width, height }}
    ></div>
  );
};

export default Shimmer;
