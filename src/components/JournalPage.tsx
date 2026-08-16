import React, { useState, useEffect } from 'react';
import { UserStory } from '../types';
import {
  Heart,
  AlertCircle,
  CheckCircle,
  MapPin,
  Share2,
  Lock,
  Globe,
  Sparkles,
  BookOpen,
  PenLine,
  Trash2,
  Copy,
  Check,
  RotateCcw,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { validateJournalEntry } from '../utils/contentFilter';
import {
  fetchJournalEntries,
  saveJournalEntryAsync,
  shareToContext,
} from '../utils/journalStorage';

const BOROUGHS = [
  'MANHATTAN',
  'BROOKLYN',
  'QUEENS',
  'BRONX',
  'STATEN ISLAND',
] as const;

const INSPIRATION_PROMPTS = [
  'A stranger held the door at Union Square and smiled.',
  'Found free fresh flowers on a stoop in Greenpoint.',
  'An acoustic jazz duo was playing in the park at sunset.',
  'The bodega cat fell asleep right next to the register.',
  'Someone helped carry a heavy stroller down the subway stairs.',
];

interface JournalPageProps {
  onBackToStories: () => void;
  onOpenCommunity: () => void;
}

export const JournalPage: React.FC<JournalPageProps> = ({
  onBackToStories,
  onOpenCommunity,
}) => {
  const [entries, setEntries] = useState<UserStory[]>([]);
  const [input, setInput] = useState<string>('');
  const [selectedBorough, setSelectedBorough] = useState<string>('MANHATTAN');
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isLoadingEntries, setIsLoadingEntries] = useState<boolean>(true);

  const MAX_LENGTH = 140;
  const charCount = input.length;

  const loadEntries = async () => {
    setIsLoadingEntries(true);
    try {
      const data = await fetchJournalEntries();
      setEntries(data || []);
    } catch (err) {
      console.warn('Failed to load journal entries:', err);
    } finally {
      setIsLoadingEntries(false);
    }
  };

  useEffect(() => {
    loadEntries();
  }, []);

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
      const entry = await saveJournalEntryAsync(validated, selectedBorough);

      if (shouldShare) {
        const shared = await shareToContext(entry);
        if (!shared.success) {
          setError(
            shared.error ||
              'Your entry contains words or patterns we cannot share publicly. It is saved in your private journal.'
          );
          setIsSubmitting(false);
          await loadEntries();
          return;
        }

        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#E11D48', '#A855F7', '#EC4899', '#3B82F6', '#10B981'],
        });

        setSuccessMessage('Saved & shared anonymously with fellow New Yorkers!');
      } else {
        confetti({
          particleCount: 25,
          spread: 45,
          origin: { y: 0.6 },
          colors: ['#E11D48', '#EC4899'],
        });
        setSuccessMessage('Saved safely in your private NYC journal.');
      }

      setInput('');
      await loadEntries();

      setTimeout(() => {
        setSuccessMessage('');
      }, 3500);
    } catch (err) {
      setError('Something went wrong while saving. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyEntry = (entry: UserStory) => {
    const text = `❤️ LOVE NYC Journal Moment\n\n"${entry.headline}"\n\n📍 ${entry.borough || 'New York City'} · ${new Date(entry.createdAt).toLocaleDateString()}\n#LoveNYC`;
    navigator.clipboard.writeText(text);
    setCopiedId(entry.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleShareExisting = async (entry: UserStory) => {
    try {
      const result = await shareToContext(entry);
      if (result.success) {
        confetti({
          particleCount: 35,
          spread: 60,
          origin: { y: 0.65 },
          colors: ['#A855F7', '#EC4899', '#3B82F6'],
        });
        await loadEntries();
      }
    } catch (err) {
      console.warn('Failed to share existing entry:', err);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 py-2 select-none">
      {/* Top Banner */}
      <div className="w-full bg-[#F5F2EB] border-[2.5px] border-zinc-900 rounded-[24px] shadow-[6px_6px_0px_#18181b] p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-200 border-2 border-zinc-900 text-rose-950 text-xs font-bold uppercase tracking-wider shadow-[2px_2px_0px_#18181b]">
                <Heart size={14} className="fill-rose-600 text-rose-600" />
                <span>MY NYC JOURNAL</span>
              </span>
              <span className="text-xs font-bold text-zinc-600 uppercase">
                {entries.length} {entries.length === 1 ? 'Moment Saved' : 'Moments Saved'}
              </span>
            </div>

            <h2 className="font-card text-2xl sm:text-3xl font-bold text-zinc-900 leading-tight">
              Your Everyday New York Moments
            </h2>
            <p className="mt-1 font-sans-clean text-zinc-600 text-xs sm:text-sm max-w-xl leading-relaxed">
              A private space for your everyday New York City memories, quiet joys, and neighborly love. Share anonymously with the city or keep them for yourself.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={onOpenCommunity}
              className="inline-flex items-center justify-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white font-sans-clean font-bold text-xs sm:text-sm py-2.5 px-4 rounded-xl border-2 border-zinc-900 shadow-[2px_2px_0px_#18181b] active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer"
            >
              <Globe size={14} />
              <span>Community Board</span>
            </button>

            <button
              type="button"
              onClick={onBackToStories}
              className="inline-flex items-center justify-center gap-1.5 bg-white hover:bg-zinc-100 text-zinc-900 font-sans-clean font-bold text-xs sm:text-sm py-2.5 px-3.5 rounded-xl border-2 border-zinc-900 shadow-[2px_2px_0px_#18181b] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
            >
              <RotateCcw size={14} />
              <span className="hidden sm:inline">Daily Stories</span>
            </button>
          </div>
        </div>
      </div>

      {/* Writing Prompt Card */}
      <div className="w-full bg-[#F5F2EB] border-[2.5px] border-zinc-900 rounded-[24px] shadow-[6px_6px_0px_#18181b] p-6 sm:p-7 text-zinc-900">
        <div className="flex items-center justify-between mb-3">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-700 font-sans-clean uppercase tracking-wide">
            <PenLine size={14} className="text-rose-500" />
            <span>Write Today's Positive Moment</span>
          </span>

          <span className="text-xs font-bold text-zinc-500 uppercase">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>

        <h3 className="font-card text-2xl sm:text-3xl font-bold text-zinc-900 mb-2">
          What good thing happened to you in New York today?
        </h3>

        {/* Textarea */}
        <div className="mt-3">
          <textarea
            value={input}
            onChange={(e) => {
              setInput(e.target.value.slice(0, MAX_LENGTH));
              setError('');
            }}
            placeholder="e.g., A stranger held the door at Union Square. The sunset from Brooklyn Bridge was breathtaking. A neighbor left fresh flowers on their stoop."
            maxLength={MAX_LENGTH}
            disabled={isSubmitting}
            rows={3}
            className="w-full p-3.5 font-handwriting text-xl leading-relaxed border-2 border-zinc-900 rounded-xl bg-white text-zinc-900 placeholder-zinc-400 resize-none focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 transition-all shadow-[inset_1.5px_1.5px_0px_rgba(0,0,0,0.06)]"
            aria-label="Write your positive moment"
          />

          {/* Character count & Inspiration Prompts */}
          <div className="mt-2 flex items-center justify-between text-xs font-sans-clean">
            <span className={charCount > 0 ? 'text-zinc-800 font-bold' : 'text-zinc-500'}>
              {charCount} / {MAX_LENGTH} characters
            </span>
            {charCount > MAX_LENGTH * 0.9 && (
              <span className="text-amber-600 font-bold">Keep it brief!</span>
            )}
          </div>
        </div>

        {/* Inspiration Prompt Pills */}
        {input.length === 0 && (
          <div className="mt-3 pt-2">
            <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block mb-1.5">
              Need inspiration? Click any idea:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {INSPIRATION_PROMPTS.slice(0, 3).map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setInput(prompt)}
                  className="text-xs bg-white/90 hover:bg-white text-zinc-800 border border-zinc-900/40 rounded-full px-3 py-1 font-sans-clean font-medium hover:border-zinc-900 transition-all cursor-pointer text-left"
                >
                  "{prompt}"
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Borough Selection */}
        <div className="mt-4 pt-3 border-t border-zinc-900/15">
          <div className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-zinc-600 mb-2">
            <MapPin size={13} className="text-zinc-500" />
            <span>Which borough did this take place in?</span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {BOROUGHS.map((b) => {
              const isSelected = selectedBorough === b;
              return (
                <button
                  key={b}
                  type="button"
                  onClick={() => setSelectedBorough(b)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-full border border-zinc-900 transition-all cursor-pointer ${
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
            <AlertCircle size={16} className="text-red-600 mt-0.5 flex-shrink-0" />
            <p className="font-sans-clean text-xs text-red-800">{error}</p>
          </div>
        )}

        {/* Success message */}
        {successMessage && (
          <div className="mt-3 flex items-center gap-2 p-3 bg-emerald-100 border border-emerald-300 rounded-xl text-emerald-900 font-bold font-sans-clean text-xs sm:text-sm animate-in fade-in duration-200">
            <CheckCircle size={18} className="text-emerald-700 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Submit Actions */}
        <div className="mt-5 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => handleSaveAndShare(true)}
            disabled={input.trim().length === 0 || isSubmitting}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-sans-clean font-bold text-sm py-3 px-4 rounded-xl border-2 border-zinc-900 shadow-[2.5px_2.5px_0px_#18181b] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#18181b] transition-all cursor-pointer"
          >
            <Share2 size={16} />
            <span>{isSubmitting ? 'Saving...' : 'Share Anonymously with NYC'}</span>
          </button>

          <button
            type="button"
            onClick={() => handleSaveAndShare(false)}
            disabled={input.trim().length === 0 || isSubmitting}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-white hover:bg-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed text-zinc-900 font-sans-clean font-bold text-sm py-3 px-4 rounded-xl border-2 border-zinc-900 shadow-[2px_2px_0px_#18181b] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
          >
            <Lock size={15} className="text-zinc-600" />
            <span>Save to Private Journal Only</span>
          </button>
        </div>
      </div>

      {/* Your Journal History Section */}
      <div className="w-full">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <BookOpen size={16} className="text-zinc-800" />
            <h3 className="font-card text-xl font-bold text-zinc-900">
              Saved Entries ({entries.length})
            </h3>
          </div>
        </div>

        {isLoadingEntries ? (
          <div className="w-full py-12 flex flex-col items-center justify-center text-center bg-[#F5F2EB] border-2 border-zinc-900 rounded-2xl p-6">
            <div className="text-2xl animate-spin mb-2">❤️</div>
            <p className="font-sans-clean font-bold text-zinc-700 text-sm">
              Loading your NYC journal...
            </p>
          </div>
        ) : entries.length === 0 ? (
          <div className="w-full py-10 flex flex-col items-center justify-center text-center bg-[#F5F2EB] border-[2.5px] border-zinc-900 rounded-[22px] p-8 shadow-[4px_4px_0px_#18181b]">
            <div className="text-4xl mb-2">📓</div>
            <h4 className="font-card text-xl font-bold text-zinc-900 mb-1">
              Your journal is waiting for its first moment
            </h4>
            <p className="font-sans-clean text-xs sm:text-sm text-zinc-600 max-w-sm mb-4">
              Write one small thing that made you smile today in New York above to start your collection.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {entries.map((entry) => {
              const isCopied = copiedId === entry.id;

              return (
                <article
                  key={entry.id}
                  className="bg-[#F5F2EB] border-[2.5px] border-zinc-900 rounded-[22px] shadow-[4px_4px_0px_#18181b] p-5 flex flex-col justify-between select-none hover:translate-y-[-1px] transition-transform"
                >
                  {/* Card Header */}
                  <div>
                    <div className="flex items-center justify-between mb-2 text-xs">
                      <span className="font-bold text-zinc-500">
                        {new Date(entry.createdAt).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>

                      {entry.borough && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-zinc-700 bg-white px-2 py-0.5 rounded-md border border-zinc-900/30">
                          <MapPin size={10} className="text-zinc-500" />
                          <span>{entry.borough}</span>
                        </span>
                      )}
                    </div>

                    {/* Headline Quote */}
                    <div className="my-2 min-h-[50px] flex items-center">
                      <p className="font-handwriting text-xl sm:text-[22px] leading-[1.3] text-zinc-900 font-medium">
                        "{entry.headline}"
                      </p>
                    </div>
                  </div>

                  {/* Card Bottom Status & Actions */}
                  <div className="pt-3 mt-2 border-t border-zinc-900/15 flex items-center justify-between text-xs">
                    <div>
                      {entry.isSharedToCommunity ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-900 bg-purple-100 px-2 py-0.5 rounded-full border border-purple-300">
                          <Globe size={11} />
                          <span>Shared with NYC</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-zinc-700 bg-white px-2 py-0.5 rounded-full border border-zinc-400">
                          <Lock size={10} />
                          <span>Private</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {!entry.isSharedToCommunity && (
                        <button
                          type="button"
                          onClick={() => handleShareExisting(entry)}
                          title="Share anonymously with NYC"
                          className="inline-flex items-center gap-1 text-[11px] font-bold bg-purple-100 hover:bg-purple-200 text-purple-900 px-2 py-1 rounded-lg border border-zinc-900 cursor-pointer"
                        >
                          <Share2 size={11} />
                          <span>Share</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleCopyEntry(entry)}
                        title="Copy entry text"
                        className="p-1 rounded-lg bg-white hover:bg-zinc-100 text-zinc-700 border border-zinc-900 cursor-pointer"
                      >
                        {isCopied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
