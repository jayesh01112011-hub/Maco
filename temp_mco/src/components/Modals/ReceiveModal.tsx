import React, { useState } from 'react';
import { X, Copy, Check, QrCode, ShieldAlert, Share2 } from 'lucide-react';
import { playTap, playSuccess } from '../../utils/audio';

interface ReceiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  walletAddress: string;
}

export const ReceiveModal: React.FC<ReceiveModalProps> = ({
  isOpen,
  onClose,
  walletAddress,
}) => {
  const [network, setNetwork] = useState<'Ethereum' | 'Solana' | 'Arbitrum' | 'Base' | 'Polygon'>('Ethereum');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const networks = [
    { name: 'Ethereum', symbol: 'ERC-20', badge: 'Mainnet' },
    { name: 'Arbitrum', symbol: 'L2', badge: 'Low Gas' },
    { name: 'Base', symbol: 'L2', badge: 'Coinbase' },
    { name: 'Solana', symbol: 'SPL', badge: 'Sub-second' },
    { name: 'Polygon', symbol: 'PoS', badge: 'Fast' },
  ] as const;

  const getAddressForNetwork = () => {
    if (network === 'Solana') {
      return '7XqP3vY9WkM2J1zQ8sF5H4tB6nV0mC3xR2eL8pK7wY1';
    }
    return walletAddress;
  };

  const currentAddr = getAddressForNetwork();

  const handleCopy = () => {
    playSuccess();
    navigator.clipboard.writeText(currentAddr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-[#121419] border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#5FD3A0]/15 text-[#5FD3A0] flex items-center justify-center">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Receive Crypto</h3>
              <p className="text-[11px] text-white/40">Select destination network</p>
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

        {/* Network Selection */}
        <div className="py-4">
          <label className="block text-[11px] font-bold text-white/50 uppercase tracking-wider mb-2">
            Network Chain
          </label>
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {networks.map((net) => {
              const active = network === net.name;
              return (
                <button
                  key={net.name}
                  onClick={() => {
                    playTap();
                    setNetwork(net.name);
                  }}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    active
                      ? 'bg-[#E6DFCF] text-[#121316] border-[#E6DFCF]'
                      : 'bg-white/[0.04] text-white/70 border-white/5 hover:border-white/20'
                  }`}
                >
                  <span>{net.name}</span>
                  <span className={`text-[9px] px-1 py-0.2 rounded ${active ? 'bg-black/15 text-black' : 'bg-white/10 text-white/50'}`}>
                    {net.symbol}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* QR Code Presentation Box */}
        <div className="bg-[#181B22] border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center my-2">
          {/* Simulated High-Res Crisp QR Code with Center Logo */}
          <div className="relative p-3 bg-white rounded-2xl shadow-xl">
            <svg className="w-44 h-44" viewBox="0 0 100 100" fill="none">
              {/* Corner position markers */}
              <rect width="100" height="100" fill="white" />
              {/* Top-Left */}
              <rect x="10" y="10" width="24" height="24" fill="#121316" rx="4" />
              <rect x="14" y="14" width="16" height="16" fill="white" rx="2" />
              <rect x="18" y="18" width="8" height="8" fill="#121316" rx="1.5" />

              {/* Top-Right */}
              <rect x="66" y="10" width="24" height="24" fill="#121316" rx="4" />
              <rect x="70" y="14" width="16" height="16" fill="white" rx="2" />
              <rect x="74" y="18" width="8" height="8" fill="#121316" rx="1.5" />

              {/* Bottom-Left */}
              <rect x="10" y="66" width="24" height="24" fill="#121316" rx="4" />
              <rect x="14" y="70" width="16" height="16" fill="white" rx="2" />
              <rect x="18" y="74" width="8" height="8" fill="#121316" rx="1.5" />

              {/* Data Matrix Dots Pattern */}
              <circle cx="42" cy="14" r="2.5" fill="#121316" />
              <circle cx="50" cy="14" r="2.5" fill="#121316" />
              <circle cx="58" cy="14" r="2.5" fill="#121316" />

              <circle cx="42" cy="22" r="2.5" fill="#121316" />
              <circle cx="58" cy="22" r="2.5" fill="#121316" />

              <circle cx="42" cy="30" r="2.5" fill="#121316" />
              <circle cx="50" cy="30" r="2.5" fill="#121316" />

              <circle cx="14" cy="42" r="2.5" fill="#121316" />
              <circle cx="22" cy="42" r="2.5" fill="#121316" />
              <circle cx="30" cy="42" r="2.5" fill="#121316" />
              <circle cx="70" cy="42" r="2.5" fill="#121316" />
              <circle cx="78" cy="42" r="2.5" fill="#121316" />
              <circle cx="86" cy="42" r="2.5" fill="#121316" />

              <circle cx="14" cy="50" r="2.5" fill="#121316" />
              <circle cx="30" cy="50" r="2.5" fill="#121316" />
              <circle cx="66" cy="50" r="2.5" fill="#121316" />
              <circle cx="82" cy="50" r="2.5" fill="#121316" />

              <circle cx="42" cy="62" r="2.5" fill="#121316" />
              <circle cx="50" cy="62" r="2.5" fill="#121316" />
              <circle cx="58" cy="62" r="2.5" fill="#121316" />
              <circle cx="66" cy="62" r="2.5" fill="#121316" />
              <circle cx="86" cy="62" r="2.5" fill="#121316" />

              <circle cx="42" cy="74" r="2.5" fill="#121316" />
              <circle cx="54" cy="78" r="2.5" fill="#121316" />
              <circle cx="66" cy="74" r="2.5" fill="#121316" />
              <circle cx="74" cy="82" r="2.5" fill="#121316" />
              <circle cx="86" cy="86" r="2.5" fill="#121316" />
            </svg>

            {/* Centered Brand Emblem in QR */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 rounded-xl bg-[#121419] border-2 border-white flex items-center justify-center shadow-lg">
                <span className="font-extrabold text-xs text-[#E6DFCF]">A</span>
              </div>
            </div>
          </div>

          <div className="mt-4 text-center">
            <span className="text-xs text-white/50">Only send assets via the</span>{' '}
            <span className="text-xs font-bold text-white">{network} network</span>
          </div>
        </div>

        {/* Address Row with Copy Action */}
        <div className="space-y-2 mt-2">
          <div className="bg-[#181B22] border border-white/10 rounded-2xl p-3.5 flex items-center justify-between gap-3">
            <div className="truncate font-mono-num text-xs text-white/90 font-medium">
              {currentAddr}
            </div>
            <button
              onClick={handleCopy}
              className={`p-2.5 rounded-xl transition-all shrink-0 flex items-center gap-1.5 text-xs font-bold ${
                copied
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[11px] text-amber-200/80">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Sending tokens on incompatible networks will result in permanent loss.</span>
          </div>
        </div>

        {/* Share Button */}
        <button
          onClick={handleCopy}
          className="w-full mt-4 py-3.5 rounded-2xl bg-[#E6DFCF] hover:bg-[#F2ECE0] text-[#121316] font-bold text-sm flex items-center justify-center gap-2 transition-all"
        >
          <Share2 className="w-4 h-4" />
          <span>Share Address</span>
        </button>
      </div>
    </div>
  );
};
