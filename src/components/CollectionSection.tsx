import React from 'react';
import { Heart, Plus, SlidersHorizontal } from 'lucide-react';
import { CurrencyCode, Product, ProductCategory } from '../types';
import { formatPrice } from '../utils/currency';

export type SortOption = 'featured' | 'price-asc' | 'price-desc';

interface CollectionSectionProps {
  products: Product[];
  allCountByCategory: Record<ProductCategory | 'All', number>;
  activeCategory: ProductCategory | 'All';
  onCategoryChange: (category: ProductCategory | 'All') => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  currency: CurrencyCode;
  onCurrencyChange: (currency: CurrencyCode) => void;
  showSavedOnly: boolean;
  onToggleSavedOnly: () => void;
  wishlistIds: string[];
  onToggleWishlist: (productId: string) => void;
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
  searchQuery: string;
  onClearSearch: () => void;
}

const CATEGORIES: (ProductCategory | 'All')[] = [
  'All',
  'Clothing',
  'Beauty',
  'Skin & Scents',
  'Home',
];

export const CollectionSection: React.FC<CollectionSectionProps> = ({
  products,
  allCountByCategory,
  activeCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  currency,
  onCurrencyChange,
  showSavedOnly,
  onToggleSavedOnly,
  wishlistIds,
  onToggleWishlist,
  onSelectProduct,
  onQuickAdd,
  searchQuery,
  onClearSearch,
}) => {
  return (
    <section
      id="collection"
      className="mx-auto max-w-[1380px] px-4 sm:px-8 lg:px-14 py-16 sm:py-24 border-t border-[#E3DBD0]"
    >
      {/* Editorial Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-[#E3DBD0]">
        <div>
          <p className="text-[11px] tracking-[0.2em] text-[#8B6C36] uppercase font-medium">
            Collection No. 04 · Mumbai &amp; New Delhi
          </p>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl lg:text-5xl font-medium text-[#1E1915] tracking-[-0.01em]">
            Featured Collection
          </h2>
          <p className="mt-2.5 text-sm sm:text-base text-[#5C4F43] max-w-xl">
            Fourteen signature products across pure silk clothing, everyday beauty, natural
            serums &amp; perfumes, and home decor.
          </p>
        </div>

        {/* Utility Strip: Currency, Saved Filter & Sort */}
        <div className="flex flex-wrap items-center gap-3">
          <div
            className="inline-flex items-center rounded-lg bg-[#EAE3D8] p-1"
            role="group"
            aria-label="Currency selector"
          >
            {(['INR', 'USD', 'GBP'] as CurrencyCode[]).map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => onCurrencyChange(code)}
                className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors cursor-pointer tabular-nums ${
                  currency === code
                    ? 'bg-[#FAF7F2] text-[#1E1915] shadow-xs'
                    : 'text-[#5C4F43] hover:text-[#1E1915]'
                }`}
              >
                {code}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={onToggleSavedOnly}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              showSavedOnly
                ? 'bg-[#1E1915] border-[#1E1915] text-[#FAF7F2]'
                : 'bg-[#FAF7F2] border-[#DDD3C5] text-[#3A2D22] hover:border-[#A58347]'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${showSavedOnly ? 'fill-current' : ''}`} />
            <span>Saved ({wishlistIds.length})</span>
          </button>

          <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-[#DDD3C5] bg-[#FAF7F2]">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#8B6C36]" />
            <label htmlFor="collection-sort" className="sr-only">
              Sort products
            </label>
            <select
              id="collection-sort"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="bg-transparent text-xs font-medium text-[#1E1915] focus:outline-none cursor-pointer"
            >
              <option value="featured">Recommended</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Interactive Category Tabs */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {CATEGORIES.map((category) => {
            const isActive = activeCategory === category;
            const count = allCountByCategory[category] ?? 0;
            return (
              <button
                key={category}
                type="button"
                onClick={() => onCategoryChange(category)}
                className={`px-4 py-2 rounded-full text-xs font-medium tracking-[0.06em] transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-[#1E1915] text-[#FAF7F2]'
                    : 'bg-[#FAF7F2] border border-[#E3DBD0] text-[#4A3F35] hover:border-[#A58347] hover:text-[#1E1915]'
                }`}
              >
                {category === 'All' ? 'All Products' : category}{' '}
                <span className="opacity-70 tabular-nums">({count})</span>
              </button>
            );
          })}
        </div>

        {searchQuery.trim() !== '' && (
          <div className="flex items-center gap-2 text-xs text-[#5C4F43]">
            <span>
              Filtering by &ldquo;<strong className="text-[#1E1915]">{searchQuery}</strong>&rdquo;
            </span>
            <button
              type="button"
              onClick={onClearSearch}
              className="underline hover:text-[#A58347] cursor-pointer"
            >
              Reset
            </button>
          </div>
        )}
      </div>

      {/* Product Grid */}
      {products.length === 0 ? (
        <div className="mt-14 rounded-2xl border border-[#E3DBD0] bg-[#FAF7F2] py-16 px-6 text-center">
          <p className="font-display text-2xl text-[#1E1915]">
            No products match your selection
          </p>
          <p className="mt-2 text-sm text-[#5C4F43]">
            Clear your filters or browse all 14 products in the collection.
          </p>
          <button
            type="button"
            onClick={() => {
              onCategoryChange('All');
              onClearSearch();
              if (showSavedOnly) onToggleSavedOnly();
            }}
            className="mt-6 px-6 py-2.5 rounded-full bg-[#1E1915] text-[#FAF7F2] text-xs font-medium tracking-[0.12em] cursor-pointer"
          >
            VIEW ALL PRODUCTS
          </button>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {products.map((product) => {
            const isSaved = wishlistIds.includes(product.id);
            return (
              <article
                key={product.id}
                className="group flex flex-col rounded-2xl bg-[#FAF7F2] border border-[#E5DDD2] overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(30,25,21,0.08)]"
              >
                {/* Uniform 4:3 Studio Product Photography Container */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#EAE2D6]">
                  <button
                    type="button"
                    onClick={() => onSelectProduct(product)}
                    className="block w-full h-full cursor-pointer focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#A58347]"
                    aria-label={`View ${product.name}`}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className={`w-full h-full object-cover ${
                        product.imagePosition || 'object-center'
                      } transition-transform duration-500 group-hover:scale-[1.03]`}
                    />
                  </button>

                  {/* Wishlist Heart Toggle */}
                  <button
                    type="button"
                    onClick={() => onToggleWishlist(product.id)}
                    aria-label={
                      isSaved
                        ? `Remove ${product.name} from saved items`
                        : `Save ${product.name} to wishlist`
                    }
                    className="absolute top-3 right-3 w-9 h-9 rounded-full bg-[#FAF7F2]/90 backdrop-blur-sm border border-[#E3DBD0] flex items-center justify-center text-[#3A2D22] hover:text-[#A58347] transition-colors cursor-pointer"
                  >
                    <Heart
                      className={`w-4 h-4 ${isSaved ? 'fill-[#A58347] text-[#A58347]' : ''}`}
                      strokeWidth={1.6}
                    />
                  </button>

                  {/* Quick Add Overlay Button */}
                  <button
                    type="button"
                    onClick={() => onQuickAdd(product)}
                    className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#1E1915]/90 hover:bg-[#A58347] text-[#FAF7F2] text-[11px] font-medium tracking-[0.12em] backdrop-blur-sm transition-all duration-200 sm:opacity-0 sm:translate-y-1 sm:group-hover:opacity-100 sm:group-hover:translate-y-0 cursor-pointer whitespace-nowrap"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>ADD TO BAG</span>
                  </button>
                </div>

                {/* Clean Unboxed Product Metadata */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-[11px] tracking-[0.12em] uppercase text-[#7A6B5C]">
                      <span>{product.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{product.subCategory}</span>
                      {product.editionNote && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-[#8B6C36]">{product.editionNote}</span>
                        </>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => onSelectProduct(product)}
                      className="mt-1.5 text-left block cursor-pointer"
                    >
                      <h3 className="font-display text-xl sm:text-[22px] font-medium text-[#1E1915] group-hover:text-[#8B6C36] transition-colors leading-snug">
                        {product.name}
                      </h3>
                    </button>

                    <p className="mt-1.5 text-xs sm:text-[13px] text-[#5C4F43] line-clamp-2 leading-relaxed">
                      {product.tagline}
                    </p>
                  </div>

                  <div className="mt-4 pt-3.5 border-t border-[#ECE4D9] flex items-center justify-between gap-3">
                    <span className="text-[15px] font-semibold text-[#1E1915] tabular-nums">
                      {formatPrice(product.priceINR, currency)}
                    </span>

                    <button
                      type="button"
                      onClick={() => onSelectProduct(product)}
                      className="text-[11px] font-medium tracking-[0.14em] uppercase text-[#5C4F43] hover:text-[#1E1915] transition-colors cursor-pointer whitespace-nowrap"
                    >
                      View Details →
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};
