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
    bgColor: string; // Dynamic page background color
    bgCard: string;
    bgPill: string;
    textPill: string;
    borderPill: string;
    accentColor: string;
    pinColor: string;
    sourceDataset: string;
  }
> = {
  gather: {
    name: 'Gathering',
    emoji: '🎵',
    bgColor: '#FADCE9', // Soft Pink / Lilac
    bgCard: 'bg-[#FADCE9]',
    bgPill: 'bg-[#F2CEEF]',
    textPill: 'text-[#421344]',
    borderPill: 'border-transparent',
    accentColor: '#D946EF',
    pinColor: '#D946EF',
    sourceDataset: 'NYC Permitted Event Information',
  },
  grow: {
    name: 'Grow',
    emoji: '🌱',
    bgColor: '#BDD8F8', // Periwinkle Blue
    bgCard: 'bg-[#BDD8F8]',
    bgPill: 'bg-[#254BA8]',
    textPill: 'text-white',
    borderPill: 'border-transparent',
    accentColor: '#2563EB',
    pinColor: '#2563EB',
    sourceDataset: 'NYC Parks Forestry',
  },
  fix: {
    name: 'Fixed',
    emoji: '✨',
    bgColor: '#F9D79E', // Warm Ochre / Marigold Amber
    bgCard: 'bg-[#F9D79E]',
    bgPill: 'bg-[#E88022]',
    textPill: 'text-white',
    borderPill: 'border-transparent',
    accentColor: '#D97706',
    pinColor: '#D97706',
    sourceDataset: 'NYC 311 Service Requests',
  },
  care: {
    name: 'Care',
    emoji: '❤️',
    bgColor: '#F9BCA9', // Soft Coral Peach / Terracotta
    bgCard: 'bg-[#F9BCA9]',
    bgPill: 'bg-[#EB5341]',
    textPill: 'text-white',
    borderPill: 'border-transparent',
    accentColor: '#EA580C',
    pinColor: '#EA580C',
    sourceDataset: 'Urban Park Ranger Animal Condition Response',
  },
  create: {
    name: 'Create',
    emoji: '🎬',
    bgColor: '#FDF5A9', // Pale Lemon Yellow
    bgCard: 'bg-[#FDF5A9]',
    bgPill: 'bg-[#EAB308]',
    textPill: 'text-zinc-900',
    borderPill: 'border-transparent',
    accentColor: '#CA8A04',
    pinColor: '#CA8A04',
    sourceDataset: 'NYC Film Permits (MOME)',
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
