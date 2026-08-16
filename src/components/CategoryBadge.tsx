import React from 'react';
import { StoryCategory } from '../types';
import { DoodleIcon } from './DoodleIcon';

interface CategoryBadgeProps {
  category: StoryCategory;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const CATEGORY_THEMES: Record<
  StoryCategory,
  {
    name: string;
    emoji: string;
    bgCard: string;
    bgPill: string;
    textPill: string;
    borderPill: string;
    accentColor: string;
    pinColor: string;
    sourceDataset: string;
  }
> = {
  fix: {
    name: 'FIX',
    emoji: '✨',
    bgCard: 'bg-[#E0F2FE]', // Soft Sky Blue
    bgPill: 'bg-[#BAE6FD]',
    textPill: 'text-[#0369A1]',
    borderPill: 'border-[#0284C7]',
    accentColor: '#0284C7',
    pinColor: '#0284C7',
    sourceDataset: 'NYC 311 Service Requests',
  },
  gather: {
    name: 'GATHER',
    emoji: '🎵',
    bgCard: 'bg-[#FEF9C3]', // Soft Warm Mustard
    bgPill: 'bg-[#FDE047]',
    textPill: 'text-[#854D0E]',
    borderPill: 'border-[#CA8A04]',
    accentColor: '#CA8A04',
    pinColor: '#EAB308',
    sourceDataset: 'NYC Permitted Event Information',
  },
  create: {
    name: 'CREATE',
    emoji: '🎬',
    bgCard: 'bg-[#FFE4E6]', // Soft Coral
    bgPill: 'bg-[#FECDD3]',
    textPill: 'text-[#9F1239]',
    borderPill: 'border-[#E11D48]',
    accentColor: '#E11D48',
    pinColor: '#F43F5E',
    sourceDataset: 'NYC Film Permits (MOME)',
  },
  care: {
    name: 'CARE',
    emoji: '🐦',
    bgCard: 'bg-[#DCFCE7]', // Soft Mint Sage
    bgPill: 'bg-[#BBF7D0]',
    textPill: 'text-[#15803D]',
    borderPill: 'border-[#16A34A]',
    accentColor: '#16A34A',
    pinColor: '#22C55E',
    sourceDataset: 'Urban Park Ranger Animal Condition Response',
  },
};

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({
  category,
  showIcon = true,
  size = 'md',
  className = '',
}) => {
  const theme = CATEGORY_THEMES[category];

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-3 py-1 text-xs sm:text-sm gap-1.5 font-bold',
    lg: 'px-4 py-1.5 text-sm gap-2 font-bold tracking-wide',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border-2 border-zinc-900 shadow-[2px_2px_0px_#18181b] font-sans-clean uppercase tracking-wider ${theme.bgPill} ${theme.textPill} ${sizeClasses[size]} ${className}`}
    >
      {showIcon && <DoodleIcon category={category} size={size === 'sm' ? 14 : 16} />}
      <span>
        {theme.emoji} {theme.name}
      </span>
    </span>
  );
};
