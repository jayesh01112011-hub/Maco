import React, { useState, useRef } from 'react';
import { ShieldCheck, Eye, EyeOff, Snowflake, Sparkles, CreditCard, RotateCcw } from 'lucide-react';
import { CardSkin } from '../types';
import { playTap, playLock } from '../utils/audio';

interface Card3DProps {
  isFrozen: boolean;
  onToggleFreeze: () => void;
  selectedSkin: CardSkin;
  onSelectSkin: (skin: CardSkin) => void;
  onOpenCardDetails?: () => void;
}

export const Card3D: React.FC<Card3DProps> = ({
  isFrozen,
  onToggleFreeze,
  selectedSkin,
  onSelectSkin,
  onOpenCardDetails,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showNumbers, setShowNumbers] = useState(false);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = -((y - centerY) / centerY) * 12;
    const rotY = ((x - centerX) / centerX) * 14;

    setRotateX(rotX);
    setRotateY(rotY);
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.25,
    });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlarePos(prev => ({ ...prev, opacity: 0 }));
  };

  const handleFlip = (e: React.MouseEvent) => {
    e.stopPropagation();
    playTap();
    setIsFlipped(!isFlipped);
  };

  const skinStyles: Record<CardSkin, { bg: string; border: string; accent: string; name: string }> = {
    obsidian: {
      bg: 'linear-gradient(135deg, #1C1E24 0%, #111216 45%, #0B0C0E 100%)',
      border: 'border-white/10',
      accent: '#E6DFCF',
      name: 'Vault Black Titanium',
    },
    platinum: {
      bg: 'linear-gradient(135deg, #2E333D 0%, #1D2128 50%, #14171D 100%)',
      border: 'border-white/20',
      accent: '#FFFFFF',
      name: 'Brushed Platinum',
    },
    aurora: {
      bg: 'linear-gradient(135deg, #14213d 0%, #0d1b2a 40%, #1e1b4b 85%, #0f172a 100%)',
      border: 'border-cyan-400/25',
      accent: '#38BDF8',
      name: 'Cyber Aurora',
    },
    solaris: {
      bg: 'linear-gradient(135deg, #2A2318 0%, #18140E 50%, #0E0C09 100%)',
      border: 'border-amber-400/25',
      accent: '#FBBF24',
      name: 'Solaris Gold',
    },
  };

  const currentSkin = skinStyles[selectedSkin];

  return (
    <div className="w-full select-none">
      {/* 3D Card Container with Perspective */}
      <div
        className="relative w-full aspect-[1.586/1] max-w-[420px] mx-auto cursor-pointer"
        style={{ perspective: '1000px' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={() => onOpenCardDetails?.()}
      >
        <div
          ref={cardRef}
          className="relative w-full h-full transition-transform duration-200 ease-out"
          style={{
            transformStyle: 'preserve-3d',
            transform: `rotateX(${rotateX}deg) rotateY(${rotateY + (isFlipped ? 180 : 0)}deg)`,
          }}
        >
          {/* FRONT FACE */}
          <div
            className={`absolute inset-0 rounded-2xl md:rounded-3xl p-5 md:p-6 flex flex-col justify-between overflow-hidden shadow-2xl border ${currentSkin.border}`}
            style={{
              background: currentSkin.bg,
              backfaceVisibility: 'hidden',
            }}
          >
            {/* Dynamic Glare Reflection */}
            <div
              className="pointer-events-none absolute inset-0 transition-opacity duration-300"
              style={{
                background: `radial-gradient(circle 280px at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,${glarePos.opacity}), transparent 80%)`,
              }}
            />

            {/* Subtle Metallic Micro-Brushing Overlay */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.035]"
              style={{
                backgroundImage: 'repeating-linear-gradient(0deg, #fff, #fff 1px, transparent 1px, transparent 2px)',
              }}
            />

            {/* Frozen Overlay */}
            {isFrozen && (
              <div className="absolute inset-0 bg-[#0A101D]/75 backdrop-blur-sm z-20 flex flex-col items-center justify-center gap-2 border border-cyan-400/30 rounded-2xl md:rounded-3xl">
                <Snowflake className="w-8 h-8 text-cyan-400 animate-pulse" />
                <span className="text-xs font-bold tracking-wider text-cyan-300 uppercase">Card Temporarily Frozen</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    playLock();
                    onToggleFreeze();
                  }}
                  className="mt-1 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-200 text-xs font-semibold hover:bg-cyan-500/30 transition-colors"
                >
                  Unfreeze Now
                </button>
              </div>
            )}

            {/* Top Row: Chip & Brand */}
            <div className="flex items-start justify-between z-10">
              <div className="flex items-center gap-3">
                {/* Metallic EMV Chip */}
                <div className="w-10 h-8 rounded-md bg-gradient-to-br from-[#E6DFCF] via-[#C9BFA8] to-[#8C8472] p-[1.5px] shadow-sm">
                  <div className="w-full h-full rounded-[4px] border border-black/20 flex flex-col justify-around p-1">
                    <div className="h-[1px] bg-black/30 w-full" />
                    <div className="h-[1px] bg-black/30 w-3/4" />
                    <div className="h-[1px] bg-black/30 w-full" />
                  </div>
                </div>

                {/* Contactless Signal Icon */}
                <svg className="w-5 h-5 text-white/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M8.5 16.5a5 5 0 0 1 0-9" strokeLinecap="round" />
                  <path d="M12 19a8.5 8.5 0 0 0 0-14" strokeLinecap="round" />
                  <path d="M15.5 21.5a12 12 0 0 0 0-19" strokeLinecap="round" />
                </svg>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold tracking-widest uppercase opacity-60" style={{ color: currentSkin.accent }}>
                  VAULT
                </span>
                <span className="font-extrabold text-sm tracking-tight text-white">BLACK</span>
              </div>
            </div>

            {/* Middle Row: Card Number */}
            <div className="my-auto z-10 flex items-center justify-between">
              <div className="font-mono-num tracking-[0.22em] text-base md:text-lg text-white/90 drop-shadow-sm font-semibold">
                {showNumbers ? '4242  9812  6023  8842' : '••••  ••••  ••••  8842'}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  playTap();
                  setShowNumbers(!showNumbers);
                }}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                title={showNumbers ? 'Hide numbers' : 'Show numbers'}
              >
                {showNumbers ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Bottom Row: Cardholder, Expiry & Visa Platinum Logo */}
            <div className="flex items-end justify-between z-10">
              <div>
                <div className="text-[9px] uppercase tracking-wider text-white/40 font-semibold">Cardholder</div>
                <div className="text-xs md:text-sm font-bold tracking-wide text-white">ALEXANDER R. VANCE</div>
              </div>

              <div className="flex items-end gap-5">
                <div>
                  <div className="text-[9px] uppercase tracking-wider text-white/40 font-semibold">Expires</div>
                  <div className="text-xs md:text-sm font-mono-num font-bold text-white">09/29</div>
                </div>

                <div className="text-right">
                  <span className="text-base md:text-lg font-black italic tracking-tighter" style={{ color: currentSkin.accent }}>
                    VISA
                  </span>
                  <div className="text-[8px] tracking-widest uppercase text-white/50 font-bold -mt-1">Infinite</div>
                </div>
              </div>
            </div>
          </div>

          {/* BACK FACE */}
          <div
            className={`absolute inset-0 rounded-2xl md:rounded-3xl flex flex-col justify-between overflow-hidden shadow-2xl border ${currentSkin.border}`}
            style={{
              background: currentSkin.bg,
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            {/* Magnetic Stripe */}
            <div className="w-full h-11 bg-black/90 mt-5 border-y border-white/5" />

            {/* Signature & CVV Panel */}
            <div className="px-6 py-2">
              <div className="flex items-center gap-3">
                <div className="flex-1 h-8 bg-white/85 rounded flex items-center px-3">
                  <span className="font-serif italic text-xs text-neutral-800 tracking-wider">A. R. Vance</span>
                </div>
                <div className="bg-[#121418] border border-white/15 px-3 py-1.5 rounded text-right">
                  <div className="text-[8px] uppercase text-white/50 tracking-wider">CVV</div>
                  <div className="font-mono-num text-xs font-bold text-white tracking-widest">
                    {showNumbers ? '849' : '•••'}
                  </div>
                </div>
              </div>
            </div>

            {/* Back Footer Info */}
            <div className="px-6 pb-5 flex items-center justify-between text-[9px] text-white/40 font-medium">
              <div>Issued by Vault Bancorp · FDlC Insured via Partner Bank</div>
              <div className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Encrypted</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card Quick Interactive Toolbelt */}
      <div className="flex items-center justify-between max-w-[420px] mx-auto mt-4 px-1 text-xs">
        <button
          onClick={handleFlip}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-white/80 border border-white/5 transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{isFlipped ? 'Show Front' : 'Flip Card'}</span>
        </button>

        <button
          onClick={() => {
            playLock();
            onToggleFreeze();
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all border ${
            isFrozen
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/30'
              : 'bg-white/[0.04] hover:bg-white/[0.08] text-white/80 border-white/5'
          }`}
        >
          <Snowflake className="w-3.5 h-3.5" />
          <span>{isFrozen ? 'Card Frozen' : 'Freeze'}</span>
        </button>

        {/* Skin Selector Pill Buttons */}
        <div className="flex items-center gap-1 bg-[#14161B] p-1 rounded-full border border-white/5">
          {(['obsidian', 'platinum', 'aurora', 'solaris'] as CardSkin[]).map((skin) => (
            <button
              key={skin}
              onClick={() => {
                playTap();
                onSelectSkin(skin);
              }}
              className={`w-5 h-5 rounded-full transition-transform ${
                selectedSkin === skin ? 'ring-2 ring-white scale-110' : 'opacity-60 hover:opacity-100'
              }`}
              style={{
                background:
                  skin === 'obsidian'
                    ? '#1C1E24'
                    : skin === 'platinum'
                    ? '#D1D5DB'
                    : skin === 'aurora'
                    ? '#38BDF8'
                    : '#F59E0B',
              }}
              title={skinStyles[skin].name}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
