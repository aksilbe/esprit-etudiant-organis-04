
import React from 'react';

export const Logo: React.FC = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="relative inline-block">
        <div className="relative z-10">
          <span className="text-5xl font-extrabold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent leading-none tracking-tighter">100</span>
        </div>
        <div className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500 border-2 border-white shadow-md" />
        <svg 
          className="absolute -top-1.5 -left-3 w-6 h-6 text-accent" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="3"
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M9 12l2 2 4-4" />
        </svg>
      </div>
    </div>
  );
};
