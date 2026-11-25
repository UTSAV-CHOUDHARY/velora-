import React, { useState } from 'react';
import { Menu, Search, ShoppingBag, X } from 'lucide-react';
import { ProductCategory } from '../types';

interface NavbarProps {
  activeCategory: ProductCategory | 'All';
  onSelectNavCategory: (category: ProductCategory | 'All', scrollTarget?: string) => void;
  onOpenSearch: () => void;
  onOpenCart: () => void;
  onOpenSalon: () => void;
  cartCount: number;
}

const NAV_ITEMS: { label: string; category: ProductCategory; target: string }[] = [
  { label: 'CLOTHING', category: 'Clothing', target: 'collection' },
  { label: 'BEAUTY', category: 'Beauty', target: 'collection' },
  { label: 'SKIN & SCENTS', category: 'Skin & Scents', target: 'collection' },
  { label: 'HOME', category: 'Home', target: 'collection' },
];

export const Navbar: React.FC<NavbarProps> = ({
  activeCategory,
  onSelectNavCategory,
  onOpenSearch,
  onOpenCart,
  onOpenSalon,
  cartCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (category: ProductCategory, target: string) => {
    setMobileMenuOpen(false);
    onSelectNavCategory(category, target);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-3 sm:px-6 lg:px-10 pt-3 sm:pt-4 pointer-events-none">
      <div className="mx-auto max-w-[1380px] pointer-events-auto">
        <div className="flex items-center justify-between gap-4 lg:gap-8 rounded-2xl bg-[#FAF7F2]/92 backdrop-blur-md border border-[#E4DDD2] px-4 sm:px-6 lg:px-7 py-2.5 sm:py-3 shadow-[0_8px_30px_rgba(30,25,21,0.06)]">
          {/* Zone 1: Brand Wordmark */}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2.5 text-[#3A2D22] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A58347] rounded-sm"
            aria-label="VELORA Home"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 28 28"
              fill="none"
              aria-hidden="true"
              className="text-[#4A3828] shrink-0"
            >
              <path
                d="M4.5 5.5H9.2L14.2 19.8L19.1 5.5H23.2L15.8 23.5H12.4L4.5 5.5Z"
                stroke="currentColor"
                strokeWidth="1.25"
              />
              <path d="M10.8 5.5L14.1 14.5L17.4 5.5" stroke="#A58347" strokeWidth="1.1" />
            </svg>
            <span className="text-[11px] text-[#A58347]" aria-hidden="true">
              •
            </span>
            <span className="font-display text-[20px] sm:text-[22px] font-medium tracking-[0.22em] text-[#3A2D22] leading-none">
              VELORA
            </span>
          </a>

          {/* Zone 2: Desktop Single-Line Navigation */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-6 lg:gap-9"
          >
            {NAV_ITEMS.map((item) => {
              const isActive = activeCategory === item.category;
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => handleNavClick(item.category, item.target)}
                  className={`relative py-1 text-[11px] font-medium tracking-[0.16em] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A58347] ${
                    isActive
                      ? 'text-[#1E1915]'
                      : 'text-[#5C4F43] hover:text-[#1E1915]'
                  }`}
                >
                  {item.label}
                  <span
                    className={`absolute left-0 right-0 -bottom-0.5 h-[1px] bg-[#A58347] transition-transform duration-200 origin-center ${
                      isActive ? 'scale-x-100' : 'scale-x-0'
                    }`}
                  />
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Search, Bag & Primary CTA */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={onOpenSearch}
              aria-label="Search products"
              className="flex items-center justify-center w-9 h-9 rounded-full text-[#3A2D22] hover:bg-[#EDE6DC] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#A58347]"
            >
              <Search className="w-[17px] h-[17px]" strokeWidth={1.6} />
            </button>

            <button
              type="button"
              onClick={onOpenCart}
              aria-label={`Shopping bag with ${cartCount} items`}
              className="relative flex items-center justify-center w-9 h-9 rounded-full text-[#3A2D22] hover:bg-[#EDE6DC] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#A58347]"
            >
              <ShoppingBag className="w-[17px] h-[17px]" strokeWidth={1.6} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[17px] h-[17px] px-1 rounded-full bg-[#A58347] text-[#FAF7F2] text-[10px] font-semibold flex items-center justify-center tabular-nums">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={onOpenSalon}
              className="hidden sm:inline-flex items-center justify-center px-5 py-2 rounded-full bg-gradient-to-b from-[#B49052] to-[#98763D] hover:from-[#A58347] hover:to-[#876632] text-[#FAF7F2] text-[11px] font-medium tracking-[0.15em] shadow-sm transition-all duration-200 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A58347]"
            >
              BOOK A VISIT
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-full text-[#3A2D22] hover:bg-[#EDE6DC] transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 rounded-2xl bg-[#FAF7F2]/95 backdrop-blur-md border border-[#E4DDD2] p-4 shadow-[0_14px_40px_rgba(30,25,21,0.1)]">
            <nav className="flex flex-col divide-y divide-[#EAE2D7]">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => handleNavClick(item.category, item.target)}
                  className="flex items-center justify-between py-3 text-left text-xs font-medium tracking-[0.16em] text-[#2A211B] hover:text-[#A58347] cursor-pointer"
                >
                  <span>{item.label}</span>
                  <span className="text-[#A58347]">→</span>
                </button>
              ))}
            </nav>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSalon();
              }}
              className="mt-3 w-full py-2.5 rounded-full bg-gradient-to-b from-[#B49052] to-[#98763D] text-[#FAF7F2] text-xs font-medium tracking-[0.15em] cursor-pointer"
            >
              BOOK A VISIT
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
