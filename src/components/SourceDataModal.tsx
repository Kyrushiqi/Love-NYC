import React, { useState } from 'react';
import { StoryItem } from '../types';
import { CATEGORY_THEMES } from './CategoryBadge';
import { DoodleIcon } from './DoodleIcon';
import { X, ExternalLink, Copy, Check, ShieldCheck, Sparkles, Database, FileCode } from 'lucide-react';

interface SourceDataModalProps {
  story: StoryItem | null;
  onClose: () => void;
}

export const SourceDataModal: React.FC<SourceDataModalProps> = ({ story, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!story) return null;

  const { fact, line1, line2, detail, category, isAiGenerated } = story;
  const theme = CATEGORY_THEMES[category];

  const handleCopyRaw = () => {
    navigator.clipboard.writeText(JSON.stringify(fact.raw, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        id="source-data-modal"
        className="relative w-full max-w-2xl max-h-[90vh] bg-[#FBF9F4] border-[2.5px] border-zinc-900 rounded-[24px] shadow-[8px_8px_0px_#18181b] flex flex-col overflow-hidden text-zinc-900"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b-2 border-zinc-900 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <span
              className={`p-2 rounded-xl border-2 border-zinc-900 ${theme.bgPill} ${theme.textPill} shadow-[2px_2px_0px_#18181b]`}
            >
              <DoodleIcon category={category} size={18} />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-sans-clean font-bold text-base sm:text-lg">
                  Source Data Transparency
                </h3>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-600">
                  <ShieldCheck size={12} />
                  Zero Fabrication Rule
                </span>
              </div>
              <p className="text-xs text-zinc-500 font-sans-clean">
                Data is truth. AI is voice. Verifying NYC Open Data record.
              </p>
            </div>
          </div>

          <button
            id="btn-close-source-modal"
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl border-2 border-zinc-900 hover:bg-zinc-100 active:translate-x-[1px] active:translate-y-[1px] shadow-[2px_2px_0px_#18181b] cursor-pointer"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          {/* Side-by-side: AI Voice vs Verified Ground Truth */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Story Postcard Side */}
            <div className={`p-4 rounded-2xl border-2 border-zinc-900 ${theme.bgCard} shadow-[3px_3px_0px_#18181b] flex flex-col justify-between`}>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-zinc-600 uppercase tracking-wider">
                    AI Voice Postcard
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-white/70 px-1.5 py-0.5 rounded border border-zinc-300">
                    <Sparkles size={10} className="text-amber-600" />
                    Gemini 3.7 Flash
                  </span>
                </div>

                <div className="font-card text-xl sm:text-[22px] font-bold leading-snug text-zinc-900 mt-2">
                  <div>{line1}</div>
                  <div>{line2}</div>
                </div>

                <p className="mt-3 text-xs sm:text-sm text-zinc-800 font-medium font-sans-clean leading-relaxed">
                  {detail}
                </p>
              </div>

              <div className="mt-4 pt-2 border-t border-zinc-900/15 text-[11px] text-zinc-600">
                Category: <strong>{theme.name}</strong> · Borough: <strong>{fact.borough}</strong>
              </div>
            </div>

            {/* Extracted Verified Facts */}
            <div className="p-4 rounded-2xl border-2 border-zinc-900 bg-white shadow-[3px_3px_0px_#18181b]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-zinc-600 uppercase tracking-wider">
                  Extracted Facts Object
                </span>
                <span className="text-[11px] font-mono text-zinc-500">
                  {fact.dateBadge}
                </span>
              </div>

              <dl className="space-y-2 text-xs font-sans-clean">
                <div>
                  <dt className="text-zinc-500 font-medium">Dataset Source:</dt>
                  <dd className="font-bold text-zinc-900">{fact.datasetName}</dd>
                </div>

                <div>
                  <dt className="text-zinc-500 font-medium">Subject / Descriptor:</dt>
                  <dd className="font-bold text-zinc-900">{fact.subject}</dd>
                </div>

                <div>
                  <dt className="text-zinc-500 font-medium">Verified Location:</dt>
                  <dd className="font-bold text-zinc-900">{fact.locationName} ({fact.borough})</dd>
                </div>

                <div>
                  <dt className="text-zinc-500 font-medium">Governing Agency:</dt>
                  <dd className="font-bold text-zinc-900">{fact.agency}</dd>
                </div>

                <div>
                  <dt className="text-zinc-500 font-medium">Socrata Dataset ID:</dt>
                  <dd className="font-mono text-zinc-700">{fact.datasetId}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Raw JSON Socrata Inspector */}
          <div className="border-2 border-zinc-900 rounded-2xl overflow-hidden shadow-[3px_3px_0px_#18181b] bg-zinc-950 text-zinc-100">
            <div className="px-4 py-2.5 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCode size={14} className="text-amber-400" />
                <span className="text-xs font-mono text-zinc-300 font-bold">
                  Raw Socrata Open Data JSON Record
                </span>
              </div>

              <button
                type="button"
                onClick={handleCopyRaw}
                className="inline-flex items-center gap-1 text-xs font-mono text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 px-2 py-1 rounded transition-colors cursor-pointer"
              >
                {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                <span>{copied ? 'Copied' : 'Copy JSON'}</span>
              </button>
            </div>

            <pre className="p-4 text-xs font-mono text-emerald-400 overflow-x-auto max-h-56 leading-relaxed">
              <code>{JSON.stringify(fact.raw, null, 2)}</code>
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t-2 border-zinc-900 bg-white flex items-center justify-between flex-wrap gap-2">
          <a
            href={fact.datasetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 hover:text-sky-900 underline"
          >
            <span>Open NYC Open Data portal ({fact.datasetId})</span>
            <ExternalLink size={12} />
          </a>

          <button
            type="button"
            onClick={onClose}
            className="bg-zinc-900 hover:bg-zinc-800 text-white font-sans-clean font-bold text-xs py-2 px-4 rounded-xl border-2 border-zinc-900 shadow-[2px_2px_0px_#18181b] cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
