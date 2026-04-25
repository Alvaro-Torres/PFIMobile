import React, { createContext, useContext, useState } from "react";

type LanguageText = {
  en: string;
  fr: string;
};

export type CartItem = {
  id: number;
  name: LanguageText;
  price: number;
  image: string;
  quantity: number;
};

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">, quantity: number) => void;
  increaseQuantity: (id: number) => void;
  decreaseQuantity: (id: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  function addToCart(item: Omit<CartItem, "quantity">, quantity: number) {
    setCartItems((currentCart) => {
      const existingItem = currentCart.find((x) => x.id === item.id);

      if (existingItem) {
        return currentCart.map((x) =>
          x.id === item.id
            ? { ...x, quantity: x.quantity + quantity }
            : x
        );
      }

      return [...currentCart, { ...item, quantity }];
    });
  }

  function increaseQuantity(id: number) {
    setCartItems((currentCart) =>
      currentCart.map((x) =>
        x.id === id ? { ...x, quantity: x.quantity + 1 } : x
      )
    );
  }

  function decreaseQuantity(id: number) {
    setCartItems((currentCart) =>
      currentCart
        .map((x) =>
          x.id === id ? { ...x, quantity: x.quantity - 1 } : x
        )
        .filter((x) => x.quantity > 0)
    );
  }

  function clearCart() {
    setCartItems([]);
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart doit être utilisé dans CartProvider");
  }

  return context;
}