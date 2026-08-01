import React from "react";

const Marquee = ({ text, className = "" }) => {
  return (
    <div className={`w-full bg-yellow-400 text-[#1E201E] overflow-hidden whitespace-nowrap py-2 border-b border-yellow-500 ${className}`}>
      <div className="flex animate-marquee hover:[animation-play-state:paused] w-max">
        <span className="mx-8 text-sm sm:text-base font-semibold">{text}</span>
        <span className="mx-8 text-sm sm:text-base font-semibold">{text}</span>
      </div>
    </div>
  );
};

export default Marquee;
