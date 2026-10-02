import React, { useState } from 'react';
import { X, Delete, Smartphone, CreditCard, Building2, CheckCircle2 } from 'lucide-react';
import { playTap, playTick, playSuccess } from '../../utils/audio';

interface KeypadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmAddCash: (amount: number, method: string) => void;
}

export const KeypadModal: React.FC<KeypadModalProps> = ({
  isOpen,
  onClose,
  onConfirmAddCash,
}) => {
  const [amountStr, setAmountStr] = useState('');
  const [method, setMethod] = useState<'Apple Pay' | 'Debit Card' | 'Wire'>('Apple Pay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleKeyPress = (val: string) => {
    playTick();
    if (val === '.') {
      if (!amountStr.includes('.') && amountStr.length < 7) {
        setAmountStr(amountStr ? amountStr + '.' : '0.');
      }
      return;
    }
    if (amountStr.length < 7) {
      // Limit to 2 decimals if decimal is present
      if (amountStr.includes('.')) {
        const parts = amountStr.split('.');
        if (parts[1] && parts[1].length >= 2) return;
      }
      setAmountStr(amountStr === '0' ? val : amountStr + val);
    }
  };

  const handleDelete = () => {
    playTick();
    setAmountStr((prev) => prev.slice(0, -1));
  };

  const handleQuickAdd = (preset: number) => {
    playTap();
    setAmountStr(preset.toString());
  };

  const parsedAmount = parseFloat(amountStr) || 0;

  const handleExecute = () => {
    if (parsedAmount <= 0) return;
    setIsProcessing(true);
    playTap();

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      playSuccess();
      onConfirmAddCash(parsedAmount, method);

      setTimeout(() => {
        setIsSuccess(false);
        setAmountStr('');
        onClose();
      }, 1500);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-sm bg-[#121419] border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col justify-between overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <button
            onClick={() => {
              playTap();
              onClose();
            }}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <span className="font-bold text-sm text-white">Add Cash</span>
          <div className="w-8" />
        </div>

        {isSuccess ? (
          <div className="py-16 flex flex-col items-center justify-center text-center">
            <CheckCircle2 className="w-16 h-16 text-emerald-400 mb-4 animate-bounce" />
            <h4 className="text-2xl font-black text-white">+${parsedAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h4>
            <p className="text-sm text-white/60 mt-1 font-medium">Added to Vault Cash via {method}</p>
          </div>
        ) : (
          <>
            {/* Big Amount Display */}
            <div className="py-6 text-center">
              <div className="font-mono-num text-5xl font-black text-white tracking-tight drop-shadow-sm">
                ${amountStr || '0'}
              </div>
              <div className="mt-2 text-xs text-white/40 flex items-center justify-center gap-1.5">
                <span>Earning 5.35% APY immediately</span>
              </div>
            </div>

            {/* Quick Amount Chips */}
            <div className="flex items-center justify-center gap-2 mb-4">
              {[50, 100, 500, 1000].map((preset) => (
                <button
                  key={preset}
                  onClick={() => handleQuickAdd(preset)}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-white/80 text-xs font-mono-num font-bold transition-all"
                >
                  +${preset}
                </button>
              ))}
            </div>

            {/* Payment Method Selector */}
            <div className="grid grid-cols-3 gap-2 mb-5">
              {[
                { name: 'Apple Pay', icon: Smartphone },
                { name: 'Debit Card', icon: CreditCard },
                { name: 'Wire', icon: Building2 },
              ].map((m) => {
                const Icon = m.icon;
                const active = method === m.name;
                return (
                  <button
                    key={m.name}
                    onClick={() => {
                      playTap();
                      setMethod(m.name as typeof method);
                    }}
                    className={`py-2 px-1.5 rounded-xl border flex flex-col items-center gap-1 text-[11px] font-semibold transition-all ${
                      active
                        ? 'bg-[#E6DFCF]/15 border-[#E6DFCF] text-white'
                        : 'bg-white/[0.03] border-white/5 text-white/40 hover:text-white'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{m.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Tactile Keypad */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0'].map((k) => (
                <button
                  key={k}
                  onClick={() => handleKeyPress(k)}
                  className="h-13 rounded-2xl bg-[#181B22] hover:bg-[#20242D] border border-white/5 font-mono-num font-bold text-xl text-white active:scale-95 transition-transform flex items-center justify-center shadow-sm"
                >
                  {k}
                </button>
              ))}
              <button
                onClick={handleDelete}
                className="h-13 rounded-2xl bg-[#181B22] hover:bg-[#20242D] border border-white/5 text-white/60 hover:text-white active:scale-95 transition-transform flex items-center justify-center shadow-sm"
              >
                <Delete className="w-5 h-5" />
              </button>
            </div>

            {/* Confirmation CTA */}
            <button
              disabled={parsedAmount <= 0 || isProcessing}
              onClick={handleExecute}
              className={`w-full py-4 rounded-2xl font-bold text-sm tracking-wide transition-all ${
                parsedAmount > 0 && !isProcessing
                  ? 'bg-[#E6DFCF] hover:bg-[#F2ECE0] text-[#121316] shadow-lg cursor-pointer hover:scale-[1.01] active:scale-[0.98]'
                  : 'bg-white/10 text-white/30 cursor-not-allowed'
              }`}
            >
              {isProcessing ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-black/40 border-t-black rounded-full animate-spin" />
                  Authenticating with {method}...
                </span>
              ) : (
                `Add $${parsedAmount > 0 ? parsedAmount.toLocaleString() : '0'} with ${method}`
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
};
