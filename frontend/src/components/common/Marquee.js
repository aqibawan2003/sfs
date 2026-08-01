import React from "react";

const Marquee = ({ text, className = "" }) => {
  return (
    <div
      className={`w-full text-white overflow-hidden whitespace-nowrap py-2 border-b border-[rgba(38,85,139,1)] ${className}`}
      style={{
        background:
          "linear-gradient(to bottom, rgba(206,219,233,1) 0%, rgba(170,197,222,1) 17%, rgba(97,153,199,1) 50%, rgba(58,132,195,1) 51%, rgba(65,154,214,1) 59%, rgba(75,184,240,1) 71%, rgba(38,85,139,1) 100%)",
      }}
    >
      <div className="flex animate-marquee hover:[animation-play-state:paused] w-max">
        <span className="mx-8 text-sm sm:text-base font-semibold">{text}</span>
        <span className="mx-8 text-sm sm:text-base font-semibold">{text}</span>
      </div>
    </div>
  );
};

export default Marquee;
