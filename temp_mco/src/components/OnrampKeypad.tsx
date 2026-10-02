import React, { useState } from 'react';
import { ArrowLeft, Settings, ChevronDown, Delete, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { TokenHolding } from '../types';
import { playTap, playTick, playSuccess } from '../utils/audio';
import { CryptoIcon } from './CryptoIcon';

interface OnrampKeypadProps {
  isOpen: boolean;
  onClose: () => void;
  token?: TokenHolding | null;
  onCompletePurchase: (amountNum: number, tokenSymbol: string) => void;
}

export const OnrampKeypad: React.FC<OnrampKeypadProps> = ({
  isOpen,
  onClose,
  token,
  onCompletePurchase,
}) => {
  const [amountStr, setAmountStr] = useState('1000');
  const [currencySymbol, setCurrencySymbol] = useState<'₹' | '$' | '€' | '£'>('₹');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Apple Pay' | 'Card' | 'Bank Transfer'>('UPI');
  const [showPaymentDropdown, setShowPaymentDropdown] = useState(false);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);

  if (!isOpen) return null;

  const currentToken = token || {
    name: 'Ethereum',
    symbol: 'ETH',
    symbolChar: 'Ξ',
    price: 2690.68,
    iconBg: '#627EEA22',
    iconFg: '#8FA3F0',
  };

  const handleKeyPress = (val: string) => {
    playTick();
    if (val === '.') {
      if (!amountStr.includes('.') && amountStr.length < 8) {
        setAmountStr(amountStr ? amountStr + '.' : '0.');
      }
      return;
    }
    if (amountStr === '0') {
      setAmountStr(val);
      return;
    }
    if (amountStr.length < 8) {
      if (amountStr.includes('.')) {
        const parts = amountStr.split('.');
        if (parts[1] && parts[1].length >= 2) return;
      }
      setAmountStr(amountStr + val);
    }
  };

  const handleDelete = () => {
    playTick();
    setAmountStr((prev) => (prev.length > 1 ? prev.slice(0, -1) : ''));
  };

  const parsedAmount = parseFloat(amountStr) || 0;

  const handleContinue = () => {
    if (parsedAmount <= 0) return;
    setIsProcessing(true);
    playTap();

    setTimeout(() => {
      setIsProcessing(false);
      setIsDone(true);
      playSuccess();

      // Convert to USD equivalent roughly if INR
      const usdValue = currencySymbol === '₹' ? parsedAmount / 87 : parsedAmount;
      onCompletePurchase(usdValue, currentToken.symbol);

      setTimeout(() => {
        setIsDone(false);
        setAmountStr('1000');
        onClose();
      }, 1400);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md">
      <div className="w-full max-w-[480px] h-full sm:h-auto sm:max-h-[92vh] bg-[#000000] border sm:border-white/10 sm:rounded-3xl flex flex-col justify-between overflow-hidden p-5 animate-in slide-in-from-bottom duration-200">
        {/* Top Status & Header Bar */}
        <div>
          {/* Simulated Mobile Status Icons */}
          <div className="flex items-center justify-between text-xs text-white/40 pb-2">
            <span className="font-mono-num font-semibold text-white/80">7:22</span>
            <div className="flex items-center gap-2">
              <span className="text-[10px]">5G</span>
              <div className="w-5 h-2.5 border border-white/40 rounded-sm p-0.5 flex items-center">
                <div className="w-3 h-full bg-white/70 rounded-2xs" />
              </div>
            </div>
          </div>

          {/* Navigation Bar */}
          <div className="flex items-center justify-between py-2">
            <button
              onClick={() => {
                playTap();
                onClose();
              }}
              className="p-2 -ml-2 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            {/* Token Badge */}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2">
                <CryptoIcon symbol={currentToken.symbol} size={22} />
                <span className="font-bold text-sm text-white">Buy {currentToken.symbol}</span>
              </div>
              <span className="text-[11px] text-white/40">on Ethereum</span>
            </div>

            <button
              onClick={() => playTap()}
              className="p-2 -mr-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Center Display: Amount & Payment Selector */}
        {isDone ? (
          <div className="py-20 flex flex-col items-center justify-center text-center">
            <CheckCircle2 className="w-16 h-16 text-emerald-400 mb-3 animate-bounce" />
            <h3 className="text-2xl font-bold text-white">Order Confirmed!</h3>
            <p className="text-sm text-white/60 mt-1">
              Purchased {currentToken.symbol} with {currencySymbol}{parsedAmount.toLocaleString()} via {paymentMethod}
            </p>
          </div>
        ) : (
          <div className="my-auto text-center space-y-4 py-8">
            {/* Big Currency & Amount */}
            <div className="flex items-center justify-center gap-1">
              <button
                onClick={() => {
                  playTap();
                  setShowCurrencyDropdown(!showCurrencyDropdown);
                }}
                className="font-mono-num text-5xl sm:text-6xl font-extrabold text-white/90 hover:text-white flex items-center"
              >
                {currencySymbol}
              </button>
              <span className="font-mono-num text-5xl sm:text-6xl font-extrabold text-white tracking-tight">
                {amountStr || '0'}
              </span>
            </div>

            {/* Currency switcher dropdown */}
            {showCurrencyDropdown && (
              <div className="inline-flex gap-2 p-1 bg-[#1A1D24] border border-white/10 rounded-2xl shadow-xl">
                {(['₹', '$', '€', '£'] as const).map((curr) => (
                  <button
                    key={curr}
                    onClick={() => {
                      playTap();
                      setCurrencySymbol(curr);
                      setShowCurrencyDropdown(false);
                    }}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                      currencySymbol === curr ? 'bg-white text-black' : 'text-white/60 hover:text-white'
                    }`}
                  >
                    {curr}
                  </button>
                ))}
              </div>
            )}

            {/* Payment Method Pill (e.g. 🏦 UPI ⌵) */}
            <div className="relative inline-block">
              <button
                onClick={() => {
                  playTap();
                  setShowPaymentDropdown(!showPaymentDropdown);
                }}
                className="px-4 py-2 rounded-full bg-[#181A20] hover:bg-[#20232B] border border-white/10 text-xs font-bold text-white/90 flex items-center gap-2 shadow-sm transition-all"
              >
                <span>🏦 {paymentMethod}</span>
                <ChevronDown className="w-3.5 h-3.5 text-white/50" />
              </button>

              {showPaymentDropdown && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-44 bg-[#181A20] border border-white/10 rounded-2xl p-1 shadow-2xl z-20 space-y-1">
                  {(['UPI', 'Apple Pay', 'Card', 'Bank Transfer'] as const).map((pm) => (
                    <button
                      key={pm}
                      onClick={() => {
                        playTap();
                        setPaymentMethod(pm);
                        setShowPaymentDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                        paymentMethod === pm ? 'bg-white/15 text-white' : 'text-white/60 hover:text-white'
                      }`}
                    >
                      {pm}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Subtext: Powered by Onramp.money */}
            <div className="text-[11px] text-white/40 tracking-wide">
              Powered by Onramp.money
            </div>
          </div>
        )}

        {/* Bottom Section: Continue CTA & Numeric Keypad */}
        {!isDone && (
          <div className="space-y-4 pt-2">
            {/* White Continue Button */}
            <button
              disabled={parsedAmount <= 0 || isProcessing}
              onClick={handleContinue}
              className={`w-full py-4 rounded-full font-bold text-sm tracking-wide transition-all shadow-xl ${
                parsedAmount > 0 && !isProcessing
                  ? 'bg-white hover:bg-neutral-200 text-black cursor-pointer active:scale-[0.98]'
                  : 'bg-white/20 text-white/40 cursor-not-allowed'
              }`}
            >
              {isProcessing ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-black/40 border-t-black rounded-full animate-spin" />
                  Connecting to {paymentMethod}...
                </span>
              ) : (
                'Continue'
              )}
            </button>

            {/* Exact Full Screen Mobile Keypad */}
            <div className="grid grid-cols-3 gap-y-2 gap-x-4 pt-2 pb-1 text-center select-none">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((k) => (
                <button
                  key={k}
                  onClick={() => handleKeyPress(k)}
                  className="h-14 font-mono-num font-semibold text-2xl text-white active:bg-white/10 rounded-2xl transition-colors flex items-center justify-center"
                >
                  {k}
                </button>
              ))}
              <button
                onClick={() => handleKeyPress('.')}
                className="h-14 font-mono-num font-semibold text-2xl text-white active:bg-white/10 rounded-2xl transition-colors flex items-center justify-center"
              >
                .
              </button>
              <button
                onClick={() => handleKeyPress('0')}
                className="h-14 font-mono-num font-semibold text-2xl text-white active:bg-white/10 rounded-2xl transition-colors flex items-center justify-center"
              >
                0
              </button>
              <button
                onClick={handleDelete}
                className="h-14 font-semibold text-white/80 active:bg-white/10 rounded-2xl transition-colors flex items-center justify-center"
              >
                <Delete className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
