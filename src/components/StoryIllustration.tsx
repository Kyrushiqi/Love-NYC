import React from 'react';
import { StoryCategory } from '../types';

interface StoryIllustrationProps {
  category: StoryCategory | 'intro';
  className?: string;
}

export const StoryIllustration: React.FC<StoryIllustrationProps> = ({
  category,
  className = '',
}) => {
  switch (category) {
    case 'gather':
      return (
        /* iPhone 16 - 5: Gathering - 3 Dancing Friends in a square frame with spark rays */
        <svg
          viewBox="0 0 320 320"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`w-full max-w-[280px] sm:max-w-[340px] h-auto select-none ${className}`}
        >
          {/* Framed Square Box */}
          <rect
            x="48"
            y="48"
            width="224"
            height="224"
            rx="4"
            stroke="#18181b"
            strokeWidth="3.5"
            fill="none"
          />

          {/* Radiating Spark Rays above center dancer */}
          <g stroke="#18181b" strokeWidth="3" strokeLinecap="round" strokeDasharray="1 6">
            <line x1="160" y1="62" x2="160" y2="86" strokeWidth="3.5" />
            <line x1="136" y1="68" x2="146" y2="90" strokeWidth="3.5" />
            <line x1="184" y1="68" x2="174" y2="90" strokeWidth="3.5" />
            <line x1="116" y1="80" x2="130" y2="98" strokeWidth="3.5" />
            <line x1="204" y1="80" x2="190" y2="98" strokeWidth="3.5" />
          </g>

          {/* Sparkle Dots */}
          <circle cx="160" cy="56" r="3" fill="#18181b" />
          <circle cx="128" cy="64" r="2.5" fill="#18181b" />
          <circle cx="192" cy="64" r="2.5" fill="#18181b" />

          {/* Middle Dancing Person (Arms Up!) */}
          {/* Head */}
          <circle cx="160" cy="115" r="14" fill="#18181b" />
          {/* Arms raised high in celebration */}
          <path
            d="M136 142 C124 112, 130 86, 145 74"
            stroke="#18181b"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeDasharray="2 5"
          />
          <path
            d="M184 142 C196 112, 190 86, 175 74"
            stroke="#18181b"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeDasharray="2 5"
          />
          {/* Body */}
          <path
            d="M146 136 C145 160, 144 180, 148 198 C152 206, 168 206, 172 198 C176 180, 175 160, 174 136"
            stroke="#18181b"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeDasharray="2 5"
          />
          {/* Legs */}
          <path
            d="M150 198 C148 218, 145 238, 143 252 C143 256, 150 258, 154 254 C157 238, 159 218, 160 204"
            stroke="#18181b"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeDasharray="2 5"
          />
          <path
            d="M170 198 C172 218, 175 238, 177 252 C177 256, 170 258, 166 254 C163 238, 161 218, 160 204"
            stroke="#18181b"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeDasharray="2 5"
          />

          {/* Left Dancing Person */}
          {/* Head */}
          <circle cx="114" cy="148" r="13" fill="#18181b" />
          {/* Arm hugging center */}
          <path
            d="M98 172 C88 162, 102 144, 120 152 C138 160, 162 168, 170 160"
            stroke="#18181b"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="2 5"
          />
          {/* Body */}
          <path
            d="M104 168 C98 190, 100 210, 108 224 C116 228, 124 228, 128 216 C132 200, 128 178, 124 168"
            stroke="#18181b"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="2 5"
          />
          {/* Legs */}
          <path
            d="M106 222 C102 238, 98 252, 95 262 C95 266, 102 268, 106 264 C111 252, 114 238, 116 224"
            stroke="#18181b"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="2 5"
          />
          <path
            d="M120 222 C122 238, 126 252, 128 262 C128 266, 121 268, 117 264 C114 252, 112 238, 111 224"
            stroke="#18181b"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="2 5"
          />

          {/* Right Dancing Person */}
          {/* Head */}
          <circle cx="206" cy="148" r="13" fill="#18181b" />
          {/* Arm hugging center */}
          <path
            d="M222 172 C232 162, 218 144, 200 152 C182 160, 158 168, 150 160"
            stroke="#18181b"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="2 5"
          />
          {/* Body */}
          <path
            d="M216 168 C222 190, 220 210, 212 224 C204 228, 196 228, 192 216 C188 200, 192 178, 196 168"
            stroke="#18181b"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="2 5"
          />
          {/* Legs */}
          <path
            d="M214 222 C218 238, 222 252, 225 262 C225 266, 218 268, 214 264 C209 252, 206 238, 204 224"
            stroke="#18181b"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="2 5"
          />
          <path
            d="M200 222 C198 238, 194 252, 192 262 C192 266, 199 268, 203 264 C206 252, 208 238, 209 224"
            stroke="#18181b"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="2 5"
          />
        </svg>
      );

    case 'grow':
      return (
        /* iPhone 16 - 6: Grow - Sprouting Plant Seedling with Soil Mound */
        <svg
          viewBox="0 0 320 320"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`w-full max-w-[280px] sm:max-w-[340px] h-auto select-none ${className}`}
        >
          {/* Top Left Leaf (Heart-shaped / curved) */}
          <path
            d="M160 145 C135 110, 95 105, 90 135 C85 165, 125 175, 160 162"
            stroke="#18181b"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray="2 6"
          />
          {/* Leaf vein */}
          <path
            d="M110 135 C130 140, 145 150, 160 155"
            stroke="#18181b"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Top Right Leaf */}
          <path
            d="M160 145 C185 95, 230 100, 235 130 C240 160, 195 175, 160 162"
            stroke="#18181b"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray="2 6"
          />
          {/* Leaf vein */}
          <path
            d="M215 130 C195 138, 175 148, 160 155"
            stroke="#18181b"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Plant Stem */}
          <path
            d="M160 155 C160 185, 155 210, 162 235"
            stroke="#18181b"
            strokeWidth="5.5"
            strokeLinecap="round"
            strokeDasharray="2 6"
          />

          {/* Stippled Soil Mound with Dotted Texture */}
          <g fill="#18181b">
            {/* Center Mound Stones & Soil */}
            <ellipse cx="160" cy="242" rx="14" ry="7" />
            <circle cx="140" cy="244" r="5.5" />
            <circle cx="180" cy="244" r="6" />
            <circle cx="125" cy="248" r="4.5" />
            <circle cx="195" cy="248" r="4.5" />
            <circle cx="110" cy="252" r="3.5" />
            <circle cx="210" cy="252" r="3.5" />
            <circle cx="95" cy="256" r="3" />
            <circle cx="225" cy="256" r="3" />

            {/* Sprinkled Dirt Dots */}
            <circle cx="150" cy="235" r="2.5" />
            <circle cx="170" cy="235" r="3" />
            <circle cx="132" cy="239" r="2.5" />
            <circle cx="188" cy="239" r="2.5" />
            <circle cx="145" cy="252" r="2.5" />
            <circle cx="175" cy="252" r="3" />
            <circle cx="160" cy="256" r="2.5" />
            <circle cx="102" cy="248" r="2" />
            <circle cx="218" cy="248" r="2" />
            <circle cx="85" cy="260" r="2" />
            <circle cx="235" cy="260" r="2" />
          </g>
        </svg>
      );

    case 'fix':
      return (
        /* iPhone 16 - 7: Fixed - Mechanic Wrench with Sparkle Bursts */
        <svg
          viewBox="0 0 320 320"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`w-full max-w-[280px] sm:max-w-[340px] h-auto select-none ${className}`}
        >
          {/* Top-Left Sparkle Star */}
          <path
            d="M100 85 L104 102 L120 106 L104 110 L100 126 L96 110 L80 106 L96 102 Z"
            fill="#18181b"
          />
          {/* Spark rays */}
          <g stroke="#18181b" strokeWidth="3" strokeLinecap="round">
            <line x1="75" y1="90" x2="85" y2="98" />
            <line x1="125" y1="90" x2="115" y2="98" />
            <line x1="75" y1="125" x2="85" y2="118" />
            <line x1="130" y1="125" x2="118" y2="118" />
          </g>

          {/* Hand-drawn Wrench body */}
          {/* Top Wrench Head (Open-end jaw) */}
          <path
            d="M175 105 C165 95, 175 75, 195 72 C215 70, 235 85, 230 110 C226 125, 210 135, 195 130 L180 118 L192 102 L178 98 L168 112 Z"
            stroke="#18181b"
            strokeWidth="5.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="2 6"
          />

          {/* Wrench Shaft / Handle */}
          <path
            d="M178 128 L118 208 C114 214, 110 222, 116 230 C122 236, 130 232, 136 226 L196 146 Z"
            stroke="#18181b"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="2 6"
          />

          {/* Grip holes in Wrench handle */}
          <circle cx="164" cy="162" r="4.5" fill="#18181b" />
          <circle cx="146" cy="186" r="4.5" fill="#18181b" />
          <circle cx="128" cy="210" r="4.5" fill="#18181b" />

          {/* Bottom Wrench Ring / Box-end */}
          <circle
            cx="108"
            cy="234"
            r="16"
            stroke="#18181b"
            strokeWidth="5"
            strokeDasharray="2 5"
          />
          <circle cx="108" cy="234" r="7" fill="#18181b" />

          {/* Small spark burst on right */}
          <path
            d="M245 175 L247 185 L257 187 L247 189 L245 198 L243 189 L233 187 L243 185 Z"
            fill="#18181b"
          />
        </svg>
      );

    case 'care':
      return (
        /* iPhone 16 - 8: Care - Cupped Hand Holding Heart with Sparkle Dots */
        <svg
          viewBox="0 0 320 320"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`w-full max-w-[280px] sm:max-w-[340px] h-auto select-none ${className}`}
        >
          {/* Radiating Spark Rays above Heart */}
          <g stroke="#18181b" strokeWidth="3" strokeLinecap="round" strokeDasharray="1 6">
            <line x1="160" y1="52" x2="160" y2="72" />
            <line x1="125" y1="65" x2="138" y2="80" />
            <line x1="195" y1="65" x2="182" y2="80" />
            <line x1="98" y1="95" x2="114" y2="105" />
            <line x1="222" y1="95" x2="206" y2="105" />
          </g>

          {/* Stippled / Dotted Floating Heart */}
          <path
            d="M160 178 C135 155, 105 130, 105 105 C105 85, 122 72, 142 72 C154 72, 160 80, 160 80 C160 80, 166 72, 178 72 C198 72, 215 85, 215 105 C215 130, 185 155, 160 178 Z"
            stroke="#18181b"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="2 6"
          />
          {/* Heart Accent Dot */}
          <circle cx="160" cy="115" r="4.5" fill="#18181b" />

          {/* Caring Hand Cupping from below */}
          {/* Forearm & Cuff */}
          <path
            d="M78 220 L92 195 C94 192, 98 190, 102 192 L120 198 L106 226 C104 230, 100 232, 96 230 Z"
            stroke="#18181b"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeDasharray="2 5"
          />
          {/* Cuff Hatching */}
          <line x1="88" y1="210" x2="98" y2="204" stroke="#18181b" strokeWidth="3" />
          <line x1="95" y1="220" x2="105" y2="214" stroke="#18181b" strokeWidth="3" />

          {/* Hand Palm & Palm Curve */}
          <path
            d="M120 198 C135 190, 155 190, 175 195 C200 202, 230 185, 248 165 C252 160, 258 164, 254 172 C236 205, 200 228, 165 228 C135 228, 115 220, 106 226"
            stroke="#18181b"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="2 6"
          />

          {/* Thumb / Fingers curve */}
          <path
            d="M138 185 C145 178, 160 178, 172 184"
            stroke="#18181b"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="2 5"
          />
        </svg>
      );

    case 'create':
      return (
        /* iPhone 16 - 9: Create - Angled Pencil Sketching Dynamic Starburst */
        <svg
          viewBox="0 0 320 320"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`w-full max-w-[280px] sm:max-w-[340px] h-auto select-none ${className}`}
        >
          {/* Pencil Body (Angled from top right to bottom left) */}
          {/* Eraser End */}
          <path
            d="M232 72 L252 92 C256 96, 256 102, 252 106 L244 114 L220 90 L228 82 C232 78, 238 78, 242 82"
            stroke="#18181b"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeDasharray="2 5"
          />
          {/* Metal Ferrule Band */}
          <line x1="220" y1="90" x2="244" y2="114" stroke="#18181b" strokeWidth="4.5" />
          <line x1="212" y1="98" x2="236" y2="122" stroke="#18181b" strokeWidth="4.5" />

          {/* Wooden Pencil Shaft */}
          <path
            d="M212 98 L142 168 L166 192 L236 122 Z"
            stroke="#18181b"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="2 6"
          />
          {/* Center Groove */}
          <line
            x1="189"
            y1="110"
            x2="154"
            y2="180"
            stroke="#18181b"
            strokeWidth="3.5"
            strokeDasharray="2 5"
          />

          {/* Sharpened Wood Cone Tip */}
          <path
            d="M142 168 L118 214 L166 192 Z"
            stroke="#18181b"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Graphite Lead Tip */}
          <polygon points="118,214 126,204 136,209" fill="#18181b" />

          {/* Dynamic Starburst Drawn at the Tip! */}
          <path
            d="M116 216 L94 200 L98 226 L76 238 L100 248 L94 274 L118 258 L138 274 L132 248 L156 238 L134 226 L138 200 Z"
            stroke="#18181b"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="2 5"
          />

          {/* Spark rays and burst lines */}
          <g stroke="#18181b" strokeWidth="3" strokeLinecap="round">
            <line x1="62" y1="215" x2="74" y2="225" />
            <line x1="55" y1="250" x2="70" y2="250" />
            <line x1="75" y1="285" x2="88" y2="275" />
            <line x1="120" y1="295" x2="120" y2="280" />
            <line x1="162" y1="270" x2="150" y2="260" />
            <line x1="175" y1="230" x2="160" y2="232" />
          </g>
        </svg>
      );

    case 'intro':
    default:
      return (
        /* iPhone 16 - 4: Intro / Cover - Heart Outline with NYC Skyline Inside */
        <svg
          viewBox="0 0 320 320"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`w-full max-w-[280px] sm:max-w-[340px] h-auto select-none ${className}`}
        >
          {/* Heart Outline made of Stippled Dots */}
          <path
            d="M160 270 C110 230, 55 185, 55 125 C55 80, 90 52, 130 52 C148 52, 160 62, 160 62 C160 62, 172 52, 190 52 C230 52, 265 80, 265 125 C265 185, 210 230, 160 270 Z"
            stroke="#18181b"
            strokeWidth="5.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="2 7"
          />

          {/* Empire State Building (Center) */}
          <rect x="148" y="105" width="24" height="110" stroke="#18181b" strokeWidth="3.5" />
          <rect x="152" y="85" width="16" height="20" stroke="#18181b" strokeWidth="3" />
          <line x1="160" y1="65" x2="160" y2="85" stroke="#18181b" strokeWidth="3.5" />
          {/* Windows / Grids */}
          <line x1="154" y1="120" x2="154" y2="200" stroke="#18181b" strokeWidth="2" strokeDasharray="2 3" />
          <line x1="166" y1="120" x2="166" y2="200" stroke="#18181b" strokeWidth="2" strokeDasharray="2 3" />

          {/* Chrysler Building (Left) */}
          <rect x="120" y="130" width="22" height="85" stroke="#18181b" strokeWidth="3.5" />
          <path d="M120 130 L131 95 L142 130 Z" stroke="#18181b" strokeWidth="3" />
          <line x1="131" y1="80" x2="131" y2="95" stroke="#18181b" strokeWidth="3" />

          {/* One World Trade / Skyscraper (Right) */}
          <rect x="178" y="140" width="22" height="75" stroke="#18181b" strokeWidth="3.5" />
          <path d="M178 140 L189 110 L200 140 Z" stroke="#18181b" strokeWidth="3" />

          {/* Smaller Buildings */}
          <rect x="100" y="160" width="16" height="55" stroke="#18181b" strokeWidth="3" />
          <rect x="204" y="165" width="16" height="50" stroke="#18181b" strokeWidth="3" />

          {/* Small Heart at the Bottom Base */}
          <path
            d="M160 248 C155 242, 148 236, 148 230 C148 225, 152 222, 156 222 C159 222, 160 224, 160 224 C160 224, 161 222, 164 222 C168 222, 172 225, 172 230 C172 236, 165 242, 160 248 Z"
            fill="#18181b"
          />
        </svg>
      );
  }
};
