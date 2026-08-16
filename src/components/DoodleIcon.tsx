import React from 'react';
import { StoryCategory } from '../types';

interface DoodleIconProps {
  category: StoryCategory;
  className?: string;
  size?: number;
}

export const DoodleIcon: React.FC<DoodleIconProps> = ({ category, className = '', size = 24 }) => {
  switch (category) {
    case 'fix':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          {/* Hand-drawn style lightbulb with spark lines */}
          <path d="M9 18h6" />
          <path d="M10 22h4" />
          <path d="M12 2a7 7 0 0 0-7 7c0 2.6 1.4 4.5 2.5 5.8.5.6.8 1.4.8 2.2h7.4c0-.8.3-1.6.8-2.2C17.6 13.5 19 11.6 19 9a7 7 0 0 0-7-7z" />
          <path d="M12 6v3" />
          <path d="M21 4l-1.5 1.5" />
          <path d="M3 4l1.5 1.5" />
        </svg>
      );

    case 'gather':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          {/* Hand-drawn music notes / gathering celebration */}
          <path d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" fill="currentColor" fillOpacity="0.2" />
          <circle cx="18" cy="16" r="3" fill="currentColor" fillOpacity="0.2" />
          <path d="M4 8c1-1 3-1 4 0" />
          <path d="M2 12c2-1.5 4-1.5 6 0" />
        </svg>
      );

    case 'create':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          {/* Hand-drawn film clapperboard */}
          <rect x="2" y="7" width="20" height="14" rx="2" fill="currentColor" fillOpacity="0.1" />
          <path d="M2 7l4-4h14l2 4" />
          <path d="M7 3l3 4" />
          <path d="M13 3l3 4" />
          <path d="M9 14l6 3-6 3V14z" fill="currentColor" />
        </svg>
      );

    case 'care':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          {/* Hand-drawn bird / wild friend */}
          <path d="M16 7a4 4 0 0 1 4 4c0 4-3 9-8 9s-9-4-9-8a5 5 0 0 1 8-4c1.5-2 4-3 5-1z" />
          <circle cx="16" cy="10" r="1" fill="currentColor" />
          <path d="M19 10l3 1-3 2" />
          <path d="M6 14c2 0 4-1 6-3" />
        </svg>
      );

    case 'grow':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          {/* Hand-drawn seedling sprout */}
          <path d="M7 20h10" />
          <path d="M12 20v-8" />
          <path d="M12 12c-2.5-4-7-4-7-1 0 3.5 4.5 3.5 7 1z" />
          <path d="M12 12c2.5-4 7-4 7-1 0 3.5-4.5 3.5-7 1z" />
        </svg>
      );

    default:
      return null;
  }
};
