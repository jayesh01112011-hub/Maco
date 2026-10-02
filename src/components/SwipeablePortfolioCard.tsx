import React, { useState, useRef } from 'react';
import { CryptoIcon } from './CryptoIcon';
import { playTap, playTick } from '../utils/audio';

interface SwipeablePortfolioCardProps {
  name: string;
  symbol: string;
  amount: number;
  price: number;
  change24h: number;
  onTrade: () => void;
  sparkline?: number[];
}

export const SwipeablePortfolioCard: React.FC<SwipeablePortfolioCardProps> = ({
  name,
  symbol,
  amount,
  price,
  change24h,
  onTrade,
  sparkline,
}) => {
  const [isSlid, setIsSlid] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const totalValue = price * amount;
  const isUp = change24h >= 0;

  // Generate realistic sparkline path
  const points =
    sparkline && sparkline.length > 2
      ? sparkline
      : isUp
      ? [price * 0.96, price * 0.98, price * 0.97, price * 1.01, price * 0.99, price * 1.02, price]
      : [price * 1.04, price * 1.02, price * 1.03, price * 0.98, price * 0.99, price * 0.96, price];

  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;

  const svgPath = points
    .map((pt, i) => {
      const x = (i / (points.length - 1)) * 60;
      const y = 22 - ((pt - min) / range) * 16;
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');

  // Touch Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startXRef.current;

    if (!isSlid) {
      if (diff > 0) {
        setDragOffset(Math.min(diff, 130));
      }
    } else {
      if (diff < 0) {
        setDragOffset(Math.max(120 + diff, 0));
      }
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    // 30% slide threshold is ~65px
    if (!isSlid && dragOffset > 55) {
      playTick();
      setIsSlid(true);
    } else if (isSlid && dragOffset < 65) {
      playTick();
      setIsSlid(false);
    }
    setDragOffset(0);
  };

  // Mouse Handlers for Desktop Testing
  const handleMouseDown = (e: React.MouseEvent) => {
    startXRef.current = e.clientX;
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const diff = e.clientX - startXRef.current;
    if (!isSlid && diff > 0) {
      setDragOffset(Math.min(diff, 130));
    } else if (isSlid && diff < 0) {
      setDragOffset(Math.max(120 + diff, 0));
    }
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (!isSlid && dragOffset > 55) {
      playTick();
      setIsSlid(true);
    } else if (isSlid && dragOffset < 65) {
      playTick();
      setIsSlid(false);
    }
    setDragOffset(0);
  };

  // Compute smooth animated width for dark card
  const targetWidth = isSlid ? 120 : dragOffset > 0 ? Math.min(dragOffset, 120) : 0;
  const targetOpacity = isSlid ? 1 : dragOffset > 0 ? Math.min(dragOffset / 55, 1) : 0;
  const targetScale = isSlid ? 1 : dragOffset > 0 ? Math.min(0.85 + (dragOffset / 120) * 0.15, 1) : 0.85;

  return (
    <div
      ref={cardRef}
      className="relative overflow-hidden rounded-2xl select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div
        className={`bg-[#F5F6F8] hover:bg-[#EDEFF2] rounded-2xl p-3 flex items-center justify-between border border-neutral-200/50 cursor-pointer transition-colors duration-200 ${
          isSlid ? 'shadow-xs bg-[#EDEFF2]' : ''
        }`}
        onClick={() => {
          if (!isDragging && dragOffset === 0) {
            playTap();
            onTrade();
          }
        }}
      >
        <div className="flex items-center flex-1 min-w-0">
          {/* Smoothly Expanding Dark Sparkline Widget */}
          <div
            className="overflow-hidden shrink-0 will-change-[width,opacity,transform]"
            style={{
              width: targetWidth,
              opacity: targetOpacity,
              marginRight: targetWidth > 0 ? 10 : 0,
              transform: `scale(${targetScale})`,
              transition: isDragging
                ? 'none'
                : 'width 380ms cubic-bezier(0.16, 1, 0.3, 1), opacity 280ms ease, margin-right 380ms cubic-bezier(0.16, 1, 0.3, 1), transform 380ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <div
              onClick={(e) => {
                e.stopPropagation();
                playTap();
                setIsSlid(false);
              }}
              className="bg-[#18191D] text-white rounded-xl p-2.5 w-[120px] space-y-1 shadow-md border border-white/5 active:scale-95 transition-transform"
              title="Click to collapse"
            >
              <div className="w-full h-5">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 60 22">
                  <path
                    d={svgPath}
                    fill="none"
                    stroke={isUp ? '#4ADE80' : '#F87171'}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="text-xs font-mono-num font-extrabold text-white truncate">
                ${price < 1 ? price.toFixed(4) : price.toLocaleString('en-US', { maximumFractionDigits: 2 })}
              </div>
              <div className="text-[10px] font-mono-num flex items-center justify-between text-white/50">
                <span className="truncate">{amount} {symbol}</span>
                <span className={`font-bold ml-1 ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isUp ? '+' : ''}{change24h}%
                </span>
              </div>
            </div>
          </div>

          {/* Coin Brand Icon & Title with Smooth Slide Offset */}
          <div
            className="flex items-center gap-3.5 pl-1 min-w-0 flex-1 transition-transform duration-300 ease-out"
          >
            <CryptoIcon symbol={symbol} size={40} />
            <div className="min-w-0">
              <div className="font-bold text-sm text-[#111317] truncate">{name}</div>
              <div className="text-xs text-[#6B7280] font-mono-num flex items-center gap-1.5">
                <span>{amount} {symbol}</span>
                {!isSlid && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      playTap();
                      setIsSlid(true);
                    }}
                    className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-black/5 hover:bg-black/10 text-[#555A64] transition-all active:scale-90"
                    title="Slide 30% to view chart"
                  >
                    Slide 30% ⇆
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Total USD Balance */}
        <div className="text-right pl-3 pr-1 shrink-0">
          <div className="font-mono-num font-bold text-sm text-[#111317]">
            ${totalValue.toLocaleString('en-US', {
              maximumFractionDigits: totalValue < 10 ? 2 : 0,
            })}
          </div>
          <div className={`text-[11px] font-mono-num font-medium ${isUp ? 'text-emerald-600' : 'text-rose-600'}`}>
            {isUp ? '+' : ''}{change24h}%
          </div>
        </div>
      </div>
    </div>
  );
};
