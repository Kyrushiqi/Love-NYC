import React from "react";
import { Layers, Map, Shuffle, Database, Sparkles, Heart, MessageCircle } from "lucide-react";

interface HeaderProps {
  viewMode: "cards" | "map" | "community";
  onChangeViewMode: (mode: "cards" | "map" | "community") => void;
  onRefresh: () => void;
  isLoading: boolean;
  onOpenPipeline: () => void;
  onOpenCustomDataset: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  viewMode,
  onChangeViewMode,
  onRefresh,
  isLoading,
  onOpenPipeline,
  onOpenCustomDataset,
}) => {
  return (
    <header className="w-full max-w-4xl mx-auto pt-4 pb-4 px-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      {/* Brand & Subtitle */}
      <div className="flex items-center justify-between sm:justify-start gap-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-rose-400 border-2 border-zinc-900 shadow-[2.5px_2.5px_0px_#18181b] flex items-center justify-center text-lg rotate-[-2deg]">
            ❤️
          </div>
          <div>
            <h1 className="font-sans-clean text-xl sm:text-2xl font-black text-zinc-900 tracking-tight leading-none flex items-center gap-1.5">
              <span>LOVE NYC</span>
              <span className="text-[11px] font-bold text-rose-700 bg-rose-100 border border-rose-400 px-1.5 py-0.2 rounded-full uppercase tracking-wide">
                Live
              </span>
            </h1>
            <p className="text-xs text-zinc-600 font-sans-clean font-medium mt-0.5">
              Daily civic stories from verified NYC Open Data
            </p>
          </div>
        </div>

        {/* Mobile System Info button */}
        <button
          type="button"
          onClick={onOpenPipeline}
          className="sm:hidden p-1.5 rounded-lg border-2 border-zinc-900 bg-white shadow-[2px_2px_0px_#18181b] text-zinc-800 text-xs font-bold flex items-center gap-1 cursor-pointer"
          title="System Design & Sources"
        >
          <Database size={13} />
        </button>
      </div>

      {/* Center/Right Actions: View Mode Switcher & Pipeline Button */}
      <div className="flex items-center justify-between sm:justify-end gap-2">
        {/* Segmented Control: Cards vs Map vs Community */}
        <div className="inline-flex p-1 bg-zinc-200/90 rounded-2xl border-2 border-zinc-900 shadow-[2px_2px_0px_#18181b]">
          <button
            id="tab-cards-view"
            type="button"
            onClick={() => onChangeViewMode("cards")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              viewMode === "cards"
                ? "bg-white text-zinc-900 border border-zinc-900 shadow-[1.5px_1.5px_0px_#18181b]"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            <Layers size={14} />
            <span>Stories</span>
          </button>

          <button
            id="tab-map-view"
            type="button"
            onClick={() => onChangeViewMode("map")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              viewMode === "map"
                ? "bg-white text-zinc-900 border border-zinc-900 shadow-[1.5px_1.5px_0px_#18181b]"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            <Map size={14} />
            <span>Map</span>
          </button>

          <button
            id="tab-community-view"
            type="button"
            onClick={() => onChangeViewMode("community")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              viewMode === "community"
                ? "bg-purple-600 text-white border border-zinc-900 shadow-[1.5px_1.5px_0px_#18181b]"
                : "text-zinc-700 hover:text-zinc-900"
            }`}
          >
            <MessageCircle size={14} />
            <span>Moments</span>
          </button>
        </div>

        <button
          id="btn-open-custom-dataset"
          type="button"
          onClick={onOpenCustomDataset}
          className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-zinc-900 bg-white hover:bg-zinc-100 active:bg-zinc-200 px-3 py-2 rounded-xl border-2 border-zinc-900 shadow-[2px_2px_0px_#18181b] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
        >
          <Database size={13} className="text-zinc-700" />
          <span>Custom dataset</span>
        </button>

        {/* Desktop Pipeline & Live Data Button */}
        <button
          id="btn-open-pipeline-desktop"
          type="button"
          onClick={onOpenPipeline}
          className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-zinc-900 bg-white hover:bg-zinc-100 active:bg-zinc-200 px-3 py-2 rounded-xl border-2 border-zinc-900 shadow-[2px_2px_0px_#18181b] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
        >
          <Database size={13} className="text-zinc-700" />
          <span>Data Pipeline</span>
        </button>
      </div>
    </header>
  );
};
