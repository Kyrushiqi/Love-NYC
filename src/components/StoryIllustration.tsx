import React from 'react';
import { StoryCategory } from '../types';

interface StoryIllustrationProps {
  category: StoryCategory;
  className?: string;
}

export const StoryIllustration: React.FC<StoryIllustrationProps> = ({
  category,
  className = '',
}) => {
  switch (category) {
    case 'gather':
      return (
        <svg
          viewBox="0 0 320 320"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`w-full max-w-[280px] sm:max-w-[340px] h-auto select-none ${className}`}
        >
          {/* Radiating Spark Rays above head */}
          <g stroke="#18181b" strokeWidth="3" strokeLinecap="round" strokeDasharray="1 7" strokeDashoffset="0">
            <line x1="160" y1="40" x2="160" y2="75" strokeWidth="3.5" />
            <line x1="135" y1="50" x2="145" y2="80" strokeWidth="3.5" />
            <line x1="185" y1="50" x2="175" y2="80" strokeWidth="3.5" />
            <line x1="115" y1="65" x2="130" y2="90" strokeWidth="3.5" />
            <line x1="205" y1="65" x2="190" y2="90" strokeWidth="3.5" />
            <line x1="98" y1="88" x2="120" y2="105" strokeWidth="3.5" />
            <line x1="222" y1="88" x2="200" y2="105" strokeWidth="3.5" />
          </g>

          {/* Dancing Sparkles Dots */}
          <circle cx="160" cy="30" r="3.5" fill="#18181b" />
          <circle cx="120" cy="42" r="3" fill="#18181b" />
          <circle cx="200" cy="42" r="3" fill="#18181b" />
          <circle cx="95" cy="62" r="2.5" fill="#18181b" />
          <circle cx="225" cy="62" r="2.5" fill="#18181b" />

          {/* Middle Dancing Person (Arms Up!) */}
          {/* Head */}
          <circle
            cx="160"
            cy="110"
            r="16"
            fill="#18181b"
          />
          {/* Arms up in joy */}
          <path
            d="M130 145 C115 110, 125 75, 142 62"
            stroke="#18181b"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray="2 6"
          />
          <path
            d="M190 145 C205 110, 195 75, 178 62"
            stroke="#18181b"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray="2 6"
          />
          {/* Body */}
          <path
            d="M142 135 C142 165, 140 185, 145 205 C150 215, 170 215, 175 205 C180 185, 178 165, 178 135"
            stroke="#18181b"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeDasharray="2 5"
          />
          {/* Legs */}
          <path
            d="M148 205 C145 230, 142 255, 140 275 C140 282, 148 285, 154 280 C158 260, 160 235, 160 215"
            stroke="#18181b"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeDasharray="2 5"
          />
          <path
            d="M172 205 C175 230, 178 255, 180 275 C180 282, 172 285, 166 280 C162 260, 160 235, 160 215"
            stroke="#18181b"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeDasharray="2 5"
          />

          {/* Left Person (Hugging in) */}
          {/* Head */}
          <circle
            cx="108"
            cy="150"
            r="15"
            fill="#18181b"
          />
          {/* Arm hugging middle */}
          <path
            d="M92 180 C80 170, 95 145, 115 155 C135 165, 165 175, 175 165"
            stroke="#18181b"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeDasharray="2 5"
          />
          {/* Body */}
          <path
            d="M96 175 C90 200, 92 225, 100 240 C110 245, 120 245, 125 230 C130 210, 125 185, 120 175"
            stroke="#18181b"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeDasharray="2 5"
          />
          {/* Legs */}
          <path
            d="M98 238 C94 255, 88 275, 85 288 C85 294, 94 296, 98 290 C104 275, 108 255, 110 240"
            stroke="#18181b"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeDasharray="2 5"
          />
          <path
            d="M115 238 C118 255, 122 275, 125 288 C125 294, 116 296, 112 290 C108 275, 106 255, 105 240"
            stroke="#18181b"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeDasharray="2 5"
          />

          {/* Right Person (Hugging in) */}
          {/* Head */}
          <circle
            cx="212"
            cy="150"
            r="15"
            fill="#18181b"
          />
          {/* Arm hugging middle */}
          <path
            d="M228 180 C240 170, 225 145, 205 155 C185 165, 155 175, 145 165"
            stroke="#18181b"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeDasharray="2 5"
          />
          {/* Body */}
          <path
            d="M224 175 C230 200, 228 225, 220 240 C210 245, 200 245, 195 230 C190 210, 195 185, 200 175"
            stroke="#18181b"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeDasharray="2 5"
          />
          {/* Legs */}
          <path
            d="M222 238 C226 255, 232 275, 235 288 C235 294, 226 296, 222 290 C216 275, 212 255, 210 240"
            stroke="#18181b"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeDasharray="2 5"
          />
          <path
            d="M205 238 C202 255, 198 275, 195 288 C195 294, 204 296, 208 290 C212 275, 214 255, 215 240"
            stroke="#18181b"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeDasharray="2 5"
          />
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
          {/* Warm Sparkles */}
          <g stroke="#18181b" strokeWidth="3" strokeLinecap="round" strokeDasharray="1 6">
            <line x1="160" y1="50" x2="160" y2="75" />
            <line x1="120" y1="70" x2="135" y2="85" />
            <line x1="200" y1="70" x2="185" y2="85" />
          </g>
          {/* Little Rescued Bird / Urban Friend */}
          <circle cx="160" cy="115" r="14" fill="#18181b" />
          {/* Beak */}
          <polygon points="172,112 184,115 172,118" fill="#18181b" />
          {/* Body */}
          <path
            d="M150 125 C130 140, 135 175, 160 178 C185 178, 190 140, 170 125"
            stroke="#18181b"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeDasharray="2 5"
          />
          {/* Little Wings fluttering */}
          <path
            d="M135 145 C115 130, 110 155, 132 162"
            stroke="#18181b"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="2 5"
          />
          <path
            d="M185 145 C205 130, 210 155, 188 162"
            stroke="#18181b"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="2 5"
          />

          {/* Two Gentle Human Hands Cupping & Protecting */}
          <path
            d="M95 235 C105 210, 135 195, 155 205 C160 208, 160 215, 152 220 C135 228, 120 245, 115 270"
            stroke="#18181b"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray="2 6"
          />
          <path
            d="M225 235 C215 210, 185 195, 165 205 C160 208, 160 215, 168 220 C185 228, 200 245, 205 270"
            stroke="#18181b"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray="2 6"
          />
          {/* Plant / Leaf of NYC Nature */}
          <path
            d="M160 240 C160 260, 160 280, 160 295"
            stroke="#18181b"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M160 265 C175 255, 185 265, 160 275"
            stroke="#18181b"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray="2 5"
          />
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
          {/* NYC Cinema Clapperboard / Camera */}
          <g stroke="#18181b" strokeWidth="3" strokeLinecap="round" strokeDasharray="1 6">
            <line x1="60" y1="70" x2="80" y2="90" />
            <line x1="260" y1="70" x2="240" y2="90" />
            <line x1="160" y1="40" x2="160" y2="60" />
          </g>
          {/* Stars */}
          <circle cx="75" cy="55" r="3" fill="#18181b" />
          <circle cx="245" cy="55" r="3" fill="#18181b" />
          <circle cx="160" cy="30" r="3.5" fill="#18181b" />

          {/* Clapper Top Angle */}
          <path
            d="M80 120 L230 75 L240 100 L90 145 Z"
            stroke="#18181b"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeDasharray="2 5"
          />
          {/* Stripes */}
          <line x1="120" y1="108" x2="135" y2="132" stroke="#18181b" strokeWidth="4" />
          <line x1="165" y1="94" x2="180" y2="118" stroke="#18181b" strokeWidth="4" />
          <line x1="210" y1="80" x2="225" y2="104" stroke="#18181b" strokeWidth="4" />

          {/* Board Body */}
          <rect
            x="80"
            y="145"
            width="160"
            height="115"
            rx="12"
            stroke="#18181b"
            strokeWidth="5"
            strokeDasharray="2 6"
          />
          {/* Play Icon / Camera Lens in center */}
          <polygon
            points="145,180 185,202 145,225"
            stroke="#18181b"
            strokeWidth="4"
            fill="#18181b"
          />
          {/* NYC Text on Clapper */}
          <circle cx="105" cy="170" r="3" fill="#18181b" />
          <circle cx="115" cy="170" r="3" fill="#18181b" />
          <circle cx="125" cy="170" r="3" fill="#18181b" />
        </svg>
      );

    case 'fix':
    default:
      return (
        <svg
          viewBox="0 0 320 320"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`w-full max-w-[280px] sm:max-w-[340px] h-auto select-none ${className}`}
        >
          {/* Spark Rays of Fixed Streetlight */}
          <g stroke="#18181b" strokeWidth="3.5" strokeLinecap="round" strokeDasharray="1 6">
            <line x1="160" y1="45" x2="160" y2="70" />
            <line x1="110" y1="65" x2="130" y2="85" />
            <line x1="210" y1="65" x2="190" y2="85" />
            <line x1="85" y1="115" x2="110" y2="125" />
            <line x1="235" y1="115" x2="210" y2="125" />
          </g>

          {/* Glowing Lightbulb Head */}
          <circle cx="160" cy="125" r="42" stroke="#18181b" strokeWidth="5" strokeDasharray="2 6" />
          <circle cx="160" cy="125" r="14" fill="#18181b" />

          {/* Filament */}
          <path
            d="M148 145 L148 125 L160 115 L172 125 L172 145"
            stroke="#18181b"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Base of Bulb / Streetlight post */}
          <path
            d="M140 167 L180 167 L175 195 L145 195 Z"
            stroke="#18181b"
            strokeWidth="4.5"
            strokeDasharray="2 5"
          />
          <path
            d="M152 195 L152 280 C152 288, 168 288, 168 280 L168 195"
            stroke="#18181b"
            strokeWidth="4.5"
            strokeDasharray="2 5"
          />
          <line x1="125" y1="285" x2="195" y2="285" stroke="#18181b" strokeWidth="5" strokeLinecap="round" />
        </svg>
      );
  }
};
