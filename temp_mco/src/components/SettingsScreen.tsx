import React, { useState } from 'react';
import {
  ArrowLeft,
  DollarSign,
  QrCode,
  Bell,
  CreditCard,
  Settings as SettingsIcon,
  Bookmark,
  ShieldCheck,
  GitFork,
  Info,
  FileText,
  MessageSquare,
  LogOut,
  ChevronRight,
  Check,
  X,
} from 'lucide-react';
import { playTap, playSuccess } from '../utils/audio';

interface SettingsScreenProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBuy: () => void;
  onOpenScan: () => void;
  onOpenCardPromo: () => void;
  soundEnabled: boolean;
  onToggleSound: (enabled: boolean) => void;
  baseCurrency: string;
  onChangeCurrency: (currency: string) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  isOpen,
  onClose,
  onOpenBuy,
  onOpenScan,
  onOpenCardPromo,
  soundEnabled,
  onToggleSound,
  baseCurrency,
  onChangeCurrency,
}) => {
  const [activeSubView, setActiveSubView] = useState<'none' | 'notifications' | 'preferences' | 'contacts' | 'permissions' | 'networks' | 'about'>('none');
  const [notificationsOn, setNotificationsOn] = useState(true);
  const [faceIdOn, setFaceIdOn] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#000000] text-white">
      <div className="w-full max-w-[480px] h-full sm:h-auto sm:max-h-[95vh] bg-[#000000] sm:rounded-3xl flex flex-col justify-between p-5 overflow-y-auto no-scrollbar relative animate-in slide-in-from-right duration-200">
        <div>
          {/* Top Status & Back Arrow Header */}
          <div className="flex items-center justify-between pb-3">
            <button
              onClick={() => {
                playTap();
                if (activeSubView !== 'none') {
                  setActiveSubView('none');
                } else {
                  onClose();
                }
              }}
              className="p-2 -ml-2 rounded-full hover:bg-white/10 text-white/90 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            {activeSubView !== 'none' && (
              <span className="font-bold text-sm text-white capitalize">{activeSubView}</span>
            )}
            <div className="w-8" />
          </div>

          {/* SUB-VIEW: NOTIFICATIONS */}
          {activeSubView === 'notifications' && (
            <div className="space-y-4 pt-2">
              <h2 className="text-xl font-bold">Notifications</h2>
              <div className="bg-[#14161C] rounded-2xl p-4 divide-y divide-white/5 space-y-3">
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <div className="text-sm font-bold">Push Alerts</div>
                    <div className="text-xs text-white/50">Transfers & confirmations</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationsOn}
                    onChange={(e) => setNotificationsOn(e.target.checked)}
                    className="w-4 h-4 accent-blue-500"
                  />
                </div>
                <div className="flex items-center justify-between pt-3">
                  <div>
                    <div className="text-sm font-bold">Price Movement Alerts</div>
                    <div className="text-xs text-white/50">Tokens moving &gt; 5% in 24h</div>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4 accent-blue-500" />
                </div>
              </div>
            </div>
          )}

          {/* SUB-VIEW: PREFERENCES */}
          {activeSubView === 'preferences' && (
            <div className="space-y-4 pt-2">
              <h2 className="text-xl font-bold">App Preferences</h2>
              <div className="bg-[#14161C] rounded-2xl p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold">Biometrics (Face ID)</div>
                    <div className="text-xs text-white/50">Require for transactions &gt; $500</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={faceIdOn}
                    onChange={(e) => setFaceIdOn(e.target.checked)}
                    className="w-4 h-4 accent-blue-500"
                  />
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                  <div>
                    <div className="text-sm font-bold">Haptic Audio Clicks</div>
                    <div className="text-xs text-white/50">Tactile sounds on keypad taps</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={soundEnabled}
                    onChange={(e) => onToggleSound(e.target.checked)}
                    className="w-4 h-4 accent-blue-500"
                  />
                </div>

                <div className="pt-3 border-t border-white/5">
                  <div className="text-sm font-bold mb-2">Display Currency</div>
                  <div className="grid grid-cols-4 gap-2">
                    {['USD', 'EUR', 'GBP', 'INR'].map((c) => (
                      <button
                        key={c}
                        onClick={() => {
                          playTap();
                          onChangeCurrency(c);
                        }}
                        className={`py-2 rounded-xl text-xs font-bold transition-all ${
                          baseCurrency === c ? 'bg-white text-black' : 'bg-white/5 text-white/60 hover:text-white'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SUB-VIEW: CONTACTS */}
          {activeSubView === 'contacts' && (
            <div className="space-y-4 pt-2">
              <h2 className="text-xl font-bold">Contacts & Address Book</h2>
              <div className="bg-[#14161C] rounded-2xl divide-y divide-white/5 overflow-hidden">
                {[
                  { name: 'vitalik.eth', address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045' },
                  { name: 'satoshi.eth', address: '0x1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa' },
                  { name: 'alice.sol', address: '7XqP3vY9WkM2J1zQ8sF5H4tB6nV0mC3xR2eL8pK7wY1' },
                ].map((c) => (
                  <div key={c.name} className="p-3.5 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-sm text-white">{c.name}</div>
                      <div className="font-mono-num text-[11px] text-white/40 truncate max-w-[240px]">
                        {c.address}
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/60">
                      Verified
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SUB-VIEW: NETWORKS */}
          {activeSubView === 'networks' && (
            <div className="space-y-4 pt-2">
              <h2 className="text-xl font-bold">Enabled Networks</h2>
              <div className="bg-[#14161C] rounded-2xl divide-y divide-white/5 overflow-hidden">
                {[
                  { name: 'Ethereum Mainnet', rpc: '12ms · 18 Gwei', active: true },
                  { name: 'Arbitrum One', rpc: '9ms · 0.1 Gwei', active: true },
                  { name: 'Base Network', rpc: '10ms · 0.05 Gwei', active: true },
                  { name: 'Solana Mainnet', rpc: '15ms · 400 TPS', active: true },
                  { name: 'Polygon PoS', rpc: '14ms · 30 Gwei', active: true },
                ].map((net) => (
                  <div key={net.name} className="p-3.5 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-sm text-white">{net.name}</div>
                      <div className="text-[11px] text-emerald-400 font-mono-num">{net.rpc}</div>
                    </div>
                    <Check className="w-4 h-4 text-emerald-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SUB-VIEW: ABOUT */}
          {activeSubView === 'about' && (
            <div className="space-y-4 pt-2 text-center">
              <div className="w-16 h-16 rounded-3xl bg-white/10 flex items-center justify-center mx-auto text-2xl font-black text-white">
                M
              </div>
              <h2 className="text-xl font-bold">MetaMask Mobile</h2>
              <p className="text-xs text-white/50 max-w-xs mx-auto">
                Version 7.28.0 (Build 1849)<br />
                The world&apos;s leading self-custody web3 wallet.
              </p>
              <div className="pt-4 space-y-2 text-xs text-blue-400">
                <div className="hover:underline cursor-pointer">Terms of Service</div>
                <div className="hover:underline cursor-pointer">Privacy Notice</div>
                <div className="hover:underline cursor-pointer">Audit Certificates</div>
              </div>
            </div>
          )}

          {/* MAIN SETTINGS MENU VIEW (Screenshot_20261002-095306.png) */}
          {activeSubView === 'none' && (
            <div className="space-y-6 pt-1">
              {/* Top 2 Square Action Cards: Buy & Scan */}
              <div className="grid grid-cols-2 gap-3">
                {/* Buy Button Card */}
                <button
                  onClick={() => {
                    playTap();
                    onOpenBuy();
                  }}
                  className="h-24 rounded-2xl bg-[#14161C] hover:bg-[#1C1F27] border border-white/[0.08] hover:border-white/20 flex flex-col items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
                >
                  <DollarSign className="w-5 h-5 text-white/80" />
                  <span className="text-xs font-bold text-white">Buy</span>
                </button>

                {/* Scan Button Card */}
                <button
                  onClick={() => {
                    playTap();
                    onOpenScan();
                  }}
                  className="h-24 rounded-2xl bg-[#14161C] hover:bg-[#1C1F27] border border-white/[0.08] hover:border-white/20 flex flex-col items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
                >
                  <QrCode className="w-5 h-5 text-white/80" />
                  <span className="text-xs font-bold text-white">Scan</span>
                </button>
              </div>

              {/* Group 1: Notifications & MetaMask Card */}
              <div className="bg-[#14161C] border border-white/[0.08] rounded-2xl divide-y divide-white/5 overflow-hidden">
                <button
                  onClick={() => {
                    playTap();
                    setActiveSubView('notifications');
                  }}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <Bell className="w-5 h-5 text-white/70" />
                    <span className="font-bold text-sm text-white">Notifications</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/30" />
                </button>

                {/* MetaMask Card -> Opens the "SPEND AND EARN" flow! */}
                <button
                  onClick={() => {
                    playTap();
                    onOpenCardPromo();
                  }}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <CreditCard className="w-5 h-5 text-white/70" />
                    <span className="font-bold text-sm text-white">MetaMask Card</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/30" />
                </button>
              </div>

              {/* Manage Section */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-white/50 px-1">Manage</div>
                <div className="bg-[#14161C] border border-white/[0.08] rounded-2xl divide-y divide-white/5 overflow-hidden">
                  <button
                    onClick={() => {
                      playTap();
                      setActiveSubView('preferences');
                    }}
                    className="w-full p-4 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="flex items-center gap-3.5">
                      <SettingsIcon className="w-5 h-5 text-white/70" />
                      <span className="font-bold text-sm text-white">Settings</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/30" />
                  </button>

                  <button
                    onClick={() => {
                      playTap();
                      setActiveSubView('contacts');
                    }}
                    className="w-full p-4 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="flex items-center gap-3.5">
                      <Bookmark className="w-5 h-5 text-white/70" />
                      <span className="font-bold text-sm text-white">Contacts</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/30" />
                  </button>

                  <button
                    onClick={() => {
                      playTap();
                      setActiveSubView('networks');
                    }}
                    className="w-full p-4 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="flex items-center gap-3.5">
                      <ShieldCheck className="w-5 h-5 text-white/70" />
                      <span className="font-bold text-sm text-white">Permissions</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/30" />
                  </button>

                  <button
                    onClick={() => {
                      playTap();
                      setActiveSubView('networks');
                    }}
                    className="w-full p-4 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="flex items-center gap-3.5">
                      <GitFork className="w-5 h-5 text-white/70" />
                      <span className="font-bold text-sm text-white">Networks</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/30" />
                  </button>
                </div>
              </div>

              {/* Resources Section */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-white/50 px-1">Resources</div>
                <div className="bg-[#14161C] border border-white/[0.08] rounded-2xl divide-y divide-white/5 overflow-hidden">
                  <button
                    onClick={() => {
                      playTap();
                      setActiveSubView('about');
                    }}
                    className="w-full p-4 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="flex items-center gap-3.5">
                      <Info className="w-5 h-5 text-white/70" />
                      <span className="font-bold text-sm text-white">About MetaMask</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/30" />
                  </button>

                  <button
                    onClick={() => {
                      playTap();
                      alert('Feature request modal: What would you like to see next in MetaMask?');
                    }}
                    className="w-full p-4 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="flex items-center gap-3.5">
                      <FileText className="w-5 h-5 text-white/70" />
                      <span className="font-bold text-sm text-white">Request a feature</span>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      playTap();
                      alert('Contacting 24/7 MetaMask Institutional Support via encrypted live chat.');
                    }}
                    className="w-full p-4 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="flex items-center gap-3.5">
                      <MessageSquare className="w-5 h-5 text-white/70" />
                      <span className="font-bold text-sm text-white">Contact support</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Bottom Red Logout Button (Screenshot_20261002-095306.png) */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    playTap();
                    if (confirm('Are you sure you want to lock and log out of this wallet session?')) {
                      onClose();
                    }
                  }}
                  className="w-full p-4 rounded-2xl bg-[#14161C] border border-white/[0.08] hover:border-red-500/30 flex items-center gap-3.5 text-rose-500 hover:text-rose-400 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-bold text-sm">Log out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
