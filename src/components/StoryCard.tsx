import React from 'react';
import { StoryItem } from '../types';
import { CATEGORY_THEMES } from './CategoryBadge';
import { StoryIllustration } from './StoryIllustration';
import { ArrowRight, Send, Database } from 'lucide-react';

interface StoryCardProps {
  story: StoryItem;
  onViewSource: (story: StoryItem) => void;
  onSendPostcard: (story: StoryItem) => void;
  onLocateOnMap?: (story: StoryItem) => void;
  isCompact?: boolean;
  className?: string;
}

const CATEGORY_DISPLAY_NAMES: Record<string, string> = {
  gather: 'Gathering',
  care: 'Wildlife Care',
  create: 'Filming & Art',
  fix: 'Civic Fixing',
};

export const StoryCard: React.FC<StoryCardProps> = ({
  story,
  onViewSource,
  onSendPostcard,
  onLocateOnMap,
  className = '',
}) => {
  const { fact, line1, line2, detail, category } = story;
  const theme = CATEGORY_THEMES[category];
  const categoryLabel = CATEGORY_DISPLAY_NAMES[category] || theme.name;

  return (
    <article
      id={`story-card-${story.id}`}
      className={`w-full max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 md:gap-12 px-4 sm:px-8 py-4 sm:py-6 select-none ${className}`}
    >
      {/* Left Content Column */}
      <div className="flex-1 w-full flex flex-col justify-center text-left">
        {/* Date Header */}
        <div className="mb-2">
          <span className="font-sans-clean text-xs sm:text-sm font-bold tracking-wider text-zinc-800 uppercase">
            {fact.dateBadge || 'AUG 16, SUN'}
          </span>
        </div>

        {/* Big Serif Headline */}
        <h2 className="font-card text-3xl sm:text-4xl lg:text-[44px] leading-[1.16] font-bold text-zinc-900 tracking-tight my-2">
          <span>{line1}</span>
          {line2 && <span className="block">{line2}</span>}
        </h2>

        {/* Category Pill */}
        <div className="my-2.5">
          <span
            className={`inline-block ${theme.bgPill} ${theme.textPill} font-sans-clean font-bold text-xs sm:text-sm px-4 py-1 rounded-full shadow-xs`}
          >
            {theme.name}
          </span>
        </div>

        {/* Grounding Story Detail */}
        <p className="font-sans-clean text-zinc-800 text-base sm:text-lg leading-relaxed font-normal my-2 max-w-xl">
          {detail}
        </p>

        {/* Thin Divider Line */}
        <div className="w-full max-w-lg h-[1.5px] bg-zinc-400/40 my-3 sm:my-4" />

        {/* Source Citation & Modal Trigger */}
        <div className="flex items-center justify-between max-w-lg text-xs sm:text-sm text-zinc-700 font-sans-clean font-medium">
          <span className="truncate max-w-[260px]">
            Source: {fact.datasetName || 'NYC 311 Service Requests'}
          </span>
          <button
            type="button"
            onClick={() => onViewSource(story)}
            className="underline hover:text-zinc-900 cursor-pointer font-medium"
          >
            View Source Data
          </button>
        </div>

        {/* Action Button: See Where -> */}
        <div className="mt-5 sm:mt-6 flex items-center gap-3">
          {onLocateOnMap && (
            <button
              id={`btn-see-where-${story.id}`}
              type="button"
              onClick={() => onLocateOnMap(story)}
              className="inline-flex items-center gap-2.5 bg-zinc-900 hover:bg-black active:scale-95 text-white font-sans-clean font-bold text-sm sm:text-base px-6 sm:px-7 py-2.5 sm:py-3 rounded-full shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <span>See where</span>
              <ArrowRight size={16} />
            </button>
          )}

          {/* Quick Postcard Share Action */}
          <button
            id={`btn-share-card-${story.id}`}
            type="button"
            onClick={() => onSendPostcard(story)}
            className="inline-flex items-center gap-1.5 bg-white/80 hover:bg-white text-zinc-900 border border-zinc-300 font-sans-clean font-semibold text-xs sm:text-sm px-4 py-2.5 sm:py-3 rounded-full shadow-xs active:scale-95 transition-all cursor-pointer"
          >
            <Send size={14} className="text-zinc-700 -rotate-12" />
            <span>Send card</span>
          </button>
        </div>
      </div>

      {/* Right Column: Hand-drawn Vector Doodle Illustration */}
      <div className="flex-1 w-full flex items-center justify-center py-2 md:py-4">
        <StoryIllustration
          category={category}
          className="w-full max-w-[260px] sm:max-w-[320px] lg:max-w-[380px] drop-shadow-sm transition-transform duration-300 hover:scale-[1.02]"
        />
      </div>
    </article>
  );
};
