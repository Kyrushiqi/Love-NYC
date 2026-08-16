import React from "react";
import { Send } from "lucide-react";

export type NavViewMode = "cards" | "map" | "journal" | "community";

interface HeaderProps {
  viewMode: NavViewMode;
  onChangeViewMode: (mode: NavViewMode) => void;
  onOpenShare: () => void;
  onOpenPipeline?: () => void;
  onOpenCustomDataset?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  viewMode,
  onChangeViewMode,
  onOpenShare,
}) => {
  const navItems: { label: string; mode: NavViewMode; id: string }[] = [
    { label: "Today", mode: "cards", id: "nav-today" },
    { label: "Map", mode: "map", id: "nav-map" },
    { label: "Journal", mode: "journal", id: "nav-journal" },
    { label: "Community", mode: "community", id: "nav-community" },
  ];

  return (
    <header className="w-full max-w-5xl mx-auto pt-4 sm:pt-6 pb-3 px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Brand: Love NYC */}
      <button
        id="nav-brand-logo"
        type="button"
        onClick={() => onChangeViewMode("cards")}
        className="font-card text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 hover:opacity-85 transition-opacity cursor-pointer text-left"
        aria-label="Love NYC Home"
      >
        Love NYC
      </button>

      {/* Right Top Navigation & Share Button */}
      <div className="flex items-center gap-3 sm:gap-6">
        <nav className="flex items-center gap-3 sm:gap-6 font-sans-clean text-xs sm:text-sm md:text-base">
          {navItems.map((item) => {
            const isActive = viewMode === item.mode;
            return (
              <button
                key={item.mode}
                id={item.id}
                type="button"
                onClick={() => onChangeViewMode(item.mode)}
                className={`relative py-1 transition-all cursor-pointer font-medium ${
                  isActive
                    ? "text-zinc-900 font-bold after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-zinc-900 after:rounded-full"
                    : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Share Button (Circular with Paper Airplane / Send Icon) */}
        <button
          id="btn-nav-share"
          type="button"
          onClick={onOpenShare}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-zinc-300 shadow-[2px_2px_0px_#18181b] sm:border-2 sm:border-zinc-900 flex items-center justify-center text-zinc-900 hover:bg-zinc-50 active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#18181b] transition-all cursor-pointer flex-shrink-0"
          title="Share NYC Postcard"
          aria-label="Share NYC Postcard"
        >
          <Send size={16} className="-rotate-12 translate-x-[-0.5px] translate-y-[0.5px] text-zinc-800" />
        </button>
      </div>
    </header>
  );
};
