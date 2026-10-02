import React from 'react';

interface CryptoIconProps {
  symbol: string;
  size?: number; // size in px, defaults to 36
  className?: string;
}

export const CryptoIcon: React.FC<CryptoIconProps> = ({
  symbol,
  size = 36,
  className = '',
}) => {
  const sym = symbol.toUpperCase().replace('-PERP', '');

  const renderSvg = () => {
    switch (sym) {
      case 'BTC':
        return (
          <svg viewBox="0 0 32 32" className="w-full h-full">
            <circle cx="16" cy="16" r="16" fill="#F7931A" />
            <path
              fill="#FFFFFF"
              d="M23.189 14.02c.314-2.096-1.283-3.223-3.465-3.975l.708-2.84-1.728-.43-.69 2.765c-.454-.114-.92-.22-1.385-.326l.695-2.783-1.727-.431-.709 2.839c-.376-.086-.745-.17-1.104-.26l.002-.007-2.384-.595-.46 1.846s1.283.294 1.256.312c.7.175.826.638.805 1.006l-.806 3.235c.048.012.11.03.18.057l-.183-.045-1.13 4.532c-.086.212-.303.531-.793.41.018.025-1.256-.313-1.256-.313l-.858 1.978 2.25.561c.418.105.828.215 1.231.318l-.715 2.872 1.727.43.708-2.84c.472.127.93.245 1.378.357l-.706 2.828 1.728.43.715-2.866c2.948.558 5.164.333 6.097-2.333.752-2.146-.037-3.385-1.588-4.192 1.13-.26 1.98-1.003 2.207-2.538zm-3.95 5.537c-.535 2.146-4.152.986-5.325.694l.95-3.81c1.173.293 4.929.872 4.375 3.116zm.536-5.573c-.488 1.954-3.501.962-4.478.718l.862-3.454c.977.244 4.12.7 3.616 2.736z"
            />
          </svg>
        );

      case 'ETH':
        return (
          <svg viewBox="0 0 32 32" className="w-full h-full">
            <circle cx="16" cy="16" r="16" fill="#627EEA" />
            <g fill="#FFFFFF" fillRule="nonzero">
              <path fillOpacity="0.6" d="M16.498 4v8.87l7.497 3.35z" />
              <path d="M16.498 4L9 16.22l7.498-3.35z" />
              <path fillOpacity="0.6" d="M16.498 21.968v6.027L24 17.616z" />
              <path d="M16.498 27.995v-6.028L9 17.616z" />
              <path fillOpacity="0.2" d="M16.498 20.573l7.497-4.353-7.497-3.349z" />
              <path fillOpacity="0.6" d="M9 16.22l7.498 4.353v-7.702z" />
            </g>
          </svg>
        );

      case 'SOL':
        return (
          <svg viewBox="0 0 32 32" className="w-full h-full">
            <circle cx="16" cy="16" r="16" fill="#000000" />
            <defs>
              <linearGradient id="sol-g1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00FFA3" />
                <stop offset="100%" stopColor="#DC1FFF" />
              </linearGradient>
            </defs>
            <g fill="url(#sol-g1)">
              <path d="M7.4 21.6c.2-.2.5-.3.8-.3h15.2c.4 0 .7.5.5.9l-1.8 1.8c-.2.2-.5.3-.8.3H6.1c-.4 0-.7-.5-.5-.9l1.8-1.8z" />
              <path d="M7.4 7.6c.2-.2.5-.3.8-.3h15.2c.4 0 .7.5.5.9l-1.8 1.8c-.2.2-.5.3-.8.3H6.1c-.4 0-.7-.5-.5-.9l1.8-1.8z" />
              <path d="M24.6 14.6c-.2-.2-.5-.3-.8-.3H8.6c-.4 0-.7.5-.5.9l1.8 1.8c.2.2.5.3.8.3h15.2c.4 0 .7-.5.5-.9l-1.8-1.8z" />
            </g>
          </svg>
        );

      case 'BNB':
        return (
          <svg viewBox="0 0 32 32" className="w-full h-full">
            <circle cx="16" cy="16" r="16" fill="#F3BA2F" />
            <path
              fill="#FFFFFF"
              d="M16 7l3.6 3.6-1.8 1.8L16 10.6l-1.8 1.8-1.8-1.8L16 7zm-5.4 5.4l1.8 1.8L10.6 16l1.8 1.8-1.8 1.8L7 16l3.6-3.6zm10.8 0L25 16l-3.6 3.6-1.8-1.8 1.8-1.8-1.8-1.8 1.8-1.8zm-5.4 1.8l1.8 1.8L16 17.8l-1.8-1.8 1.8-1.8zM16 21.4l1.8 1.8L16 25l-3.6-3.6 1.8-1.8 1.8 1.8z"
            />
          </svg>
        );

      case 'XRP':
        return (
          <svg viewBox="0 0 32 32" className="w-full h-full">
            <circle cx="16" cy="16" r="16" fill="#23292F" />
            <path
              fill="#FFFFFF"
              d="M23.3 9h2.3l-5.7 5.6c-2.2 2.1-5.7 2.1-7.9 0L6.4 9h2.3l4.6 4.5c1.5 1.5 3.9 1.5 5.4 0L23.3 9zm-14.7 14h-2.3l5.7-5.6c2.2-2.1 5.7-2.1 7.9 0l5.6 5.6h-2.3l-4.6-4.5c-1.5-1.5-3.9-1.5-5.4 0L8.6 23z"
            />
          </svg>
        );

      case 'DOGE':
        return (
          <svg viewBox="0 0 32 32" className="w-full h-full">
            <circle cx="16" cy="16" r="16" fill="#C2A633" />
            <path
              fill="#FFFFFF"
              d="M13.2 8.5h4.6c4.5 0 7.2 2.8 7.2 7.5s-2.7 7.5-7.2 7.5h-4.6V8.5zm3.4 12.3h1.2c2.6 0 4.1-1.7 4.1-4.8 0-3.1-1.5-4.8-4.1-4.8h-1.2v9.6zM11 15h6v2h-6v-2z"
            />
          </svg>
        );

      case 'SUI':
        return (
          <svg viewBox="0 0 32 32" className="w-full h-full">
            <circle cx="16" cy="16" r="16" fill="#4DA2FF" />
            <path
              fill="#FFFFFF"
              d="M16 6.5c-2.1 3.2-6.5 8.9-6.5 13.5 0 4.1 2.9 6.5 6.5 6.5s6.5-2.4 6.5-6.5c0-4.6-4.4-10.3-6.5-13.5zm-1.8 17.5c-2.3-.4-3.7-2.1-3.7-4.4 0-1.7 1-4.2 2.4-6.4 1.1 2.6 2.8 5.7 2.8 7.8 0 1.6-.7 2.7-1.5 3z"
            />
          </svg>
        );

      case 'AVAX':
        return (
          <svg viewBox="0 0 32 32" className="w-full h-full">
            <circle cx="16" cy="16" r="16" fill="#E84142" />
            <path
              fill="#FFFFFF"
              d="M17.4 7.8c-.6-1-2.1-1-2.8 0L7.5 20.3c-.6 1.1.1 2.4 1.4 2.4h3.6c.8 0 1.5-.4 1.9-1.1l1.6-2.8h-2.1l2.1-3.6 1.5 2.6c.4.7 1.1 1.1 1.9 1.1h5.2c1.3 0 2-1.3 1.4-2.4l-7.2-12.7z"
            />
          </svg>
        );

      case 'LINK':
        return (
          <svg viewBox="0 0 32 32" className="w-full h-full">
            <circle cx="16" cy="16" r="16" fill="#375BD2" />
            <path
              fill="#FFFFFF"
              fillRule="evenodd"
              d="M16 7.2l7.6 4.4v8.8L16 24.8l-7.6-4.4v-8.8L16 7.2zm4.4 11.2V13.6L16 11l-4.4 2.6v4.8L16 21l4.4-2.6z"
            />
          </svg>
        );

      case 'ADA':
        return (
          <svg viewBox="0 0 32 32" className="w-full h-full">
            <circle cx="16" cy="16" r="16" fill="#0033AD" />
            <circle cx="16" cy="16" r="4.2" fill="#FFFFFF" />
            <circle cx="16" cy="8.2" r="1.6" fill="#FFFFFF" />
            <circle cx="16" cy="23.8" r="1.6" fill="#FFFFFF" />
            <circle cx="8.2" cy="16" r="1.6" fill="#FFFFFF" />
            <circle cx="23.8" cy="16" r="1.6" fill="#FFFFFF" />
            <circle cx="10.5" cy="10.5" r="1.2" fill="#FFFFFF" />
            <circle cx="21.5" cy="21.5" r="1.2" fill="#FFFFFF" />
            <circle cx="10.5" cy="21.5" r="1.2" fill="#FFFFFF" />
            <circle cx="21.5" cy="10.5" r="1.2" fill="#FFFFFF" />
          </svg>
        );

      case 'PEPE':
        return (
          <svg viewBox="0 0 32 32" className="w-full h-full">
            <circle cx="16" cy="16" r="16" fill="#3D9B3D" />
            {/* Stylized high-end Pepe Frog vector icon */}
            <path
              d="M8 18c0-5 3.5-9 8-9s8 4 8 9c0 4-3 6.5-8 6.5S8 22 8 18z"
              fill="#4ADE80"
            />
            {/* Eyes */}
            <circle cx="12" cy="13" r="3.2" fill="#FFFFFF" />
            <circle cx="12.5" cy="13" r="1.6" fill="#1E293B" />
            <circle cx="20" cy="13" r="3.2" fill="#FFFFFF" />
            <circle cx="19.5" cy="13" r="1.6" fill="#1E293B" />
            {/* Smile */}
            <path
              d="M10.5 19.5c2 2 9 2 11 0"
              stroke="#064E3B"
              strokeWidth="1.8"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        );

      case 'NEAR':
        return (
          <svg viewBox="0 0 32 32" className="w-full h-full">
            <circle cx="16" cy="16" r="16" fill="#000000" />
            <path
              fill="#FFFFFF"
              d="M21.8 8.6L16.2 16.8c-.3.4-.8.7-1.3.7-.7 0-1.3-.6-1.3-1.3V9.5c0-.6-.5-1.1-1.1-1.1s-1.1.5-1.1 1.1v13c0 .6.5 1.1 1.1 1.1.4 0 .7-.2.9-.5l5.6-8.2c.3-.4.8-.7 1.3-.7.7 0 1.3.6 1.3 1.3v6.7c0 .6.5 1.1 1.1 1.1s1.1-.5 1.1-1.1V9.7c0-.6-.5-1.1-1.1-1.1-.4 0-.7.2-.9.5z"
            />
          </svg>
        );

      case 'ARB':
        return (
          <svg viewBox="0 0 32 32" className="w-full h-full">
            <circle cx="16" cy="16" r="16" fill="#28A0F0" />
            <path
              fill="#FFFFFF"
              d="M15.4 7.2c.4-.6 1.1-.6 1.5 0l8.7 13.5c.4.6.1 1.3-.6 1.3h-3.2l-6.1-9.5-2.8 4.3 2 3.1h-3.6l-3.9 6.1c-.4.6-1.1.6-1.5 0l-3.3-5.2c-.4-.6-.1-1.3.6-1.3h3.2l5.7-8.9 3.3-3.4z"
            />
          </svg>
        );

      case 'OP':
        return (
          <svg viewBox="0 0 32 32" className="w-full h-full">
            <circle cx="16" cy="16" r="16" fill="#FF0420" />
            {/* Crisp white 'OP' text */}
            <text
              x="16"
              y="20.5"
              fill="#FFFFFF"
              fontSize="12.5"
              fontWeight="900"
              fontFamily="system-ui, -apple-system, sans-serif"
              textAnchor="middle"
              letterSpacing="-0.5"
            >
              OP
            </text>
          </svg>
        );

      case 'SHIB':
        return (
          <svg viewBox="0 0 32 32" className="w-full h-full">
            <circle cx="16" cy="16" r="16" fill="#FFA409" />
            <path
              fill="#FFFFFF"
              d="M16 8l3 5 4-2-1 6 3 2-3 3 1 4-5-1-2 2-2-2-5 1 1-4-3-3 3-2-1-6 4 2 3-5z"
            />
            <circle cx="13" cy="16" r="1.2" fill="#1F2937" />
            <circle cx="19" cy="16" r="1.2" fill="#1F2937" />
            <polygon points="16,19 14.5,17.5 17.5,17.5" fill="#1F2937" />
          </svg>
        );

      case 'DOT':
        return (
          <svg viewBox="0 0 32 32" className="w-full h-full">
            <circle cx="16" cy="16" r="16" fill="#E6007A" />
            <circle cx="16" cy="11.5" r="4.2" fill="#FFFFFF" />
            <circle cx="16" cy="22.5" r="2.4" fill="#FFFFFF" />
          </svg>
        );

      case 'LTC':
        return (
          <svg viewBox="0 0 32 32" className="w-full h-full">
            <circle cx="16" cy="16" r="16" fill="#345D9D" />
            <path
              fill="#FFFFFF"
              d="M14.5 8h3.2v9.8h4.5v3.2h-7.7V8zm-2.8 7.2l1.6-.7.7-1.8 1.8-.7-.6 1.8 2.8-1.2-.6 1.6-2.9 1.2-.8 2.1-1.6.7.7-1.8-1.7.8.6-2z"
            />
          </svg>
        );

      case 'UNI':
        return (
          <svg viewBox="0 0 32 32" className="w-full h-full">
            <circle cx="16" cy="16" r="16" fill="#FF007A" />
            <path
              fill="#FFFFFF"
              d="M11 10c2-3 8-3 10 1 1 2 2 5 0 8-1 1-3 3-2 5-3-1-5-2-6-4-1 2-3 3-4 1-1-1-1-3 0-5 1-2 1-4 2-6z"
            />
          </svg>
        );

      case 'APT':
        return (
          <svg viewBox="0 0 32 32" className="w-full h-full">
            <circle cx="16" cy="16" r="16" fill="#1A2D3A" />
            <g stroke="#2DD4BF" strokeWidth="2.4" strokeLinecap="round" fill="none">
              <path d="M10 22l6-13 6 13" />
              <path d="M12.5 17h7" />
            </g>
          </svg>
        );

      case 'USDC':
        return (
          <svg viewBox="0 0 32 32" className="w-full h-full">
            <circle cx="16" cy="16" r="16" fill="#2775CA" />
            <circle cx="16" cy="16" r="12" fill="none" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.4" />
            <path
              fill="#FFFFFF"
              d="M17.5 11.2c-2.4-.4-4.5.6-4.5 2.5 0 3 5.5 2.2 5.5 4.5 0 1.2-1 2-2.8 1.8-1.5-.2-2.5-.9-3.2-1.7l-1.2 1.8c1 1.1 2.4 1.8 4.2 2v1.9h2v-1.9c2.4-.4 4.5-.8 4.5-2.8 0-3-5.5-2.3-5.5-4.5 0-1.1.9-1.8 2.6-1.6 1.4.2 2.2.8 2.8 1.5l1.2-1.8c-.8-1-2.1-1.7-3.6-1.9v-1.8h-2v1.9z"
            />
          </svg>
        );

      case 'USDT':
        return (
          <svg viewBox="0 0 32 32" className="w-full h-full">
            <circle cx="16" cy="16" r="16" fill="#26A17B" />
            <path
              fill="#FFFFFF"
              d="M17.8 14.8v-2.2h5.2V9H9v3.6h5.2v2.2c-4.2.3-7.2 1.3-7.2 2.5s3 2.2 7.2 2.5v5.7h3.6v-5.7c4.2-.3 7.2-1.3 7.2-2.5s-3-2.2-7.2-2.5zm0 3.3c-2.6.2-5.4.2-6.8-.2.9-.4 2.8-.7 5-.7s4.1.3 5 .7c-1.4.4-4.2.4-6.8.2h3.6z"
            />
          </svg>
        );

      case 'VRAX':
        return (
          <svg viewBox="0 0 32 32" className="w-full h-full">
            <circle cx="16" cy="16" r="16" fill="#FCE7D2" />
            {/* Anime fox/cat mascot matching screenshot */}
            <circle cx="16" cy="16" r="12" fill="#F97316" />
            <polygon points="9,10 13,4 15,10" fill="#EA580C" />
            <polygon points="23,10 19,4 17,10" fill="#EA580C" />
            <circle cx="12.5" cy="15.5" r="1.8" fill="#FFFFFF" />
            <circle cx="12.5" cy="15.5" r="1" fill="#18181B" />
            <circle cx="19.5" cy="15.5" r="1.8" fill="#FFFFFF" />
            <circle cx="19.5" cy="15.5" r="1" fill="#18181B" />
            <path d="M14 18.5 Q16 20 18 18.5" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            {/* Small green leaf badge on bottom right */}
            <circle cx="23" cy="23" r="5" fill="#22C55E" />
            <path d="M22 24c1.5-2 3-1.5 2.5 0-.5 1-2 1.5-2.5 0z" fill="#FFFFFF" />
          </svg>
        );

      case 'E/ACC':
      case 'EACC':
        return (
          <svg viewBox="0 0 32 32" className="w-full h-full">
            <circle cx="16" cy="16" r="16" fill="#1E3A8A" />
            {/* Blue celestial sphere with cyan hyperspeed rocket streak */}
            <circle cx="16" cy="16" r="10" fill="#3B82F6" />
            <path d="M8 24 L24 8" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
            <polygon points="24,8 20,9 23,12" fill="#38BDF8" />
            <circle cx="16" cy="16" r="4" fill="#93C5FD" opacity="0.8" />
            {/* Small cyan badge */}
            <circle cx="23" cy="23" r="5" fill="#06B6D4" />
            <rect x="21" y="22.5" width="4" height="1.5" fill="#FFFFFF" rx="0.5" />
          </svg>
        );

      case 'REVEN':
        return (
          <svg viewBox="0 0 32 32" className="w-full h-full">
            <circle cx="16" cy="16" r="16" fill="#1C1917" />
            {/* Stylized golden lion beast emblem */}
            <circle cx="16" cy="16" r="10" fill="#78350F" />
            <path d="M12 12c2-2 6-2 8 0 2 3 0 7-4 8-4-1-6-5-4-8z" fill="#F59E0B" />
            <circle cx="13.5" cy="14" r="1" fill="#FFFFFF" />
            <circle cx="18.5" cy="14" r="1" fill="#FFFFFF" />
            {/* Small green leaf badge */}
            <circle cx="23" cy="23" r="5" fill="#22C55E" />
            <path d="M22 24c1.5-2 3-1.5 2.5 0-.5 1-2 1.5-2.5 0z" fill="#FFFFFF" />
          </svg>
        );

      case 'HUMA':
        return (
          <svg viewBox="0 0 32 32" className="w-full h-full">
            <circle cx="16" cy="16" r="16" fill="#581C87" />
            {/* Magenta/violet geometric ribbon */}
            <path d="M10 16a6 6 0 0 1 12 0c0 4-6 9-6 9s-6-5-6-9z" fill="#D946EF" />
            <circle cx="16" cy="15" r="3" fill="#FFFFFF" />
            {/* Small yellow cube badge */}
            <circle cx="23" cy="23" r="5" fill="#EAB308" />
            <rect x="21" y="21" width="4" height="4" fill="#713F12" rx="0.5" />
          </svg>
        );

      case 'CT':
        return (
          <svg viewBox="0 0 32 32" className="w-full h-full">
            <circle cx="16" cy="16" r="16" fill="#854D0E" />
            <circle cx="16" cy="16" r="12" fill="#EAB308" />
            <text x="16" y="21" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="900" fontFamily="sans-serif">
              C
            </text>
            {/* Small yellow cube badge */}
            <circle cx="23" cy="23" r="5" fill="#F59E0B" />
            <rect x="21" y="21" width="4" height="4" fill="#FFFFFF" rx="0.5" />
          </svg>
        );

      case 'XDP':
        return (
          <svg viewBox="0 0 32 32" className="w-full h-full">
            <circle cx="16" cy="16" r="16" fill="#0C4A6E" />
            <circle cx="16" cy="16" r="10" fill="#0284C7" />
            <ellipse cx="16" cy="16" rx="12" ry="4" fill="none" stroke="#38BDF8" strokeWidth="1.8" transform="rotate(-25 16 16)" />
            {/* Small blue badge */}
            <circle cx="23" cy="23" r="5" fill="#2563EB" />
            <rect x="21" y="22.5" width="4" height="1.5" fill="#FFFFFF" rx="0.5" />
          </svg>
        );

      case 'TRUMP':
        return (
          <svg viewBox="0 0 32 32" className="w-full h-full">
            <circle cx="16" cy="16" r="16" fill="#1E293B" />
            <circle cx="16" cy="16" r="11" fill="#0F172A" stroke="#334155" strokeWidth="1" />
            <text x="16" y="20.5" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="900" fontFamily="monospace">
              TP
            </text>
            {/* Small blue badge */}
            <circle cx="23" cy="23" r="5" fill="#3B82F6" />
            <rect x="21" y="22.5" width="4" height="1.5" fill="#FFFFFF" rx="0.5" />
          </svg>
        );

      case 'SPCXB':
        return (
          <svg viewBox="0 0 32 32" className="w-full h-full">
            <circle cx="16" cy="16" r="16" fill="#0F172A" />
            {/* SpaceX constellation launch rocket */}
            <path d="M16 7l3 7h-6z" fill="#E2E8F0" />
            <circle cx="16" cy="18" r="1.5" fill="#38BDF8" />
            <path d="M10 23c2-2 4-2 6 0 2-2 4-2 6 0" stroke="#F97316" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            {/* Small yellow cube badge */}
            <circle cx="23" cy="23" r="5" fill="#EAB308" />
            <rect x="21" y="21" width="4" height="4" fill="#FFFFFF" rx="0.5" />
          </svg>
        );

      case 'ORB':
        return (
          <svg viewBox="0 0 32 32" className="w-full h-full">
            <circle cx="16" cy="16" r="16" fill="#2E1065" />
            <circle cx="16" cy="16" r="10" fill="#7C3AED" />
            <circle cx="14" cy="13" r="3" fill="#C4B5FD" opacity="0.8" />
            {/* Small green leaf badge */}
            <circle cx="23" cy="23" r="5" fill="#22C55E" />
            <path d="M22 24c1.5-2 3-1.5 2.5 0-.5 1-2 1.5-2.5 0z" fill="#FFFFFF" />
          </svg>
        );

      case 'BIRD':
        return (
          <svg viewBox="0 0 32 32" className="w-full h-full">
            <circle cx="16" cy="16" r="16" fill="#0284C7" />
            <path d="M10 18c4 0 7-3 9-8 0 4 3 6 5 6-3 4-8 6-14 2z" fill="#FFFFFF" />
          </svg>
        );

      case 'MEGA':
        return (
          <svg viewBox="0 0 32 32" className="w-full h-full">
            <circle cx="16" cy="16" r="16" fill="#312E81" />
            <path d="M9 22L12 10L16 16L20 10L23 22H19.5L18 16.5L16 19.5L14 16.5L12.5 22H9Z" fill="#818CF8" />
          </svg>
        );

      case 'PURR':
        return (
          <svg viewBox="0 0 32 32" className="w-full h-full">
            <circle cx="16" cy="16" r="16" fill="#FDF2F8" />
            {/* Cute pink anime cat */}
            <polygon points="9,13 11,6 15,10" fill="#F472B6" />
            <polygon points="23,13 21,6 17,10" fill="#F472B6" />
            <circle cx="16" cy="17" r="8" fill="#FBCFE8" />
            <circle cx="13" cy="16" r="1.5" fill="#831843" />
            <circle cx="19" cy="16" r="1.5" fill="#831843" />
            <path d="M15 19q1 1 2 0" stroke="#831843" strokeWidth="1.2" fill="none" />
          </svg>
        );

      case 'ZK':
        return (
          <svg viewBox="0 0 32 32" className="w-full h-full">
            <circle cx="16" cy="16" r="16" fill="#18181B" />
            <path d="M9 16l5-5v3h8v4h-8v3z" fill="#3B82F6" />
            <path d="M23 16l-5 5v-3h-8v-4h8v-3z" fill="#60A5FA" />
          </svg>
        );

      case 'WIF':
        return (
          <svg viewBox="0 0 32 32" className="w-full h-full">
            <circle cx="16" cy="16" r="16" fill="#D97706" />
            {/* Doge head */}
            <circle cx="16" cy="18" r="8" fill="#FDE68A" />
            <circle cx="13.5" cy="17.5" r="1.2" fill="#1C1917" />
            <circle cx="18.5" cy="17.5" r="1.2" fill="#1C1917" />
            <ellipse cx="16" cy="20.5" rx="2" ry="1.2" fill="#78350F" />
            {/* Famous pink woven beanie hat! */}
            <path d="M9 14 C10 8, 22 8, 23 14 Z" fill="#EC4899" />
            <circle cx="16" cy="8" r="2" fill="#F472B6" />
          </svg>
        );

      case 'RESC':
        return (
          <svg viewBox="0 0 32 32" className="w-full h-full">
            <circle cx="16" cy="16" r="16" fill="#15803D" />
            <path d="M16 7L23 11V17C23 21 16 25 16 25S9 21 9 17V11L16 7Z" fill="#86EFAC" />
          </svg>
        );

      case 'ONDO':
        return (
          <svg viewBox="0 0 32 32" className="w-full h-full">
            <circle cx="16" cy="16" r="16" fill="#0F172A" />
            <circle cx="16" cy="16" r="8" fill="none" stroke="#38BDF8" strokeWidth="3" />
            <circle cx="16" cy="16" r="3" fill="#38BDF8" />
          </svg>
        );

      case 'PAXG':
        return (
          <svg viewBox="0 0 32 32" className="w-full h-full">
            <circle cx="16" cy="16" r="16" fill="#D97706" />
            <circle cx="16" cy="16" r="11" fill="#F59E0B" stroke="#FDE68A" strokeWidth="1.5" />
            <text x="16" y="20.5" textAnchor="middle" fill="#78350F" fontSize="10" fontWeight="900" fontFamily="sans-serif">
              AU
            </text>
          </svg>
        );

      case 'CHZ':
        return (
          <svg viewBox="0 0 32 32" className="w-full h-full">
            <circle cx="16" cy="16" r="16" fill="#DC2626" />
            <path d="M16 7c2 3 5 5 5 9 0 3.5-2.5 6-5 6s-5-2.5-5-6c0-4 3-6 5-9z" fill="#FFFFFF" />
          </svg>
        );

      case 'RENDER':
        return (
          <svg viewBox="0 0 32 32" className="w-full h-full">
            <circle cx="16" cy="16" r="16" fill="#E11D48" />
            <circle cx="16" cy="16" r="10" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeDasharray="6 3" />
            <circle cx="16" cy="16" r="4" fill="#FFFFFF" />
          </svg>
        );

      default:
        return (
          <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-extrabold text-[11px] shadow-sm">
            {sym.slice(0, 3)}
          </div>
        );
    }
  };

  return (
    <div
      className={`inline-flex items-center justify-center shrink-0 rounded-full overflow-hidden shadow-sm ${className}`}
      style={{ width: size, height: size }}
    >
      {renderSvg()}
    </div>
  );
};
