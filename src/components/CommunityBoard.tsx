import React, { useState, useEffect } from 'react';
import { CommunityEntry, UserStory } from '../types';
import {
  MessageCircle,
  Heart,
  MapPin,
  Share2,
  PenLine,
  CheckCircle,
  Filter,
  Sparkles,
  Search,
  RotateCcw,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  getAllCommunityEntries,
  likeCommunityEntry,
} from '../utils/journalStorage';
import { JournalPrompt } from './JournalPrompt';

const BOROUGHS = [
  'ALL',
  'MANHATTAN',
  'BROOKLYN',
  'QUEENS',
  'BRONX',
  'STATEN ISLAND',
] as const;

interface CommunityBoardProps {
  onBackToDailyStories: () => void;
  onSendPostcard?: (entry: CommunityEntry) => void;
}

export const CommunityBoard: React.FC<CommunityBoardProps> = ({
  onBackToDailyStories,
}) => {
  const [entries, setEntries] = useState<CommunityEntry[]>([]);
  const [selectedBorough, setSelectedBorough] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPostingModalOpen, setIsPostingModalOpen] = useState<boolean>(false);
  const [likedEntryIds, setLikedEntryIds] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const loadEntries = async () => {
    setIsLoading(true);
    try {
      const data = await getAllCommunityEntries();
      setEntries(data);
    } catch (err) {
      console.warn('Failed to load community entries:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEntries();
  }, []);

  const handleLike = async (entry: CommunityEntry, e: React.MouseEvent) => {
    e.stopPropagation();
    if (likedEntryIds.has(entry.id)) return;

    // Small celebratory heart confetti
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 15,
      spread: 45,
      origin: { x, y },
      colors: ['#E11D48', '#EC4899', '#A855F7'],
    });

    setLikedEntryIds((prev) => new Set(prev).add(entry.id));

    // Optimistic UI update
    setEntries((prev) =>
      prev.map((item) =>
        item.id === entry.id
          ? { ...item, likesCount: (item.likesCount || 0) + 1 }
          : item
      )
    );

    await likeCommunityEntry(entry.id);
  };

  const handleCopyMoment = (entry: CommunityEntry) => {
    const text = `❤️ LOVE NYC Community Moment · From a fellow New Yorker\n\n"${entry.headline}"\n\n📍 ${entry.borough || 'New York City'}\n#LoveNYC #NYCOpenData`;
    navigator.clipboard.writeText(text);
    setCopiedId(entry.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredEntries = entries.filter((item) => {
    if (!item.isVisible) return false;
    if (selectedBorough === 'ALL') return true;
    return (
      item.borough?.toUpperCase().includes(selectedBorough) ||
      (selectedBorough === 'MANHATTAN' && item.borough?.toUpperCase().includes('NEW YORK'))
    );
  });

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-5">
      {/* Top Banner */}
      <div className="w-full bg-[#F5F2EB] border-[2.5px] border-zinc-900 rounded-[24px] shadow-[6px_6px_0px_#18181b] p-6 sm:p-8 select-none">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-200 border-2 border-zinc-900 text-purple-950 text-xs font-bold uppercase tracking-wider shadow-[2px_2px_0px_#18181b]">
                <MessageCircle size={14} className="text-purple-800" />
                <span>COMMUNITY BOARD</span>
              </span>
              <span className="text-xs font-bold text-zinc-600 uppercase">
                {entries.length} Shared Moments
              </span>
            </div>

            <h2 className="font-card text-2xl sm:text-3xl font-bold text-zinc-900 leading-tight">
              Moments from Fellow New Yorkers
            </h2>
            <p className="mt-1 font-sans-clean text-zinc-600 text-xs sm:text-sm max-w-xl leading-relaxed">
              Real, anonymous moments of kindness, quiet beauty, and neighborly love submitted by people across all five boroughs.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <img
              src="/community.svg"
              alt="Community moments"
              className="w-14 h-14 sm:w-16 sm:h-16 object-contain hidden md:block"
            />
            <div className="flex items-center gap-2">
              <button
                id="btn-open-post-moment"
                type="button"
                onClick={() => setIsPostingModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-sans-clean font-bold text-sm py-2.5 px-4 rounded-xl border-2 border-zinc-900 shadow-[2.5px_2.5px_0px_#18181b] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#18181b] transition-all cursor-pointer"
              >
                <PenLine size={15} />
                <span>Post Your Moment</span>
              </button>

              <button
                id="btn-back-to-stories"
                type="button"
                onClick={onBackToDailyStories}
                className="inline-flex items-center justify-center gap-1.5 bg-white hover:bg-zinc-100 text-zinc-900 font-sans-clean font-bold text-sm py-2.5 px-3.5 rounded-xl border-2 border-zinc-900 shadow-[2.5px_2.5px_0px_#18181b] active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer"
              >
                <RotateCcw size={15} />
                <span className="hidden sm:inline">Daily Stories</span>
              </button>
            </div>
          </div>
        </div>

        {/* Borough Filter Tabs */}
        <div className="mt-6 pt-4 border-t-2 border-zinc-900/15 flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1 mr-1">
            <Filter size={12} />
            <span>Borough:</span>
          </span>
          {BOROUGHS.map((b) => {
            const isSelected = selectedBorough === b;
            const count =
              b === 'ALL'
                ? entries.length
                : entries.filter((e) =>
                    e.borough?.toUpperCase().includes(b) ||
                    (b === 'MANHATTAN' && e.borough?.toUpperCase().includes('NEW YORK'))
                  ).length;

            return (
              <button
                key={b}
                type="button"
                onClick={() => setSelectedBorough(b)}
                className={`text-xs font-bold px-3 py-1.5 rounded-full border border-zinc-900 transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-purple-600 text-white shadow-[1.5px_1.5px_0px_#18181b]'
                    : 'bg-white text-zinc-700 hover:bg-zinc-100'
                }`}
              >
                {b === 'ALL' ? 'All Boroughs' : b} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Moments Wall Grid */}
      {isLoading ? (
        <div className="w-full py-16 flex flex-col items-center justify-center text-center bg-white border-2 border-zinc-900 rounded-2xl p-8">
          <div className="text-3xl animate-bounce mb-2">💌</div>
          <p className="font-sans-clean font-bold text-zinc-700">
            Gathering moments from across New York City...
          </p>
        </div>
      ) : filteredEntries.length === 0 ? (
        <div className="w-full py-12 flex flex-col items-center justify-center text-center bg-[#F5F2EB] border-2 border-zinc-900 rounded-2xl p-8 shadow-[4px_4px_0px_#18181b]">
          <div className="text-4xl mb-3">🗽</div>
          <h3 className="font-card text-xl font-bold text-zinc-900 mb-1">
            No moments found for {selectedBorough}
          </h3>
          <p className="font-sans-clean text-xs text-zinc-600 mb-4">
            Be the first to share something good that happened in this borough!
          </p>
          <button
            type="button"
            onClick={() => setIsPostingModalOpen(true)}
            className="inline-flex items-center gap-1.5 bg-zinc-900 text-white font-bold text-xs py-2 px-4 rounded-xl border border-zinc-900 shadow-[2px_2px_0px_#18181b] cursor-pointer"
          >
            <PenLine size={13} />
            <span>Write a moment</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredEntries.map((entry, idx) => {
            const hasLiked = likedEntryIds.has(entry.id);
            const isCopied = copiedId === entry.id;

            return (
              <article
                key={entry.id}
                className="bg-[#F5F2EB] border-[2.5px] border-zinc-900 rounded-[22px] shadow-[4.5px_4.5px_0px_#18181b] p-5 sm:p-6 flex flex-col justify-between hover:translate-y-[-2px] transition-transform select-none"
              >
                {/* Card Top */}
                <div>
                  <div className="flex items-center justify-between mb-3 text-xs font-bold text-zinc-600">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-100 border border-zinc-900/40 text-purple-900 text-[11px] uppercase tracking-wider font-bold">
                      <MessageCircle size={12} />
                      <span>Fellow New Yorker</span>
                    </span>

                    {entry.borough && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-zinc-700 bg-white px-2 py-0.5 rounded-md border border-zinc-900/30">
                        <MapPin size={11} className="text-zinc-500" />
                        <span>{entry.borough}</span>
                      </span>
                    )}
                  </div>

                  {/* Headline quote */}
                  <div className="my-3 min-h-[70px] flex items-center">
                    <h3 className="font-card text-xl sm:text-[22px] leading-[1.3] font-bold text-zinc-900">
                      "{entry.headline}"
                    </h3>
                  </div>
                </div>

                {/* Card Bottom: Date & Interactive Actions */}
                <div className="pt-3.5 mt-2 border-t-2 border-zinc-900/10 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-semibold text-zinc-500">
                    {new Date(entry.submittedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>

                  <div className="flex items-center gap-2">
                    {/* Send Love / Heart Button */}
                    <button
                      type="button"
                      onClick={(e) => handleLike(entry, e)}
                      title="Send love to this moment"
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-900 font-bold transition-all cursor-pointer ${
                        hasLiked
                          ? 'bg-rose-100 text-rose-700 shadow-[1px_1px_0px_#18181b]'
                          : 'bg-white text-zinc-700 hover:bg-rose-50 hover:text-rose-600 shadow-[1.5px_1.5px_0px_#18181b]'
                      }`}
                    >
                      <Heart
                        size={13}
                        className={hasLiked ? 'fill-rose-600 text-rose-600' : 'text-zinc-500'}
                      />
                      <span>{entry.likesCount || 0}</span>
                    </button>

                    {/* Copy Postcard Text */}
                    <button
                      type="button"
                      onClick={() => handleCopyMoment(entry)}
                      title="Copy moment postcard text"
                      className="p-1.5 rounded-xl bg-white hover:bg-zinc-100 text-zinc-700 border border-zinc-900 shadow-[1.5px_1.5px_0px_#18181b] cursor-pointer"
                    >
                      <Share2 size={13} />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Write & Post Moment Modal */}
      {isPostingModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setIsPostingModalOpen(false)}
        >
          <div
            className="w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <JournalPrompt
              onEntryComplete={async () => {
                await loadEntries();
                setIsPostingModalOpen(false);
              }}
              onSkip={() => setIsPostingModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
