import { CurrencyCode } from '../types';

const CURRENCY_CONFIG: Record<
  CurrencyCode,
  { rateFromINR: number; symbol: string; locale: string }
> = {
  INR: { rateFromINR: 1, symbol: '₹', locale: 'en-IN' },
  USD: { rateFromINR: 1 / 84, symbol: '$', locale: 'en-US' },
  GBP: { rateFromINR: 1 / 106, symbol: '£', locale: 'en-GB' },
};

export function formatPrice(amountINR: number, currency: CurrencyCode): string {
  const { rateFromINR, symbol, locale } = CURRENCY_CONFIG[currency];
  const converted = Math.round(amountINR * rateFromINR);
  return `${symbol}${converted.toLocaleString(locale)}`;
}
