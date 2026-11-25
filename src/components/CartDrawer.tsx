import React, { useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle2, Gift, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { CartItem, ConfirmedOrder, CurrencyCode } from '../types';
import { formatPrice } from '../utils/currency';

interface CartDrawerProps {
  isOpen: boolean;
  items: CartItem[];
  currency: CurrencyCode;
  onClose: () => void;
  onUpdateQuantity: (key: string, delta: number) => void;
  onRemoveItem: (key: string) => void;
  onOrderConfirmed: (order: ConfirmedOrder) => void;
}

const COMPLIMENTARY_THRESHOLD_INR = 15000;
const STANDARD_SHIPPING_INR = 450;

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  items,
  currency,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onOrderConfirmed,
}) => {
  const [step, setStep] = useState<'bag' | 'checkout' | 'confirmed'>('bag');
  const [giftWrap, setGiftWrap] = useState(true);
  const [giftNote, setGiftNote] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [cityPostal, setCityPostal] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'cod'>('upi');
  const [formError, setFormError] = useState('');
  const [latestOrder, setLatestOrder] = useState<ConfirmedOrder | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (items.length > 0 && step === 'confirmed') {
      setStep('bag');
    }
  }, [items.length, step]);

  if (!isOpen) return null;

  const subtotalINR = items.reduce((sum, item) => sum + item.unitPriceINR * item.quantity, 0);
  const qualifiesFreeShipping = subtotalINR >= COMPLIMENTARY_THRESHOLD_INR || subtotalINR === 0;
  const shippingINR = qualifiesFreeShipping ? 0 : STANDARD_SHIPPING_INR;
  const totalINR = subtotalINR + shippingINR;
  const remainingForFreeINR = Math.max(0, COMPLIMENTARY_THRESHOLD_INR - subtotalINR);
  const progressPct = Math.min(100, (subtotalINR / COMPLIMENTARY_THRESHOLD_INR) * 100);

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !customerName.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !shippingAddress.trim() ||
      !cityPostal.trim()
    ) {
      setFormError('Please fill in all recipient and delivery address details.');
      return;
    }
    setFormError('');

    const order: ConfirmedOrder = {
      orderNumber: `VLR-${Math.floor(1000 + Math.random() * 8999)}`,
      createdAt: new Date().toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      customerName: customerName.trim(),
      email: email.trim(),
      shippingAddress: shippingAddress.trim(),
      cityPostal: cityPostal.trim(),
      paymentMethod:
        paymentMethod === 'upi'
          ? 'UPI, Cards & NetBanking'
          : 'Cash on Delivery (Pay at Doorstep)',
      giftWrap,
      giftNote: giftNote.trim(),
      items: [...items],
      subtotalINR,
      shippingINR,
      totalINR,
      currency,
    };

    setLatestOrder(order);
    setStep('confirmed');
    onOrderConfirmed(order);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#1E1915]/45 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Bag"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md h-full bg-[#FAF7F2] border-l border-[#E3DBD0] shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#E5DDD2] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {step === 'checkout' && (
              <button
                type="button"
                onClick={() => setStep('bag')}
                aria-label="Back to shopping bag"
                className="p-1.5 -ml-1.5 rounded-full hover:bg-[#EDE6DC] text-[#3A2D22] cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <h2 className="font-display text-2xl font-medium text-[#1E1915]">
              {step === 'bag'
                ? 'Your Shopping Bag'
                : step === 'checkout'
                  ? 'Delivery & Payment'
                  : 'Order Confirmed'}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close shopping bag"
            className="w-9 h-9 rounded-full hover:bg-[#EDE6DC] flex items-center justify-center text-[#3A2D22] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {step === 'confirmed' && latestOrder ? (
            <div className="py-4">
              <div className="rounded-2xl border border-[#DDD3C5] bg-[#F3EEE7] p-6 text-center">
                <CheckCircle2 className="w-10 h-10 text-[#8B6C36] mx-auto" strokeWidth={1.5} />
                <p className="mt-3 text-[11px] tracking-[0.18em] uppercase text-[#8B6C36] font-medium">
                  Order #{latestOrder.orderNumber} Confirmed
                </p>
                <h3 className="mt-1 font-display text-2xl text-[#1E1915]">
                  Preparing Your Shipment
                </h3>
                <p className="mt-2 text-xs text-[#5C4F43] leading-relaxed">
                  An order confirmation and live tracking link have been sent to{' '}
                  <strong className="text-[#1E1915]">{latestOrder.email}</strong>.
                </p>
              </div>

              <div className="mt-6 rounded-2xl border border-[#E5DDD2] bg-white/60 p-5 space-y-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#5C4F43]">Recipient</span>
                  <span className="font-medium text-[#1E1915]">{latestOrder.customerName}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-[#5C4F43]">Delivery Address</span>
                  <span className="font-medium text-[#1E1915] text-right">
                    {latestOrder.shippingAddress}, {latestOrder.cityPostal}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-[#5C4F43]">Payment Mode</span>
                  <span className="font-medium text-[#1E1915] text-right">
                    {latestOrder.paymentMethod}
                  </span>
                </div>
                <div className="pt-3 border-t border-[#E5DDD2] flex justify-between text-sm font-semibold text-[#1E1915] tabular-nums">
                  <span>Total Paid / Payable</span>
                  <span>{formatPrice(latestOrder.totalINR, latestOrder.currency)}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setStep('bag');
                  onClose();
                }}
                className="mt-6 w-full py-3 rounded-full bg-[#1E1915] text-[#FAF7F2] text-xs font-medium tracking-[0.15em] uppercase cursor-pointer"
              >
                CONTINUE BROWSING
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-14 h-14 rounded-full bg-[#EFE9DF] flex items-center justify-center text-[#8B6C36]">
                <ShoppingBag className="w-6 h-6" strokeWidth={1.5} />
              </div>
              <p className="mt-4 font-display text-2xl text-[#1E1915]">Your bag is empty</p>
              <p className="mt-2 text-xs text-[#5C4F43] max-w-[240px]">
                Explore our Autumn-Winter Reserve to add couture gowns, lipsticks, botanical
                serums, or home pieces.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-6 px-6 py-2.5 rounded-full bg-[#1E1915] text-[#FAF7F2] text-xs font-medium tracking-[0.14em] uppercase cursor-pointer"
              >
                EXPLORE COLLECTION
              </button>
            </div>
          ) : step === 'bag' ? (
            <div className="space-y-5">
              {/* Complimentary Pan-India Courier Progress */}
              <div className="rounded-xl bg-[#F2ECE3] border border-[#E5DDD2] p-3.5">
                <p className="text-xs text-[#3A2D22]">
                  {qualifiesFreeShipping ? (
                    <span>Complimentary insured pan-India delivery unlocked.</span>
                  ) : (
                    <span>
                      Add{' '}
                      <strong className="tabular-nums">
                        {formatPrice(remainingForFreeINR, currency)}
                      </strong>{' '}
                      more for complimentary insured delivery across India.
                    </span>
                  )}
                </p>
                <div className="mt-2 h-1 w-full rounded-full bg-[#DED5C8] overflow-hidden">
                  <div
                    className="h-full bg-[#A58347] transition-all duration-300"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>

              {/* Line Items */}
              <ul className="divide-y divide-[#EAE2D7]">
                {items.map((item) => (
                  <li key={item.key} className="py-4 flex gap-3.5">
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#EAE2D6] shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className={`w-full h-full object-cover ${item.imagePosition || 'object-center'}`}
                      />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-[10px] tracking-[0.12em] uppercase text-[#7A6B5C]">
                            {item.category}
                          </p>
                          <h3 className="font-display text-lg font-medium text-[#1E1915] truncate">
                            {item.name}
                          </h3>
                          <p className="text-xs text-[#5C4F43]">{item.variantLabel}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.key)}
                          aria-label={`Remove ${item.name}`}
                          className="text-[#8B7D6E] hover:text-[#1E1915] p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="mt-2 flex items-center justify-between">
                        <div className="inline-flex items-center rounded-full border border-[#DDD3C5] bg-white/70">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.key, -1)}
                            aria-label="Decrease item quantity"
                            className="w-7 h-7 flex items-center justify-center text-[#3A2D22] cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-medium tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.key, 1)}
                            aria-label="Increase item quantity"
                            className="w-7 h-7 flex items-center justify-center text-[#3A2D22] cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-sm font-semibold text-[#1E1915] tabular-nums">
                          {formatPrice(item.unitPriceINR * item.quantity, currency)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Silk Gift Packaging */}
              <div className="rounded-xl border border-[#E5DDD2] bg-white/55 p-4 space-y-2.5">
                <label className="flex items-center justify-between gap-3 cursor-pointer">
                  <span className="flex items-center gap-2 text-xs font-medium text-[#1E1915]">
                    <Gift className="w-4 h-4 text-[#A58347]" />
                    <span>Complimentary Signature Silk Gift Box</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={giftWrap}
                    onChange={(e) => setGiftWrap(e.target.checked)}
                    className="accent-[#A58347] w-4 h-4 cursor-pointer"
                  />
                </label>
                {giftWrap && (
                  <input
                    type="text"
                    value={giftNote}
                    onChange={(e) => setGiftNote(e.target.value)}
                    placeholder="Add a personal gift card message (optional)..."
                    className="w-full rounded-lg border border-[#DDD3C5] bg-[#FAF7F2] px-3 py-2 text-xs text-[#1E1915] placeholder:text-[#8B7D6E] focus:outline-none focus:border-[#A58347]"
                  />
                )}
              </div>
            </div>
          ) : (
            /* Checkout Form */
            <form id="velora-checkout-form" onSubmit={handleConfirmOrder} className="space-y-4">
              <div>
                <label className="block text-[11px] font-medium tracking-[0.12em] uppercase text-[#5C4F43] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Ananya Sharma"
                  className="w-full rounded-xl border border-[#DDD3C5] bg-white/75 px-3.5 py-2.5 text-sm text-[#1E1915] focus:outline-none focus:border-[#A58347]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium tracking-[0.12em] uppercase text-[#5C4F43] mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ananya@example.in"
                    className="w-full rounded-xl border border-[#DDD3C5] bg-white/75 px-3.5 py-2.5 text-sm text-[#1E1915] focus:outline-none focus:border-[#A58347]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium tracking-[0.12em] uppercase text-[#5C4F43] mb-1">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98201 44510"
                    className="w-full rounded-xl border border-[#DDD3C5] bg-white/75 px-3.5 py-2.5 text-sm text-[#1E1915] focus:outline-none focus:border-[#A58347]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium tracking-[0.12em] uppercase text-[#5C4F43] mb-1">
                  House / Flat &amp; Street Address
                </label>
                <input
                  type="text"
                  required
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="42 Altamount Road, Cumballa Hill"
                  className="w-full rounded-xl border border-[#DDD3C5] bg-white/75 px-3.5 py-2.5 text-sm text-[#1E1915] focus:outline-none focus:border-[#A58347]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium tracking-[0.12em] uppercase text-[#5C4F43] mb-1">
                  City, State &amp; PIN Code
                </label>
                <input
                  type="text"
                  required
                  value={cityPostal}
                  onChange={(e) => setCityPostal(e.target.value)}
                  placeholder="Mumbai, Maharashtra 400026"
                  className="w-full rounded-xl border border-[#DDD3C5] bg-white/75 px-3.5 py-2.5 text-sm text-[#1E1915] focus:outline-none focus:border-[#A58347]"
                />
              </div>

              <div className="pt-2">
                <p className="text-[11px] font-medium tracking-[0.12em] uppercase text-[#5C4F43] mb-2">
                  Payment Method
                </p>
                <div className="grid grid-cols-1 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`text-left rounded-xl border px-4 py-3 text-xs transition-colors cursor-pointer ${
                      paymentMethod === 'upi'
                        ? 'border-[#1E1915] bg-[#1E1915] text-[#FAF7F2]'
                        : 'border-[#DDD3C5] bg-white/70 text-[#1E1915]'
                    }`}
                  >
                    <span className="font-medium block">UPI, Cards &amp; NetBanking</span>
                    <span className="opacity-75">
                      GPay, PhonePe, RuPay, Visa, Mastercard &amp; EMI
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`text-left rounded-xl border px-4 py-3 text-xs transition-colors cursor-pointer ${
                      paymentMethod === 'cod'
                        ? 'border-[#1E1915] bg-[#1E1915] text-[#FAF7F2]'
                        : 'border-[#DDD3C5] bg-white/70 text-[#1E1915]'
                    }`}
                  >
                    <span className="font-medium block">Cash on Delivery (Pay at Doorstep)</span>
                    <span className="opacity-75">
                      Pay via cash or UPI QR when your parcel arrives
                    </span>
                  </button>
                </div>
              </div>

              {formError && (
                <p className="text-xs text-[#8A2323] font-medium" role="alert">
                  {formError}
                </p>
              )}
            </form>
          )}
        </div>

        {/* Footer Totals & CTA */}
        {items.length > 0 && step !== 'confirmed' && (
          <div className="p-6 border-t border-[#E5DDD2] bg-[#F5EFE7] space-y-4">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-[#5C4F43] tabular-nums">
                <span>Subtotal (Incl. GST)</span>
                <span>{formatPrice(subtotalINR, currency)}</span>
              </div>
              <div className="flex justify-between text-[#5C4F43] tabular-nums">
                <span>Insured Pan-India Delivery</span>
                <span>{shippingINR === 0 ? 'Complimentary' : formatPrice(shippingINR, currency)}</span>
              </div>
              <div className="pt-2 border-t border-[#DED5C8] flex justify-between text-sm font-semibold text-[#1E1915] tabular-nums">
                <span>Total</span>
                <span>{formatPrice(totalINR, currency)}</span>
              </div>
            </div>

            {step === 'bag' ? (
              <button
                type="button"
                onClick={() => setStep('checkout')}
                className="w-full py-3.5 rounded-full bg-[#1E1915] hover:bg-[#A58347] text-[#FAF7F2] text-xs font-medium tracking-[0.16em] uppercase transition-colors cursor-pointer"
              >
                PROCEED TO CHECKOUT
              </button>
            ) : (
              <button
                type="submit"
                form="velora-checkout-form"
                className="w-full py-3.5 rounded-full bg-gradient-to-b from-[#B49052] to-[#98763D] hover:from-[#A58347] hover:to-[#876632] text-[#FAF7F2] text-xs font-medium tracking-[0.16em] uppercase transition-all cursor-pointer"
              >
                PLACE ORDER · {formatPrice(totalINR, currency)}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
