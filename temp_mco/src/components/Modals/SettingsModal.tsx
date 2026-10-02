import React, { useState } from 'react';
import { X, ShieldCheck, Volume2, VolumeX, Smartphone, Key, Globe, Check, Eye, EyeOff } from 'lucide-react';
import { playTap, playSuccess } from '../../utils/audio';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  soundEnabled: boolean;
  onToggleSound: (enabled: boolean) => void;
  baseCurrency: string;
  onChangeCurrency: (currency: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  soundEnabled,
  onToggleSound,
  baseCurrency,
  onChangeCurrency,
}) => {
  const [faceIdEnabled, setFaceIdEnabled] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [showSeed, setShowSeed] = useState(false);
  const [seedRevealed, setSeedRevealed] = useState(false);

  if (!isOpen) return null;

  const mockSeedPhrase = [
    'obsidian', 'titanium', 'quantum', 'velocity',
    'zenith', 'stellar', 'matrix', 'crystal',
    'aurora', 'phantom', 'kinetic', 'cipher'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-[#121419] border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-[#E6DFCF]" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Vault Security & Preferences</h3>
              <p className="text-[11px] text-white/40">Hardware-level encryption</p>
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

        {/* Security & Biometrics */}
        <div className="py-4 space-y-4">
          <div>
            <div className="text-[11px] font-bold text-white/40 uppercase tracking-wider mb-2">
              Authentication
            </div>
            <div className="bg-[#181B22] border border-white/10 rounded-2xl p-1 divide-y divide-white/5">
              <label className="flex items-center justify-between p-3 cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <Smartphone className="w-4 h-4 text-white/60" />
                  <div>
                    <div className="text-xs font-semibold text-white">Face ID / Touch ID</div>
                    <div className="text-[10px] text-white/40">Require for transactions &gt; $500</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={faceIdEnabled}
                  onChange={(e) => {
                    playTap();
                    setFaceIdEnabled(e.target.checked);
                  }}
                  className="w-4 h-4 accent-[#E6DFCF] cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 cursor-pointer">
                <div className="flex items-center gap-2.5">
                  {soundEnabled ? <Volume2 className="w-4 h-4 text-[#E6DFCF]" /> : <VolumeX className="w-4 h-4 text-white/40" />}
                  <div>
                    <div className="text-xs font-semibold text-white">Haptic Audio & Sounds</div>
                    <div className="text-[10px] text-white/40">Tactile clicks on keypad & confirmations</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={soundEnabled}
                  onChange={(e) => {
                    playTap();
                    onToggleSound(e.target.checked);
                  }}
                  className="w-4 h-4 accent-[#E6DFCF] cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Currency Preference */}
          <div>
            <div className="text-[11px] font-bold text-white/40 uppercase tracking-wider mb-2">
              Display Currency
            </div>
            <div className="grid grid-cols-4 gap-2">
              {(['USD', 'EUR', 'GBP', 'JPY'] as const).map((curr) => {
                const active = baseCurrency === curr;
                return (
                  <button
                    key={curr}
                    onClick={() => {
                      playTap();
                      onChangeCurrency(curr);
                    }}
                    className={`py-2 rounded-xl border text-xs font-bold transition-all ${
                      active
                        ? 'bg-[#E6DFCF] text-[#121316] border-[#E6DFCF]'
                        : 'bg-[#181B22] border-white/5 text-white/60 hover:border-white/20'
                    }`}
                  >
                    {curr}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Backup Seed Phrase View */}
          <div>
            <div className="text-[11px] font-bold text-white/40 uppercase tracking-wider mb-2">
              Private Key Security
            </div>
            <div className="bg-[#181B22] border border-white/10 rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Key className="w-4 h-4 text-amber-400" />
                  <div>
                    <div className="text-xs font-semibold text-white">Secret Recovery Phrase</div>
                    <div className="text-[10px] text-white/40">12-word cryptographic seed</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    playTap();
                    setShowSeed(!showSeed);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold transition-colors"
                >
                  {showSeed ? 'Hide' : 'Reveal'}
                </button>
              </div>

              {showSeed && (
                <div className="mt-3 pt-3 border-t border-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] text-amber-300 font-medium">Never share these words with anyone</span>
                    <button
                      onClick={() => {
                        playTap();
                        setSeedRevealed(!seedRevealed);
                      }}
                      className="text-white/50 hover:text-white"
                    >
                      {seedRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {mockSeedPhrase.map((w, i) => (
                      <div
                        key={i}
                        className="bg-black/40 border border-white/5 px-2.5 py-1.5 rounded-lg text-center"
                      >
                        <span className="text-[9px] text-white/30 mr-1.5">{i + 1}</span>
                        <span className="font-mono-num text-xs font-bold text-white/90">
                          {seedRevealed ? w : '••••••'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Audit */}
        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-white/40">
          <span>Client Version 3.4.1 (Build 8820)</span>
          <span className="text-emerald-400">Audited by Trail of Bits</span>
        </div>
      </div>
    </div>
  );
};
