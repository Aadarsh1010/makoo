import React from 'react';

const MakooLogo = ({ className = "", color = "#1B2A5E", size = 52 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer circle */}
      <circle
        cx="50"
        cy="50"
        r="48"
        stroke={color}
        strokeWidth="2"
        fill="none"
      />
      {/* Inner circle subtle */}
      <circle
        cx="50"
        cy="50"
        r="42"
        stroke={color}
        strokeWidth="0.5"
        fill="none"
        opacity="0.3"
      />
      {/* Baker body - simple suited figure */}
      <g>
        {/* Head */}
        <circle cx="50" cy="32" r="8" fill={color} />
        {/* Hat */}
        <rect x="42" y="22" width="16" height="4" rx="1" fill={color} />
        <rect x="44" y="18" width="12" height="6" rx="2" fill={color} />
        {/* Body / suit jacket */}
        <rect x="38" y="40" width="24" height="20" rx="2" fill={color} />
        {/* Arms */}
        <rect x="30" y="42" width="8" height="14" rx="2" fill={color} transform="rotate(-15 34 49)" />
        <rect x="62" y="42" width="8" height="14" rx="2" fill={color} transform="rotate(15 66 49)" />
        {/* Legs */}
        <rect x="40" y="60" width="6" height="18" rx="1" fill={color} />
        <rect x="54" y="60" width="6" height="18" rx="1" fill={color} />
        {/* Bread tray */}
        <rect x="35" y="55" width="30" height="6" rx="1" fill={color} />
        {/* Bread loaves on tray */}
        <ellipse cx="42" cy="54" rx="4" ry="3" fill={color} />
        <ellipse cx="50" cy="54" rx="4" ry="3" fill={color} />
        <ellipse cx="58" cy="54" rx="4" ry="3" fill={color} />
        {/* Steam lines */}
        <path d="M40 50 Q38 46 42 44" stroke={color} strokeWidth="1.5" fill="none" opacity="0.6" />
        <path d="M50 50 Q48 45 52 43" stroke={color} strokeWidth="1.5" fill="none" opacity="0.6" />
        <path d="M60 50 Q58 46 62 44" stroke={color} strokeWidth="1.5" fill="none" opacity="0.6" />
      </g>
    </svg>
  );
};

export default MakooLogo;
