import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { StoryItem } from '../types';
import { CATEGORY_THEMES } from './CategoryBadge';
import { StoryCard } from './StoryCard';
import { X, Layers, Sparkles, MapPin } from 'lucide-react';

interface MapViewProps {
  stories: StoryItem[];
  selectedStory: StoryItem | null;
  onSelectStory: (story: StoryItem | null) => void;
  onViewSource: (story: StoryItem) => void;
  onSendPostcard: (story: StoryItem) => void;
  onOpenCards?: () => void;
}

export const MapView: React.FC<MapViewProps> = ({
  stories,
  selectedStory,
  onSelectStory,
  onViewSource,
  onSendPostcard,
  onOpenCards,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterBorough, setFilterBorough] = useState<string>('all');

  const filteredStories = stories.filter((story) => {
    if (filterCategory !== 'all' && story.category !== filterCategory) return false;
    if (filterBorough !== 'all' && story.fact.borough !== filterBorough) return false;
    return true;
  });

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Center on NYC (New York City five boroughs view)
      const map = L.map(mapContainerRef.current, {
        center: [40.73061, -73.935242],
        zoom: 11,
        zoomControl: false,
        attributionControl: false,
      });

      // Add crisp minimal Carto Positron tiles for clean sticker aesthetic
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      // Custom zoom control in top right
      L.control.zoom({ position: 'topright' }).addTo(map);

      const markersGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = markersGroup;
      mapInstanceRef.current = map;
    }

    return () => {
      // Cleanup if unmounting
    };
  }, []);

  // Update Markers whenever filtered stories change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    filteredStories.forEach((story) => {
      const { fact, category } = story;
      const theme = CATEGORY_THEMES[category];
      const isSelected = selectedStory?.id === story.id;

      // Custom HTML Sticker Pin Icon
      const customIcon = L.divIcon({
        className: 'custom-story-pin',
        html: `
          <div style="
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: ${theme.accentColor};
            color: #ffffff;
            width: ${isSelected ? '36px' : '30px'};
            height: ${isSelected ? '36px' : '30px'};
            border-radius: 50%;
            border: 2.5px solid #18181b;
            box-shadow: ${isSelected ? '0 0 0 4px #ffffff, 4px 4px 0px #18181b' : '2.5px 2.5px 0px #18181b'};
            font-size: ${isSelected ? '16px' : '14px'};
            cursor: pointer;
            transition: all 0.2s ease;
          ">
            <span>${theme.emoji}</span>
          </div>
        `,
        iconSize: [isSelected ? 36 : 30, isSelected ? 36 : 30],
        iconAnchor: [isSelected ? 18 : 15, isSelected ? 18 : 15],
      });

      const marker = L.marker([fact.coordinates.lat, fact.coordinates.lng], {
        icon: customIcon,
        title: `${fact.categoryLabel}: ${fact.subject}`,
      });

      marker.on('click', () => {
        onSelectStory(story);
        map.panTo([fact.coordinates.lat, fact.coordinates.lng], { animate: true });
      });

      marker.addTo(markersGroup);
    });
  }, [filteredStories, selectedStory, onSelectStory]);

  return (
    <div className="relative w-full h-[580px] sm:h-[620px] rounded-[24px] overflow-hidden border-[2.5px] border-zinc-900 shadow-[6px_6px_0px_#18181b] bg-[#f8f6f0]">
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Filter Controls */}
      <div className="absolute top-3 left-3 right-3 z-10 flex flex-col gap-2 pointer-events-none">
        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pointer-events-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setFilterCategory('all')}
            className={`px-3 py-1 rounded-full text-xs font-bold border-2 border-zinc-900 shadow-[2px_2px_0px_#18181b] transition-all cursor-pointer ${
              filterCategory === 'all'
                ? 'bg-zinc-900 text-white'
                : 'bg-white text-zinc-900 hover:bg-zinc-100'
            }`}
          >
            All Stories ({stories.length})
          </button>

          {(['fix', 'gather', 'create', 'care'] as const).map((cat) => {
            const theme = CATEGORY_THEMES[cat];
            const isSelected = filterCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setFilterCategory(isSelected ? 'all' : cat)}
                className={`px-2.5 py-1 rounded-full text-xs font-bold border-2 border-zinc-900 shadow-[2px_2px_0px_#18181b] transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? `${theme.bgPill} ${theme.textPill} ring-2 ring-zinc-900`
                    : 'bg-white text-zinc-800 hover:bg-zinc-50'
                }`}
              >
                {theme.emoji} {theme.name}
              </button>
            );
          })}
        </div>

        {/* Borough Filter Chips */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 pointer-events-auto">
          {['all', 'MANHATTAN', 'BROOKLYN', 'QUEENS', 'BRONX', 'STATEN ISLAND'].map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => setFilterBorough(b)}
              className={`px-2 py-0.5 rounded-md text-[11px] font-bold border border-zinc-900 transition-all cursor-pointer ${
                filterBorough === b
                  ? 'bg-zinc-800 text-white shadow-[1px_1px_0px_#18181b]'
                  : 'bg-white/90 text-zinc-700 hover:bg-white'
              }`}
            >
              {b === 'all' ? 'All Boroughs' : b}
            </button>
          ))}
        </div>
      </div>

      {/* Floating Selected Story Postcard Drawer */}
      {selectedStory && (
        <div className="absolute bottom-16 left-3 right-3 sm:left-auto sm:right-4 sm:w-[380px] z-20 animate-in fade-in slide-in-from-bottom-6 duration-200">
          <div className="relative">
            <button
              type="button"
              onClick={() => onSelectStory(null)}
              className="absolute -top-3 -right-2 z-30 bg-zinc-900 text-white rounded-full p-1.5 border-2 border-white shadow-[2px_2px_0px_#18181b] hover:bg-zinc-800 cursor-pointer"
              aria-label="Close card preview"
            >
              <X size={14} />
            </button>

            <div className="bg-[#F5F2EB] border-[2.5px] border-zinc-900 rounded-[20px] shadow-[6px_6px_0px_#18181b] p-4 max-h-[460px] overflow-y-auto">
              <StoryCard
                story={selectedStory}
                onViewSource={onViewSource}
                onSendPostcard={onSendPostcard}
              />
            </div>
          </div>
        </div>
      )}

      {/* Map Hint info badge on bottom left */}
      {!selectedStory && (
        <div className="absolute bottom-4 left-4 z-10 pointer-events-none bg-white/95 border-2 border-zinc-900 px-3 py-1.5 rounded-xl shadow-[3px_3px_0px_#18181b] text-xs font-bold text-zinc-800 flex items-center gap-1.5">
          <MapPin size={14} className="text-rose-500" />
          <span>Tap any pin to view its story postcard</span>
        </div>
      )}

      {/* Bottom Right Floating Switcher */}
      {onOpenCards && (
        <div className="absolute bottom-4 right-4 z-20">
          <div className="inline-flex items-center p-1 bg-white/95 backdrop-blur-xs rounded-full border-2 border-zinc-900 shadow-[3px_3px_0px_#18181b]">
            <button
              type="button"
              onClick={onOpenCards}
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full text-xs font-bold text-zinc-700 hover:text-zinc-900 transition-all cursor-pointer"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="M3 9h18" />
                <path d="M9 21V9" />
              </svg>
              <span>Card view</span>
            </button>

            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full text-xs font-bold bg-zinc-900 text-white shadow-xs cursor-pointer"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
                <line x1="9" x2="9" y1="3" y2="18" />
                <line x1="15" x2="15" y1="6" y2="21" />
              </svg>
              <span>Map</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
