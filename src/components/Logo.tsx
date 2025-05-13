
import React from 'react';

export const Logo: React.FC = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="relative">
        <span className="text-5xl font-extrabold bg-gradient-to-r from-red-500 via-red-600 to-red-500 bg-clip-text text-transparent leading-none drop-shadow-sm">100</span>
        <div className="absolute bottom-0 left-0 right-0 flex flex-col gap-1">
          <div className="h-[3px] bg-gradient-to-r from-red-400 to-red-600 rounded-full shadow-sm"></div>
          <div className="h-[3px] bg-gradient-to-r from-red-500 to-red-700 rounded-full shadow-sm"></div>
        </div>
        <div className="absolute -top-1 -right-1.5 h-3 w-3 bg-yellow-400 rounded-full animate-pulse opacity-90 shadow-sm shadow-yellow-300"></div>
      </div>
    </div>
  );
};
