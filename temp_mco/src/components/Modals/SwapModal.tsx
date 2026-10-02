import React, { useState } from 'react';
import { X, ArrowDownUp, Settings, ChevronDown, CheckCircle2, Sparkles, RefreshCw } from 'lucide-react';
import { TokenHolding } from '../../types';
import { playTap, playSuccess } from '../../utils/audio';

interface SwapModalProps {
  isOpen: boolean;
  onClose: () => void;
  tokens: TokenHolding[];
  onConfirmSwap: (fromSymbol: string, toSymbol: string, fromAmt: number, toAmt: number) => void;
}

export const SwapModal: React.FC<SwapModalProps> = ({
  isOpen,
  onClose,
  tokens,
  onConfirmSwap,
}) => {
  const [fromToken, setFromToken] = useState<TokenHolding>(tokens[1]); // ETH
  const [toToken, setToToken] = useState<TokenHolding>(tokens[3]); // USDC
  const [fromAmount, setFromAmount] = useState('1');
  const [slippage, setSlippage] = useState<'0.1%' | '0.5%' | '1.0%'>('0.5%');
  const [showSettings, setShowSettings] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);
  const [isDone, setIsDone] = useState(false);

  if (!isOpen) return null;

  const parsedFrom = parseFloat(fromAmount) || 0;
  // Dynamic exchange rate: fromToken.price / toToken.price
  const rate = fromToken.price / (toToken.price || 1);
  const calculatedTo = (parsedFrom * rate).toFixed(toToken.price < 1 ? 4 : 2);
  const isOverBalance = parsedFrom > fromToken.holdings;
  const canSwap = parsedFrom > 0 && !isOverBalance && fromToken.id !== toToken.id;

  const handleInvert = () => {
    playTap();
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    setFromAmount('1');
  };

  const handleSwap = () => {
    if (!canSwap) return;
    setIsSwapping(true);
    playTap();

    setTimeout(() => {
      setIsSwapping(false);
      setIsDone(true);
      playSuccess();
      onConfirmSwap(fromToken.symbol, toToken.symbol, parsedFrom, parseFloat(calculatedTo));

      setTimeout(() => {
        setIsDone(false);
        setFromAmount('1');
        onClose();
      }, 1500);
    }, 1300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-[#121419] border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-cyan-500/15 text-cyan-300 flex items-center justify-center">
              <RefreshCw className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Instant Swap</h3>
              <p className="text-[11px] text-white/40">Zero routing fee · Best execution</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                playTap();
                setShowSettings(!showSettings);
              }}
              className="p-1.5 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors"
            >
              <Settings className="w-4 h-4" />
            </button>
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
        </div>

        {/* Slippage Settings Drawer */}
        {showSettings && (
          <div className="my-3 p-3 bg-[#181B22] rounded-2xl border border-white/10 text-xs animate-in slide-in-from-top duration-150">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/60 font-medium">Slippage Tolerance</span>
              <span className="font-mono-num font-bold text-[#E6DFCF]">{slippage}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(['0.1%', '0.5%', '1.0%'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    playTap();
                    setSlippage(s);
                  }}
                  className={`py-1.5 rounded-lg border text-center font-bold transition-all ${
                    slippage === s
                      ? 'bg-[#E6DFCF] text-[#121316] border-[#E6DFCF]'
                      : 'bg-white/5 text-white/60 border-white/5 hover:border-white/20'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {isDone ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <CheckCircle2 className="w-14 h-14 text-emerald-400 mb-3 animate-bounce" />
            <h4 className="text-xl font-bold text-white">Swap Executed!</h4>
            <p className="text-sm text-white/60 mt-1">
              Received {calculatedTo} {toToken.symbol}
            </p>
            <div className="mt-4 font-mono-num text-xs text-white/40">
              Mempool block hash: 0x{Math.random().toString(16).slice(2, 10)}...
            </div>
          </div>
        ) : (
          <div className="space-y-3 pt-4">
            {/* Pay Box (From) */}
            <div className="bg-[#181B22] border border-white/10 rounded-2xl p-4">
              <div className="flex items-center justify-between text-xs text-white/50 mb-2">
                <span>You Pay</span>
                <span>
                  Balance:{' '}
                  <span className="font-mono-num font-semibold text-white">
                    {fromToken.holdings} {fromToken.symbol}
                  </span>
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <input
                  type="number"
                  placeholder="0.0"
                  value={fromAmount}
                  onChange={(e) => setFromAmount(e.target.value)}
                  className="bg-transparent font-mono-num text-2xl font-extrabold text-white placeholder-white/20 outline-none w-1/2"
                />

                <div className="relative">
                  <select
                    value={fromToken.id}
                    onChange={(e) => {
                      playTap();
                      const found = tokens.find((t) => t.id === e.target.value);
                      if (found) setFromToken(found);
                    }}
                    className="appearance-none bg-white/10 hover:bg-white/15 text-white font-bold text-sm px-3 py-2 pr-7 rounded-xl outline-none cursor-pointer"
                  >
                    {tokens.map((t) => (
                      <option key={t.id} value={t.id} className="bg-[#181B22] text-white">
                        {t.symbol}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-white/50 absolute right-2.5 top-3 pointer-events-none" />
                </div>
              </div>

              <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5 text-[11px] text-white/40">
                <span>≈ ${(parsedFrom * fromToken.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                <button
                  onClick={() => {
                    playTap();
                    setFromAmount(fromToken.holdings.toString());
                  }}
                  className="text-[#E6DFCF] hover:underline font-bold"
                >
                  Use Max
                </button>
              </div>
            </div>

            {/* Invert Button */}
            <div className="flex justify-center -my-2 relative z-10">
              <button
                onClick={handleInvert}
                className="w-10 h-10 rounded-full bg-[#1C1F27] border border-white/15 text-white/80 hover:text-white hover:scale-110 active:scale-95 transition-all shadow-md flex items-center justify-center"
              >
                <ArrowDownUp className="w-4 h-4" />
              </button>
            </div>

            {/* Receive Box (To) */}
            <div className="bg-[#181B22] border border-white/10 rounded-2xl p-4">
              <div className="flex items-center justify-between text-xs text-white/50 mb-2">
                <span>You Receive</span>
                <span>
                  Balance:{' '}
                  <span className="font-mono-num font-semibold text-white">
                    {toToken.holdings} {toToken.symbol}
                  </span>
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <div className="font-mono-num text-2xl font-extrabold text-white">
                  {calculatedTo}
                </div>

                <div className="relative">
                  <select
                    value={toToken.id}
                    onChange={(e) => {
                      playTap();
                      const found = tokens.find((t) => t.id === e.target.value);
                      if (found) setToToken(found);
                    }}
                    className="appearance-none bg-white/10 hover:bg-white/15 text-white font-bold text-sm px-3 py-2 pr-7 rounded-xl outline-none cursor-pointer"
                  >
                    {tokens.map((t) => (
                      <option key={t.id} value={t.id} className="bg-[#181B22] text-white">
                        {t.symbol}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-white/50 absolute right-2.5 top-3 pointer-events-none" />
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-white/5 text-[11px] text-white/40">
                <span>≈ ${(parseFloat(calculatedTo || '0') * toToken.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            {/* Routing & Quote Details */}
            <div className="bg-[#181B22]/50 border border-white/5 rounded-2xl p-3 space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-white/50">
                <span>Rate</span>
                <span className="font-mono-num text-white/80 font-medium">
                  1 {fromToken.symbol} = {rate.toFixed(4)} {toToken.symbol}
                </span>
              </div>
              <div className="flex items-center justify-between text-white/50">
                <span>Route</span>
                <span className="text-white/80 font-medium flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" /> Uniswap v3 & Curve Pool
                </span>
              </div>
              <div className="flex items-center justify-between text-white/50">
                <span>Price Impact</span>
                <span className="text-emerald-400 font-semibold">&lt;0.01% (Optimal)</span>
              </div>
            </div>

            {isOverBalance && (
              <p className="text-xs text-rose-400 font-semibold">
                Insufficient {fromToken.symbol} in wallet.
              </p>
            )}

            {/* Action Button */}
            <button
              disabled={!canSwap || isSwapping}
              onClick={handleSwap}
              className={`w-full py-4 rounded-2xl font-bold text-sm tracking-wide transition-all shadow-lg ${
                canSwap && !isSwapping
                  ? 'bg-[#E6DFCF] hover:bg-[#F0EAE0] text-[#121316] cursor-pointer hover:scale-[1.01] active:scale-[0.98]'
                  : 'bg-white/10 text-white/30 cursor-not-allowed'
              }`}
            >
              {isSwapping ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-black/40 border-t-black rounded-full animate-spin" />
                  Routing Trade Across DEXs...
                </span>
              ) : (
                `Swap ${fromToken.symbol} for ${toToken.symbol}`
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
