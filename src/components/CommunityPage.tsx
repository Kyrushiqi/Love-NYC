import React, { useEffect, useState } from 'react';
import { UserStory, CommunityEntry } from '../types';
import {
  Share2,
  Heart,
  CheckCircle,
  AlertCircle,
  MessageCircle,
} from 'lucide-react';
import {
  shareToContext,
  getDailyFeaturedCommunityEntry,
} from '../utils/journalStorage';

interface CommunityPageProps {
  userEntry: UserStory | null;
  onClose: () => void;
}

export const CommunityPage: React.FC<CommunityPageProps> = ({
  userEntry,
  onClose,
}) => {
  const [sharedEntry, setSharedEntry] = useState<CommunityEntry | null>(null);
  const [isSharing, setIsSharing] = useState<boolean>(false);
  const [hasShared, setHasShared] = useState<boolean>(false);
  const [shareError, setShareError] = useState<string>('');

  useEffect(() => {
    let isMounted = true;

    getDailyFeaturedCommunityEntry().then((entry) => {
      if (isMounted) {
        setSharedEntry(entry);
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
      await new Promise((resolve) => setTimeout(resolve, 500));

      const success = await shareToContext(userEntry.id);

      if (success) {
        setHasShared(true);
        setTimeout(async () => {
          const refreshedEntry = await getDailyFeaturedCommunityEntry();
          setSharedEntry(refreshedEntry);
        }, 800);
      } else {
        setShareError(
          'Your entry contains content we cannot share. Please try something else.'
        );
      }
    } catch (err) {
      setShareError('Something went wrong. Please try again.');
    } finally {
      setIsSharing(false);
    }
  };

  // If no community entry exists and user hasn't written one
  if (!sharedEntry && !userEntry) {
    return (
      <article className="relative w-full max-w-md mx-auto bg-[#F5F2EB] border-[2.5px] border-zinc-900 rounded-[24px] shadow-[6px_6px_0px_#18181b] p-6 flex flex-col items-center justify-center min-h-[380px] text-center">
        <div className="mb-4 text-5xl">💜</div>
        <h2 className="font-card text-2xl font-bold text-zinc-900 mb-3">
          Come back tomorrow
        </h2>
        <p className="font-sans-clean text-zinc-600 text-sm leading-relaxed mb-6">
          Other New Yorkers will share their good moments, and you can too.
        </p>
        <button
          onClick={onClose}
          className="bg-zinc-900 hover:bg-zinc-800 text-white font-sans-clean font-bold text-sm py-2.5 px-4 rounded-xl border-2 border-zinc-900 shadow-[2px_2px_0px_#18181b] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#18181b] transition-all cursor-pointer"
        >
          Close app
        </button>
      </article>
    );
  }

  // Show shared community entry if it exists
  if (sharedEntry) {
    return (
      <article className="relative w-full max-w-md mx-auto bg-[#F5F2EB] border-[2.5px] border-zinc-900 rounded-[24px] shadow-[6px_6px_0px_#18181b] p-6 flex flex-col justify-between select-none text-zinc-900">
        {/* Header - Community Label */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-200 border-2 border-zinc-900 text-purple-900 text-xs font-bold uppercase tracking-wider shadow-[2px_2px_0px_#18181b]">
              <MessageCircle size={14} />
              <span>Community</span>
            </span>
          </div>

          {/* Date Badge */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-zinc-600 uppercase">
              From a fellow New Yorker
            </span>
            <span className="text-xs font-bold text-zinc-600 uppercase">
              {new Date().toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>

          <div className="mb-4">
            <h2 className="font-card text-2xl sm:text-[28px] leading-[1.22] font-bold text-zinc-900">
              {sharedEntry.headline}
            </h2>
          </div>

          {/* Privacy note */}
          <p className="font-sans-clean text-zinc-600 text-xs leading-relaxed italic">
            This entry has been anonymized and shared with permission.
            {sharedEntry.borough && (
              <>
                <br />
                <span className="not-italic">📍 {sharedEntry.borough}</span>
              </>
            )}
          </p>
        </div>

        {/* Actions */}
        <div className="pt-4 border-t-2 border-zinc-900/20 flex flex-col gap-2">
          <button
            onClick={onClose}
            className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-sans-clean font-bold text-sm py-2.5 px-4 rounded-xl border-2 border-zinc-900 shadow-[2px_2px_0px_#18181b] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#18181b] transition-all cursor-pointer"
          >
            That's all for today
          </button>
        </div>
      </article>
    );
  }

  // Show user's entry with option to share
  if (userEntry && !hasShared) {
    return (
      <article className="relative w-full max-w-md mx-auto bg-[#F5F2EB] border-[2.5px] border-zinc-900 rounded-[24px] shadow-[6px_6px_0px_#18181b] p-6 flex flex-col justify-between select-none text-zinc-900">
        {/* Header */}
        <div className="mb-6">
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

          <h2 className="font-card text-2xl sm:text-[28px] leading-[1.22] font-bold text-zinc-900 mb-4">
            {userEntry.headline}
          </h2>

          <p className="font-sans-clean text-zinc-600 text-sm leading-relaxed">
            Would you like to share this with other New Yorkers? Your name
            stays private — only your words appear in the community.
          </p>
        </div>

        {/* Error message */}
        {shareError && (
          <div className="mb-4 flex items-start gap-2 p-3 bg-red-100 border border-red-300 rounded-lg">
            <AlertCircle
              size={16}
              className="text-red-600 mt-0.5 flex-shrink-0"
            />
            <p className="font-sans-clean text-xs text-red-800">{shareError}</p>
          </div>
        )}

        {/* Actions */}
        <div className="pt-4 border-t-2 border-zinc-900/20 flex flex-col gap-2.5">
          <button
            onClick={handleShareToCommunity}
            disabled={isSharing}
            className="w-full inline-flex items-center justify-center gap-2 bg-rose-300 hover:bg-rose-400 disabled:opacity-50 disabled:cursor-not-allowed text-rose-900 font-sans-clean font-bold text-sm py-3 px-4 rounded-xl border-2 border-zinc-900 shadow-[2px_2px_0px_#18181b] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#18181b] transition-all cursor-pointer"
          >
            <Share2 size={15} />
            <span>{isSharing ? 'Sharing...' : 'Share with Community'}</span>
          </button>

          <button
            onClick={onClose}
            disabled={isSharing}
            className="text-xs text-zinc-600 hover:text-zinc-900 font-semibold py-1 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Keep private & close
          </button>
        </div>
      </article>
    );
  }

  // Success state after sharing
  return (
    <article className="relative w-full max-w-md mx-auto bg-[#F5F2EB] border-[2.5px] border-zinc-900 rounded-[24px] shadow-[6px_6px_0px_#18181b] p-6 flex flex-col items-center justify-center min-h-[320px] text-center">
      <div className="mb-4">
        <CheckCircle
          size={48}
          className="text-emerald-600 fill-emerald-100 mx-auto"
        />
      </div>
      <h2 className="font-card text-2xl sm:text-3xl font-bold text-zinc-900 mb-2">
        Your story is shared.
      </h2>
      <p className="font-sans-clean text-zinc-700 text-sm leading-relaxed mb-6">
        Other New Yorkers will see your moment of good. Thank you for making
        this better.
      </p>

      <button
        onClick={onClose}
        className="bg-zinc-900 hover:bg-zinc-800 text-white font-sans-clean font-bold text-sm py-2.5 px-6 rounded-xl border-2 border-zinc-900 shadow-[2px_2px_0px_#18181b] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#18181b] transition-all cursor-pointer"
      >
        Close app
      </button>
    </article>
  );
};
