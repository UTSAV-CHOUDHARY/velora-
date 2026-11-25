import { useEffect, useMemo, useState } from 'react';
import { Check, ShoppingBag } from 'lucide-react';
import { CartDrawer } from './components/CartDrawer';
import { CollectionSection, SortOption } from './components/CollectionSection';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { MaisonSection } from './components/MaisonSection';
import { Navbar } from './components/Navbar';
import { ProductModal } from './components/ProductModal';
import { SalonModal } from './components/SalonModal';
import { SearchModal } from './components/SearchModal';
import { PRODUCTS } from './data/products';
import { CartItem, CurrencyCode, Product, ProductCategory } from './types';

const STORAGE_CART_KEY = 'velora_in_cart_v2';
const STORAGE_WISHLIST_KEY = 'velora_in_wishlist_v2';
const STORAGE_CURRENCY_KEY = 'velora_in_currency_v2';

export default function App() {
  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'All'>('All');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [currency, setCurrency] = useState<CurrencyCode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CURRENCY_KEY);
      if (saved === 'INR' || saved === 'USD' || saved === 'GBP') return saved;
    } catch {
      // ignore storage errors
    }
    return 'INR';
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CART_KEY);
      if (saved) return JSON.parse(saved) as CartItem[];
    } catch {
      // ignore
    }
    return [];
  });

  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_WISHLIST_KEY);
      if (saved) return JSON.parse(saved) as string[];
    } catch {
      // ignore
    }
    return [];
  });

  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSalonOpen, setIsSalonOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CART_KEY, JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_WISHLIST_KEY, JSON.stringify(wishlistIds));
    } catch {
      // ignore
    }
  }, [wishlistIds]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CURRENCY_KEY, currency);
    } catch {
      // ignore
    }
  }, [currency]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 2800);
  };

  const countByCategory = useMemo(() => {
    const counts: Record<ProductCategory | 'All', number> = {
      All: PRODUCTS.length,
      Clothing: 0,
      Beauty: 0,
      'Skin & Scents': 0,
      Home: 0,
    };
    for (const p of PRODUCTS) {
      counts[p.category] += 1;
    }
    return counts;
  }, []);

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = PRODUCTS.filter((p) => {
      if (activeCategory !== 'All' && p.category !== activeCategory) return false;
      if (showSavedOnly && !wishlistIds.includes(p.id)) return false;
      if (
        q &&
        !p.name.toLowerCase().includes(q) &&
        !p.category.toLowerCase().includes(q) &&
        !p.subCategory.toLowerCase().includes(q) &&
        !p.tagline.toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });

    return [...list].sort((a, b) => {
      if (sortBy === 'price-asc') return a.priceINR - b.priceINR;
      if (sortBy === 'price-desc') return b.priceINR - a.priceINR;
      return a.featuredOrder - b.featuredOrder;
    });
  }, [activeCategory, showSavedOnly, wishlistIds, searchQuery, sortBy]);

  const totalBagCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const handleToggleWishlist = (productId: string) => {
    setWishlistIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const handleAddToBag = (
    product: Product,
    variantLabel: string,
    unitPriceINR: number,
    quantity = 1
  ) => {
    const key = `${product.id}__${variantLabel}`;
    setCart((prev) => {
      const existing = prev.find((item) => item.key === key);
      if (existing) {
        return prev.map((item) =>
          item.key === key ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...prev,
        {
          key,
          productId: product.id,
          name: product.name,
          category: product.category,
          image: product.image,
          imagePosition: product.imagePosition,
          variantLabel,
          unitPriceINR,
          quantity,
        },
      ];
    });
    showToast(`${product.name} (${variantLabel}) added to bag`);
  };

  const handleQuickAdd = (product: Product) => {
    const defaultVariant = product.variants[0];
    const unitPriceINR = product.priceINR + (defaultVariant?.priceDeltaINR ?? 0);
    handleAddToBag(product, defaultVariant?.label ?? 'Standard', unitPriceINR, 1);
  };

  const handleUpdateCartQuantity = (key: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.key === key ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveCartItem = (key: string) => {
    setCart((prev) => prev.filter((item) => item.key !== key));
  };

  const handleSelectNavCategory = (
    category: ProductCategory | 'All',
    scrollTarget = 'collection'
  ) => {
    setActiveCategory(category);
    setShowSavedOnly(false);
    const el = document.getElementById(scrollTarget);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleInspectProductById = (productId: string) => {
    const found = PRODUCTS.find((p) => p.id === productId);
    if (found) {
      setSelectedProduct(found);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3EEE7] text-[#1E1915]">
      <Navbar
        activeCategory={activeCategory}
        onSelectNavCategory={handleSelectNavCategory}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSalon={() => setIsSalonOpen(true)}
        cartCount={totalBagCount}
      />

      <main>
        <HeroSection
          onExploreCategory={(category) => {
            setActiveCategory(category);
          }}
          onInspectProduct={handleInspectProductById}
        />

        <CollectionSection
          products={filteredProducts}
          allCountByCategory={countByCategory}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          sortBy={sortBy}
          onSortChange={setSortBy}
          currency={currency}
          onCurrencyChange={setCurrency}
          showSavedOnly={showSavedOnly}
          onToggleSavedOnly={() => setShowSavedOnly((prev) => !prev)}
          wishlistIds={wishlistIds}
          onToggleWishlist={handleToggleWishlist}
          onSelectProduct={setSelectedProduct}
          onQuickAdd={handleQuickAdd}
          searchQuery={searchQuery}
          onClearSearch={() => setSearchQuery('')}
        />

        <MaisonSection onOpenSalon={() => setIsSalonOpen(true)} />
      </main>

      <Footer
        onSelectCategory={(cat) => handleSelectNavCategory(cat, 'collection')}
        onOpenSalon={() => setIsSalonOpen(true)}
      />

      {/* Interactive Overlays */}
      <ProductModal
        product={selectedProduct}
        currency={currency}
        isSaved={selectedProduct ? wishlistIds.includes(selectedProduct.id) : false}
        onClose={() => setSelectedProduct(null)}
        onToggleWishlist={handleToggleWishlist}
        onAddToBag={handleAddToBag}
      />

      <CartDrawer
        isOpen={isCartOpen}
        items={cart}
        currency={currency}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onOrderConfirmed={() => {
          setCart([]);
        }}
      />

      <SearchModal
        isOpen={isSearchOpen}
        query={searchQuery}
        onQueryChange={setSearchQuery}
        products={PRODUCTS}
        currency={currency}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={(product) => setSelectedProduct(product)}
      />

      <SalonModal isOpen={isSalonOpen} onClose={() => setIsSalonOpen(false)} />

      {/* Subtle Add-to-Bag Confirmation Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-full bg-[#1E1915] text-[#FAF7F2] px-4 py-2.5 shadow-xl border border-[#3A3028]">
          <Check className="w-4 h-4 text-[#D3B170] shrink-0" />
          <span className="text-xs font-medium max-w-[240px] truncate">{toastMessage}</span>
          <button
            type="button"
            onClick={() => {
              setToastMessage(null);
              setIsCartOpen(true);
            }}
            className="inline-flex items-center gap-1 pl-2 border-l border-[#4B3F35] text-[11px] tracking-[0.1em] uppercase text-[#E4CFA8] hover:text-white cursor-pointer whitespace-nowrap"
          >
            <ShoppingBag className="w-3 h-3" />
            <span>Bag</span>
          </button>
        </div>
      )}
    </div>
  );
}
