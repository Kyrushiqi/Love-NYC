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
  onOpenCommunityBoard?: () => void;
  onOpenDataPipeline: () => void;
  onStoryChange?: (index: number) => void;
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
  onOpenCommunityBoard,
  onOpenDataPipeline,
  onStoryChange,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [direction, setDirection] = useState<number>(0);

  useEffect(() => {
    onStoryChange?.(currentIndex);
  }, [currentIndex, onStoryChange]);
  
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
        <h3 className="font-card text-2xl sm:text-3xl font-bold text-zinc-900 mb-2">
          Gathering good news...
        </h3>
        <p className="text-zinc-600 text-sm text-center font-sans-clean font-medium">
          Querying live Socrata endpoints across 311, Parks, Film Office & Urban Rangers.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center justify-between min-h-[calc(100vh-140px)] py-4">
      {/* Swipeable Main Card Area */}
      <div className="relative w-full flex-1 flex items-center justify-center min-h-[460px] sm:min-h-[500px]">
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
              dragElastic={0.3}
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
              className="w-full max-w-md mx-auto"
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
              className="w-full max-w-md mx-auto"
            >
              <JournalPrompt
                onEntryComplete={(entry) => {
                  setJournalEntry(entry);
                  setTimeout(() => {
                    setDirection(1);
                    setScreen('community');
                  }, 500);
                }}
                onSkip={() => {
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
                onOpenCommunityBoard={onOpenCommunityBoard}
                onWriteMoment={() => {
                  setDirection(-1);
                  setScreen('journal');
                }}
                onClose={() => {
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

      {/* Bottom Bar: Centered Dots Pagination & Bottom Right View Mode Switcher */}
      <div className="w-full flex items-center justify-between mt-6 px-4 relative">
        {/* Left Spacer for symmetry */}
        <div className="w-24 hidden sm:block" />

        {/* Centered Pagination Dots */}
        <div className="flex-1 flex items-center justify-center gap-2">
          {stories.map((s, idx) => {
            const isSelected = screen === 'cards' && idx === currentIndex;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => handleDotClick(idx)}
                title={`${s.fact.categoryLabel}: ${s.fact.subject}`}
                className={`transition-all duration-200 rounded-full cursor-pointer ${
                  isSelected
                    ? 'w-2.5 h-2.5 bg-zinc-900 scale-125'
                    : 'w-2.5 h-2.5 bg-white/90 hover:bg-white border border-zinc-400/60'
                }`}
                aria-label={`Jump to story ${idx + 1}`}
              />
            );
          })}
        </div>

        {/* Right Floating View Switcher: Card view vs Map */}
        <div className="flex items-center justify-end">
          <div className="inline-flex items-center p-1 bg-white/90 backdrop-blur-xs rounded-full border border-zinc-300 shadow-sm">
            <button
              id="bottom-tab-cards"
              type="button"
              onClick={() => {
                setScreen('cards');
              }}
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full text-xs font-bold transition-all bg-zinc-900 text-white shadow-xs cursor-pointer"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="M3 9h18" />
                <path d="M9 21V9" />
              </svg>
              <span>Card view</span>
            </button>

            <button
              id="bottom-tab-map"
              type="button"
              onClick={onOpenMap}
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full text-xs font-bold text-zinc-700 hover:text-zinc-900 transition-all cursor-pointer"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
                <line x1="9" x2="9" y1="3" y2="18" />
                <line x1="15" x2="15" y1="6" y2="21" />
              </svg>
              <span>Map</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
