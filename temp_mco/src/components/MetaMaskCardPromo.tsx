import React, { useState } from 'react';
import { ArrowLeft, ChevronDown, CheckCircle2 } from 'lucide-react';
import { playTap, playSuccess } from '../utils/audio';
import cardDuoImg from '../assets/images/metamask_card_duo_1790915107934.jpg';

interface MetaMaskCardPromoProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCardDetails?: () => void;
}

export const MetaMaskCardPromo: React.FC<MetaMaskCardPromoProps> = ({
  isOpen,
  onClose,
  onOpenCardDetails,
}) => {
  const [step, setStep] = useState<'promo' | 'signup' | 'success'>('promo');
  const [country, setCountry] = useState('India');
  const [email, setEmail] = useState('');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const countries = [
    { name: 'India', available: false },
    { name: 'United States', available: true },
    { name: 'United Kingdom', available: true },
    { name: 'Germany', available: true },
    { name: 'France', available: true },
    { name: 'Singapore', available: true },
    { name: 'Canada', available: false },
    { name: 'Australia', available: true },
  ];

  const currentCountryObj = countries.find((c) => c.name === country) || { name: country, available: false };

  const handleJoinWaitlist = () => {
    if (!email || !email.includes('@')) return;
    setIsSubmitting(true);
    playTap();

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      playSuccess();
      setTimeout(() => {
        setStep('promo');
        onClose();
      }, 1800);
    }, 1000);
  };

  const setIsSuccess = (val: boolean) => {
    if (val) setStep('success');
  };

  // STEP 1: "SPEND AND EARN" (Screenshot_20261002-095312.png)
  if (step === 'promo') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#25093A] text-white">
        <div className="w-full max-w-[480px] h-full sm:h-auto sm:max-h-[95vh] bg-[#25093A] sm:rounded-3xl flex flex-col justify-between p-6 overflow-hidden relative animate-in fade-in duration-200">
          {/* Top Notch / Dynamic Island pill */}
          <div className="w-24 h-7 bg-black rounded-full mx-auto mb-2 shrink-0" />

          {/* Close button in top left */}
          <button
            onClick={() => {
              playTap();
              onClose();
            }}
            className="absolute top-5 left-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Heading Section */}
          <div className="text-center mt-3 space-y-2">
            <h1 className="font-black text-4xl sm:text-5xl tracking-tighter text-[#E9D5FF] uppercase font-display leading-tight">
              SPEND<br />AND EARN
            </h1>
            <p className="text-sm sm:text-base text-purple-200/80 font-medium max-w-xs mx-auto leading-snug">
              The MetaMask Card is the fast and easy way to spend your crypto and earn up to 3% USDC back.
            </p>
          </div>

          {/* 3D Angled Cards Image (Screenshot_20261002-095312.png) */}
          <div className="my-auto py-4 relative flex items-center justify-center">
            <div className="relative w-72 sm:w-80 aspect-[3/4] max-h-[360px] rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
              <img
                src={cardDuoImg}
                alt="MetaMask Card Duo"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Bottom CTA Buttons */}
          <div className="space-y-3 pt-2">
            <button
              onClick={() => {
                playTap();
                setStep('signup');
              }}
              className="w-full py-4 rounded-full bg-white hover:bg-neutral-100 text-[#17150F] font-extrabold text-sm tracking-wide transition-all shadow-xl active:scale-[0.98]"
            >
              Set up now
            </button>

            <button
              onClick={() => {
                playTap();
                onClose();
              }}
              className="w-full py-2.5 text-center text-sm font-bold text-white/70 hover:text-white transition-colors"
            >
              Not now
            </button>
          </div>
        </div>
      </div>
    );
  }

  // STEP 2: "Let's get started" (Screenshot_20261002-095319.png)
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#000000] text-white">
      <div className="w-full max-w-[480px] h-full sm:h-auto sm:max-h-[95vh] bg-[#000000] sm:rounded-3xl flex flex-col justify-between p-6 overflow-hidden relative animate-in slide-in-from-right duration-200">
        <div>
          {/* Header with Back Arrow */}
          <div className="flex items-center pb-5">
            <button
              onClick={() => {
                playTap();
                setStep('promo');
              }}
              className="p-2 -ml-2 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>

          {/* Title & Description */}
          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Let&apos;s get started
            </h1>
            <p className="text-sm text-white/60 leading-relaxed">
              Create an account with Crypto Life (CL) to set up your MetaMask Card. MetaMask does not see or store your personal data.
            </p>
          </div>

          {/* Form Fields */}
          <div className="space-y-5 mt-8">
            {/* Country of residence */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-white/70">
                Country of residence
              </label>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    playTap();
                    setShowCountryDropdown(!showCountryDropdown);
                  }}
                  className="w-full bg-[#16181E] border border-white/10 hover:border-white/20 rounded-2xl px-4 py-3.5 text-sm font-semibold text-white flex items-center justify-between transition-colors"
                >
                  <span>{country}</span>
                  <ChevronDown className="w-4 h-4 text-white/50" />
                </button>

                {showCountryDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-[#1C1F27] border border-white/15 rounded-2xl p-1.5 shadow-2xl z-30 max-h-52 overflow-y-auto no-scrollbar">
                    {countries.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => {
                          playTap();
                          setCountry(c.name);
                          setShowCountryDropdown(false);
                        }}
                        className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-colors ${
                          country === c.name ? 'bg-white/15 text-white' : 'text-white/60 hover:text-white'
                        }`}
                      >
                        <span>{c.name}</span>
                        {c.available && (
                          <span className="text-[10px] text-emerald-400 font-semibold">Available</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Status Note based on Country */}
              {!currentCountryObj.available ? (
                <div className="text-xs text-white/40 pt-1">
                  Card sign-up isn&apos;t available in your country yet.
                </div>
              ) : (
                <div className="text-xs text-emerald-400 pt-1 flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Instant virtual card issuance available in {country}.</span>
                </div>
              )}
            </div>

            {/* Email address */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-white/70">
                Email address
              </label>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#16181E] border border-white/10 focus:border-white/30 rounded-2xl px-4 py-3.5 text-sm font-medium text-white placeholder-white/20 outline-none transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Success Feedback View if Done */}
        {step === 'success' ? (
          <div className="py-8 text-center space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
            <h3 className="text-lg font-bold text-white">Added to Waitlist!</h3>
            <p className="text-xs text-white/60">We will notify you at {email} when your card is ready.</p>
          </div>
        ) : (
          /* Bottom Action CTAs */
          <div className="space-y-3 pt-6">
            <button
              onClick={handleJoinWaitlist}
              disabled={isSubmitting || !email}
              className={`w-full py-4 rounded-full font-bold text-sm tracking-wide transition-all shadow-xl ${
                email && !isSubmitting
                  ? 'bg-white hover:bg-neutral-200 text-black cursor-pointer active:scale-[0.98]'
                  : 'bg-white/20 text-white/40 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-black/40 border-t-black rounded-full animate-spin" />
                  Submitting...
                </span>
              ) : currentCountryObj.available ? (
                'Order MetaMask Card'
              ) : (
                'Join waitlist'
              )}
            </button>

            <button
              onClick={() => {
                playTap();
                onOpenCardDetails?.();
                onClose();
              }}
              className="w-full py-2.5 text-center text-sm font-bold text-white/70 hover:text-white transition-colors"
            >
              I already have a MetaMask Card
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
