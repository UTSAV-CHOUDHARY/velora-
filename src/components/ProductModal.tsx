import React, { useEffect, useState } from 'react';
import { Check, Heart, Minus, Plus, X } from 'lucide-react';
import { CurrencyCode, Product } from '../types';
import { formatPrice } from '../utils/currency';

interface ProductModalProps {
  product: Product | null;
  currency: CurrencyCode;
  isSaved: boolean;
  onClose: () => void;
  onToggleWishlist: (productId: string) => void;
  onAddToBag: (product: Product, variantLabel: string, unitPriceINR: number, quantity: number) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  currency,
  isSaved,
  onClose,
  onToggleWishlist,
  onAddToBag,
}) => {
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    setSelectedVariantIdx(0);
    setQuantity(1);
    setJustAdded(false);
  }, [product?.id]);

  useEffect(() => {
    if (!product) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [product, onClose]);

  if (!product) return null;

  const variant = product.variants[selectedVariantIdx] ?? product.variants[0];
  const unitPriceINR = product.priceINR + (variant?.priceDeltaINR ?? 0);

  const handleAdd = () => {
    onAddToBag(product, variant.label, unitPriceINR, quantity);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1800);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#1E1915]/55 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdp-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#FAF7F2] border border-[#E3DBD0] shadow-[0_24px_70px_rgba(30,25,21,0.28)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close product details"
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-[#FAF7F2]/90 border border-[#DDD3C5] flex items-center justify-center text-[#1E1915] hover:bg-[#EDE6DC] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12">
          {/* Left Photography Frame */}
          <div className="md:col-span-6 bg-[#ECE4D8] flex flex-col">
            <div className="aspect-[4/3] md:aspect-auto md:flex-1 w-full overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                referrerPolicy="no-referrer"
                className={`w-full h-full object-cover ${product.imagePosition || 'object-center'}`}
              />
            </div>
          </div>

          {/* Right Contiguous Purchase Module */}
          <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-[11px] tracking-[0.14em] uppercase text-[#7A6B5C]">
                <span>{product.category}</span>
                <span aria-hidden="true">·</span>
                <span>{product.sku}</span>
                <span aria-hidden="true">·</span>
                <span className="text-[#8B6C36]">Ready to Ship</span>
              </div>

              <h2
                id="pdp-title"
                className="mt-2 font-display text-3xl sm:text-[34px] font-medium text-[#1E1915] leading-tight"
              >
                {product.name}
              </h2>

              <p className="mt-2 text-xl font-semibold text-[#1E1915] tabular-nums">
                {formatPrice(unitPriceINR, currency)}
                <span className="ml-2 text-xs font-normal text-[#6B5D50]">
                  (Inclusive of all taxes)
                </span>
              </p>

              <p className="mt-4 text-sm text-[#4A3F35] leading-relaxed">{product.description}</p>

              {/* Variant Selector */}
              <div className="mt-6">
                <p className="text-[11px] font-medium tracking-[0.14em] uppercase text-[#5C4F43]">
                  Select Size / Option
                </p>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {product.variants.map((v, idx) => {
                    const selected = idx === selectedVariantIdx;
                    return (
                      <button
                        key={v.label}
                        type="button"
                        onClick={() => setSelectedVariantIdx(idx)}
                        className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium border transition-colors cursor-pointer whitespace-nowrap ${
                          selected
                            ? 'bg-[#1E1915] border-[#1E1915] text-[#FAF7F2]'
                            : 'bg-[#FAF7F2] border-[#DDD3C5] text-[#3A2D22] hover:border-[#A58347]'
                        }`}
                      >
                        {v.swatchHex && (
                          <span
                            className="w-3 h-3 rounded-full border border-black/15 shrink-0"
                            style={{ backgroundColor: v.swatchHex }}
                          />
                        )}
                        <span>{v.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Craft Provenance */}
              <div className="mt-6 pt-5 border-t border-[#E6DDD1]">
                <p className="text-[11px] font-medium tracking-[0.14em] uppercase text-[#5C4F43]">
                  Craft &amp; Details
                </p>
                <ul className="mt-2.5 space-y-1.5 text-xs text-[#4A3F35]">
                  {product.craftDetails.map((detail) => (
                    <li key={detail} className="flex items-start gap-2">
                      <span className="text-[#A58347] mt-0.5" aria-hidden="true">
                        —
                      </span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Purchase Controls */}
            <div className="mt-8 pt-5 border-t border-[#E6DDD1] flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center rounded-full border border-[#DDD3C5] bg-[#FAF7F2]">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="w-9 h-10 flex items-center justify-center text-[#3A2D22] hover:text-[#A58347] cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-7 text-center text-xs font-semibold tabular-nums">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                  aria-label="Increase quantity"
                  className="w-9 h-10 flex items-center justify-center text-[#3A2D22] hover:text-[#A58347] cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAdd}
                className="flex-1 min-w-[160px] py-3 px-6 rounded-full bg-[#1E1915] hover:bg-[#A58347] text-[#FAF7F2] text-xs font-medium tracking-[0.15em] uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
              >
                {justAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>ADDED TO BAG</span>
                  </>
                ) : (
                  <span>
                    ADD TO BAG · {formatPrice(unitPriceINR * quantity, currency)}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => onToggleWishlist(product.id)}
                aria-label={isSaved ? 'Remove from saved items' : 'Save to wishlist'}
                className="w-11 h-11 rounded-full border border-[#DDD3C5] bg-[#FAF7F2] hover:border-[#A58347] flex items-center justify-center text-[#3A2D22] cursor-pointer"
              >
                <Heart
                  className={`w-4 h-4 ${isSaved ? 'fill-[#A58347] text-[#A58347]' : ''}`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
