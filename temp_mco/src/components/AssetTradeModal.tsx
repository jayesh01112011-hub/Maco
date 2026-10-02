import React, { useState } from 'react';
import { X, ArrowDownUp, Sparkles, TrendingUp, TrendingDown, CheckCircle2, Zap } from 'lucide-react';
import { playTap, playSuccess } from '../utils/audio';
import { CryptoIcon } from './CryptoIcon';

interface AssetTradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: {
    symbol: string;
    name?: string;
    price?: number;
    change?: number;
    iconEmoji?: string;
    iconBg?: string;
  } | null;
  onOpenBuy: (symbol: string) => void;
  onExecuteTrade: (fromSym: string, toSym: string, amount: number) => void;
}

export const AssetTradeModal: React.FC<AssetTradeModalProps> = ({
  isOpen,
  onClose,
  asset,
  onOpenBuy,
  onExecuteTrade,
}) => {
  const [activeTab, setActiveTab] = useState<'swap' | 'perps'>('swap');
  const [payAmount, setPayAmount] = useState('100');
  const [leverage, setLeverage] = useState(20);
  const [perpDirection, setPerpDirection] = useState<'long' | 'short'>('long');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);

  if (!isOpen || !asset) return null;

  const currentPrice = asset.price || 1.84;
  const changeVal = asset.change ?? 2.45;
  const isUp = changeVal >= 0;

  const parsedPay = parseFloat(payAmount) || 0;
  const tokensReceived = (parsedPay / currentPrice).toFixed(currentPrice < 1 ? 4 : 2);

  const handleSwap = () => {
    if (parsedPay <= 0) return;
    setIsProcessing(true);
    playTap();

    setTimeout(() => {
      setIsProcessing(false);
      setIsDone(true);
      playSuccess();
      onExecuteTrade('USDC', asset.symbol, parsedPay);

      setTimeout(() => {
        setIsDone(false);
        onClose();
      }, 1400);
    }, 1100);
  };

  const handleOpenPerp = () => {
    if (parsedPay <= 0) return;
    setIsProcessing(true);
    playTap();

    setTimeout(() => {
      setIsProcessing(false);
      setIsDone(true);
      playSuccess();

      setTimeout(() => {
        setIsDone(false);
        onClose();
      }, 1400);
    }, 1100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-[480px] bg-[#121419] border-t sm:border border-white/10 rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <div className="flex items-center gap-3">
            <CryptoIcon symbol={asset.symbol} size={42} />

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-white">{asset.name || asset.symbol}</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/70 font-bold">
                  {asset.symbol}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono-num mt-0.5">
                <span className="text-white font-bold">${currentPrice < 1 ? currentPrice.toFixed(4) : currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                <span className={`font-semibold flex items-center ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isUp ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                  {isUp ? '+' : ''}{changeVal}%
                </span>
              </div>
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

        {isDone ? (
          <div className="py-12 text-center space-y-2">
            <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto animate-bounce" />
            <h4 className="text-xl font-bold text-white">Order Executed!</h4>
            <p className="text-xs text-white/60">
              {activeTab === 'swap'
                ? `Swapped $${parsedPay} USDC for ${tokensReceived} ${asset.symbol}`
                : `Opened ${leverage}x ${perpDirection.toUpperCase()} on ${asset.symbol}`}
            </p>
          </div>
        ) : (
          <div className="space-y-4 pt-4">
            {/* Action Tabs: Swap & Perps */}
            <div className="flex p-1 bg-[#181B22] rounded-2xl border border-white/5">
              <button
                onClick={() => {
                  playTap();
                  setActiveTab('swap');
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'swap' ? 'bg-white text-black shadow-sm' : 'text-white/60 hover:text-white'
                }`}
              >
                Instant Swap
              </button>
              <button
                onClick={() => {
                  playTap();
                  setActiveTab('perps');
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'perps' ? 'bg-white text-black shadow-sm' : 'text-white/60 hover:text-white'
                }`}
              >
                Trade Perps (50x)
              </button>
            </div>

            {activeTab === 'swap' ? (
              /* SWAP TAB */
              <div className="space-y-3">
                {/* You Pay */}
                <div className="bg-[#181B22] border border-white/5 rounded-2xl p-3.5 space-y-1">
                  <div className="flex justify-between text-xs text-white/50">
                    <span>You Pay</span>
                    <span>Bal: $12,500.00 USDC</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <input
                      type="number"
                      value={payAmount}
                      onChange={(e) => setPayAmount(e.target.value)}
                      className="bg-transparent font-mono-num text-2xl font-black text-white outline-none w-1/2"
                    />
                    <span className="font-bold text-sm text-white px-3 py-1.5 rounded-xl bg-white/10">
                      USDC
                    </span>
                  </div>
                </div>

                {/* You Receive */}
                <div className="bg-[#181B22] border border-white/5 rounded-2xl p-3.5 space-y-1">
                  <div className="flex justify-between text-xs text-white/50">
                    <span>You Receive (Estimated)</span>
                    <span>Rate: 1 {asset.symbol} = ${currentPrice}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="font-mono-num text-2xl font-black text-white">
                      {tokensReceived}
                    </div>
                    <span className="font-bold text-sm text-white px-3 py-1.5 rounded-xl bg-white/10">
                      {asset.symbol}
                    </span>
                  </div>
                </div>

                {/* Quick Buy via Fiat option */}
                <button
                  type="button"
                  onClick={() => {
                    playTap();
                    onClose();
                    onOpenBuy(asset.symbol);
                  }}
                  className="w-full py-2.5 text-center text-xs font-bold text-blue-400 hover:text-blue-300"
                >
                  Or buy with UPI / Card via Onramp →
                </button>

                {/* Execute Swap CTA */}
                <button
                  disabled={parsedPay <= 0 || isProcessing}
                  onClick={handleSwap}
                  className={`w-full py-4 rounded-full font-bold text-sm tracking-wide transition-all shadow-xl ${
                    parsedPay > 0 && !isProcessing
                      ? 'bg-white hover:bg-neutral-200 text-black cursor-pointer active:scale-98'
                      : 'bg-white/20 text-white/40 cursor-not-allowed'
                  }`}
                >
                  {isProcessing ? 'Routing DEX Swap...' : `Swap USDC for ${asset.symbol}`}
                </button>
              </div>
            ) : (
              /* PERPS TAB */
              <div className="space-y-3">
                {/* Long / Short toggle */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      playTap();
                      setPerpDirection('long');
                    }}
                    className={`py-2.5 rounded-xl font-bold text-xs transition-all ${
                      perpDirection === 'long'
                        ? 'bg-emerald-500 text-black shadow-md'
                        : 'bg-white/5 text-emerald-400 hover:bg-white/10'
                    }`}
                  >
                    Long {asset.symbol}
                  </button>
                  <button
                    onClick={() => {
                      playTap();
                      setPerpDirection('short');
                    }}
                    className={`py-2.5 rounded-xl font-bold text-xs transition-all ${
                      perpDirection === 'short'
                        ? 'bg-rose-500 text-white shadow-md'
                        : 'bg-white/5 text-rose-400 hover:bg-white/10'
                    }`}
                  >
                    Short {asset.symbol}
                  </button>
                </div>

                {/* Leverage Slider */}
                <div className="bg-[#181B22] p-3 rounded-2xl border border-white/5">
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-white/50">Leverage</span>
                    <span className="font-mono-num font-extrabold text-white">{leverage}x</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="50"
                    step="1"
                    value={leverage}
                    onChange={(e) => setLeverage(parseInt(e.target.value))}
                    className="w-full accent-white cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-white/40 mt-1 font-mono-num">
                    <span>2x</span>
                    <span>10x</span>
                    <span>25x</span>
                    <span>50x Max</span>
                  </div>
                </div>

                {/* Collateral Input */}
                <div className="bg-[#181B22] border border-white/5 rounded-2xl p-3.5 space-y-1">
                  <div className="flex justify-between text-xs text-white/50">
                    <span>Collateral (USDC)</span>
                    <span>Available: $12,500.00</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <input
                      type="number"
                      value={payAmount}
                      onChange={(e) => setPayAmount(e.target.value)}
                      className="bg-transparent font-mono-num text-xl font-black text-white outline-none w-1/2"
                    />
                    <span className="text-xs font-mono-num text-white/60">
                      Position: ${(parsedPay * leverage).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Execute Perp CTA */}
                <button
                  disabled={parsedPay <= 0 || isProcessing}
                  onClick={handleOpenPerp}
                  className={`w-full py-4 rounded-full font-bold text-sm tracking-wide transition-all shadow-xl ${
                    perpDirection === 'long'
                      ? 'bg-emerald-400 hover:bg-emerald-300 text-black'
                      : 'bg-rose-500 hover:bg-rose-400 text-white'
                  }`}
                >
                  {isProcessing ? 'Opening Position...' : `Open ${leverage}x ${perpDirection.toUpperCase()} on ${asset.symbol}`}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
