import React from 'react';
import { X, Database, Bot, ArrowRight, ShieldCheck, CheckCircle2, RefreshCw, Sparkles, Layers } from 'lucide-react';
import { CATEGORY_THEMES } from './CategoryBadge';
import { DoodleIcon } from './DoodleIcon';

interface DataPipelineModalProps {
  onClose: () => void;
}

export const DataPipelineModal: React.FC<DataPipelineModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        id="data-pipeline-modal"
        className="relative w-full max-w-2xl max-h-[90vh] bg-[#FBF9F4] border-[2.5px] border-zinc-900 rounded-[24px] shadow-[8px_8px_0px_#18181b] flex flex-col overflow-hidden text-zinc-900"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b-2 border-zinc-900 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl border-2 border-zinc-900 bg-rose-200 text-rose-900 shadow-[2px_2px_0px_#18181b]">
              <Database size={18} />
            </span>
            <div>
              <h3 className="font-sans-clean font-bold text-base sm:text-lg">
                System Design & Civic Architecture
              </h3>
              <p className="text-xs text-zinc-500 font-sans-clean">
                NYC Open Data (Socrata) → Strict Fact Filtering → Gemini AI Voice → Postcards
              </p>
            </div>
          </div>

          <button
            id="btn-close-pipeline-modal"
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl border-2 border-zinc-900 hover:bg-zinc-100 active:translate-x-[1px] active:translate-y-[1px] shadow-[2px_2px_0px_#18181b] cursor-pointer"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* Core Principle Banner */}
          <div className="p-4 rounded-2xl border-2 border-zinc-900 bg-[#FEF9C3] shadow-[3px_3px_0px_#18181b]">
            <div className="flex items-center gap-2 font-bold text-amber-900 text-sm mb-1">
              <ShieldCheck size={18} />
              <span>Core Principle: Data is Truth. AI is Voice.</span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-800 leading-relaxed font-medium">
              AI never decides <em>what</em> happened or <em>whether</em> it is good — that is determined strictly by the public record and filtering rules (e.g. 311 tickets marked <code>Closed</code>). AI's only job is tone and phrasing.
            </p>
          </div>

          {/* 5-Step Architecture Flow */}
          <div>
            <h4 className="text-xs font-bold text-zinc-600 uppercase tracking-wider mb-3">
              Data-to-Story Pipeline Flow
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="p-3 bg-white border-2 border-zinc-900 rounded-xl shadow-[2px_2px_0px_#18181b]">
                <div className="text-[11px] font-bold text-zinc-500 mb-1">STEP 1 · INGEST</div>
                <div className="text-xs font-bold text-zinc-900 mb-1">NYC Open Data Socrata</div>
                <p className="text-[11px] text-zinc-600 leading-snug">
                  Direct client/server fetch across 4 official JSON API datasets.
                </p>
              </div>

              <div className="p-3 bg-white border-2 border-zinc-900 rounded-xl shadow-[2px_2px_0px_#18181b]">
                <div className="text-[11px] font-bold text-zinc-500 mb-1">STEP 2 · FACT SCHEMA</div>
                <div className="text-xs font-bold text-zinc-900 mb-1">Structured Extraction</div>
                <p className="text-[11px] text-zinc-600 leading-snug">
                  Normalizes borough, dates, agency, descriptor, and coordinates.
                </p>
              </div>

              <div className="p-3 bg-white border-2 border-zinc-900 rounded-xl shadow-[2px_2px_0px_#18181b]">
                <div className="text-[11px] font-bold text-zinc-500 mb-1">STEP 3 · VOICE</div>
                <div className="text-xs font-bold text-zinc-900 mb-1">Gemini 3.7 Flash</div>
                <p className="text-[11px] text-zinc-600 leading-snug">
                  Two-line headline + 1 detail sentence under strict zero-hallucination guardrails.
                </p>
              </div>
            </div>
          </div>

          {/* 4 Datasets Breakdown */}
          <div>
            <h4 className="text-xs font-bold text-zinc-600 uppercase tracking-wider mb-3">
              The 4 Core Datasets
            </h4>
            <div className="space-y-2.5">
              {(['fix', 'gather', 'create', 'care'] as const).map((cat) => {
                const theme = CATEGORY_THEMES[cat];
                const meta = {
                  fix: {
                    desc: 'Closed 311 work orders for streetlights, parks, and roadways.',
                    freshness: 'High · Updated daily in real time',
                    id: 'erm2-nwe9',
                  },
                  gather: {
                    desc: 'Permitted community concerts, festivals, and public gatherings.',
                    freshness: 'High · Scheduled park and public permits',
                    id: 'bkfu-528j',
                  },
                  create: {
                    desc: "Mayor's Office of Media & Entertainment active filming permits.",
                    freshness: 'High · Actively maintained production permits',
                    id: 'tg4x-b46p',
                  },
                  care: {
                    desc: 'Urban Park Ranger responses to injured, relocated, or protected wildlife.',
                    freshness: 'Moderate · Labeled "on record" to stay honest',
                    id: '8jbk-r428',
                  },
                }[cat];

                return (
                  <div
                    key={cat}
                    className={`p-3 rounded-xl border-2 border-zinc-900 ${theme.bgCard} shadow-[2px_2px_0px_#18181b] flex items-center justify-between gap-3`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`p-2 rounded-lg border-2 border-zinc-900 ${theme.bgPill} ${theme.textPill}`}>
                        <DoodleIcon category={cat} size={16} />
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-zinc-900">
                            {theme.emoji} {theme.name} · {theme.sourceDataset}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-700 font-medium mt-0.5">
                          {meta.desc}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-[11px] font-bold text-zinc-900">{meta.freshness}</div>
                      <code className="text-[10px] text-zinc-500 font-mono">{meta.id}</code>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t-2 border-zinc-900 bg-white flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="bg-zinc-900 hover:bg-zinc-800 text-white font-sans-clean font-bold text-xs py-2 px-4 rounded-xl border-2 border-zinc-900 shadow-[2px_2px_0px_#18181b] cursor-pointer"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
