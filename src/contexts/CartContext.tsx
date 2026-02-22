import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

export interface CartItemExtra {
  label: string;
  price: number;
}

export interface CartItem {
  id: string;
  type: "activity" | "combo";
  title: string;
  image: string;
  price: number;
  originalPrice?: number;
  date: string;
  time?: string;
  adults: number;
  children: number;
  totalPrice: number;
  selectedRental?: CartItemExtra;
  selectedAddons?: CartItemExtra[];
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, updates: Partial<CartItem>) => void;
  clearCart: () => void;
  itemCount: number;
  totalAmount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_KEY = "betterview_cart";

function loadCart(): CartItem[] {
  try {
    const stored = localStorage.getItem(CART_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCart);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((item: CartItem) => {
    setItems((prev) => [...prev, { ...item, id: `${item.id}-${Date.now()}` }]);
    setIsCartOpen(true);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const updateItem = useCallback((id: string, updates: Partial<CartItem>) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const itemCount = items.length;
  const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateItem, clearCart, itemCount, totalAmount, isCartOpen, setIsCartOpen }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
