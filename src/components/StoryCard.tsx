import React from 'react';
import { StoryItem } from '../types';
import { CATEGORY_THEMES } from './CategoryBadge';
import { DoodleIcon } from './DoodleIcon';
import { Database, Send, MapPin, Sparkles, CheckCircle2 } from 'lucide-react';

interface StoryCardProps {
  story: StoryItem;
  onViewSource: (story: StoryItem) => void;
  onSendPostcard: (story: StoryItem) => void;
  onLocateOnMap?: (story: StoryItem) => void;
  isCompact?: boolean;
  className?: string;
}

export const StoryCard: React.FC<StoryCardProps> = ({
  story,
  onViewSource,
  onSendPostcard,
  onLocateOnMap,
  isCompact = false,
  className = '',
}) => {
  const { fact, line1, line2, detail, category, isAiGenerated } = story;
  const theme = CATEGORY_THEMES[category];

  return (
    <article
      id={`story-card-${story.id}`}
      className={`relative w-full max-w-md mx-auto ${theme.bgCard} border-[2.5px] border-zinc-900 rounded-[24px] shadow-[5px_5px_0px_#18181b] p-5 sm:p-6 flex flex-col justify-between transition-all duration-200 select-none ${className}`}
    >
      {/* Top Meta Bar */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center flex-wrap gap-2">
            {/* Category Tag */}
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full border-2 border-zinc-900 ${theme.bgPill} ${theme.textPill} text-xs sm:text-sm font-bold uppercase tracking-wider shadow-[2px_2px_0px_#18181b] gap-1.5`}
            >
              <DoodleIcon category={category} size={14} />
              <span>{theme.emoji} {theme.name}</span>
            </span>

            {/* Date Tag */}
            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-white/90 border-2 border-zinc-900 text-zinc-900 text-xs font-bold uppercase tracking-wide shadow-[2px_2px_0px_#18181b]">
              {fact.dateBadge}
            </span>
          </div>

          {/* Borough Tag */}
          <div className="flex items-center gap-1">
            <span className="inline-flex items-center gap-1 text-xs font-bold text-zinc-800 bg-white/80 border-[1.5px] border-zinc-900 px-2 py-0.5 rounded-md shadow-[1.5px_1.5px_0px_#18181b]">
              <MapPin size={12} className="text-zinc-700" />
              {fact.borough}
            </span>
          </div>
        </div>

        {/* Decorative subtle doodle background element */}
        <div className="absolute right-4 top-16 opacity-15 pointer-events-none text-zinc-900">
          <DoodleIcon category={category} size={72} />
        </div>

        {/* Postcard Body: Two-line headline */}
        <div className="my-3 sm:my-4 z-10 relative">
          <h2 className="font-card text-2xl sm:text-[28px] leading-[1.22] text-zinc-900 font-bold tracking-tight drop-shadow-[0_1px_0_rgba(255,255,255,0.7)]">
            <span className="block">{line1}</span>
            <span className="block">{line2}</span>
          </h2>

          {/* Grounding Detail sentence */}
          <p className="mt-3 text-zinc-800 font-sans-clean text-sm sm:text-[15px] leading-relaxed font-medium">
            {detail}
          </p>
        </div>
      </div>

      {/* Footer Area: Source citation & Action triggers */}
      <div className="mt-4 pt-3 border-t-2 border-zinc-900/20 z-10">
        <div className="flex items-center justify-between text-xs text-zinc-700 mb-3 font-sans-clean font-medium">
          <span className="truncate max-w-[240px] italic">
            Source: {fact.datasetName}
          </span>
          {isAiGenerated ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-zinc-600 bg-white/60 px-1.5 py-0.5 rounded border border-zinc-400">
              <Sparkles size={10} className="text-amber-600" />
              AI Voice
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-zinc-600 bg-white/60 px-1.5 py-0.5 rounded border border-zinc-400">
              <CheckCircle2 size={10} className="text-emerald-600" />
              Fact Verified
            </span>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center gap-2">
          <button
            id={`btn-view-source-${story.id}`}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onViewSource(story);
            }}
            className="flex-1 inline-flex items-center justify-center gap-1.5 bg-white hover:bg-zinc-50 active:bg-zinc-100 text-zinc-900 font-sans-clean font-bold text-xs sm:text-sm py-2 px-3 rounded-xl border-2 border-zinc-900 shadow-[2px_2px_0px_#18181b] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#18181b] transition-all cursor-pointer"
          >
            <Database size={14} />
            <span>View source data</span>
          </button>

          <button
            id={`btn-send-postcard-${story.id}`}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSendPostcard(story);
            }}
            className="flex-1 inline-flex items-center justify-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 active:bg-black text-white font-sans-clean font-bold text-xs sm:text-sm py-2 px-3 rounded-xl border-2 border-zinc-900 shadow-[2px_2px_0px_#18181b] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#18181b] transition-all cursor-pointer"
          >
            <Send size={14} className="text-rose-300" />
            <span>Send postcard</span>
          </button>

          {onLocateOnMap && (
            <button
              id={`btn-map-locate-${story.id}`}
              type="button"
              title="View on Map"
              onClick={(e) => {
                e.stopPropagation();
                onLocateOnMap(story);
              }}
              className="inline-flex items-center justify-center bg-white hover:bg-zinc-50 text-zinc-900 p-2 rounded-xl border-2 border-zinc-900 shadow-[2px_2px_0px_#18181b] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#18181b] transition-all cursor-pointer"
            >
              <MapPin size={16} />
            </button>
          )}
        </div>
      </div>
    </article>
  );
};
