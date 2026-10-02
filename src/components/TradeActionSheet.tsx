import React from 'react';
import { X, RefreshCw, Plus, ArrowUpRight, ArrowDownLeft, Zap, Sparkles } from 'lucide-react';
import { playTap } from '../utils/audio';

interface TradeActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction: (action: 'swap' | 'buy' | 'send' | 'receive' | 'perps') => void;
}

export const TradeActionSheet: React.FC<TradeActionSheetProps> = ({
  isOpen,
  onClose,
  onSelectAction,
}) => {
  if (!isOpen) return null;

  const actions = [
    {
      id: 'swap' as const,
      title: 'Swap Tokens',
      desc: 'Instant decentralized trade with zero routing fees',
      icon: RefreshCw,
      iconBg: 'bg-blue-500/15 text-blue-400',
    },
    {
      id: 'buy' as const,
      title: 'Buy Crypto',
      desc: 'Purchase with UPI, Apple Pay, or credit card',
      icon: Plus,
      iconBg: 'bg-emerald-500/15 text-emerald-400',
    },
    {
      id: 'send' as const,
      title: 'Send Tokens',
      desc: 'Transfer crypto to any ENS name or address',
      icon: ArrowUpRight,
      iconBg: 'bg-cyan-500/15 text-cyan-300',
    },
    {
      id: 'receive' as const,
      title: 'Receive Tokens',
      desc: 'Show QR code and copy your multi-chain address',
      icon: ArrowDownLeft,
      iconBg: 'bg-purple-500/15 text-purple-300',
    },
    {
      id: 'perps' as const,
      title: 'Trade Perps (50x)',
      desc: 'Trade perpetual futures with up to 50x leverage',
      icon: Zap,
      iconBg: 'bg-amber-500/15 text-amber-300',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-[480px] bg-[#14161B] border-t sm:border border-white/10 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
              +
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Trade & Actions</h3>
              <p className="text-[11px] text-white/40">Select an on-chain transaction</p>
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

        {/* Action List */}
        <div className="space-y-2 py-4">
          {actions.map((act) => {
            const Icon = act.icon;
            return (
              <button
                key={act.id}
                onClick={() => {
                  playTap();
                  onClose();
                  onSelectAction(act.id);
                }}
                className="w-full p-3.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 flex items-center gap-3.5 text-left transition-all group active:scale-[0.99]"
              >
                <div className={`w-11 h-11 rounded-2xl ${act.iconBg} flex items-center justify-center shrink-0 transition-transform group-hover:scale-105`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-sm text-white group-hover:text-blue-400 transition-colors">
                    {act.title}
                  </div>
                  <div className="text-xs text-white/40">{act.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
