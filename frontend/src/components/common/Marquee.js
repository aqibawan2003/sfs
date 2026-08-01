import React from "react";

const Marquee = ({ text, className = "" }) => {
  return (
    <div className={`w-full bg-[rgb(208,110,101)] text-white overflow-hidden whitespace-nowrap py-2 border-b border-[rgb(170,85,78)] ${className}`}>
      <div className="flex animate-marquee hover:[animation-play-state:paused] w-max">
        <span className="mx-8 text-sm sm:text-base font-semibold">{text}</span>
        <span className="mx-8 text-sm sm:text-base font-semibold">{text}</span>
      </div>
    </div>
  );
};

export default Marquee;
