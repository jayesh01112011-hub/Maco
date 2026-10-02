export type NavTab = 'home' | 'explore' | 'money' | 'rewards';

export interface TokenHolding {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  holdings: number;
  holdingsUsd: number;
  iconBg: string;
  iconFg: string;
  symbolChar: string;
  sparkline: number[];
  category: 'Layer 1' | 'Layer 2' | 'DeFi' | 'RWAs' | 'Memes' | 'AI' | 'Macro' | 'Sports' | 'Sites';
  mcap: string;
  vol24h: string;
  high24h: number;
  low24h: number;
}

export interface CryptoMover {
  symbol: string;
  name?: string;
  price?: number;
  change: number;
  iconEmoji?: string;
  iconBg?: string;
}

export interface PerpsMover {
  symbol: string;
  change: number;
  iconEmoji?: string;
  isGain: boolean;
}

export interface BenefitItem {
  id: string;
  title: string;
  description: string;
  meta: string;
  partner: string;
  badge?: string;
  claimed?: boolean;
}

export interface Transaction {
  id: string;
  type: 'receive' | 'send' | 'swap' | 'card' | 'yield';
  title: string;
  subtitle: string;
  amount: string;
  amountUsd: number;
  date: string;
  timestamp: number;
  isPositive: boolean;
  status: 'confirmed' | 'pending' | 'failed';
  hash: string;
  fee: string;
  tokenSymbol: string;
}

export interface YieldVault {
  id: string;
  name: string;
  asset: string;
  apy: number;
  tvl: string;
  deposited: number;
  depositedUsd: number;
  earnedUsd: number;
  risk: 'Low' | 'Medium';
  tag: string;
}

export interface PerpPosition {
  id: string;
  pair: string;
  type: 'long' | 'short';
  leverage: number;
  entryPrice: number;
  currentPrice: number;
  margin: number;
  pnl: number;
  pnlPercent: number;
  liquidationPrice: number;
}

export type CardSkin = 'obsidian' | 'platinum' | 'aurora' | 'solaris';

export interface WalletAccount {
  id: string;
  name: string;
  address: string;
  balanceUsd: number;
  avatarLetter: string;
  type: 'Vault Main' | 'Cold Ledger' | 'DeFi Active';
}
