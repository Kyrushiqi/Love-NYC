import React, { useState } from 'react';
import { UserStory } from '../types';
import { Heart, AlertCircle, CheckCircle, MapPin, Share2, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';
import { validateJournalEntry } from '../utils/contentFilter';
import { saveJournalEntry, shareToContext } from '../utils/journalStorage';

const BOROUGHS = [
  'MANHATTAN',
  'BROOKLYN',
  'QUEENS',
  'BRONX',
  'STATEN ISLAND',
] as const;

interface JournalPromptProps {
  onEntryComplete: (entry: UserStory) => void;
  onSkip: () => void;
}

export const JournalPrompt: React.FC<JournalPromptProps> = ({
  onEntryComplete,
  onSkip,
}) => {
  const [input, setInput] = useState<string>('');
  const [selectedBorough, setSelectedBorough] = useState<string>('MANHATTAN');
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');

  const MAX_LENGTH = 140;
  const charCount = input.length;

  const handleSaveAndShare = async (shouldShare: boolean) => {
    setError('');

    const validated = validateJournalEntry(input, MAX_LENGTH);

    if (!validated) {
      setError(
        'Please write 1-140 characters about something good that happened to you today.'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Save entry locally
      const entry = saveJournalEntry(validated, selectedBorough);

      if (shouldShare) {
        // 2. Share to public community feed
        const shared = await shareToContext(entry.id);
        if (!shared) {
          setError(
            'Your entry contains words or patterns we cannot share publicly. It is saved in your private journal.'
          );
          setIsSubmitting(false);
          return;
        }

        entry.isSharedToCommunity = true;

        confetti({
          particleCount: 45,
          spread: 65,
          origin: { y: 0.65 },
          colors: ['#A855F7', '#EC4899', '#3B82F6', '#10B981', '#F59E0B'],
        });

        setSuccessMessage('Your moment is shared anonymously with fellow New Yorkers!');
      } else {
        setSuccessMessage('Saved to your private journal.');
      }

      setIsSuccess(true);

      setTimeout(() => {
        onEntryComplete(entry);
      }, 1000);
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <article className="relative w-full max-w-md mx-auto bg-[#F5F2EB] border-[2.5px] border-zinc-900 rounded-[24px] shadow-[6px_6px_0px_#18181b] p-6 flex flex-col items-center justify-center min-h-[360px] text-center select-none">
        <div className="mb-4">
          <CheckCircle
            size={52}
            className="text-emerald-600 fill-emerald-100 mx-auto"
          />
        </div>
        <h2 className="font-card text-2xl sm:text-3xl font-bold text-zinc-900 mb-2">
          Your story matters.
        </h2>
        <p className="font-sans-clean text-zinc-700 text-sm leading-relaxed mb-4 max-w-xs">
          {successMessage}
        </p>
      </article>
    );
  }

  return (
    <article className="relative w-full max-w-md mx-auto bg-[#F5F2EB] border-[2.5px] border-zinc-900 rounded-[24px] shadow-[6px_6px_0px_#18181b] p-6 flex flex-col justify-between select-none text-zinc-900">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
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

        <h2 className="font-card text-2xl sm:text-[30px] leading-[1.2] font-bold text-zinc-900 mb-2">
          What good thing happened to you
          <span className="block">in New York today?</span>
        </h2>

        <p className="font-sans-clean text-zinc-600 text-xs sm:text-sm leading-relaxed">
          One small moment. Share it anonymously with fellow New Yorkers, or keep it private.
        </p>
      </div>

      {/* Input Form */}
      <div className="mb-3">
        <textarea
          value={input}
          onChange={(e) => {
            setInput(e.target.value.slice(0, MAX_LENGTH));
            setError('');
          }}
          placeholder="e.g., A stranger held the door at Union Square. A neighbor left flowers on the stoop. The sunset over the river was stunning."
          maxLength={MAX_LENGTH}
          disabled={isSubmitting}
          className="w-full p-3 font-handwriting text-lg leading-relaxed border-2 border-zinc-900 rounded-xl bg-white text-zinc-900 placeholder-zinc-400 resize-none focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[inset_1.5px_1.5px_0px_rgba(0,0,0,0.06)]"
          rows={3}
          aria-label="Your positive moment"
        />

        {/* Character count */}
        <div className="mt-2 flex items-center justify-between text-xs font-sans-clean">
          <span className={charCount > 0 ? 'text-zinc-700 font-semibold' : 'text-zinc-500'}>
            {charCount} / {MAX_LENGTH}
          </span>
          {charCount > MAX_LENGTH * 0.9 && charCount < MAX_LENGTH && (
            <span className="text-amber-600 font-semibold">Keep it brief!</span>
          )}
        </div>

        {/* Borough selection */}
        <div className="mt-3">
          <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-zinc-600 mb-1.5">
            <MapPin size={12} className="text-zinc-500" />
            <span>Which borough did this happen in?</span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {BOROUGHS.map((b) => {
              const isSelected = selectedBorough === b;
              return (
                <button
                  key={b}
                  type="button"
                  onClick={() => setSelectedBorough(b)}
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-full border border-zinc-900 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-purple-600 text-white shadow-[1.5px_1.5px_0px_#18181b]'
                      : 'bg-white text-zinc-700 hover:bg-zinc-100'
                  }`}
                >
                  {b}
                </button>
              );
            })}
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mt-3 flex items-start gap-2 p-3 bg-red-100 border border-red-300 rounded-lg">
            <AlertCircle
              size={16}
              className="text-red-600 mt-0.5 flex-shrink-0"
            />
            <p className="font-sans-clean text-xs text-red-800">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-4 flex flex-col gap-2.5">
          <button
            type="button"
            onClick={() => handleSaveAndShare(true)}
            disabled={input.trim().length === 0 || isSubmitting}
            className="w-full inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-sans-clean font-bold text-sm py-3 px-4 rounded-xl border-2 border-zinc-900 shadow-[2px_2px_0px_#18181b] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#18181b] transition-all cursor-pointer"
          >
            <Share2 size={16} />
            <span>{isSubmitting ? 'Sharing...' : 'Share Anonymously with NYC'}</span>
          </button>

          <button
            type="button"
            onClick={() => handleSaveAndShare(false)}
            disabled={input.trim().length === 0 || isSubmitting}
            className="w-full inline-flex items-center justify-center gap-1.5 bg-white hover:bg-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed text-zinc-900 font-sans-clean font-bold text-xs py-2 px-3 rounded-xl border border-zinc-900 shadow-[1.5px_1.5px_0px_#18181b] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
          >
            <Lock size={13} className="text-zinc-600" />
            <span>Save to Private Journal Only</span>
          </button>
        </div>
      </div>

      {/* Skip option */}
      <button
        type="button"
        onClick={onSkip}
        disabled={isSubmitting}
        className="text-xs text-zinc-600 hover:text-zinc-900 font-semibold py-1 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-center"
      >
        Skip to community moments →
      </button>
    </article>
  );
};
