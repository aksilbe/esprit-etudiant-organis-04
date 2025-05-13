
import React from 'react';

export const Logo: React.FC = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="relative">
        <span className="text-5xl font-extrabold text-red-500 leading-none">100</span>
        <div className="absolute bottom-0 left-0 right-0 flex flex-col gap-1">
          <div className="h-[3px] bg-red-500 rounded-full"></div>
          <div className="h-[3px] bg-red-500 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};
