import React, { useState, useEffect } from "react";
import { StoryItem, CitySummary } from "./types";
import {
  fetchStoriesFromServer,
  getLocalFallbackStories,
} from "./utils/dataService";
import { Header } from "./components/Header";
import { DailyStack } from "./components/DailyStack";
import { MapView } from "./components/MapView";
import { SourceDataModal } from "./components/SourceDataModal";
import { PostcardShareModal } from "./components/PostcardShareModal";
import { DataPipelineModal } from "./components/DataPipelineModal";
import { CustomDatasetModal } from "./components/CustomDatasetModal";
import { CommunityBoard } from "./components/CommunityBoard";
import { JournalPage } from "./components/JournalPage";
import { CATEGORY_THEMES } from "./components/CategoryBadge";
import { ShieldCheck, Heart, Sparkles, Database } from "lucide-react";

export default function App() {
  const [stories, setStories] = useState<StoryItem[]>([]);
  const [summary, setSummary] = useState<CitySummary>({
    closed311Count: 14280,
    gatheringsCount: 184,
    filmsCount: 42,
    wildlifeRescuesCount: 18,
    lastUpdated: "Just now",
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<"cards" | "map" | "journal" | "community">("cards");
  const [activeStoryIndex, setActiveStoryIndex] = useState<number>(0);

  // Modals & Active Story States
  const [selectedMapStory, setSelectedMapStory] = useState<StoryItem | null>(
    null,
  );
  const [sourceModalStory, setSourceModalStory] = useState<StoryItem | null>(
    null,
  );
  const [postcardModalStory, setPostcardModalStory] =
    useState<StoryItem | null>(null);
  const [isPipelineModalOpen, setIsPipelineModalOpen] =
    useState<boolean>(false);
  const [isCustomDatasetModalOpen, setIsCustomDatasetModalOpen] =
    useState<boolean>(false);

  const loadDailyStories = async () => {
    setIsLoading(true);
    try {
      const data = await fetchStoriesFromServer();
      if (data && data.stories && data.stories.length > 0) {
        setStories(data.stories);
        if (data.summary) setSummary(data.summary);
      } else {
        const fallback = getLocalFallbackStories();
        setStories(fallback.stories);
        setSummary(fallback.summary);
      }
    } catch (err) {
      console.warn("Error loading stories, using fallback:", err);
      const fallback = getLocalFallbackStories();
      setStories(fallback.stories);
      setSummary(fallback.summary);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDailyStories();
  }, []);

  const handleLocateOnMap = (story: StoryItem) => {
    setSelectedMapStory(story);
    setViewMode("map");
  };

  const handleOpenShare = () => {
    const activeStory =
      stories[activeStoryIndex] ||
      stories[0] ||
      getLocalFallbackStories().stories[0];
    setPostcardModalStory(activeStory);
  };

  const handleUseCustomDataset = async (datasetReference: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/custom-dataset/use", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dataset: datasetReference }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || "Unable to load custom dataset.");
      }

      if (data?.stories?.length) {
        setStories(data.stories);
        setSummary(data.summary || summary);
        setViewMode("cards");
      }
    } catch (err) {
      console.warn("Custom dataset load failed:", err);
    } finally {
      setIsLoading(false);
      setIsCustomDatasetModalOpen(false);
    }
  };

  const activeStory = stories[activeStoryIndex] || stories[0];
  const activeTheme = activeStory?.category
    ? CATEGORY_THEMES[activeStory.category]
    : CATEGORY_THEMES.gather;

  const getPageBgColor = () => {
    if (viewMode === "cards") {
      return activeTheme?.bgColor || "#FADCE9";
    }
    if (viewMode === "map") {
      return "#EAE8DF";
    }
    if (viewMode === "journal") {
      return "#FADCE9";
    }
    if (viewMode === "community") {
      return "#F5E8FB";
    }
    return "#FADCE9";
  };

  return (
    <div
      className="min-h-screen text-zinc-900 flex flex-col justify-between selection:bg-rose-200 transition-colors duration-500 ease-in-out"
      style={{ backgroundColor: getPageBgColor() }}
    >
      {/* Top Application Header */}
      <Header
        viewMode={viewMode}
        onChangeViewMode={setViewMode}
        onOpenShare={handleOpenShare}
        onOpenPipeline={() => setIsPipelineModalOpen(true)}
        onOpenCustomDataset={() => setIsCustomDatasetModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-2 sm:py-4 flex flex-col items-center justify-center">
        {viewMode === "cards" ? (
          <DailyStack
            stories={stories}
            summary={summary}
            isLoading={isLoading}
            onRefresh={loadDailyStories}
            onViewSource={(story) => setSourceModalStory(story)}
            onSendPostcard={(story) => setPostcardModalStory(story)}
            onLocateOnMap={handleLocateOnMap}
            onOpenMap={() => setViewMode("map")}
            onOpenCommunityBoard={() => setViewMode("community")}
            onOpenDataPipeline={() => setIsPipelineModalOpen(true)}
            onStoryChange={(idx) => setActiveStoryIndex(idx)}
          />
        ) : viewMode === "map" ? (
          <div className="w-full">
            <MapView
              stories={stories}
              selectedStory={selectedMapStory}
              onSelectStory={setSelectedMapStory}
              onViewSource={(story) => setSourceModalStory(story)}
              onSendPostcard={(story) => setPostcardModalStory(story)}
              onOpenCards={() => setViewMode("cards")}
            />
          </div>
        ) : viewMode === "journal" ? (
          <div className="w-full">
            <JournalPage
              onBackToStories={() => setViewMode("cards")}
              onOpenCommunity={() => setViewMode("community")}
            />
          </div>
        ) : (
          <div className="w-full">
            <CommunityBoard
              onBackToDailyStories={() => setViewMode("cards")}
            />
          </div>
        )}
      </main>

      {/* Subtle Civic Footer */}
      <footer className="w-full max-w-4xl mx-auto px-4 py-4 mt-4 border-t border-zinc-300/70 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-zinc-600 font-sans-clean font-medium">
        <div className="flex items-center gap-2">
          <span>Data is truth. AI is voice.</span>
          <span>·</span>
          <span>4 Live NYC Open Data Feeds</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsPipelineModalOpen(true)}
            className="hover:text-zinc-900 underline cursor-pointer"
          >
            System Architecture
          </button>
          <span>·</span>
          <span>NYPL Hackathon 2026</span>
        </div>
      </footer>

      {/* Source Data Inspector Modal */}
      <SourceDataModal
        story={sourceModalStory}
        onClose={() => setSourceModalStory(null)}
      />

      {/* Send Postcard Share Modal */}
      <PostcardShareModal
        story={postcardModalStory}
        onClose={() => setPostcardModalStory(null)}
      />

      {/* System Pipeline Modal */}
      {isPipelineModalOpen && (
        <DataPipelineModal onClose={() => setIsPipelineModalOpen(false)} />
      )}

      {isCustomDatasetModalOpen && (
        <CustomDatasetModal
          onClose={() => setIsCustomDatasetModalOpen(false)}
          onUseDataset={handleUseCustomDataset}
        />
      )}
    </div>
  );
}
