import React, { createContext, useContext, useEffect, useState } from "react";
import LocalStorageService from "../services/LocalStorageService";
import { CartItem, PharmacyProduct } from "../types";

interface CartContextType {
  items: CartItem[];
  addToCart: (product: PharmacyProduct, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    const storedCart = await LocalStorageService.getItem<CartItem[]>("@cart");
    if (storedCart) {
      setItems(storedCart);
    }
  };

  const saveCart = async (newItems: CartItem[]) => {
    setItems(newItems);
    await LocalStorageService.setItem("@cart", newItems);
  };

  const addToCart = (product: PharmacyProduct, quantity: number) => {
    const existingItem = items.find((item) => item.productId === product.id);
    let newItems;

    if (existingItem) {
      newItems = items.map((item) =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      newItems = [
        ...items,
        {
          productId: product.id,
          productName: product.name,
          price: product.price,
          quantity,
        },
      ];
    }
    saveCart(newItems);
  };

  const removeFromCart = (productId: string) => {
    const newItems = items.filter((item) => item.productId !== productId);
    saveCart(newItems);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const newItems = items.map((item) =>
      item.productId === productId ? { ...item, quantity } : item
    );
    saveCart(newItems);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        total,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
