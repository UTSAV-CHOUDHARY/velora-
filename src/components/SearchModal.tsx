import React, { useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { CurrencyCode, Product } from '../types';
import { formatPrice } from '../utils/currency';

interface SearchModalProps {
  isOpen: boolean;
  query: string;
  onQueryChange: (val: string) => void;
  products: Product[];
  currency: CurrencyCode;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  query,
  onQueryChange,
  products,
  currency,
  onClose,
  onSelectProduct,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const t = window.setTimeout(() => inputRef.current?.focus(), 60);
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const trimmed = query.trim().toLowerCase();
  const matches = trimmed
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(trimmed) ||
          p.category.toLowerCase().includes(trimmed) ||
          p.subCategory.toLowerCase().includes(trimmed) ||
          p.tagline.toLowerCase().includes(trimmed) ||
          p.description.toLowerCase().includes(trimmed)
      )
    : products.slice(0, 6);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-[#1E1915]/50 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label="Search VELORA Collection"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-2xl bg-[#FAF7F2] border border-[#E3DBD0] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[#E5DDD2]">
          <Search className="w-4 h-4 text-[#8B6C36] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search silk gowns, saffron serum, oud perfume, lipstick..."
            className="flex-1 bg-transparent text-sm text-[#1E1915] placeholder:text-[#8B7D6E] focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => onQueryChange('')}
              className="text-xs text-[#5C4F43] hover:text-[#1E1915] cursor-pointer"
            >
              Clear
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="p-1.5 rounded-full hover:bg-[#EDE6DC] text-[#3A2D22] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-3">
          <p className="px-3 py-1.5 text-[10px] tracking-[0.18em] uppercase text-[#7A6B5C]">
            {trimmed ? `Results (${matches.length})` : 'Popular Creations'}
          </p>

          {matches.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-[#5C4F43]">
              No pieces found for &ldquo;{query}&rdquo;.
            </p>
          ) : (
            <div className="divide-y divide-[#EFE8DD]">
              {matches.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => {
                    onSelectProduct(product);
                    onClose();
                  }}
                  className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-[#F1EAE0] transition-colors text-left cursor-pointer"
                >
                  <div className="w-14 h-12 rounded-lg overflow-hidden bg-[#EAE2D6] shrink-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className={`w-full h-full object-cover ${product.imagePosition || 'object-center'}`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] tracking-[0.14em] uppercase text-[#8B6C36]">
                      {product.category} · {product.subCategory}
                    </p>
                    <p className="font-display text-lg font-medium text-[#1E1915] truncate">
                      {product.name}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-[#1E1915] tabular-nums shrink-0">
                    {formatPrice(product.priceINR, currency)}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
