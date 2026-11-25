import React, { useState } from 'react';
import { ProductCategory } from '../types';

interface FooterProps {
  onSelectCategory: (category: ProductCategory) => void;
  onOpenSalon: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory, onOpenSalon }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="border-t border-[#E3DBD0] bg-[#EBE4DA]/65 text-[#3A2D22]">
      <div className="mx-auto max-w-[1380px] px-4 sm:px-8 lg:px-14 py-14 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand Column */}
          <div className="md:col-span-4">
            <p className="font-display text-2xl tracking-[0.22em] text-[#1E1915]">VELORA</p>
            <p className="mt-3 text-xs text-[#5C4F43] leading-relaxed max-w-xs">
              Luxury Clothing, Clean Beauty, Natural Skincare &amp; Home Decor. Handcrafted in India
              for Collection No. 04.
            </p>
            <p className="mt-4 text-[11px] tracking-[0.16em] uppercase text-[#7A6B5C] tabular-nums">
              19° 04&apos; N, 72° 52&apos; E · Mumbai
            </p>
          </div>

          {/* Navigation Column */}
          <div className="md:col-span-3 space-y-2.5">
            <p className="text-[11px] font-medium tracking-[0.18em] uppercase text-[#8B6C36]">
              Shop By Category
            </p>
            <ul className="space-y-2 text-xs">
              {(['Clothing', 'Beauty', 'Skin & Scents', 'Home'] as ProductCategory[]).map((cat) => (
                <li key={cat}>
                  <button
                    type="button"
                    onClick={() => onSelectCategory(cat)}
                    className="hover:text-[#A58347] transition-colors cursor-pointer"
                  >
                    {cat}
                  </button>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={onOpenSalon}
                  className="hover:text-[#A58347] transition-colors cursor-pointer"
                >
                  Book a Store Visit
                </button>
              </li>
            </ul>
          </div>

          {/* Stores Column */}
          <div className="md:col-span-2 space-y-2.5 text-xs text-[#5C4F43]">
            <p className="text-[11px] font-medium tracking-[0.18em] uppercase text-[#8B6C36]">
              Our Stores
            </p>
            <p>Kala Ghoda, Mumbai</p>
            <p>Mehrauli, New Delhi</p>
            <p>Lavelle Road, Bengaluru</p>
          </div>

          {/* Correspondence Column */}
          <div className="md:col-span-3">
            <p className="text-[11px] font-medium tracking-[0.18em] uppercase text-[#8B6C36]">
              Updates &amp; Early Access
            </p>
            <p className="mt-2 text-xs text-[#5C4F43]">
              Get updates on new arrivals, festive edits, and private sale previews.
            </p>
            {subscribed ? (
              <p className="mt-4 text-xs font-medium text-[#8B6C36]">
                Thank you! You are subscribed to VELORA updates.
              </p>
            ) : (
              <form onSubmit={handleSubscribe} className="mt-3 flex gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  aria-label="Email address for updates"
                  className="flex-1 min-w-0 rounded-full border border-[#D4C9B8] bg-[#FAF7F2] px-4 py-2 text-xs text-[#1E1915] focus:outline-none focus:border-[#A58347]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-full bg-[#1E1915] hover:bg-[#A58347] text-[#FAF7F2] text-[11px] font-medium tracking-[0.12em] uppercase transition-colors cursor-pointer shrink-0"
                >
                  Join
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[#DCD3C6] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#6B5D50]">
          <span>© 2026 VELORA India. All rights reserved.</span>
          <span>Autumn-Winter Collection · No. 04</span>
        </div>
      </div>
    </footer>
  );
};
