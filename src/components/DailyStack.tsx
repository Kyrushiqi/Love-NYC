import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo } from 'motion/react';
import { StoryItem, CitySummary, UserStory } from '../types';
import { StoryCard } from './StoryCard';
import { ClosingCard } from './ClosingCard';
import { JournalPrompt } from './JournalPrompt';
import { CommunityPage } from './CommunityPage';
import { ChevronLeft, ChevronRight, Shuffle, Sparkles, Filter } from 'lucide-react';
import { CATEGORY_THEMES } from './CategoryBadge';

interface DailyStackProps {
  stories: StoryItem[];
  summary: CitySummary;
  isLoading: boolean;
  onRefresh: () => void;
  onViewSource: (story: StoryItem) => void;
  onSendPostcard: (story: StoryItem) => void;
  onLocateOnMap?: (story: StoryItem) => void;
  onOpenMap: () => void;
  onOpenDataPipeline: () => void;
}

export const DailyStack: React.FC<DailyStackProps> = ({
  stories,
  summary,
  isLoading,
  onRefresh,
  onViewSource,
  onSendPostcard,
  onLocateOnMap,
  onOpenMap,
  onOpenDataPipeline,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [direction, setDirection] = useState<number>(0);
  
  // Track which screen we're on: 'cards' | 'closing' | 'journal' | 'community'
  const [screen, setScreen] = useState<'cards' | 'closing' | 'journal' | 'community'>('cards');
  
  // Store the user's journal entry so we can pass it to the community page
  const [journalEntry, setJournalEntry] = useState<UserStory | null>(null);
  
  const totalCards = stories.length;
  const isClosingCard = currentIndex >= totalCards;

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, totalCards, screen]);

  const handleNext = () => {
    // Handle navigation between screens
    if (screen === 'cards') {
      if (currentIndex < totalCards - 1) {
        setDirection(1);
        setCurrentIndex((prev) => prev + 1);
      } else if (currentIndex === totalCards - 1) {
        // Move to closing card
        setDirection(1);
        setCurrentIndex((prev) => prev + 1);
        setScreen('closing');
      }
    } else if (screen === 'closing') {
      // Move to journal prompt
      setDirection(1);
      setScreen('journal');
    } else if (screen === 'journal') {
      // Move to community page (only if they submitted an entry)
      if (journalEntry) {
        setDirection(1);
        setScreen('community');
      }
    }
  };

  const handlePrev = () => {
    // Handle backward navigation
    if (screen === 'cards') {
      if (currentIndex > 0) {
        setDirection(-1);
        setCurrentIndex((prev) => prev - 1);
      }
    } else if (screen === 'closing') {
      // Go back to last story
      setDirection(-1);
      setCurrentIndex(totalCards - 1);
      setScreen('cards');
    } else if (screen === 'journal') {
      // Go back to closing card
      setDirection(-1);
      setScreen('closing');
    } else if (screen === 'community') {
      // Go back to journal
      setDirection(-1);
      setScreen('journal');
    }
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 50;
    if (info.offset.x < -swipeThreshold) {
      handleNext();
    } else if (info.offset.x > swipeThreshold) {
      handlePrev();
    }
  };

  const handleDotClick = (index: number) => {
    // Only allow navigating within cards/closing card area
    if (screen === 'journal' || screen === 'community') return;
    
    if (index >= totalCards) {
      // Jump to closing card
      setDirection(index > currentIndex ? 1 : -1);
      setCurrentIndex(index);
      setScreen('closing');
    } else {
      // Jump to card
      setDirection(index > currentIndex ? 1 : -1);
      setCurrentIndex(index);
      setScreen('cards');
    }
  };

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 120 : -120,
      opacity: 0,
      rotate: dir > 0 ? 4 : -4,
      scale: 0.96,
    }),
    center: {
      x: 0,
      opacity: 1,
      rotate: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 340,
        damping: 28,
      },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -120 : 120,
      opacity: 0,
      rotate: dir > 0 ? -4 : 4,
      scale: 0.96,
      transition: { duration: 0.18 },
    }),
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-md mx-auto min-h-[460px] flex flex-col items-center justify-center p-8 bg-[#F5F2EB] border-[2.5px] border-zinc-900 rounded-[24px] shadow-[5px_5px_0px_#18181b]">
        <div className="relative mb-6">
          <div className="w-16 h-16 rounded-full border-4 border-zinc-900 border-t-rose-500 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center text-xl">❤️</div>
        </div>
        <h3 className="font-handwriting text-3xl font-bold text-zinc-900 mb-2">
          Gathering good news...
        </h3>
        <p className="text-zinc-600 text-sm text-center font-sans-clean font-medium">
          Querying live Socrata endpoints across 311, Parks, Film Office & Urban Rangers.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center">
      {/* Top Stack Bar: Card Counter & Live Shuffle trigger */}
      <div className="w-full flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-zinc-700 font-sans-clean bg-white px-2.5 py-1 rounded-full border-[1.5px] border-zinc-900 shadow-[1.5px_1.5px_0px_#18181b]">
            {screen === 'journal' && 'Your Moment'}
            {screen === 'community' && 'Community'}
            {screen !== 'journal' && screen !== 'community' && (isClosingCard ? 'Ritual Complete' : `Story ${currentIndex + 1} of ${totalCards}`)}
          </span>
          {!isClosingCard && currentIndex < totalCards && screen === 'cards' && (
            <span className="text-xs font-semibold text-zinc-500 hidden sm:inline">
              Swipe or use ← → keys
            </span>
          )}
        </div>

        <button
          id="btn-shuffle-stories"
          type="button"
          onClick={() => {
            onRefresh();
            setCurrentIndex(0);
            setScreen('cards');
            setJournalEntry(null);
          }}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-900 bg-white hover:bg-zinc-100 active:bg-zinc-200 px-3 py-1 rounded-full border-2 border-zinc-900 shadow-[2px_2px_0px_#18181b] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#18181b] transition-all cursor-pointer"
        >
          <Shuffle size={12} />
          <span>Shuffle Live</span>
        </button>
      </div>

      {/* Swipeable Card Area */}
      <div className="relative w-full min-h-[470px] sm:min-h-[490px] flex items-center justify-center">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          {screen === 'cards' && currentIndex < totalCards && (
            <motion.div
              key={`story-${currentIndex}`}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.4}
              onDragEnd={handleDragEnd}
              className="w-full cursor-grab active:cursor-grabbing touch-pan-y"
            >
              <StoryCard
                story={stories[currentIndex]}
                onViewSource={onViewSource}
                onSendPostcard={onSendPostcard}
                onLocateOnMap={onLocateOnMap}
              />
            </motion.div>
          )}
          
          {screen === 'closing' && (
            <motion.div
              key="closing-card"
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full"
            >
              <ClosingCard
                summary={summary}
                onRestart={() => {
                  setDirection(-1);
                  setCurrentIndex(0);
                  setScreen('cards');
                  setJournalEntry(null);
                }}
                onOpenMap={onOpenMap}
                onOpenJournal={() => {
                  setDirection(1);
                  setScreen('journal');
                }}
                onOpenDataPipeline={onOpenDataPipeline}
              />
            </motion.div>
          )}
          
          {screen === 'journal' && (
            <motion.div
              key="journal-prompt"
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full"
            >
              <JournalPrompt
                onEntryComplete={(entry) => {
                  setJournalEntry(entry);
                  // Auto-advance to community page
                  setTimeout(() => {
                    setDirection(1);
                    setScreen('community');
                  }, 500);
                }}
                onSkip={() => {
                  // Skip to community page without writing
                  setDirection(1);
                  setScreen('community');
                }}
              />
            </motion.div>
          )}
          
          {screen === 'community' && (
            <motion.div
              key="community-page"
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full"
            >
              <CommunityPage
                userEntry={journalEntry}
                onClose={() => {
                  // End of flow - reset everything
                  setDirection(-1);
                  setCurrentIndex(0);
                  setScreen('cards');
                  setJournalEntry(null);
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Controls: Left/Right Arrow Buttons & Dots */}
      <div className="w-full mt-4 flex items-center justify-between px-2">
        <button
          id="btn-prev-card"
          type="button"
          onClick={handlePrev}
          className={`p-2 rounded-xl border-2 border-zinc-900 font-bold transition-all shadow-[2px_2px_0px_#18181b] cursor-pointer ${
            (screen === 'cards' && currentIndex === 0) ||
            (screen !== 'cards' && screen !== 'closing' && screen !== 'journal')
              ? 'opacity-30 bg-zinc-100 cursor-not-allowed pointer-events-none'
              : 'bg-white hover:bg-zinc-100 active:translate-x-[1px] active:translate-y-[1px]'
          }`}
          aria-label="Previous"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Progress Dot Indicators */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {screen === 'cards' || screen === 'closing' ? (
            <>
              {stories.map((s, idx) => {
                const theme = CATEGORY_THEMES[s.category];
                const isSelected = screen === 'cards' && idx === currentIndex;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handleDotClick(idx)}
                    title={`${s.fact.categoryLabel}: ${s.fact.subject}`}
                    className={`transition-all duration-200 rounded-full border-[1.5px] border-zinc-900 cursor-pointer ${
                      isSelected
                        ? `w-6 h-3 ${theme.bgPill} shadow-[1.5px_1.5px_0px_#18181b]`
                        : 'w-2.5 h-2.5 bg-zinc-300 hover:bg-zinc-400'
                    }`}
                    aria-label={`Jump to story ${idx + 1}`}
                  />
                );
              })}
              {/* Closing Card Dot */}
              <button
                type="button"
                onClick={() => handleDotClick(totalCards)}
                title="Daily Summary"
                className={`transition-all duration-200 rounded-full border-[1.5px] border-zinc-900 cursor-pointer ${
                  screen === 'closing'
                    ? 'w-6 h-3 bg-rose-300 shadow-[1.5px_1.5px_0px_#18181b]'
                    : 'w-2.5 h-2.5 bg-zinc-300 hover:bg-zinc-400'
                }`}
                aria-label="Jump to summary"
              />
            </>
          ) : (
            <>
              {/* Simplified dots for journal/community screens */}
              <div
                className={`w-2.5 h-2.5 rounded-full border-[1.5px] border-zinc-900 ${
                  screen === 'journal' ? 'bg-rose-400' : 'bg-zinc-300'
                }`}
              />
              <div
                className={`w-2.5 h-2.5 rounded-full border-[1.5px] border-zinc-900 ${
                  screen === 'community' ? 'bg-purple-400' : 'bg-zinc-300'
                }`}
              />
            </>
          )}
        </div>

        <button
          id="btn-next-card"
          type="button"
          onClick={handleNext}
          className={`p-2 rounded-xl border-2 border-zinc-900 font-bold transition-all shadow-[2px_2px_0px_#18181b] cursor-pointer ${
            (screen === 'cards' && isClosingCard) ||
            (screen === 'journal' && !journalEntry)
              ? 'opacity-30 bg-zinc-100 cursor-not-allowed pointer-events-none'
              : 'bg-white hover:bg-zinc-100 active:translate-x-[1px] active:translate-y-[1px]'
          }`}
          aria-label="Next"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Category quick filter bar - only show on cards screen */}
      {screen === 'cards' && (
        <div className="w-full mt-5 pt-3 border-t border-zinc-300/80 flex items-center justify-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mr-1">
            Jump to:
          </span>
          {(['fix', 'gather', 'create', 'care'] as const).map((cat) => {
            const theme = CATEGORY_THEMES[cat];
            const firstMatchIndex = stories.findIndex((s) => s.category === cat);
            if (firstMatchIndex === -1) return null;

            return (
              <button
                key={cat}
                type="button"
                onClick={() => handleDotClick(firstMatchIndex)}
                className={`px-2.5 py-1 rounded-full text-xs font-bold border border-zinc-900 shadow-[1.5px_1.5px_0px_#18181b] ${theme.bgPill} ${theme.textPill} hover:opacity-90 active:scale-95 transition-all cursor-pointer`}
              >
                {theme.emoji} {theme.name}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
