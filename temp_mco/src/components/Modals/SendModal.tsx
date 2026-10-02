import React, { useState } from 'react';
import { X, ArrowUpRight, CheckCircle2, ChevronDown, Zap, Shield, Search } from 'lucide-react';
import { TokenHolding } from '../../types';
import { playTap, playSuccess } from '../../utils/audio';

interface SendModalProps {
  isOpen: boolean;
  onClose: () => void;
  tokens: TokenHolding[];
  onConfirmSend: (symbol: string, amount: number, recipient: string) => void;
}

export const SendModal: React.FC<SendModalProps> = ({
  isOpen,
  onClose,
  tokens,
  onConfirmSend,
}) => {
  const [selectedToken, setSelectedToken] = useState<TokenHolding>(tokens[1] || tokens[0]); // ETH default
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [gasSpeed, setGasSpeed] = useState<'eco' | 'normal' | 'fast'>('normal');
  const [isSending, setIsSending] = useState(false);
  const [isDone, setIsDone] = useState(false);

  if (!isOpen) return null;

  const quickContacts = [
    { name: 'vitalik.eth', address: '0xd8dA...6045' },
    { name: 'satoshi.eth', address: '0x1A1z...93cb' },
    { name: 'alice.sol', address: '7XqP...9kL2' },
  ];

  const handleMax = () => {
    playTap();
    setAmount(selectedToken.holdings.toString());
  };

  const parsedAmount = parseFloat(amount) || 0;
  const usdValue = parsedAmount * selectedToken.price;
  const isOverBalance = parsedAmount > selectedToken.holdings;
  const canSend = recipient.trim().length > 3 && parsedAmount > 0 && !isOverBalance;

  const handleSend = () => {
    if (!canSend) return;
    setIsSending(true);
    playTap();

    setTimeout(() => {
      setIsSending(false);
      setIsDone(true);
      playSuccess();
      onConfirmSend(selectedToken.symbol, parsedAmount, recipient);

      setTimeout(() => {
        setIsDone(false);
        setAmount('');
        setRecipient('');
        onClose();
      }, 1500);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-[#121419] border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#E6DFCF]/10 text-[#E6DFCF] flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Send Assets</h3>
              <p className="text-[11px] text-white/40">Instant on-chain transfer</p>
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
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <CheckCircle2 className="w-14 h-14 text-emerald-400 mb-3 animate-bounce" />
            <h4 className="text-xl font-bold text-white">Transfer Confirmed!</h4>
            <p className="text-sm text-white/60 mt-1">
              Sent {amount} {selectedToken.symbol} to {recipient}
            </p>
            <div className="mt-4 font-mono-num text-xs text-white/40">
              Tx: 0x{Math.random().toString(16).slice(2, 10)}...{Math.random().toString(16).slice(2, 6)}
            </div>
          </div>
        ) : (
          <div className="space-y-4 pt-4">
            {/* Recipient Input */}
            <div>
              <label className="block text-[11px] font-bold text-white/50 uppercase tracking-wider mb-1.5">
                Recipient
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-white/30 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="ENS name, public address (0x...) or Solana"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="w-full bg-[#181B22] border border-white/10 rounded-2xl pl-10 pr-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#E6DFCF]/50"
                />
              </div>

              {/* Quick Contacts */}
              <div className="flex items-center gap-1.5 mt-2">
                <span className="text-[10px] text-white/40 uppercase font-semibold mr-1">Frequent:</span>
                {quickContacts.map((contact) => (
                  <button
                    key={contact.name}
                    onClick={() => {
                      playTap();
                      setRecipient(contact.name);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs transition-colors font-medium"
                  >
                    {contact.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Token Selector & Amount Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-bold text-white/50 uppercase tracking-wider">
                  Amount
                </label>
                <div className="text-xs text-white/60">
                  Available:{' '}
                  <span className="font-mono-num font-semibold text-white">
                    {selectedToken.holdings} {selectedToken.symbol}
                  </span>
                </div>
              </div>

              <div className="bg-[#181B22] border border-white/10 rounded-2xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  {/* Token Dropdown */}
                  <div className="relative">
                    <select
                      value={selectedToken.id}
                      onChange={(e) => {
                        playTap();
                        const found = tokens.find((t) => t.id === e.target.value);
                        if (found) setSelectedToken(found);
                      }}
                      className="appearance-none bg-white/10 hover:bg-white/15 text-white font-bold text-sm px-3 py-2 pr-8 rounded-xl outline-none cursor-pointer"
                    >
                      {tokens.map((t) => (
                        <option key={t.id} value={t.id} className="bg-[#181B22] text-white">
                          {t.symbol} — {t.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-white/50 absolute right-2.5 top-3 pointer-events-none" />
                  </div>

                  {/* Number Input */}
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="0.0"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="bg-transparent text-right font-mono-num text-xl md:text-2xl font-bold text-white placeholder-white/20 outline-none w-36"
                    />
                    <button
                      onClick={handleMax}
                      className="px-2 py-1 rounded-md bg-[#E6DFCF]/10 text-[#E6DFCF] hover:bg-[#E6DFCF]/20 text-xs font-bold transition-colors"
                    >
                      MAX
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-white/5 text-xs text-white/40">
                  <span>Estimated Fiat Value:</span>
                  <span className="font-mono-num font-semibold text-white/80">
                    ≈ ${usdValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {isOverBalance && (
                <p className="text-xs text-rose-400 mt-1 font-semibold">
                  Amount exceeds available {selectedToken.symbol} balance.
                </p>
              )}
            </div>

            {/* Network Gas Speed */}
            <div className="bg-[#181B22]/60 rounded-2xl p-3 border border-white/5">
              <div className="flex items-center justify-between text-xs mb-2">
                <div className="flex items-center gap-1.5 text-white/60 font-medium">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Network Gas Priority</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-emerald-400">
                  <Shield className="w-3 h-3" /> MEV Protected
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {(['eco', 'normal', 'fast'] as const).map((speed) => {
                  const fee = speed === 'eco' ? '$0.42' : speed === 'normal' ? '$0.85' : '$1.40';
                  const time = speed === 'eco' ? '~25s' : speed === 'normal' ? '~10s' : '~3s';
                  const active = gasSpeed === speed;

                  return (
                    <button
                      key={speed}
                      type="button"
                      onClick={() => {
                        playTap();
                        setGasSpeed(speed);
                      }}
                      className={`p-2 rounded-xl text-center border transition-all ${
                        active
                          ? 'bg-[#E6DFCF]/15 border-[#E6DFCF]/50 text-white'
                          : 'bg-white/[0.03] border-white/5 text-white/50 hover:text-white'
                      }`}
                    >
                      <div className="text-[11px] font-bold capitalize">{speed}</div>
                      <div className="font-mono-num text-[10px] text-white/70">{fee}</div>
                      <div className="text-[9px] text-white/40">{time}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit Button */}
            <button
              disabled={!canSend || isSending}
              onClick={handleSend}
              className={`w-full py-4 rounded-2xl font-bold text-sm tracking-wide transition-all shadow-lg ${
                canSend && !isSending
                  ? 'bg-[#E6DFCF] hover:bg-[#F0EAE0] text-[#121316] cursor-pointer hover:scale-[1.01] active:scale-[0.98]'
                  : 'bg-white/10 text-white/30 cursor-not-allowed'
              }`}
            >
              {isSending ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-black/40 border-t-black rounded-full animate-spin" />
                  Broadcasting to Mempool...
                </span>
              ) : (
                `Send ${amount || '0'} ${selectedToken.symbol}`
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
