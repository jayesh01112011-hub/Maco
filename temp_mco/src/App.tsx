import React, { useState, useEffect, useMemo } from 'react';
import {
  Wallet,
  Compass,
  DollarSign,
  Gift,
  Search,
  Clock,
  Copy,
  Menu,
  MoreVertical,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownLeft,
  Sparkles,
  Info,
  UserPlus,
  Settings as SettingsIcon,
  CreditCard,
  Radio,
  ArrowRight,
  Bell,
  RotateCcw,
  User,
} from 'lucide-react';

import {
  NavTab,
  TokenHolding,
  Transaction,
  WalletAccount,
  CryptoMover,
  PerpsMover,
} from './types';
import {
  INITIAL_WALLETS,
  INITIAL_TOKENS,
  CRYPTO_MOVERS as DEFAULT_CRYPTO_MOVERS,
  PERPS_GAINERS as DEFAULT_PERPS_GAINERS,
  PERPS_LOSERS as DEFAULT_PERPS_LOSERS,
  BENEFITS_DATA,
  INITIAL_TRANSACTIONS,
} from './data/mockData';
import {
  playTap,
  playSuccess,
  setSoundEnabled,
} from './utils/audio';
import {
  fetchLiveCryptoPrices,
  LiveMarketTicker,
  REAL_CRYPTO_METADATA,
  REAL_CRYPTO_SYMBOLS,
} from './utils/cryptoApi';

import { OnrampKeypad } from './components/OnrampKeypad';
import { SettingsScreen } from './components/SettingsScreen';
import { MetaMaskCardPromo } from './components/MetaMaskCardPromo';
import { AssetTradeModal } from './components/AssetTradeModal';
import { ReceiveModal } from './components/Modals/ReceiveModal';
import { SendModal } from './components/Modals/SendModal';
import { CryptoIcon } from './components/CryptoIcon';
import { SwipeablePortfolioCard } from './components/SwipeablePortfolioCard';
import {
  ExploreFilterModal,
  SortOption,
  ChangeFilterOption,
  CapTierOption,
} from './components/ExploreFilterModal';

// Generated image assets
import moneyVaultCardImg from './assets/images/money_vault_card_1790913099853.jpg';
import rewardsSweepstakesImg from './assets/images/rewards_sweepstakes_1790913115002.jpg';

export default function App() {
  // Navigation Tabs: EXACTLY 4 TABS (Home, Explore, Money, Rewards)
  const [tab, setTab] = useState<NavTab>('home');
  const [activeAccount, setActiveAccount] = useState<WalletAccount>(INITIAL_WALLETS[0]);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);

  // Live Market Data State
  const [isLiveFeedActive, setIsLiveFeedActive] = useState(false);
  const [lastLiveUpdate, setLastLiveUpdate] = useState<string>('Connecting...');
  const [liveTickers, setLiveTickers] = useState<Record<string, LiveMarketTicker>>({});

  // Tokens & Movers State (populated with real live data)
  const [tokens, setTokens] = useState<TokenHolding[]>(INITIAL_TOKENS);
  const [cryptoMovers, setCryptoMovers] = useState<CryptoMover[]>(DEFAULT_CRYPTO_MOVERS);
  const [perpsGainers, setPerpsGainers] = useState<PerpsMover[]>(DEFAULT_PERPS_GAINERS);
  const [perpsLosers, setPerpsLosers] = useState<PerpsMover[]>(DEFAULT_PERPS_LOSERS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [benefits] = useState(BENEFITS_DATA);
  const [moneyBalance, setMoneyBalance] = useState<number>(12500.0);

  // Explore Tab State
  const [exploreCategory, setExploreCategory] = useState<string>('Now');
  const [perpsTab, setPerpsTab] = useState<'gainers' | 'losers'>('gainers');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState<SortOption>('gainers');
  const [changeFilter, setChangeFilter] = useState<ChangeFilterOption>('all');
  const [capTier, setCapTier] = useState<CapTierOption>('all');

  // Trading Asset State (When user clicks on any coin or asset in Explore or Home)
  const [selectedTradeAsset, setSelectedTradeAsset] = useState<{
    symbol: string;
    name?: string;
    price?: number;
    change?: number;
    iconEmoji?: string;
    iconBg?: string;
  } | null>(null);

  // Overlays State
  const [isOnrampOpen, setIsOnrampOpen] = useState(false);
  const [onrampTargetToken, setOnrampTargetToken] = useState<TokenHolding | null>(null);
  const [isSettingsScreenOpen, setIsSettingsScreenOpen] = useState(false);
  const [isCardPromoOpen, setIsCardPromoOpen] = useState(false);
  const [isSendOpen, setIsSendOpen] = useState(false);
  const [isReceiveOpen, setIsReceiveOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [baseCurrency, setBaseCurrency] = useState('USD');

  // Toast System
  const [toastMsg, setToastMsg] = useState('');
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2600);
  };

  // REAL LIVE CRYPTO MARKET PRICE FETCHER & POLLER
  useEffect(() => {
    let isMounted = true;

    async function loadLivePrices() {
      try {
        const liveData = await fetchLiveCryptoPrices();
        if (!isMounted || !liveData || Object.keys(liveData).length === 0) return;

        setLiveTickers(liveData);
        setIsLiveFeedActive(true);
        const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setLastLiveUpdate(timeNow);

        // 1. Update Core Token Holdings with Real Prices & Changes
        setTokens((prev) =>
          prev.map((t) => {
            const sym = t.symbol.toUpperCase();
            const live = liveData[sym];
            if (!live) return t;

            const updatedHoldingsUsd = +(t.holdings * live.price).toFixed(2);
            return {
              ...t,
              price: live.price,
              change24h: live.change24h,
              high24h: live.high24h,
              low24h: live.low24h,
              vol24h: live.volume24h,
              holdingsUsd: updatedHoldingsUsd,
            };
          })
        );

        // 2. Build Real Crypto Movers from Live Market Tickers
        const liveKeys = Object.keys(liveData).filter((k) => k !== 'USDC' && k !== 'USDT');
        if (liveKeys.length > 0) {
          const sorted = liveKeys
            .map((k) => liveData[k])
            .sort((a, b) => b.change24h - a.change24h);

          // Top Gainers
          const gainers: PerpsMover[] = sorted.slice(0, 6).map((item) => {
            const meta = REAL_CRYPTO_METADATA[item.symbol];
            return {
              symbol: item.symbol,
              change: item.change24h,
              iconEmoji: meta?.symbolChar || '🪙',
              isGain: item.change24h >= 0,
            };
          });

          // Top Losers
          const losers: PerpsMover[] = [...sorted]
            .reverse()
            .slice(0, 6)
            .map((item) => {
              const meta = REAL_CRYPTO_METADATA[item.symbol];
              return {
                symbol: item.symbol,
                change: item.change24h,
                iconEmoji: meta?.symbolChar || '🪙',
                isGain: item.change24h >= 0,
              };
            });

          setPerpsGainers(gainers);
          setPerpsLosers(losers);

          // Real Movers Chips
          const newMovers: CryptoMover[] = sorted.slice(0, 12).map((m) => {
            const meta = REAL_CRYPTO_METADATA[m.symbol];
            return {
              symbol: m.symbol,
              name: m.name,
              price: m.price,
              change: m.change24h,
              iconEmoji: meta?.symbolChar || '🪙',
              iconBg: m.change24h >= 0 ? '#10B98122' : '#EF444422',
            };
          });

          setCryptoMovers(newMovers);
        }
      } catch (err) {
        console.error('Error fetching live crypto prices:', err);
      }
    }

    // Initial load
    loadLivePrices();

    // Poll live market feeds every 8 seconds
    const interval = setInterval(loadLivePrices, 8000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Dynamic Total Portfolio Value from Real Token Holdings
  const totalPortfolioValue = useMemo(() => {
    return tokens.reduce((sum, t) => sum + (t.holdingsUsd || 0), 0);
  }, [tokens]);

  const handleOpenOnramp = (tokenSymbol?: string) => {
    const found = tokens.find((t) => t.symbol === tokenSymbol);
    setOnrampTargetToken(found || tokens[0]);
    setIsOnrampOpen(true);
  };

  const handleCompletePurchase = (amountUsd: number, tokenSymbol: string) => {
    setMoneyBalance((prev) => +(prev + amountUsd).toFixed(2));
    setTokens((prev) =>
      prev.map((t) =>
        t.symbol === tokenSymbol
          ? {
              ...t,
              holdings: +(t.holdings + amountUsd / t.price).toFixed(4),
              holdingsUsd: +(t.holdingsUsd + amountUsd).toFixed(2),
            }
          : t
      )
    );
    showToast(`Purchased $${amountUsd.toLocaleString()} of ${tokenSymbol}`);
  };

  const handleExecuteTrade = (fromSym: string, toSym: string, amountUsd: number) => {
    const targetPrice = liveTickers[toSym]?.price || tokens.find((t) => t.symbol === toSym)?.price || 1;
    const tokensReceived = amountUsd / targetPrice;

    setTokens((prev) => {
      const exists = prev.some((t) => t.symbol === toSym);
      if (exists) {
        return prev.map((t) =>
          t.symbol === toSym
            ? {
                ...t,
                holdings: +(t.holdings + tokensReceived).toFixed(4),
                holdingsUsd: +((t.holdings + tokensReceived) * t.price).toFixed(2),
              }
            : t
        );
      } else {
        const meta = REAL_CRYPTO_METADATA[toSym];
        const newToken: TokenHolding = {
          id: toSym.toLowerCase(),
          name: meta ? meta.name : toSym,
          symbol: toSym,
          price: targetPrice,
          change24h: liveTickers[toSym]?.change24h || 2.5,
          holdings: +tokensReceived.toFixed(4),
          holdingsUsd: +amountUsd.toFixed(2),
          iconBg: meta?.iconBg || '#3B82F622',
          iconFg: meta?.iconFg || '#60A5FA',
          symbolChar: meta?.symbolChar || toSym.slice(0, 2),
          sparkline: [targetPrice * 0.98, targetPrice * 0.99, targetPrice],
          category: meta?.category || 'Layer 1',
          mcap: meta?.mcap || '1.0B',
          vol24h: '500M',
          high24h: +(targetPrice * 1.02).toFixed(2),
          low24h: +(targetPrice * 0.98).toFixed(2),
        };
        return [...prev, newToken];
      }
    });

    // Add to activity history
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      type: 'swap',
      title: `Swapped ${fromSym} for ${toSym}`,
      subtitle: `Instant DEX trade at $${targetPrice < 1 ? targetPrice.toFixed(4) : targetPrice.toLocaleString()}`,
      amount: `+${tokensReceived < 1 ? tokensReceived.toFixed(4) : tokensReceived.toFixed(2)} ${toSym}`,
      amountUsd: amountUsd,
      date: 'Just now',
      timestamp: Date.now(),
      isPositive: true,
      status: 'confirmed',
      hash: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
      fee: '$0.05',
      tokenSymbol: toSym,
    };
    setTransactions((prev) => [newTx, ...prev]);

    showToast(`Traded $${amountUsd} ${fromSym} for ${tokensReceived.toFixed(2)} ${toSym}`);
  };

  const handleConfirmSend = (symbol: string, amount: number, recipient: string) => {
    setTokens((prev) =>
      prev.map((t) =>
        t.symbol === symbol
          ? {
              ...t,
              holdings: Math.max(0, +(t.holdings - amount).toFixed(4)),
              holdingsUsd: Math.max(0, +((t.holdings - amount) * t.price).toFixed(2)),
            }
          : t
      )
    );
    showToast(`Sent ${amount} ${symbol} to ${recipient}`);
  };

  // Comprehensive Real Cryptocurrencies List for Explore & Trading
  const allExploreTokens = useMemo(() => {
    return REAL_CRYPTO_SYMBOLS.map((sym) => {
      const meta = REAL_CRYPTO_METADATA[sym];
      const live = liveTickers[sym];
      const existingHolding = tokens.find((t) => t.symbol === sym);
      const price = live?.price ?? meta?.defaultPrice ?? 1.0;
      const change24h = live?.change24h ?? meta?.defaultChange ?? 0.0;

      return {
        id: sym.toLowerCase(),
        name: meta ? meta.name : sym,
        symbol: sym,
        price,
        change24h,
        holdings: existingHolding?.holdings ?? 0,
        holdingsUsd: existingHolding?.holdingsUsd ?? 0,
        iconBg: meta?.iconBg ?? '#3B82F622',
        iconFg: meta?.iconFg ?? '#60A5FA',
        symbolChar: meta?.symbolChar ?? sym.slice(0, 2),
        category: meta?.category ?? 'Layer 1',
        mcap: meta?.mcap ?? '1.0B',
        vol24h: live?.volume24h ?? '500M',
        high24h: live?.high24h ?? +(price * 1.02).toFixed(2),
        low24h: live?.low24h ?? +(price * 0.98).toFixed(2),
      };
    });
  }, [liveTickers, tokens]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedSort !== 'gainers') count++;
    if (changeFilter !== 'all') count++;
    if (capTier !== 'all') count++;
    if (exploreCategory !== 'Now' && exploreCategory !== 'All') count++;
    return Math.max(1, count); // default to 1 active filter as shown in screenshot
  }, [selectedSort, changeFilter, capTier, exploreCategory]);

  // Filtered tokens for search, category, sort, and modal filters in Explore
  const filteredExploreTokens = useMemo(() => {
    let list = [...allExploreTokens];

    // 1. Search Query Filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      return list.filter(
        (t) => t.name.toLowerCase().includes(query) || t.symbol.toLowerCase().includes(query)
      );
    }

    // 2. Category Tab Filter
    if (exploreCategory === 'Crypto') {
      list = list.filter((t) => t.category === 'Layer 1' || t.category === 'Layer 2');
    } else if (exploreCategory === 'Macro') {
      list = list.filter(
        (t) => t.category === 'Macro' || ['BTC', 'ETH', 'USDC', 'USDT', 'PAXG'].includes(t.symbol)
      );
    } else if (exploreCategory === 'RWAs') {
      list = list.filter(
        (t) => t.category === 'RWAs' || ['ONDO', 'HUMA', 'PAXG', 'USDC', 'USDT'].includes(t.symbol)
      );
    } else if (exploreCategory === 'Sports') {
      list = list.filter(
        (t) => t.category === 'Sports' || ['CHZ', 'BAR', 'CITY', 'PSG'].includes(t.symbol)
      );
    } else if (exploreCategory === 'Sites') {
      list = list.filter(
        (t) =>
          t.category === 'Sites' ||
          ['LINK', 'RENDER', 'FIL', 'AR', 'UNI', 'AAVE', 'ORB', 'XDP', 'SPCXB'].includes(t.symbol)
      );
    }

    // 3. Performance Filter (from Filter Modal)
    if (changeFilter === 'pos') {
      list = list.filter((t) => t.change24h > 0);
    } else if (changeFilter === '5') {
      list = list.filter((t) => t.change24h >= 5);
    } else if (changeFilter === '10') {
      list = list.filter((t) => t.change24h >= 10);
    } else if (changeFilter === 'dip') {
      list = list.filter((t) => t.change24h < 0);
    }

    // 4. Market Cap Tier Filter
    if (capTier === 'mega') {
      list = list.filter(
        (t) => t.mcap.includes('T') || (t.mcap.includes('B') && parseFloat(t.mcap) >= 20)
      );
    } else if (capTier === 'mid') {
      list = list.filter(
        (t) => t.mcap.includes('B') && parseFloat(t.mcap) < 20 && parseFloat(t.mcap) >= 1
      );
    } else if (capTier === 'small') {
      list = list.filter((t) => t.mcap.includes('M'));
    }

    // 5. Sort Option
    if (selectedSort === 'gainers') {
      list.sort((a, b) => b.change24h - a.change24h);
    } else if (selectedSort === 'volume') {
      list.sort((a, b) => parseFloat(b.vol24h) - parseFloat(a.vol24h));
    } else if (selectedSort === 'mcap') {
      list.sort((a, b) => {
        const getMcapVal = (m: string) =>
          m.includes('T') ? parseFloat(m) * 1000 : m.includes('B') ? parseFloat(m) : parseFloat(m) / 1000;
        return getMcapVal(b.mcap) - getMcapVal(a.mcap);
      });
    }

    return list;
  }, [allExploreTokens, searchQuery, exploreCategory, changeFilter, capTier, selectedSort]);

  // Dynamic Crypto Movers reacting to the selected category tab
  const displayedCryptoMovers = useMemo(() => {
    if (exploreCategory === 'Sports') {
      return [
        { symbol: 'BAR', name: 'FC Barcelona', change: 6.12, isGain: true },
        { symbol: 'PSG', name: 'Paris Saint-Germain', change: 5.4, isGain: true },
        { symbol: 'CHZ', name: 'Chiliz Sports', change: 4.82, isGain: true },
        { symbol: 'CITY', name: 'Manchester City', change: 3.25, isGain: true },
      ];
    }
    if (exploreCategory === 'RWAs') {
      return [
        { symbol: 'ONDO', name: 'Ondo Finance', change: 3.45, isGain: true },
        { symbol: 'HUMA', name: 'Huma Finance', change: 2.82, isGain: true },
        { symbol: 'PAXG', name: 'PAX Gold', change: 0.42, isGain: true },
        { symbol: 'USDC', name: 'USD Coin', change: 0.01, isGain: true },
        { symbol: 'USDT', name: 'Tether', change: 0.01, isGain: true },
      ];
    }
    if (exploreCategory === 'Sites') {
      return [
        { symbol: 'RENDER', name: 'Render Network', change: 4.25, isGain: true },
        { symbol: 'AR', name: 'Arweave', change: 4.1, isGain: true },
        { symbol: 'AAVE', name: 'Aave Protocol', change: 3.18, isGain: true },
        { symbol: 'FIL', name: 'Filecoin', change: 2.15, isGain: true },
        { symbol: 'XDP', name: 'X-Data Protocol', change: 1.98, isGain: true },
        { symbol: 'SPCXB', name: 'Space X Bull', change: 1.05, isGain: true },
        { symbol: 'ORB', name: 'Orbiter Finance', change: 0.94, isGain: true },
      ];
    }
    if (exploreCategory === 'Macro') {
      return [
        { symbol: 'BTC', name: 'Bitcoin', change: 3.12, isGain: true },
        { symbol: 'ETH', name: 'Ethereum', change: 1.84, isGain: true },
        { symbol: 'PAXG', name: 'PAX Gold', change: 0.42, isGain: true },
        { symbol: 'USDT', name: 'Tether', change: 0.01, isGain: true },
        { symbol: 'USDC', name: 'USD Coin', change: 0.01, isGain: true },
      ];
    }
    if (exploreCategory === 'Crypto') {
      return [
        { symbol: 'SUI', name: 'Sui Network', change: 8.42, isGain: true },
        { symbol: 'SOL', name: 'Solana', change: 5.12, isGain: true },
        { symbol: 'XRP', name: 'XRP', change: 4.28, isGain: true },
        { symbol: 'BTC', name: 'Bitcoin', change: 3.12, isGain: true },
        { symbol: 'AVAX', name: 'Avalanche', change: 3.42, isGain: true },
        { symbol: 'ETH', name: 'Ethereum', change: 1.84, isGain: true },
        { symbol: 'VRAX', name: 'Vrax Protocol', change: 16.36, isGain: true },
      ];
    }

    // Default 'Now' category shows the exact movers from screenshot
    return [
      { symbol: 'VRAX', name: 'Vrax Protocol', change: 16.36, isGain: true },
      { symbol: 'E/ACC', name: 'Effective Acceleration', change: 7.51, isGain: true },
      { symbol: 'REVEN', name: 'Revenge Token', change: 4.12, isGain: true },
      { symbol: 'HUMA', name: 'Huma Finance', change: 2.82, isGain: true },
      { symbol: 'CT', name: 'Crypto Twitter', change: 2.22, isGain: true },
      { symbol: 'XDP', name: 'X-Data Protocol', change: 1.98, isGain: true },
      { symbol: 'TRUMP', name: 'Official Trump', change: 1.55, isGain: true },
      { symbol: 'SPCXB', name: 'Space X Bull', change: 1.05, isGain: true },
      { symbol: 'ORB', name: 'Orbiter Finance', change: 0.94, isGain: true },
      { symbol: 'SUI', name: 'Sui Network', change: 8.42, isGain: true },
      { symbol: 'SOL', name: 'Solana', change: 5.12, isGain: true },
      { symbol: 'PEPE', name: 'Pepe', change: 6.85, isGain: true },
      { symbol: 'BTC', name: 'Bitcoin', change: 3.12, isGain: true },
      { symbol: 'ETH', name: 'Ethereum', change: 1.84, isGain: true },
      { symbol: 'DOGE', name: 'Dogecoin', change: 3.82, isGain: true },
    ];
  }, [exploreCategory]);

  return (
    <div className="min-h-screen bg-[#000000] text-[#EDEEF0] flex flex-col justify-between selection:bg-blue-500/20 selection:text-blue-300 font-sans">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[70] px-4 py-2 rounded-full bg-[#181B22]/95 border border-white/15 text-xs font-bold text-white shadow-2xl animate-in slide-in-from-top-3 duration-200 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Main Responsive Mobile Frame */}
      <div className="w-full max-w-[480px] mx-auto min-h-screen flex flex-col pb-24 relative bg-[#0D0E11]">
        {/* ========================================================= */}
        {/* SCREEN 1: HOME (Exact Dual-Tone Slide UI from Reference)    */}
        {/* ========================================================= */}
        {tab === 'home' && (
          <div className="flex flex-col animate-in fade-in duration-150">
            {/* 1. TOP DARK VAULT CARD (Matte Obsidian) */}
            <div className="bg-[#18191D] rounded-b-[40px] px-6 pt-5 pb-7 relative shadow-2xl text-center border-b border-white/[0.04]">
              {/* Top Header Row: Abstract Portrait Avatar (left) & Notification Bell (right) */}
              <div className="flex items-center justify-between pb-3">
                {/* Artistic Abstract Avatar Button */}
                <button
                  onClick={() => {
                    playTap();
                    setIsSettingsScreenOpen(true);
                  }}
                  className="w-10 h-10 rounded-full overflow-hidden border border-white/10 hover:border-white/20 transition-all active:scale-95 bg-white/5 flex items-center justify-center shadow-md cursor-pointer"
                  title="Profile & Settings"
                >
                  <svg viewBox="0 0 36 36" className="w-full h-full">
                    <rect width="36" height="36" fill="#FCE7D2" />
                    <path d="M0 0h18v18H0z" fill="#93C5FD" opacity="0.85" />
                    <path d="M18 18h18v18H18z" fill="#F87171" opacity="0.85" />
                    <circle cx="18" cy="18" r="9" fill="#FDBA74" />
                    <path d="M13 14c2-2 7-2 9 0" stroke="#1E293B" strokeWidth="1.8" strokeLinecap="round" fill="none" />
                    <circle cx="14" cy="17" r="1.5" fill="#1E293B" />
                    <circle cx="22" cy="17" r="1.5" fill="#1E293B" />
                    <path d="M18 17v4m-2 2c2 1.5 4 1.5 4 0" stroke="#1E293B" strokeWidth="1.6" strokeLinecap="round" fill="none" />
                  </svg>
                </button>

                {/* Notification Bell Button */}
                <button
                  onClick={() => {
                    playTap();
                    showToast('Notifications: 2 real market updates');
                  }}
                  className="w-10 h-10 rounded-full bg-[#24252A] hover:bg-[#2F3036] border border-white/5 flex items-center justify-center text-white/80 hover:text-white transition-all active:scale-95 shadow-md cursor-pointer"
                  title="Notifications"
                >
                  <Bell className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Wallet Selector Dropdown: "Wallet 1 ⌵" */}
              <div className="relative inline-block mt-1">
                <button
                  onClick={() => {
                    playTap();
                    setShowAccountDropdown(!showAccountDropdown);
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/70 hover:text-white transition-colors cursor-pointer"
                >
                  <span>{activeAccount.name.replace('Account 1', 'Wallet 1')}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-white/50" />
                </button>

                {showAccountDropdown && (
                  <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-52 bg-[#1A1C22] border border-white/10 rounded-2xl p-1.5 shadow-2xl z-40 space-y-1">
                    {INITIAL_WALLETS.map((acc) => (
                      <button
                        key={acc.id}
                        onClick={() => {
                          playTap();
                          setActiveAccount(acc);
                          setShowAccountDropdown(false);
                          showToast(`Switched to ${acc.name}`);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                          activeAccount.id === acc.id ? 'bg-white/15 text-white' : 'text-white/60 hover:text-white'
                        }`}
                      >
                        <div>{acc.name.replace('Account 1', 'Wallet 1')}</div>
                        <div className="text-[10px] text-white/40 font-mono-num">{acc.address}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Large Bold Balance: "$63,000" */}
              <div className="font-mono-num text-5xl font-black text-white tracking-tight mt-2">
                ${(totalPortfolioValue || 63000).toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </div>

              {/* Secondary Crypto Balance Subtitle: "210.43 XMR ↺" */}
              <div className="flex justify-center mt-1.5">
                <button
                  onClick={() => {
                    playTap();
                    showToast('Real-time rate refreshed');
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-white/60 hover:text-white/90 transition-colors cursor-pointer"
                >
                  <span>210.43 XMR</span>
                  <RotateCcw className="w-3.5 h-3.5 text-white/40 hover:rotate-180 transition-transform duration-300" />
                </button>
              </div>

              {/* Action Buttons: ↙ Recieve, (+) Center Circle, ↗ Send */}
              <div className="flex items-center justify-center gap-3 mt-6">
                {/* Receive Pill Button */}
                <button
                  onClick={() => {
                    playTap();
                    setIsReceiveOpen(true);
                  }}
                  className="px-5 py-2.5 rounded-full bg-[#232429] hover:bg-[#2C2E35] border border-white/5 text-xs font-bold text-white flex items-center gap-1.5 transition-all active:scale-95 shadow-md cursor-pointer"
                >
                  <ArrowDownLeft className="w-3.5 h-3.5 text-white/80" />
                  <span>Recieve</span>
                </button>

                {/* Prominent Embossed (+) Center Button */}
                <button
                  onClick={() => {
                    playTap();
                    handleOpenOnramp('BTC');
                  }}
                  className="w-13 h-13 rounded-full bg-[#24252B] hover:bg-[#31333A] border border-white/10 text-white font-bold text-2xl flex items-center justify-center transition-all active:scale-90 shadow-xl cursor-pointer"
                  title="Buy / Add Funds"
                >
                  <span className="leading-none mb-0.5">+</span>
                </button>

                {/* Send Pill Button */}
                <button
                  onClick={() => {
                    playTap();
                    setIsSendOpen(true);
                  }}
                  className="px-5 py-2.5 rounded-full bg-[#232429] hover:bg-[#2C2E35] border border-white/5 text-xs font-bold text-white flex items-center gap-1.5 transition-all active:scale-95 shadow-md cursor-pointer"
                >
                  <ArrowUpRight className="w-3.5 h-3.5 text-white/80" />
                  <span>Send</span>
                </button>
              </div>

              {/* Synchronized Status Pill: "• Synchronized" */}
              <div className="mt-6 flex justify-center">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#222328] border border-white/5 text-[11px] font-semibold text-white/75 shadow-inner">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Synchronized</span>
                </div>
              </div>
            </div>

            {/* 2. BOTTOM PORTFOLIO SLIDE SECTION (Crisp Light Background from Reference) */}
            <div className="bg-[#FFFFFF] text-[#111317] rounded-t-[36px] -mt-3 pt-6 px-5 pb-28 min-h-[calc(100vh-260px)] shadow-2xl relative z-10 space-y-3.5 flex-1">
              {/* Header: Portfolio & View all ⌵ */}
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-[#111317] tracking-tight">Portfolio</h2>
                <button
                  onClick={() => {
                    playTap();
                    setTab('explore');
                  }}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#555A64] hover:text-[#111317] transition-colors cursor-pointer"
                >
                  <span>View all</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Top Market Cap Coins List with 30% Slide Gesture for Sparkline Widget */}
              <div className="space-y-2.5">
                {[
                  {
                    name: 'Bitcoin',
                    symbol: 'BTC',
                    amount: 0.153,
                    price: tokens.find((t) => t.symbol === 'BTC')?.price || 86540,
                    change24h: tokens.find((t) => t.symbol === 'BTC')?.change24h || 3.12,
                    sparkline: [83800, 84200, 83900, 85400, 86100, 86540],
                  },
                  {
                    name: 'Ethereum',
                    symbol: 'ETH',
                    amount: 1.278,
                    price: tokens.find((t) => t.symbol === 'ETH')?.price || 2695.5,
                    change24h: tokens.find((t) => t.symbol === 'ETH')?.change24h || 1.84,
                    sparkline: [2610, 2640, 2620, 2680, 2670, 2695.5],
                  },
                  {
                    name: 'Tether',
                    symbol: 'USDT',
                    amount: 1908.0,
                    price: 1.0,
                    change24h: 0.01,
                    sparkline: [1.0, 0.999, 1.001, 1.0, 1.0, 1.0],
                  },
                  {
                    name: 'BNB',
                    symbol: 'BNB',
                    amount: 4.5,
                    price: tokens.find((t) => t.symbol === 'BNB')?.price || 580.4,
                    change24h: tokens.find((t) => t.symbol === 'BNB')?.change24h || 2.45,
                    sparkline: [565, 570, 568, 576, 578, 580.4],
                  },
                  {
                    name: 'Solana',
                    symbol: 'SOL',
                    amount: 42.5,
                    price: tokens.find((t) => t.symbol === 'SOL')?.price || 154.2,
                    change24h: tokens.find((t) => t.symbol === 'SOL')?.change24h || 5.12,
                    sparkline: [144, 147, 149, 151, 153, 154.2],
                  },
                  {
                    name: 'XRP',
                    symbol: 'XRP',
                    amount: 1200.0,
                    price: tokens.find((t) => t.symbol === 'XRP')?.price || 2.18,
                    change24h: tokens.find((t) => t.symbol === 'XRP')?.change24h || 4.28,
                    sparkline: [2.05, 2.08, 2.12, 2.15, 2.16, 2.18],
                  },
                  {
                    name: 'Dogecoin',
                    symbol: 'DOGE',
                    amount: 8500.0,
                    price: tokens.find((t) => t.symbol === 'DOGE')?.price || 0.205,
                    change24h: tokens.find((t) => t.symbol === 'DOGE')?.change24h || -1.45,
                    sparkline: [0.215, 0.212, 0.209, 0.207, 0.206, 0.205],
                  },
                  {
                    name: 'Sui Network',
                    symbol: 'SUI',
                    amount: 650.0,
                    price: tokens.find((t) => t.symbol === 'SUI')?.price || 2.84,
                    change24h: tokens.find((t) => t.symbol === 'SUI')?.change24h || 8.42,
                    sparkline: [2.55, 2.62, 2.68, 2.74, 2.79, 2.84],
                  },
                ].map((coin) => (
                  <SwipeablePortfolioCard
                    key={coin.symbol}
                    name={coin.name}
                    symbol={coin.symbol}
                    amount={coin.amount}
                    price={coin.price}
                    change24h={coin.change24h}
                    sparkline={coin.sparkline}
                    onTrade={() => {
                      setSelectedTradeAsset({
                        symbol: coin.symbol,
                        name: coin.name,
                        price: coin.price,
                        change: coin.change24h,
                        iconEmoji: coin.symbol.slice(0, 2),
                        iconBg: '#3B82F622',
                      });
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SCREEN 2: EXPLORE (Matching Screenshot with #1A1C20 & Black) */}
        {/* ========================================================= */}
        {tab === 'explore' && (
          <div className="space-y-4 px-4 pt-2 pb-28 animate-in fade-in duration-150 bg-black min-h-screen">
            {/* Title: Explore */}
            <h1 className="text-3xl font-black text-white tracking-tight pt-1">Explore</h1>

            {/* Search Bar & Filter "1" Badge Row in #1A1C20 */}
            <div className="flex items-center gap-2.5">
              <div className="flex-1 bg-[#1A1C20] border border-white/[0.06] rounded-2xl flex items-center px-4 py-3 gap-3 focus-within:border-white/20 transition-all shadow-xs">
                <Search className="w-5 h-5 text-neutral-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-sm text-white placeholder-neutral-400 outline-none w-full font-medium"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-xs text-white/50 hover:text-white"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Number filter badge button from screenshot */}
              <button
                onClick={() => {
                  playTap();
                  setIsFilterModalOpen(true);
                }}
                className="w-12 h-12 rounded-2xl bg-[#1A1C20] border border-white/[0.06] hover:border-white/20 flex items-center justify-center text-white font-black text-sm shadow-sm shrink-0 active:scale-95 transition-all cursor-pointer"
                title="Active filters"
              >
                {activeFilterCount}
              </button>
            </div>

            {/* Horizontal Categories Tabs (Now, Macro, RWAs, Crypto, Sports, Sites) with Underline */}
            <div className="flex items-center gap-6 overflow-x-auto pb-1 no-scrollbar border-b border-white/[0.08] pt-1">
              {['Now', 'Macro', 'RWAs', 'Crypto', 'Sports', 'Sites'].map((cat) => {
                const isActive = exploreCategory === cat || (cat === 'Now' && exploreCategory === 'All');
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      playTap();
                      setExploreCategory(cat);
                    }}
                    className={`pb-2.5 text-sm whitespace-nowrap transition-all relative cursor-pointer ${
                      isActive
                        ? 'text-white font-black after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2.5px] after:bg-white after:rounded-full'
                        : 'text-neutral-400 hover:text-white font-medium'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Section 1: Crypto movers > */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-base font-extrabold text-white">
                  <span>Crypto movers</span>
                  <ChevronRight className="w-4 h-4 text-white/50" />
                </div>
                <span className="text-[11px] text-white/40">
                  {exploreCategory === 'Now' ? 'Trending' : exploreCategory}
                </span>
              </div>

              {/* Chips in #1A1C20 matching screenshot & filtered dynamically by category */}
              <div className="flex flex-wrap gap-2">
                {displayedCryptoMovers.map((mover) => {
                  const live = liveTickers[mover.symbol.toUpperCase()];
                  const livePrice =
                    live?.price || (mover.symbol === 'BTC' ? 86540 : mover.symbol === 'ETH' ? 2695 : 2.5);

                  return (
                    <button
                      key={mover.symbol}
                      onClick={() => {
                        playTap();
                        setSelectedTradeAsset({
                          symbol: mover.symbol,
                          name: mover.name || mover.symbol,
                          price: livePrice,
                          change: mover.change,
                          iconEmoji: mover.symbol.slice(0, 2),
                          iconBg: '#1A1C20',
                        });
                      }}
                      className="bg-[#1A1C20] border border-white/[0.06] hover:border-white/20 rounded-full px-3 py-1.5 flex items-center gap-2 text-xs font-bold text-white transition-all active:scale-95 shadow-xs cursor-pointer group"
                    >
                      <CryptoIcon symbol={mover.symbol} size={22} />
                      <span className="text-white font-bold">{mover.symbol}</span>
                      <span className="text-[#4ADE80] font-mono-num font-extrabold">
                        +{mover.change}%
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Divider Line */}
            <div className="h-px bg-white/[0.08] my-1" />

            {/* Section 2: Perps movers > */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-base font-extrabold text-white">
                  <span>Perps movers</span>
                  <ChevronRight className="w-4 h-4 text-white/50" />
                </div>
              </div>

              {/* Segmented Toggle: Gainers / Losers */}
              <div className="flex p-1 bg-[#1A1C20] rounded-2xl border border-white/[0.06] w-full">
                <button
                  onClick={() => {
                    playTap();
                    setPerpsTab('gainers');
                  }}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    perpsTab === 'gainers'
                      ? 'bg-[#282B32] text-white shadow-xs'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Gainers
                </button>
                <button
                  onClick={() => {
                    playTap();
                    setPerpsTab('losers');
                  }}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    perpsTab === 'losers'
                      ? 'bg-[#282B32] text-white shadow-xs'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Losers
                </button>
              </div>

              {/* Perps Movers Chips in #1A1C20 */}
              <div className="flex flex-wrap gap-2">
                {(perpsTab === 'gainers'
                  ? [
                      { symbol: 'BIRD', change: 34.39 },
                      { symbol: 'MEGA', change: 19.44 },
                      { symbol: 'RESC', change: 12.30 },
                      { symbol: 'PURR', change: 7.72 },
                      { symbol: 'ZK', change: 7.62 },
                      { symbol: 'WIF', change: 7.05 },
                      { symbol: 'SOL', change: 5.12 },
                      { symbol: 'SUI', change: 8.42 },
                      { symbol: 'BTC', change: 3.12 },
                    ]
                  : [
                      { symbol: 'ARB', change: -3.45 },
                      { symbol: 'OP', change: -2.92 },
                      { symbol: 'AVAX', change: -1.85 },
                      { symbol: 'DOT', change: -1.25 },
                      { symbol: 'ADA', change: -0.95 },
                      { symbol: 'NEAR', change: -0.65 },
                    ]
                ).map((pm) => {
                  const isGain = pm.change >= 0;
                  const live = liveTickers[pm.symbol.toUpperCase()];
                  const livePrice = live?.price || 18.5;

                  return (
                    <button
                      key={pm.symbol}
                      onClick={() => {
                        playTap();
                        setSelectedTradeAsset({
                          symbol: pm.symbol + '-PERP',
                          name: pm.symbol + ' Perpetual',
                          price: livePrice,
                          change: pm.change,
                          iconEmoji: '⚡',
                          iconBg: '#1A1C20',
                        });
                      }}
                      className="bg-[#1A1C20] border border-white/[0.06] hover:border-white/20 rounded-full px-3 py-1.5 flex items-center gap-2 text-xs font-bold text-white transition-all active:scale-95 shadow-xs cursor-pointer"
                    >
                      <CryptoIcon symbol={pm.symbol} size={18} />
                      <span className="text-white font-bold">{pm.symbol}</span>
                      <span
                        className={`font-mono-num font-extrabold ${
                          isGain ? 'text-[#4ADE80]' : 'text-[#F87171]'
                        }`}
                      >
                        {isGain ? '+' : ''}
                        {pm.change}%
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Divider Line */}
            <div className="h-px bg-white/[0.08] my-1" />

            {/* Section 3: What's happening > (AI Generated News Carousel) */}
            <div className="space-y-3 pt-1">
              <div>
                <div className="flex items-center gap-1.5 text-base font-extrabold text-white">
                  <span>What's happening</span>
                  <ChevronRight className="w-4 h-4 text-white/50" />
                </div>
                <div className="flex items-center gap-1 text-xs text-neutral-400 mt-0.5">
                  <Sparkles className="w-3 h-3 text-neutral-400" />
                  <span>AI generated</span>
                  <Info className="w-3 h-3 text-neutral-500" />
                </div>
              </div>

              {/* Horizontal Carousel in #1A1C20 */}
              <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar pt-1">
                {/* News Card 1 */}
                <div className="bg-[#1A1C20] border border-white/[0.06] rounded-2xl p-4 min-w-[280px] max-w-[310px] shrink-0 space-y-2.5 shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#11291D] text-[#4ADE80] border border-[#4ADE80]/30 text-[10px] font-bold">
                      Bullish
                    </span>
                    <span className="text-[11px] text-neutral-400">4h ago</span>
                  </div>
                  <h4 className="text-sm font-bold text-white line-clamp-2 leading-snug">
                    SEC Approves Direct Settlement Framework for Institutional Desks
                  </h4>
                  <p className="text-xs text-neutral-400 line-clamp-2">
                    Spot DEX volumes and clearing protocols surge beyond $120B as institutional trading ramps up.
                  </p>
                </div>

                {/* News Card 2 */}
                <div className="bg-[#1A1C20] border border-white/[0.06] rounded-2xl p-4 min-w-[280px] max-w-[310px] shrink-0 space-y-2.5 shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#11291D] text-[#4ADE80] border border-[#4ADE80]/30 text-[10px] font-bold">
                      Bullish
                    </span>
                    <span className="text-[11px] text-neutral-400">6h ago</span>
                  </div>
                  <h4 className="text-sm font-bold text-white line-clamp-2 leading-snug">
                    Solana DeFi Ecosystem Records Highest Single-Day Volume
                  </h4>
                  <p className="text-xs text-neutral-400 line-clamp-2">
                    Raydium, Jupiter, and Marinade post unprecedented on-chain transactions exceeding all previous cycles.
                  </p>
                </div>

                {/* News Card 3 */}
                <div className="bg-[#1A1C20] border border-white/[0.06] rounded-2xl p-4 min-w-[280px] max-w-[310px] shrink-0 space-y-2.5 shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#11291D] text-[#4ADE80] border border-[#4ADE80]/30 text-[10px] font-bold">
                      Bullish
                    </span>
                    <span className="text-[11px] text-neutral-400">8h ago</span>
                  </div>
                  <h4 className="text-sm font-bold text-white line-clamp-2 leading-snug">
                    Sui Network Total Value Locked Breaks $1.5B Threshold
                  </h4>
                  <p className="text-xs text-neutral-400 line-clamp-2">
                    Native stablecoin deployments and cross-chain liquidity drive explosive Layer-1 network adoption.
                  </p>
                </div>
              </div>
            </div>

            {/* Divider Line */}
            <div className="h-px bg-white/[0.08] my-1" />

            {/* Real Crypto Market Assets List in #1A1C20 (Tap any to trade) */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-base font-extrabold text-white">
                  <span>Real Crypto Markets</span>
                  <span className="text-[11px] text-neutral-400">({filteredExploreTokens.length} assets)</span>
                </div>
                <span className="text-xs text-[#4ADE80] font-bold">1-Tap Trade</span>
              </div>

              <div className="bg-[#1A1C20] border border-white/[0.06] rounded-2xl divide-y divide-white/5 overflow-hidden">
                {filteredExploreTokens.map((coin) => {
                  const isUp = coin.change24h >= 0;
                  return (
                    <div
                      key={coin.id}
                      onClick={() => {
                        playTap();
                        setSelectedTradeAsset({
                          symbol: coin.symbol,
                          name: coin.name,
                          price: coin.price,
                          change: coin.change24h,
                          iconEmoji: coin.symbolChar,
                          iconBg: coin.iconBg,
                        });
                      }}
                      className="p-3.5 flex items-center justify-between hover:bg-white/[0.04] cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <CryptoIcon symbol={coin.symbol} size={40} />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-white">{coin.name}</span>
                            <span className="text-xs font-mono font-bold text-white/50">{coin.symbol}</span>
                          </div>
                          <div className="text-xs text-neutral-400 font-mono-num flex items-center gap-1.5 mt-0.5">
                            <span className="px-1.5 py-0.2 rounded bg-white/5 text-[10px] text-white/60">
                              {coin.category}
                            </span>
                            <span>•</span>
                            <span>Cap ${coin.mcap}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="font-mono-num font-bold text-sm text-white">
                            ${coin.price < 1 ? coin.price.toFixed(6) : coin.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </div>
                          <div className={`text-xs font-mono-num font-semibold ${isUp ? 'text-[#4ADE80]' : 'text-[#F87171]'}`}>
                            {isUp ? '+' : ''}{coin.change24h}%
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            playTap();
                            setSelectedTradeAsset({
                              symbol: coin.symbol,
                              name: coin.name,
                              price: coin.price,
                              change: coin.change24h,
                              iconEmoji: coin.symbolChar,
                              iconBg: coin.iconBg,
                            });
                          }}
                          className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-all active:scale-95"
                        >
                          Trade
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SCREEN 3: MONEY (Balance, 5.3% APY, Add/Send/Card, Banner) */}
        {/* ========================================================= */}
        {tab === 'money' && (
          <div className="space-y-6 px-4 pt-1 animate-in fade-in duration-150">
            {/* Header: Money & three dots */}
            <div className="flex items-center justify-between py-1">
              <h1 className="text-xl font-black text-white">Money</h1>
              <button
                onClick={() => {
                  playTap();
                  setIsSettingsScreenOpen(true);
                }}
                className="p-1.5 text-white/60 hover:text-white"
              >
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>

            {/* Balance & APY */}
            <div>
              <div className="font-mono-num text-5xl font-black text-white tracking-tight">
                ${moneyBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
              <div className="flex items-center gap-1.5 mt-1.5 text-xs text-white/70">
                <span className="text-emerald-400 font-bold">5.3% APY</span>
                <span>•</span>
                <span>USDC</span>
                <Info className="w-3.5 h-3.5 text-white/40" />
              </div>
            </div>

            {/* 3 Square Action Buttons: + Add, ↗ Send, 💳 Card */}
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => {
                  playTap();
                  handleOpenOnramp('USDC');
                }}
                className="py-4 rounded-2xl bg-[#14161C] border border-white/[0.08] hover:border-white/20 flex flex-col items-center justify-center gap-1.5 text-white transition-all active:scale-95 group"
              >
                <span className="text-lg font-bold">+</span>
                <span className="text-xs font-bold">Add</span>
              </button>

              <button
                onClick={() => {
                  playTap();
                  setIsSendOpen(true);
                }}
                className="py-4 rounded-2xl bg-[#14161C] border border-white/[0.08] hover:border-white/20 flex flex-col items-center justify-center gap-1.5 text-white transition-all active:scale-95 group"
              >
                <ArrowUpRight className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold">Send</span>
              </button>

              {/* Card button -> Opens the "SPEND AND EARN" flow! */}
              <button
                onClick={() => {
                  playTap();
                  setIsCardPromoOpen(true);
                }}
                className="py-4 rounded-2xl bg-[#14161C] border border-white/[0.08] hover:border-white/20 flex flex-col items-center justify-center gap-1.5 text-white transition-all active:scale-95 group"
              >
                <CreditCard className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold">Card</span>
              </button>
            </div>

            {/* Hero Banner Card: Earn up to 5.3% APY */}
            <div className="rounded-3xl bg-[#14161C] border border-white/[0.08] overflow-hidden shadow-2xl">
              <div className="relative w-full aspect-[16/9] bg-[#0E1014] overflow-hidden">
                <img
                  src={moneyVaultCardImg}
                  alt="Vault Card & Bills"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="p-5 space-y-3">
                <h3 className="text-lg font-black text-white">Earn up to 5.3% APY</h3>
                <p className="text-xs text-white/60 leading-relaxed">
                  Fund your Money account and watch your balance grow with up to 5.3% APY (variable).
                </p>

                <button
                  onClick={() => {
                    playTap();
                    handleOpenOnramp('USDC');
                  }}
                  className="w-full py-3.5 rounded-full bg-white hover:bg-neutral-200 text-black font-bold text-xs tracking-wide transition-all shadow-md active:scale-98"
                >
                  Add funds
                </button>
              </div>
            </div>

            {/* Section: How it works > */}
            <div className="space-y-2 pt-1">
              <button
                onClick={() => showToast('Dollar-backed yield details')}
                className="flex items-center gap-1 text-sm font-extrabold text-white hover:text-white/80 transition-colors"
              >
                <span>How it works</span>
                <ChevronRight className="w-4 h-4 text-white/40" />
              </button>

              <p className="text-xs text-white/50 leading-relaxed">
                Add USDC and earn up to <span className="text-emerald-400 font-semibold">5.3% APY</span> (variable).
                Your balance is dollar-backed and ready to spend, trade, or send anytime.
              </p>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SCREEN 4: REWARDS (Campaigns, Earn rewards, Benefits) */}
        {/* ========================================================= */}
        {tab === 'rewards' && (
          <div className="space-y-6 px-4 pt-1 animate-in fade-in duration-150">
            {/* Header: Rewards & User/Settings icons */}
            <div className="flex items-center justify-between py-1">
              <h1 className="text-xl font-black text-white">Rewards</h1>
              <div className="flex items-center gap-2 text-white/70">
                <button
                  onClick={() => {
                    playTap();
                    showToast('Refer a friend: Share referral link');
                  }}
                  className="p-1.5 hover:text-white"
                  title="Referral"
                >
                  <UserPlus className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    playTap();
                    setIsSettingsScreenOpen(true);
                  }}
                  className="p-1.5 hover:text-white"
                  title="Settings"
                >
                  <SettingsIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Section: Campaigns > (Money Sweepstakes Card) */}
            <div className="space-y-3">
              <div className="flex items-center gap-1 text-sm font-extrabold text-white">
                <span>Campaigns</span>
                <ChevronRight className="w-4 h-4 text-white/40" />
              </div>

              {/* Sweepstakes Hero Card */}
              <div
                onClick={() => {
                  playSuccess();
                  showToast('You are entered into the $100 Sweepstakes!');
                }}
                className="rounded-3xl bg-[#14161C] border border-white/[0.08] overflow-hidden cursor-pointer hover:border-white/20 transition-all shadow-xl group"
              >
                <div className="relative w-full aspect-[16/9] bg-[#0E1014] overflow-hidden">
                  <img
                    src={rewardsSweepstakesImg}
                    alt="Money Sweepstakes"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-emerald-500/90 text-black text-[10px] font-black uppercase tracking-wider">
                    Live
                  </div>
                </div>

                <div className="p-4 space-y-1">
                  <h3 className="font-extrabold text-base text-white">Money Sweepstakes</h3>
                  <div className="flex items-center justify-between text-xs text-white/50">
                    <span>Make 2 trades this week to enter</span>
                    <span className="font-bold text-emerald-400">4 entries active</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section: Earn rewards */}
            <div className="space-y-3 pt-1">
              <div className="text-sm font-extrabold text-white">Earn rewards</div>

              <div
                onClick={() => {
                  playTap();
                  setTab('money');
                }}
                className="p-4 rounded-2xl bg-[#14161C] border border-white/[0.08] hover:border-white/20 flex items-center justify-between cursor-pointer transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-extrabold text-sm">
                    $
                  </div>
                  <div>
                    <div className="font-bold text-sm text-white">Earn up to 5.3% APY*</div>
                    <div className="text-xs text-white/50">Money accounts are here</div>
                  </div>
                </div>

                <ChevronRight className="w-5 h-5 text-white/40" />
              </div>
            </div>

            {/* Section: Benefits > (3 available) */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-sm font-extrabold text-white">
                  <span>Benefits</span>
                  <ChevronRight className="w-4 h-4 text-white/40" />
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/10 text-white/70 font-semibold">
                  3 available
                </span>
              </div>

              {/* Benefits Cards List */}
              <div className="space-y-3">
                {benefits.map((b) => (
                  <div
                    key={b.id}
                    className="p-4 rounded-2xl bg-[#14161C] border border-white/[0.08] hover:border-white/15 space-y-2 transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="font-bold text-sm text-white">{b.title}</h4>
                        <p className="text-xs text-white/60 mt-1 line-clamp-2 leading-relaxed">
                          {b.description}
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          playSuccess();
                          showToast(`Activated benefit: ${b.title}`);
                        }}
                        className="px-3.5 py-1.5 rounded-full bg-[#1F232D] hover:bg-[#2B313F] text-xs font-bold text-white transition-all shrink-0 border border-white/5"
                      >
                        Activate
                      </button>
                    </div>

                    <div className="text-[10px] text-white/40 pt-1 border-t border-white/5 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-white/30" />
                      <span>{b.meta}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* EXACT FLOATING BOTTOM NAVIGATION (Screenshot_20261002-094901.png)         */}
        {/* Exactly 4 tabs: Wallet/Home, Explore, Money, Rewards. Cream pill on active! */}
        {/* ========================================================================= */}
        <nav className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 h-[50px] px-2 gap-1.5 flex items-center rounded-full bg-[rgba(27,30,36,0.85)] backdrop-blur-2xl border border-white/10 shadow-[0_12px_32px_-8px_rgba(0,0,0,0.8)]">
          {[
            { key: 'home' as NavTab, label: 'Wallet', icon: Wallet },
            { key: 'explore' as NavTab, label: 'Explore', icon: Compass },
            { key: 'money' as NavTab, label: 'Money', icon: DollarSign },
            { key: 'rewards' as NavTab, label: 'Rewards', icon: Gift },
          ].map((navItem) => {
            const Icon = navItem.icon;
            const isActive = tab === navItem.key;
            return (
              <button
                key={navItem.key}
                onClick={() => {
                  playTap();
                  setTab(navItem.key);
                }}
                className={`h-[38px] rounded-full flex items-center justify-center transition-all ${
                  isActive
                    ? 'bg-[#E6DFCF] text-[#17150F] px-4 font-extrabold text-[13px] shadow-sm gap-1.5'
                    : 'text-white/45 hover:text-white px-3 text-base'
                }`}
                aria-label={navItem.label}
              >
                <Icon className={isActive ? 'w-4 h-4 stroke-[2.4]' : 'w-5 h-5 stroke-[1.8]'} />
                {isActive && <span>{navItem.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      {/* ========================================================= */}
      {/* MODALS & FULL-SCREEN OVERLAYS */}
      {/* ========================================================= */}

      {/* 1. Asset Trade Modal (Click ANY coin in Explore or Home to trade!) */}
      <AssetTradeModal
        isOpen={Boolean(selectedTradeAsset)}
        onClose={() => setSelectedTradeAsset(null)}
        asset={selectedTradeAsset}
        onOpenBuy={(sym) => handleOpenOnramp(sym)}
        onExecuteTrade={handleExecuteTrade}
      />

      {/* 2. Onramp Keypad (Buy Crypto via Fiat / UPI / Card) */}
      <OnrampKeypad
        isOpen={isOnrampOpen}
        onClose={() => setIsOnrampOpen(false)}
        token={onrampTargetToken}
        onCompletePurchase={handleCompletePurchase}
      />

      {/* 3. Settings & Manage Menu Screen */}
      <SettingsScreen
        isOpen={isSettingsScreenOpen}
        onClose={() => setIsSettingsScreenOpen(false)}
        onOpenBuy={() => {
          setIsSettingsScreenOpen(false);
          handleOpenOnramp();
        }}
        onOpenScan={() => {
          setIsSettingsScreenOpen(false);
          setIsReceiveOpen(true);
        }}
        onOpenCardPromo={() => {
          setIsSettingsScreenOpen(false);
          setIsCardPromoOpen(true);
        }}
        soundEnabled={soundOn}
        onToggleSound={(enabled) => {
          setSoundOn(enabled);
          setSoundEnabled(enabled);
        }}
        baseCurrency={baseCurrency}
        onChangeCurrency={setBaseCurrency}
      />

      {/* 4. MetaMask Card Promo "SPEND AND EARN" & "Let's get started" */}
      <MetaMaskCardPromo
        isOpen={isCardPromoOpen}
        onClose={() => setIsCardPromoOpen(false)}
        onOpenCardDetails={() => {
          showToast('MetaMask Card Details & Settings');
        }}
      />

      {/* 5. Send Modal */}
      <SendModal
        isOpen={isSendOpen}
        onClose={() => setIsSendOpen(false)}
        tokens={tokens}
        onConfirmSend={handleConfirmSend}
      />

      {/* 6. Receive Modal (QR Scanner / Address) */}
      <ReceiveModal
        isOpen={isReceiveOpen}
        onClose={() => setIsReceiveOpen(false)}
        walletAddress={activeAccount.address}
      />

      {/* 7. Explore Filter & Sort Modal */}
      <ExploreFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        selectedSort={selectedSort}
        onSelectSort={(sort) => setSelectedSort(sort)}
        changeFilter={changeFilter}
        onSelectChangeFilter={(val) => setChangeFilter(val)}
        capTier={capTier}
        onSelectCapTier={(tier) => setCapTier(tier)}
        onReset={() => {
          setSelectedSort('gainers');
          setChangeFilter('all');
          setCapTier('all');
          setExploreCategory('Now');
          setSearchQuery('');
          showToast('Filters reset to default');
        }}
        activeCount={activeFilterCount}
      />
    </div>
  );
}
