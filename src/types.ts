export type ProductCategory = 'Clothing' | 'Beauty' | 'Skin & Scents' | 'Home';

export type CurrencyCode = 'INR' | 'USD' | 'GBP';

export interface ProductVariant {
  label: string;
  priceDeltaINR?: number;
  swatchHex?: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: ProductCategory;
  subCategory: string;
  priceINR: number;
  image: string;
  imagePosition?: string;
  editionNote?: string;
  tagline: string;
  description: string;
  craftDetails: string[];
  variants: ProductVariant[];
  inStock: boolean;
  featuredOrder: number;
}

export interface CartItem {
  key: string;
  productId: string;
  name: string;
  category: ProductCategory;
  image: string;
  imagePosition?: string;
  variantLabel: string;
  unitPriceINR: number;
  quantity: number;
}

export interface HeroArchiveChapter {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  category: ProductCategory;
  image: string;
  featuredProductId: string;
  accentNote: string;
}

export interface ConfirmedOrder {
  orderNumber: string;
  createdAt: string;
  customerName: string;
  email: string;
  shippingAddress: string;
  cityPostal: string;
  paymentMethod: string;
  giftWrap: boolean;
  giftNote: string;
  items: CartItem[];
  subtotalINR: number;
  shippingINR: number;
  totalINR: number;
  currency: CurrencyCode;
}

export interface SalonBooking {
  referenceCode: string;
  salonCity: string;
  service: string;
  date: string;
  timeSlot: string;
  clientName: string;
  email: string;
}
