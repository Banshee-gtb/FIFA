import { createContext, useContext, useState, type ReactNode } from 'react';

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'CAD' | 'MXN' | 'BRL' | 'AUD' | 'JPY';

interface CurrencyInfo {
  code: CurrencyCode;
  symbol: string;
  name: string;
  rate: number; // relative to USD
}

export const CURRENCIES: CurrencyInfo[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar', rate: 1 },
  { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.92 },
  { code: 'GBP', symbol: '£', name: 'British Pound', rate: 0.79 },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar', rate: 1.36 },
  { code: 'MXN', symbol: 'MX$', name: 'Mexican Peso', rate: 17.15 },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', rate: 4.97 },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', rate: 1.53 },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', rate: 149.5 },
];

interface CurrencyContextValue {
  currency: CurrencyInfo;
  setCurrency: (code: CurrencyCode) => void;
  convert: (usdAmount: number) => number;
  format: (usdAmount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currencyCode, setCurrencyCode] = useState<CurrencyCode>('USD');
  const currency = CURRENCIES.find(c => c.code === currencyCode)!;

  function convert(usdAmount: number) {
    return usdAmount * currency.rate;
  }

  function format(usdAmount: number) {
    const converted = convert(usdAmount);
    if (currency.code === 'JPY') {
      return `${currency.symbol}${Math.round(converted).toLocaleString()}`;
    }
    return `${currency.symbol}${converted.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency: (c) => setCurrencyCode(c), convert, format }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider');
  return ctx;
}
