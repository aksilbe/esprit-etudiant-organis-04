
import React from 'react';

export const Logo: React.FC = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="relative inline-flex">
        <span className="text-4xl font-extrabold text-primary leading-none tracking-tighter">100</span>
        <svg
          className="absolute -top-2 -right-3 h-4 w-4 text-red-500"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <circle cx="10" cy="10" r="8" />
        </svg>
        <svg 
          className="absolute -top-1 -left-2 w-6 h-6 text-primary-foreground" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
        >
          <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z" />
          <path d="M15 9L9 15" />
          <path d="M9 9L15 15" />
        </svg>
      </div>
    </div>
  );
};
