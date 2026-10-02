import React from 'react';
import { X, ArrowUpRight, ArrowDownLeft, RefreshCw, TrendingUp, TrendingDown, ShieldCheck } from 'lucide-react';
import { TokenHolding } from '../../types';
import { playTap } from '../../utils/audio';

interface TokenDetailModalProps {
  token: TokenHolding | null;
  onClose: () => void;
  onOpenSend: (token: TokenHolding) => void;
  onOpenSwap: (token: TokenHolding) => void;
  onOpenBuy: () => void;
}

export const TokenDetailModal: React.FC<TokenDetailModalProps> = ({
  token,
  onClose,
  onOpenSend,
  onOpenSwap,
  onOpenBuy,
}) => {
  if (!token) return null;

  const isUp = token.change24h >= 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-[#121419] border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-base"
              style={{ background: token.iconBg, color: token.iconFg }}
            >
              {token.symbolChar}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-base text-white">{token.name}</h3>
                <span className="text-xs px-1.5 py-0.5 rounded bg-white/5 text-white/50 font-semibold">
                  {token.symbol}
                </span>
              </div>
              <span className="text-[11px] text-white/40">{token.category}</span>
            </div>
          </div>

          <button
            onClick={() => {
              playTap();
              onClose();
            }}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Price & 24h Change */}
        <div className="py-5">
          <div className="text-xs text-white/50 font-medium">Market Price</div>
          <div className="flex items-baseline gap-3 mt-1">
            <div className="font-mono-num text-3xl font-extrabold text-white">
              ${token.price < 1 ? token.price.toFixed(6) : token.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div
              className={`flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-full ${
                isUp ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'
              }`}
            >
              {isUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              <span>{isUp ? '+' : ''}{token.change24h}%</span>
            </div>
          </div>
        </div>

        {/* User Balance Box */}
        <div className="bg-[#181B22] border border-white/10 rounded-2xl p-4 mb-4">
          <div className="text-xs text-white/40 font-medium">Your Vault Holdings</div>
          <div className="flex items-baseline justify-between mt-1">
            <div className="font-mono-num text-xl font-bold text-white">
              ${token.holdingsUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div className="font-mono-num text-xs text-white/70">
              {token.holdings} {token.symbol}
            </div>
          </div>
        </div>

        {/* Market Stats Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs mb-5">
          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3">
            <div className="text-white/40">Market Cap</div>
            <div className="font-mono-num font-bold text-white mt-0.5">${token.mcap}</div>
          </div>
          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3">
            <div className="text-white/40">24h Volume</div>
            <div className="font-mono-num font-bold text-white mt-0.5">${token.vol24h}</div>
          </div>
          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3">
            <div className="text-white/40">24h High</div>
            <div className="font-mono-num font-bold text-white mt-0.5">${token.high24h.toLocaleString()}</div>
          </div>
          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3">
            <div className="text-white/40">24h Low</div>
            <div className="font-mono-num font-bold text-white mt-0.5">${token.low24h.toLocaleString()}</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => {
              playTap();
              onClose();
              onOpenBuy();
            }}
            className="py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs flex flex-col items-center gap-1 border border-white/5 transition-all"
          >
            <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
            <span>Buy</span>
          </button>
          <button
            onClick={() => {
              playTap();
              onClose();
              onOpenSend(token);
            }}
            className="py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs flex flex-col items-center gap-1 border border-white/5 transition-all"
          >
            <ArrowUpRight className="w-4 h-4 text-cyan-400" />
            <span>Send</span>
          </button>
          <button
            onClick={() => {
              playTap();
              onClose();
              onOpenSwap(token);
            }}
            className="py-3 rounded-2xl bg-[#E6DFCF] hover:bg-[#F2ECE0] text-[#121316] font-bold text-xs flex flex-col items-center gap-1 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Swap</span>
          </button>
        </div>
      </div>
    </div>
  );
};
