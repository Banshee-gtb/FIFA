import { useState, useEffect } from 'react';
import type { CartItem } from '@/types';

const CART_KEY = 'fifa2026_cart';

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

let listeners: Array<() => void> = [];
let cartState: CartItem[] = loadCart();

function notifyListeners() {
  listeners.forEach(fn => fn());
}

export function useCart() {
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const fn = () => forceUpdate(n => n + 1);
    listeners.push(fn);
    return () => { listeners = listeners.filter(l => l !== fn); };
  }, []);

  const items = cartState;
  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = items.reduce((s, i) => s + i.price * i.quantity, 0);

  function addItem(item: Omit<CartItem, 'quantity'> & { quantity?: number }) {
    const qty = item.quantity ?? 1;
    const existing = cartState.find(c => c.id === item.id && c.size === item.size);
    if (existing) {
      cartState = cartState.map(c =>
        c.id === item.id && c.size === item.size ? { ...c, quantity: c.quantity + qty } : c
      );
    } else {
      cartState = [...cartState, { ...item, quantity: qty }];
    }
    saveCart(cartState);
    notifyListeners();
  }

  function removeItem(id: string, size?: string) {
    cartState = cartState.filter(c => !(c.id === id && c.size === size));
    saveCart(cartState);
    notifyListeners();
  }

  function updateQty(id: string, quantity: number, size?: string) {
    if (quantity <= 0) { removeItem(id, size); return; }
    cartState = cartState.map(c =>
      c.id === id && c.size === size ? { ...c, quantity } : c
    );
    saveCart(cartState);
    notifyListeners();
  }

  function clearCart() {
    cartState = [];
    saveCart(cartState);
    notifyListeners();
  }

  return { items, totalItems, totalPrice, addItem, removeItem, updateQty, clearCart };
}
