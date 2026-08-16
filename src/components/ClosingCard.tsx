import React from 'react';
import { CitySummary } from '../types';
import { RotateCcw, Map, Heart, Sparkles, CheckCircle, ExternalLink, NotebookPen } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ClosingCardProps {
  summary: CitySummary;
  onRestart: () => void;
  onOpenMap: () => void;
  onOpenJournal: () => void;
  onOpenDataPipeline: () => void;
}

export const ClosingCard: React.FC<ClosingCardProps> = ({
  summary,
  onRestart,
  onOpenMap,
  onOpenJournal,
  onOpenDataPipeline,
}) => {
  React.useEffect(() => {
    // Gentle celebration burst on reaching closing card
    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#0284C7', '#CA8A04', '#E11D48', '#16A34A', '#18181B'],
    });
  }, []);

  return (
    <article
      id="closing-ritual-card"
      className="relative w-full max-w-md mx-auto bg-[#F5F2EB] border-[2.5px] border-zinc-900 rounded-[24px] shadow-[6px_6px_0px_#18181b] p-6 flex flex-col justify-between select-none text-zinc-900"
    >
      {/* Top ritual emblem */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-200 border-2 border-zinc-900 text-rose-900 text-xs font-bold uppercase tracking-wider shadow-[2px_2px_0px_#18181b]">
            <Heart size={14} className="fill-rose-600 text-rose-600" />
            <span>DAILY RITUAL COMPLETE</span>
          </span>

          <span className="text-xs font-bold text-zinc-600 uppercase">
            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>

        {/* Closing poetic statement from PRD */}
        <div className="my-3">
          <h2 className="font-handwriting text-3xl sm:text-[38px] leading-[1.15] font-bold text-zinc-900">
            <span className="block">That's today.</span>
            <span className="block text-zinc-800">Come back tomorrow —</span>
          </h2>
          <p className="mt-3 font-sans-clean text-zinc-700 text-sm sm:text-[15px] leading-relaxed font-medium">
            We're making a better New York, one small thing at a time.
          </p>
        </div>

        {/* Live NYC Open Data daily city counters */}
        <div className="mt-5 pt-4 border-t-2 border-zinc-900/20">
          <div className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2.5">
            Today Across the Five Boroughs
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-2.5 bg-[#E0F2FE] border-2 border-zinc-900 rounded-xl shadow-[2px_2px_0px_#18181b]">
              <div className="text-xs text-sky-800 font-bold">✨ FIX</div>
              <div className="text-lg font-black text-zinc-900">14,280+</div>
              <div className="text-[11px] text-zinc-700">311 issues closed</div>
            </div>

            <div className="p-2.5 bg-[#FEF9C3] border-2 border-zinc-900 rounded-xl shadow-[2px_2px_0px_#18181b]">
              <div className="text-xs text-amber-800 font-bold">🎵 GATHER</div>
              <div className="text-lg font-black text-zinc-900">180+</div>
              <div className="text-[11px] text-zinc-700">permitted events</div>
            </div>

            <div className="p-2.5 bg-[#FFE4E6] border-2 border-zinc-900 rounded-xl shadow-[2px_2px_0px_#18181b]">
              <div className="text-xs text-rose-800 font-bold">🎬 CREATE</div>
              <div className="text-lg font-black text-zinc-900">42+</div>
              <div className="text-[11px] text-zinc-700">film & TV sets active</div>
            </div>

            <div className="p-2.5 bg-[#DCFCE7] border-2 border-zinc-900 rounded-xl shadow-[2px_2px_0px_#18181b]">
              <div className="text-xs text-emerald-800 font-bold">🐦 CARE</div>
              <div className="text-lg font-black text-zinc-900">18+</div>
              <div className="text-[11px] text-zinc-700">wildlife rescues on record</div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 pt-4 border-t-2 border-zinc-900/20 flex flex-col gap-2.5">
        <div className="flex gap-2">
          <button
            id="btn-replay-stack"
            type="button"
            onClick={onRestart}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white font-sans-clean font-bold text-sm py-2.5 px-4 rounded-xl border-2 border-zinc-900 shadow-[2px_2px_0px_#18181b] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#18181b] transition-all cursor-pointer"
          >
            <RotateCcw size={15} />
            <span>Replay today's stack</span>
          </button>

          <button
            id="btn-closing-map"
            type="button"
            onClick={onOpenMap}
            className="inline-flex items-center justify-center gap-1.5 bg-white hover:bg-zinc-100 text-zinc-900 font-sans-clean font-bold text-sm py-2.5 px-4 rounded-xl border-2 border-zinc-900 shadow-[2px_2px_0px_#18181b] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#18181b] transition-all cursor-pointer"
          >
            <Map size={15} />
            <span>Map View</span>
          </button>
        </div>

        <button
          id="btn-closing-journal"
          type="button"
          onClick={onOpenJournal}
          className="inline-flex items-center justify-center gap-2 bg-rose-100 hover:bg-rose-200 text-rose-900 font-sans-clean font-bold text-sm py-2.5 px-4 rounded-xl border-2 border-zinc-900 shadow-[2px_2px_0px_#18181b] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#18181b] transition-all cursor-pointer"
        >
          <NotebookPen size={15} />
          <span>What's one positive thing that happened today?</span>
        </button>

        <button
          id="btn-closing-pipeline"
          type="button"
          onClick={onOpenDataPipeline}
          className="inline-flex items-center justify-center gap-1.5 text-xs text-zinc-600 hover:text-zinc-900 font-semibold py-1 transition-colors cursor-pointer"
        >
          <span>Learn how NYC Open Data + AI pipeline works</span>
          <ExternalLink size={12} />
        </button>
      </div>
    </article>
  );
};
