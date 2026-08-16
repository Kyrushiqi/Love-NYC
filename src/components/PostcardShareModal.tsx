import React, { useState } from 'react';
import { StoryItem } from '../types';
import { CATEGORY_THEMES } from './CategoryBadge';
import { DoodleIcon } from './DoodleIcon';
import { X, Copy, Check, Share2, Heart, Sparkles, Stamp } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PostcardShareModalProps {
  story: StoryItem | null;
  onClose: () => void;
}

export const PostcardShareModal: React.FC<PostcardShareModalProps> = ({ story, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!story) return null;

  const { fact, line1, line2, detail, category } = story;
  const theme = CATEGORY_THEMES[category];

  const shareableText = `❤️ LOVE NYC Postcard · ${theme.emoji} ${theme.name}\n\n"${line1}\n${line2}"\n\n${detail}\n\n📍 ${fact.borough} · Source: ${fact.datasetName}\n#LoveNYC #NYCOpenData`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareableText);
    setCopied(true);
    confetti({
      particleCount: 25,
      spread: 50,
      origin: { y: 0.6 },
      colors: ['#E11D48', '#0284C7', '#CA8A04', '#16A34A'],
    });
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `LOVE NYC Postcard · ${theme.name}`,
          text: shareableText,
          url: window.location.href,
        });
      } catch (err) {
        // Fallback to copy if user canceled or rejected
        handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        id="postcard-share-modal"
        className="relative w-full max-w-lg bg-[#FDFBF7] border-[2.5px] border-zinc-900 rounded-[24px] shadow-[8px_8px_0px_#18181b] flex flex-col overflow-hidden text-zinc-900"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b-2 border-zinc-900 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <Heart size={18} className="fill-rose-500 text-rose-500" />
            <h3 className="font-sans-clean font-bold text-base sm:text-lg">
              Send This NYC Postcard
            </h3>
          </div>

          <button
            id="btn-close-postcard-modal"
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl border-2 border-zinc-900 hover:bg-zinc-100 active:translate-x-[1px] active:translate-y-[1px] shadow-[2px_2px_0px_#18181b] cursor-pointer"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Postcard Preview Graphic */}
        <div className="p-5 sm:p-6 overflow-y-auto">
          <div
            id="rendered-postcard"
            className={`relative p-6 rounded-2xl border-[2.5px] border-zinc-900 ${theme.bgCard} shadow-[4px_4px_0px_#18181b] overflow-hidden`}
          >
            {/* Vintage Postmark Stamp Top Right */}
            <div className="absolute top-4 right-4 flex flex-col items-center pointer-events-none">
              {/* Postage Stamp */}
              <div className="w-12 h-14 bg-white border-2 border-dashed border-zinc-900 rounded-sm flex flex-col items-center justify-center p-1 shadow-[2px_2px_0px_#18181b] rotate-2">
                <DoodleIcon category={category} size={20} className="text-zinc-900" />
                <span className="text-[8px] font-bold font-mono tracking-tighter mt-1">NYC 2026</span>
              </div>
              {/* Postmark Circle */}
              <div className="w-14 h-14 -mt-4 -ml-4 rounded-full border border-zinc-900/40 flex items-center justify-center -rotate-12 text-[7px] font-mono text-zinc-700/60 uppercase text-center leading-tight">
                NEW YORK<br />{fact.dateBadge}
              </div>
            </div>

            {/* Postcard Category Tag */}
            <div className="mb-3">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full border-[1.5px] border-zinc-900 ${theme.bgPill} ${theme.textPill} text-xs font-bold uppercase shadow-[1.5px_1.5px_0px_#18181b]`}>
                {theme.emoji} {theme.name} · {fact.borough}
              </span>
            </div>

            {/* Postcard Message */}
            <div className="my-4 max-w-[80%]">
              <h2 className="font-card text-2xl sm:text-[28px] leading-snug font-bold text-zinc-900">
                <span className="block">{line1}</span>
                <span className="block">{line2}</span>
              </h2>

              <p className="mt-3 font-sans-clean text-xs sm:text-sm text-zinc-800 font-medium leading-relaxed">
                {detail}
              </p>
            </div>

            {/* Postcard Bottom Line */}
            <div className="mt-4 pt-3 border-t border-zinc-900/20 flex items-center justify-between text-[11px] text-zinc-700 font-sans-clean">
              <span className="italic">Source: {fact.datasetName}</span>
              <span className="font-bold">LOVE NYC ❤️</span>
            </div>
          </div>

          <p className="mt-4 text-xs text-center text-zinc-500 font-sans-clean">
            Send a small proof of everyday kindness to a friend, neighbor, or family member.
          </p>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t-2 border-zinc-900 bg-white flex items-center justify-between gap-3">
          <button
            id="btn-copy-postcard"
            type="button"
            onClick={handleCopy}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-white hover:bg-zinc-100 text-zinc-900 font-sans-clean font-bold text-sm py-2.5 px-4 rounded-xl border-2 border-zinc-900 shadow-[2px_2px_0px_#18181b] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
          >
            {copied ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
            <span>{copied ? 'Postcard Copied!' : 'Copy Postcard Text'}</span>
          </button>

          <button
            id="btn-native-share"
            type="button"
            onClick={handleNativeShare}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white font-sans-clean font-bold text-sm py-2.5 px-4 rounded-xl border-2 border-zinc-900 shadow-[2px_2px_0px_#18181b] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
          >
            <Share2 size={16} className="text-rose-300" />
            <span>Share Postcard</span>
          </button>
        </div>
      </div>
    </div>
  );
};
