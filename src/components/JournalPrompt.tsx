import React, { useState } from 'react';
import { UserStory } from '../types';
import { Heart, AlertCircle, CheckCircle, MapPin } from 'lucide-react';
import { validateJournalEntry } from '../utils/contentFilter';
import { saveJournalEntry } from '../utils/journalStorage';

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

  const MAX_LENGTH = 140;
  const charCount = input.length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      // Simulate slight delay for UX
      await new Promise((resolve) => setTimeout(resolve, 300));

      const entry = saveJournalEntry(validated, selectedBorough);
      setIsSuccess(true);

      // Brief celebration, then move to next screen
      setTimeout(() => {
        onEntryComplete(entry);
      }, 900);
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <article className="relative w-full max-w-md mx-auto bg-[#F5F2EB] border-[2.5px] border-zinc-900 rounded-[24px] shadow-[6px_6px_0px_#18181b] p-6 flex flex-col items-center justify-center min-h-[340px] text-center select-none">
        <div className="mb-4">
          <CheckCircle
            size={48}
            className="text-emerald-600 fill-emerald-100 mx-auto"
          />
        </div>
        <h2 className="font-card text-2xl sm:text-3xl font-bold text-zinc-900 mb-2">
          Your story matters.
        </h2>
        <p className="font-sans-clean text-zinc-700 text-sm leading-relaxed mb-4">
          It's saved in your private journal. You can share it anonymously with fellow New Yorkers next!
        </p>
      </article>
    );
  }

  return (
    <article className="relative w-full max-w-md mx-auto bg-[#F5F2EB] border-[2.5px] border-zinc-900 rounded-[24px] shadow-[6px_6px_0px_#18181b] p-6 flex flex-col justify-between select-none text-zinc-900">
      {/* Header */}
      <div className="mb-5">
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
          One small moment. Private by default — or share anonymously with the community.
        </p>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="mb-3">
        <textarea
          value={input}
          onChange={(e) => {
            setInput(e.target.value.slice(0, MAX_LENGTH));
            setError('');
          }}
          placeholder="e.g., A stranger held the door. A park was quieter than usual. The sunset over the East River was stunning."
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
                      ? 'bg-rose-300 text-rose-950 shadow-[1.5px_1.5px_0px_#18181b]'
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

        {/* Submit Button */}
        <button
          type="submit"
          disabled={input.trim().length === 0 || isSubmitting}
          className="w-full mt-4 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-sans-clean font-bold text-sm py-3 px-4 rounded-xl border-2 border-zinc-900 shadow-[2px_2px_0px_#18181b] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#18181b] transition-all cursor-pointer"
        >
          {isSubmitting ? 'Saving...' : 'Save & Share with Community'}
        </button>
      </form>

      {/* Skip option */}
      <button
        type="button"
        onClick={onSkip}
        disabled={isSubmitting}
        className="text-xs text-zinc-600 hover:text-zinc-900 font-semibold py-1 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Skip to community moments →
      </button>
    </article>
  );
};
