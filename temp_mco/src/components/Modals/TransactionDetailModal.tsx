import React, { useState } from 'react';
import { X, ExternalLink, Check, Copy, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Transaction } from '../../types';
import { playTap, playSuccess } from '../../utils/audio';

interface TransactionDetailModalProps {
  tx: Transaction | null;
  onClose: () => void;
}

export const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({
  tx,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!tx) return null;

  const handleCopyHash = () => {
    playSuccess();
    navigator.clipboard.writeText(tx.hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-[#121419] border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Transaction Details</h3>
              <p className="text-[11px] text-white/40">Verified on-chain ledger</p>
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

        {/* Amount & Status Banner */}
        <div className="py-6 text-center">
          <div className={`font-mono-num text-3xl font-extrabold ${tx.isPositive ? 'text-emerald-400' : 'text-white'}`}>
            {tx.amount}
          </div>
          <div className="text-sm font-semibold text-white/80 mt-1">{tx.title}</div>
          <div className="inline-flex items-center gap-1.5 mt-2.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Finalized (32 Confirmations)</span>
          </div>
        </div>

        {/* Key-Value Breakdown */}
        <div className="bg-[#181B22] border border-white/10 rounded-2xl p-4 space-y-3 text-xs mb-4">
          <div className="flex items-center justify-between">
            <span className="text-white/40">Timestamp</span>
            <span className="font-medium text-white">{tx.date}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/40">Network Fee</span>
            <span className="font-mono-num font-medium text-white">{tx.fee}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/40">Context</span>
            <span className="font-medium text-white/90 text-right truncate max-w-[200px]">{tx.subtitle}</span>
          </div>

          <div className="pt-2 border-t border-white/5">
            <div className="text-white/40 mb-1">Transaction Hash</div>
            <div className="flex items-center justify-between gap-2 bg-black/30 p-2 rounded-xl">
              <span className="font-mono-num text-[11px] text-white/80 truncate">
                {tx.hash}
              </span>
              <button
                onClick={handleCopyHash}
                className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* View on Explorer Link */}
        <a
          href="https://etherscan.io"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white/90 hover:text-white font-bold text-xs flex items-center justify-center gap-2 border border-white/5 transition-all"
        >
          <ExternalLink className="w-4 h-4" />
          <span>View on Etherscan</span>
        </a>
      </div>
    </div>
  );
};
