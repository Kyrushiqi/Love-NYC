import React, { useState } from 'react';
import { StoryCategory } from '../types';

interface StoryIllustrationProps {
  category: StoryCategory | 'intro';
  className?: string;
}

const SVG_ASSET_MAP: Record<string, string> = {
  gather: '/gather.svg',
  grow: '/grow.svg',
  fix: '/fix.svg',
  care: '/care.svg',
  create: '/create.svg',
  intro: '/welcome.svg',
};

export const StoryIllustration: React.FC<StoryIllustrationProps> = ({
  category,
  className = '',
}) => {
  const [hasImgError, setHasImgError] = useState(false);
  const assetSrc = SVG_ASSET_MAP[category] || '/welcome.svg';

  if (!hasImgError && assetSrc) {
    return (
      <img
        src={assetSrc}
        alt={`${category} illustration`}
        onError={() => setHasImgError(true)}
        className={`w-full max-w-[280px] sm:max-w-[340px] h-auto select-none object-contain ${className}`}
        loading="eager"
      />
    );
  }

  // High-fidelity fallback vector SVGs if image fails to load
  switch (category) {
    case 'gather':
      return (
        <svg
          viewBox="0 0 320 320"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`w-full max-w-[280px] sm:max-w-[340px] h-auto select-none ${className}`}
        >
          <rect x="48" y="48" width="224" height="224" rx="4" stroke="#18181b" strokeWidth="3.5" fill="none" />
          <g stroke="#18181b" strokeWidth="3" strokeLinecap="round" strokeDasharray="1 6">
            <line x1="160" y1="62" x2="160" y2="86" strokeWidth="3.5" />
            <line x1="136" y1="68" x2="146" y2="90" strokeWidth="3.5" />
            <line x1="184" y1="68" x2="174" y2="90" strokeWidth="3.5" />
          </g>
          <circle cx="160" cy="56" r="3" fill="#18181b" />
          <circle cx="160" cy="115" r="14" fill="#18181b" />
          <path d="M136 142 C124 112, 130 86, 145 74" stroke="#18181b" strokeWidth="4.5" strokeLinecap="round" strokeDasharray="2 5" />
          <path d="M184 142 C196 112, 190 86, 175 74" stroke="#18181b" strokeWidth="4.5" strokeLinecap="round" strokeDasharray="2 5" />
          <path d="M146 136 C145 160, 144 180, 148 198 C152 206, 168 206, 172 198 C176 180, 175 160, 174 136" stroke="#18181b" strokeWidth="4.5" strokeLinecap="round" strokeDasharray="2 5" />
          <circle cx="114" cy="148" r="13" fill="#18181b" />
          <circle cx="206" cy="148" r="13" fill="#18181b" />
        </svg>
      );

    case 'grow':
      return (
        <svg
          viewBox="0 0 320 320"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`w-full max-w-[280px] sm:max-w-[340px] h-auto select-none ${className}`}
        >
          <path d="M160 145 C135 110, 95 105, 90 135 C85 165, 125 175, 160 162" stroke="#18181b" strokeWidth="5" strokeLinecap="round" strokeDasharray="2 6" />
          <path d="M160 145 C185 95, 230 100, 235 130 C240 160, 195 175, 160 162" stroke="#18181b" strokeWidth="5" strokeLinecap="round" strokeDasharray="2 6" />
          <path d="M160 155 C160 185, 155 210, 162 235" stroke="#18181b" strokeWidth="5.5" strokeLinecap="round" strokeDasharray="2 6" />
          <g fill="#18181b">
            <ellipse cx="160" cy="242" rx="14" ry="7" />
            <circle cx="140" cy="244" r="5.5" />
            <circle cx="180" cy="244" r="6" />
          </g>
        </svg>
      );

    case 'fix':
      return (
        <svg
          viewBox="0 0 320 320"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`w-full max-w-[280px] sm:max-w-[340px] h-auto select-none ${className}`}
        >
          <path d="M100 85 L104 102 L120 106 L104 110 L100 126 L96 110 L80 106 L96 102 Z" fill="#18181b" />
          <path d="M175 105 C165 95, 175 75, 195 72 C215 70, 235 85, 230 110 C226 125, 210 135, 195 130 L180 118 L192 102 L178 98 L168 112 Z" stroke="#18181b" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2 6" />
          <path d="M178 128 L118 208 C114 214, 110 222, 116 230 C122 236, 130 232, 136 226 L196 146 Z" stroke="#18181b" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2 6" />
          <circle cx="108" cy="234" r="16" stroke="#18181b" strokeWidth="5" strokeDasharray="2 5" />
        </svg>
      );

    case 'care':
      return (
        <svg
          viewBox="0 0 320 320"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`w-full max-w-[280px] sm:max-w-[340px] h-auto select-none ${className}`}
        >
          <path d="M160 178 C135 155, 105 130, 105 105 C105 85, 122 72, 142 72 C154 72, 160 80, 160 80 C160 80, 166 72, 178 72 C198 72, 215 85, 215 105 C215 130, 185 155, 160 178 Z" stroke="#18181b" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2 6" />
          <path d="M120 198 C135 190, 155 190, 175 195 C200 202, 230 185, 248 165 C252 160, 258 164, 254 172 C236 205, 200 228, 165 228 C135 228, 115 220, 106 226" stroke="#18181b" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2 6" />
        </svg>
      );

    case 'create':
      return (
        <svg
          viewBox="0 0 320 320"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`w-full max-w-[280px] sm:max-w-[340px] h-auto select-none ${className}`}
        >
          <path d="M212 98 L142 168 L166 192 L236 122 Z" stroke="#18181b" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2 6" />
          <polygon points="118,214 126,204 136,209" fill="#18181b" />
          <path d="M116 216 L94 200 L98 226 L76 238 L100 248 L94 274 L118 258 L138 274 L132 248 L156 238 L134 226 L138 200 Z" stroke="#18181b" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2 5" />
        </svg>
      );

    case 'intro':
    default:
      return (
        <svg
          viewBox="0 0 320 320"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`w-full max-w-[280px] sm:max-w-[340px] h-auto select-none ${className}`}
        >
          <path d="M160 270 C110 230, 55 185, 55 125 C55 80, 90 52, 130 52 C148 52, 160 62, 160 62 C160 62, 172 52, 190 52 C230 52, 265 80, 265 125 C265 185, 210 230, 160 270 Z" stroke="#18181b" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2 7" />
          <rect x="148" y="105" width="24" height="110" stroke="#18181b" strokeWidth="3.5" />
          <rect x="120" y="130" width="22" height="85" stroke="#18181b" strokeWidth="3.5" />
          <rect x="178" y="140" width="22" height="75" stroke="#18181b" strokeWidth="3.5" />
        </svg>
      );
  }
};
