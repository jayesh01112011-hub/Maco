import React from 'react';
import { X, Check, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { playTap } from '../utils/audio';

export type SortOption = 'gainers' | 'volume' | 'mcap' | 'trending';
export type ChangeFilterOption = 'all' | 'pos' | '5' | '10' | 'dip';
export type CapTierOption = 'all' | 'mega' | 'mid' | 'small';

interface ExploreFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSort: SortOption;
  onSelectSort: (sort: SortOption) => void;
  changeFilter: ChangeFilterOption;
  onSelectChangeFilter: (val: ChangeFilterOption) => void;
  capTier: CapTierOption;
  onSelectCapTier: (tier: CapTierOption) => void;
  onReset: () => void;
  activeCount: number;
}

export const ExploreFilterModal: React.FC<ExploreFilterModalProps> = ({
  isOpen,
  onClose,
  selectedSort,
  onSelectSort,
  changeFilter,
  onSelectChangeFilter,
  capTier,
  onSelectCapTier,
  onReset,
  activeCount,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#16181D] border border-white/10 rounded-t-[32px] sm:rounded-3xl p-5 shadow-2xl space-y-5 animate-in slide-in-from-bottom-5 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#1A1C20] text-white">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Explore Filters</h3>
              <p className="text-xs text-white/50">{activeCount} active criteria</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                playTap();
                onReset();
              }}
              className="text-xs font-bold text-neutral-400 hover:text-white flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
            <button
              onClick={() => {
                playTap();
                onClose();
              }}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 1. Sort By */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
            Sort Assets By
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'gainers' as SortOption, label: 'Top Gainers (24h)' },
              { id: 'mcap' as SortOption, label: 'Market Cap' },
              { id: 'volume' as SortOption, label: '24h Volume' },
              { id: 'trending' as SortOption, label: 'Trending First' },
            ].map((s) => {
              const active = selectedSort === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => {
                    playTap();
                    onSelectSort(s.id);
                  }}
                  className={`px-3 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-all ${
                    active
                      ? 'bg-white text-black shadow-sm'
                      : 'bg-[#1A1C20] text-neutral-300 hover:text-white border border-white/5'
                  }`}
                >
                  <span>{s.label}</span>
                  {active && <Check className="w-3.5 h-3.5" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. 24h Price Performance Filter */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
            24h Performance
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'all' as ChangeFilterOption, label: 'All Movers' },
              { id: 'pos' as ChangeFilterOption, label: 'Gainers Only' },
              { id: '5' as ChangeFilterOption, label: '> +5% Gain' },
              { id: '10' as ChangeFilterOption, label: '> +10% Moon' },
              { id: 'dip' as ChangeFilterOption, label: 'Dips (< 0%)' },
            ].map((f) => {
              const active = changeFilter === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => {
                    playTap();
                    onSelectChangeFilter(f.id);
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all text-center ${
                    active
                      ? 'bg-[#4ADE80] text-black shadow-sm font-black'
                      : 'bg-[#1A1C20] text-neutral-300 hover:text-white border border-white/5'
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Market Cap Tier */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
            Market Cap Tier
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'all' as CapTierOption, label: 'All Market Caps' },
              { id: 'mega' as CapTierOption, label: 'Mega Cap (>$20B)' },
              { id: 'mid' as CapTierOption, label: 'Mid-Large ($1B-$20B)' },
              { id: 'small' as CapTierOption, label: 'Small Cap (<$1B)' },
            ].map((t) => {
              const active = capTier === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    playTap();
                    onSelectCapTier(t.id);
                  }}
                  className={`px-3 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-all ${
                    active
                      ? 'bg-white text-black shadow-sm'
                      : 'bg-[#1A1C20] text-neutral-300 hover:text-white border border-white/5'
                  }`}
                >
                  <span>{t.label}</span>
                  {active && <Check className="w-3.5 h-3.5" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Apply Button */}
        <button
          onClick={() => {
            playTap();
            onClose();
          }}
          className="w-full py-3.5 rounded-2xl bg-white hover:bg-neutral-100 text-black font-black text-sm shadow-xl active:scale-[0.98] transition-all"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};
