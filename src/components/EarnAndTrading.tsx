import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Shield, Sparkles, Percent, DollarSign, ArrowRight, Zap, RefreshCw } from 'lucide-react';
import { YieldVault, PerpPosition } from '../types';
import { playTap, playSuccess } from '../utils/audio';

interface EarnAndTradingProps {
  vaults: YieldVault[];
  onDepositVault: (vaultId: string, amountUsd: number) => void;
  onClaimYield: (vaultId: string) => void;
  userUsdBalance: number;
}

export const EarnAndTrading: React.FC<EarnAndTradingProps> = ({
  vaults,
  onDepositVault,
  onClaimYield,
  userUsdBalance,
}) => {
  const [subTab, setSubTab] = useState<'earn' | 'perps'>('earn');

  // Earn State: Live ticking interest counter
  const [liveEarnedOffset, setLiveEarnedOffset] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      // Tick interest every 1.5 seconds
      setLiveEarnedOffset((prev) => prev + 0.0034);
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  // Perps State
  const [selectedPair, setSelectedPair] = useState<'BTC-PERP' | 'ETH-PERP' | 'SOL-PERP'>('BTC-PERP');
  const [direction, setDirection] = useState<'long' | 'short'>('long');
  const [leverage, setLeverage] = useState<number>(20);
  const [marginInput, setMarginInput] = useState<string>('500');
  const [activePosition, setActivePosition] = useState<PerpPosition | null>(null);

  const pairPrices: Record<string, number> = {
    'BTC-PERP': 83766.86,
    'ETH-PERP': 2690.68,
    'SOL-PERP': 117.56,
  };

  const currentPrice = pairPrices[selectedPair];
  const margin = parseFloat(marginInput) || 0;
  const positionSize = margin * leverage;

  // Liquidation calculation
  const liqDistance = currentPrice * (0.9 / leverage);
  const liquidationPrice =
    direction === 'long' ? Math.max(0, currentPrice - liqDistance) : currentPrice + liqDistance;

  const handleOpenPosition = () => {
    if (margin <= 0) return;
    playSuccess();
    setActivePosition({
      id: 'pos-' + Date.now(),
      pair: selectedPair,
      type: direction,
      leverage,
      entryPrice: currentPrice,
      currentPrice,
      margin,
      pnl: 14.20,
      pnlPercent: 2.84,
      liquidationPrice,
    });
  };

  const handleClosePosition = () => {
    playTap();
    setActivePosition(null);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Sub-navigation Switcher */}
      <div className="flex items-center gap-1 p-1 bg-[#14161B] rounded-2xl border border-white/5">
        <button
          onClick={() => {
            playTap();
            setSubTab('earn');
          }}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            subTab === 'earn'
              ? 'bg-[#E6DFCF] text-[#121316] shadow-sm'
              : 'text-white/50 hover:text-white'
          }`}
        >
          <Percent className="w-3.5 h-3.5" />
          <span>Institutional Yield</span>
        </button>

        <button
          onClick={() => {
            playTap();
            setSubTab('perps');
          }}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            subTab === 'perps'
              ? 'bg-[#E6DFCF] text-[#121316] shadow-sm'
              : 'text-white/50 hover:text-white'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Perpetual Futures (50x)</span>
        </button>
      </div>

      {subTab === 'earn' ? (
        /* EARN VAULTS VIEW */
        <div className="space-y-4">
          {/* Total Yield Hero Header */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#1C1F27] via-[#14161B] to-[#0E1014] border border-white/10">
            <div className="flex items-center justify-between text-xs text-white/50">
              <span>Total Yield Earned</span>
              <span className="flex items-center gap-1 text-emerald-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Live Compounding
              </span>
            </div>

            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-mono-num text-3xl font-extrabold text-white">
                ${(435.84 + liveEarnedOffset).toFixed(4)}
              </span>
              <span className="text-xs font-bold text-emerald-400">+$2.40 / day</span>
            </div>

            <p className="text-xs text-white/40 mt-1">
              All deposits secured in audited smart contract vaults with auto-compounding.
            </p>
          </div>

          {/* Vault Cards */}
          <div className="space-y-3">
            {vaults.map((vault) => {
              return (
                <div
                  key={vault.id}
                  className="bg-[#14161B] border border-white/5 hover:border-white/15 rounded-2xl p-4 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-white">{vault.name}</h4>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-[#E6DFCF] font-bold">
                          {vault.tag}
                        </span>
                      </div>
                      <div className="text-xs text-white/40 mt-0.5">TVL {vault.tvl} · {vault.risk} Risk</div>
                    </div>

                    <div className="text-right">
                      <div className="font-mono-num text-lg font-black text-emerald-400">
                        {vault.apy}%
                      </div>
                      <div className="text-[10px] text-white/40 uppercase font-semibold">Net APY</div>
                    </div>
                  </div>

                  {/* Deposited Info */}
                  <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-white/40">Your Stake: </span>
                      <span className="font-mono-num font-semibold text-white">
                        ${vault.depositedUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          playSuccess();
                          onClaimYield(vault.id);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-xs font-semibold transition-colors"
                      >
                        Claim Rewards
                      </button>
                      <button
                        onClick={() => {
                          playTap();
                          onDepositVault(vault.id, 500);
                        }}
                        className="px-3 py-1 rounded-lg bg-[#E6DFCF] hover:bg-[#F2ECE0] text-[#121316] text-xs font-bold transition-colors"
                      >
                        + Stake $500
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* PERPETUAL FUTURES TRADING VIEW */
        <div className="space-y-4">
          {/* Pair & Ticker Header */}
          <div className="bg-[#14161B] border border-white/10 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              {/* Pair Selector */}
              <div className="flex gap-1 bg-white/5 p-1 rounded-xl">
                {(['BTC-PERP', 'ETH-PERP', 'SOL-PERP'] as const).map((pair) => (
                  <button
                    key={pair}
                    onClick={() => {
                      playTap();
                      setSelectedPair(pair);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      selectedPair === pair ? 'bg-white/20 text-white' : 'text-white/40 hover:text-white'
                    }`}
                  >
                    {pair.replace('-PERP', '')}
                  </button>
                ))}
              </div>

              {/* Price display */}
              <div className="text-right">
                <div className="font-mono-num text-lg font-black text-white">
                  ${currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-[10px] text-emerald-400 font-semibold">+3.8% Index</div>
              </div>
            </div>

            {/* Long / Short Switcher */}
            <div className="grid grid-cols-2 gap-2 mt-4">
              <button
                onClick={() => {
                  playTap();
                  setDirection('long');
                }}
                className={`py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                  direction === 'long'
                    ? 'bg-emerald-500 text-black shadow-md'
                    : 'bg-white/5 text-emerald-400/70 hover:bg-white/10'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Long {selectedPair.split('-')[0]}</span>
              </button>

              <button
                onClick={() => {
                  playTap();
                  setDirection('short');
                }}
                className={`py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                  direction === 'short'
                    ? 'bg-rose-500 text-white shadow-md'
                    : 'bg-white/5 text-rose-400/70 hover:bg-white/10'
                }`}
              >
                <TrendingDown className="w-3.5 h-3.5" />
                <span>Short {selectedPair.split('-')[0]}</span>
              </button>
            </div>

            {/* Leverage Slider */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-white/50">Leverage</span>
                <span className="font-mono-num font-black text-[#E6DFCF] text-sm">{leverage}x</span>
              </div>
              <input
                type="range"
                min="2"
                max="50"
                step="1"
                value={leverage}
                onChange={(e) => {
                  playTap();
                  setLeverage(parseInt(e.target.value));
                }}
                className="w-full accent-[#E6DFCF] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-white/30 mt-1 font-mono-num">
                <span>2x</span>
                <span>10x</span>
                <span>25x</span>
                <span>50x Max</span>
              </div>
            </div>

            {/* Margin Collateral Input */}
            <div className="mt-4 pt-4 border-t border-white/5">
              <div className="flex items-center justify-between text-xs text-white/50 mb-1.5">
                <span>Margin Collateral (USDC)</span>
                <span>Available: ${userUsdBalance.toLocaleString()}</span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  value={marginInput}
                  onChange={(e) => setMarginInput(e.target.value)}
                  className="w-full bg-[#181B22] border border-white/10 rounded-xl px-4 py-2.5 text-sm font-mono-num font-bold text-white focus:outline-none focus:border-[#E6DFCF]"
                />
                <button
                  onClick={() => {
                    playTap();
                    setMarginInput('1000');
                  }}
                  className="absolute right-3 top-2.5 text-xs text-[#E6DFCF] font-bold"
                >
                  $1,000
                </button>
              </div>
            </div>

            {/* Liquidation & Position Size Summary */}
            <div className="mt-3 bg-[#181B22]/60 rounded-xl p-3 space-y-1.5 text-xs">
              <div className="flex justify-between text-white/50">
                <span>Total Position Size:</span>
                <span className="font-mono-num font-bold text-white">${positionSize.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-white/50">
                <span>Estimated Liquidation:</span>
                <span className="font-mono-num font-bold text-amber-400">
                  ${liquidationPrice.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Open Position Button */}
            <button
              onClick={handleOpenPosition}
              className={`w-full mt-4 py-3.5 rounded-xl font-bold text-xs tracking-wide transition-all shadow-md ${
                direction === 'long'
                  ? 'bg-emerald-400 hover:bg-emerald-300 text-black'
                  : 'bg-rose-500 hover:bg-rose-400 text-white'
              }`}
            >
              Open {leverage}x {direction.toUpperCase()} Position
            </button>
          </div>

          {/* Active Open Position Card if Exists */}
          {activePosition && (
            <div className="p-4 bg-[#181B22] border border-emerald-500/30 rounded-2xl animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                    activePosition.type === 'long' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                  }`}>
                    {activePosition.type} {activePosition.leverage}x
                  </span>
                  <span className="font-bold text-sm text-white">{activePosition.pair}</span>
                </div>
                <button
                  onClick={handleClosePosition}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold"
                >
                  Close Position
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-white/5 text-xs">
                <div>
                  <div className="text-white/40">Unrealized PnL</div>
                  <div className="font-mono-num font-black text-emerald-400 text-base">
                    +${activePosition.pnl.toFixed(2)} (+{activePosition.pnlPercent}%)
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white/40">Entry / Liq Price</div>
                  <div className="font-mono-num text-white">
                    ${activePosition.entryPrice.toLocaleString()} / <span className="text-amber-400">${activePosition.liquidationPrice.toFixed(0)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
