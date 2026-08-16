import React, { useEffect, useState } from 'react';
import { UserStory, CommunityEntry } from '../types';
import {
  Share2,
  Heart,
  CheckCircle,
  AlertCircle,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  PenLine,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  shareToContext,
  getAllCommunityEntries,
  likeCommunityEntry,
} from '../utils/journalStorage';

interface CommunityPageProps {
  userEntry: UserStory | null;
  onClose: () => void;
  onWriteMoment?: () => void;
  onOpenCommunityBoard?: () => void;
}

export const CommunityPage: React.FC<CommunityPageProps> = ({
  userEntry,
  onClose,
  onWriteMoment,
  onOpenCommunityBoard,
}) => {
  const [communityEntries, setCommunityEntries] = useState<CommunityEntry[]>([]);
  const [activeCommunityIndex, setActiveCommunityIndex] = useState<number>(0);
  const [viewState, setViewState] = useState<'opt_in' | 'celebration' | 'feed'>(
    userEntry ? 'opt_in' : 'feed'
  );
  const [isSharing, setIsSharing] = useState<boolean>(false);
  const [shareError, setShareError] = useState<string>('');
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    let isMounted = true;

    getAllCommunityEntries().then((entries) => {
      if (isMounted) {
        setCommunityEntries(entries);
        if (entries.length > 0) {
          const today = new Date().toDateString();
          const seed = today
            .split('')
            .reduce((acc, char) => acc + char.charCodeAt(0), 0);
          setActiveCommunityIndex(seed % entries.length);
        }
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleShareToCommunity = async () => {
    if (!userEntry) return;

    setIsSharing(true);
    setShareError('');

    try {
      const success = await shareToContext(userEntry.id);

      if (success) {
        confetti({
          particleCount: 40,
          spread: 65,
          origin: { y: 0.65 },
          colors: ['#A855F7', '#EC4899', '#3B82F6', '#10B981', '#F59E0B'],
        });

        setViewState('celebration');

        const refreshed = await getAllCommunityEntries();
        setCommunityEntries(refreshed);
        setActiveCommunityIndex(0);
      } else {
        setShareError(
          'Your entry contains words or patterns we cannot share publicly. It remains saved in your private journal.'
        );
      }
    } catch (err) {
      setShareError('Unable to share right now. Please try again in a moment.');
    } finally {
      setIsSharing(false);
    }
  };

  const handleLike = async (entry: CommunityEntry, e: React.MouseEvent) => {
    e.stopPropagation();
    if (likedIds.has(entry.id)) return;

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 15,
      spread: 45,
      origin: { x, y },
      colors: ['#E11D48', '#EC4899', '#A855F7'],
    });

    setLikedIds((prev) => new Set(prev).add(entry.id));

    setCommunityEntries((prev) =>
      prev.map((item) =>
        item.id === entry.id
          ? { ...item, likesCount: (item.likesCount || 0) + 1 }
          : item
      )
    );

    await likeCommunityEntry(entry.id);
  };

  const handleNextMoment = () => {
    if (communityEntries.length <= 1) return;
    setActiveCommunityIndex((prev) => (prev + 1) % communityEntries.length);
  };

  const handlePrevMoment = () => {
    if (communityEntries.length <= 1) return;
    setActiveCommunityIndex((prev) =>
      prev === 0 ? communityEntries.length - 1 : prev - 1
    );
  };

  // STEP 1: If user just wrote a moment, ask if they'd like to share it
  if (viewState === 'opt_in' && userEntry) {
    return (
      <article
        id="user-moment-share-card"
        className="relative w-full max-w-md mx-auto bg-[#F5F2EB] border-[2.5px] border-zinc-900 rounded-[24px] shadow-[6px_6px_0px_#18181b] p-6 flex flex-col justify-between select-none text-zinc-900 min-h-[440px]"
      >
        {/* Header */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-200 border-2 border-zinc-900 text-rose-900 text-xs font-bold uppercase tracking-wider shadow-[2px_2px_0px_#18181b]">
              <Heart size={14} className="fill-rose-600 text-rose-600" />
              <span>🫶 Yours</span>
            </span>

            <span className="text-xs font-bold text-zinc-600 uppercase">
              {new Date().toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>

          {/* User's headline styled in handwriting/card display font */}
          <div className="my-4 p-4 bg-white/80 border-2 border-zinc-900/40 rounded-2xl shadow-[inset_1px_1px_0px_rgba(0,0,0,0.06)]">
            <h2 className="font-handwriting text-2xl sm:text-[26px] leading-[1.3] text-zinc-900">
              "{userEntry.headline}"
            </h2>
            {userEntry.borough && (
              <div className="mt-2 text-xs font-bold text-zinc-600">
                📍 {userEntry.borough}
              </div>
            )}
          </div>

          <div className="mt-4 p-3 bg-purple-100 border border-purple-300 rounded-xl text-purple-950">
            <p className="font-sans-clean text-xs sm:text-[13px] leading-relaxed font-medium">
              <strong>Share with fellow New Yorkers?</strong> Your identity stays 100% private — only your positive moment is shared with fellow New Yorkers on the Community board.
            </p>
          </div>
        </div>

        {/* Error message */}
        {shareError && (
          <div className="my-3 flex items-start gap-2 p-3 bg-red-100 border border-red-300 rounded-lg">
            <AlertCircle
              size={16}
              className="text-red-600 mt-0.5 flex-shrink-0"
            />
            <p className="font-sans-clean text-xs text-red-800">{shareError}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-5 pt-4 border-t-2 border-zinc-900/20 flex flex-col gap-2.5">
          <button
            id="btn-confirm-share-community"
            type="button"
            onClick={handleShareToCommunity}
            disabled={isSharing}
            className="w-full inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-sans-clean font-bold text-sm py-3 px-4 rounded-xl border-2 border-zinc-900 shadow-[2px_2px_0px_#18181b] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#18181b] transition-all cursor-pointer"
          >
            <Share2 size={16} />
            <span>{isSharing ? 'Sharing anonymously...' : 'Share with Fellow New Yorkers'}</span>
          </button>

          <button
            type="button"
            onClick={() => setViewState('feed')}
            disabled={isSharing}
            className="w-full text-center text-xs text-zinc-600 hover:text-zinc-900 font-semibold py-1.5 transition-colors cursor-pointer"
          >
            Keep private & see community moments →
          </button>
        </div>
      </article>
    );
  }

  // STEP 2: Celebration banner after sharing
  if (viewState === 'celebration') {
    return (
      <article
        id="community-share-success-card"
        className="relative w-full max-w-md mx-auto bg-[#F5F2EB] border-[2.5px] border-zinc-900 rounded-[24px] shadow-[6px_6px_0px_#18181b] p-6 flex flex-col items-center justify-center min-h-[400px] text-center select-none"
      >
        <div className="mb-4">
          <CheckCircle
            size={52}
            className="text-emerald-600 fill-emerald-100 mx-auto"
          />
        </div>
        <h2 className="font-card text-2xl sm:text-3xl font-bold text-zinc-900 mb-2">
          Your moment is shared.
        </h2>
        <p className="font-sans-clean text-zinc-700 text-sm leading-relaxed mb-6 max-w-xs">
          Other New Yorkers will see your moment of good today. Thank you for making NYC a little brighter.
        </p>

        <div className="w-full flex flex-col gap-2.5">
          <button
            type="button"
            onClick={() => setViewState('feed')}
            className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-sans-clean font-bold text-sm py-3 px-4 rounded-xl border-2 border-zinc-900 shadow-[2px_2px_0px_#18181b] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#18181b] transition-all cursor-pointer"
          >
            Read what other New Yorkers shared →
          </button>
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-zinc-600 hover:text-zinc-900 font-semibold py-1 transition-colors cursor-pointer"
          >
            Done for today
          </button>
        </div>
      </article>
    );
  }

  // STEP 3: Community Feed / Moments from Fellow New Yorkers
  const currentMoment =
    communityEntries.length > 0
      ? communityEntries[activeCommunityIndex]
      : null;

  return (
    <article
      id="community-moment-card"
      className="relative w-full max-w-md mx-auto bg-[#F5F2EB] border-[2.5px] border-zinc-900 rounded-[24px] shadow-[6px_6px_0px_#18181b] p-6 flex flex-col justify-between select-none text-zinc-900 min-h-[440px]"
    >
      {/* Top metadata */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-200 border-2 border-zinc-900 text-purple-950 text-xs font-bold uppercase tracking-wider shadow-[2px_2px_0px_#18181b]">
            <MessageCircle size={14} className="text-purple-800" />
            <span>Community</span>
          </span>

          <span className="text-xs font-bold text-zinc-600 uppercase">
            {communityEntries.length > 0
              ? `Moment ${activeCommunityIndex + 1} of ${communityEntries.length}`
              : 'Today'}
          </span>
        </div>

        {/* Attribution Subheader */}
        <div className="flex items-center justify-between mb-3 text-xs font-bold text-zinc-500 uppercase tracking-wider">
          <span>From a fellow New Yorker</span>
          <span>
            {new Date().toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>

        {/* The Fellow New Yorker's Headline */}
        {currentMoment ? (
          <div className="my-3">
            <h2 className="font-card text-2xl sm:text-[28px] leading-[1.25] font-bold text-zinc-900">
              "{currentMoment.headline}"
            </h2>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-zinc-600">
                {currentMoment.borough && (
                  <span className="inline-flex items-center gap-1 bg-white px-2 py-0.5 rounded-md border border-zinc-900/30 font-bold text-zinc-800">
                    📍 {currentMoment.borough}
                  </span>
                )}
                <span className="italic text-zinc-500 text-[11px]">
                  Shared anonymously
                </span>
              </div>

              {/* Heart reaction button */}
              <button
                type="button"
                onClick={(e) => handleLike(currentMoment, e)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-zinc-900 text-xs font-bold transition-all cursor-pointer ${
                  likedIds.has(currentMoment.id)
                    ? 'bg-rose-100 text-rose-700 shadow-[1px_1px_0px_#18181b]'
                    : 'bg-white text-zinc-700 hover:bg-rose-50 shadow-[1.5px_1.5px_0px_#18181b]'
                }`}
              >
                <Heart
                  size={12}
                  className={likedIds.has(currentMoment.id) ? 'fill-rose-600 text-rose-600' : 'text-zinc-500'}
                />
                <span>{currentMoment.likesCount || 0}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="my-6 text-center py-6">
            <p className="text-zinc-600 text-sm">
              Loading moments from fellow New Yorkers...
            </p>
          </div>
        )}
      </div>

      {/* Interactive Moment Navigation Controls & Footer Actions */}
      <div className="mt-5 pt-4 border-t-2 border-zinc-900/20 flex flex-col gap-3">
        {communityEntries.length > 1 && (
          <div className="flex items-center justify-between gap-2">
            <button
              id="btn-prev-community-moment"
              type="button"
              onClick={handlePrevMoment}
              className="inline-flex items-center gap-1 text-xs font-bold bg-white hover:bg-zinc-100 text-zinc-900 px-3 py-2 rounded-xl border-2 border-zinc-900 shadow-[1.5px_1.5px_0px_#18181b] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
            >
              <ChevronLeft size={14} />
              <span>Previous</span>
            </button>

            <span className="text-[11px] font-bold text-zinc-500">
              {activeCommunityIndex + 1} / {communityEntries.length}
            </span>

            <button
              id="btn-next-community-moment"
              type="button"
              onClick={handleNextMoment}
              className="inline-flex items-center gap-1 text-xs font-bold bg-purple-100 hover:bg-purple-200 text-purple-950 px-3 py-2 rounded-xl border-2 border-zinc-900 shadow-[1.5px_1.5px_0px_#18181b] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
            >
              <span>Next Moment</span>
              <ChevronRight size={14} />
            </button>
          </div>
        )}

        <div className="flex gap-2">
          {onWriteMoment && (
            <button
              id="btn-community-write-moment"
              type="button"
              onClick={onWriteMoment}
              className="flex-1 inline-flex items-center justify-center gap-1.5 bg-rose-100 hover:bg-rose-200 text-rose-900 font-sans-clean font-bold text-xs py-2.5 px-3 rounded-xl border-2 border-zinc-900 shadow-[2px_2px_0px_#18181b] active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer"
            >
              <PenLine size={13} />
              <span>Write your moment</span>
            </button>
          )}

          <button
            id="btn-close-community"
            type="button"
            onClick={onClose}
            className="flex-1 inline-flex items-center justify-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 text-white font-sans-clean font-bold text-xs py-2.5 px-3 rounded-xl border-2 border-zinc-900 shadow-[2px_2px_0px_#18181b] active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>Back to Stories</span>
          </button>
        </div>
      </div>
    </article>
  );
};
