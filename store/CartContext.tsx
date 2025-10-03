import React, { createContext, ReactNode, useContext, useState } from 'react';

export type CartItem = {
  id: number;
  title: string;
  price: number;
  quantity: number;
  image : any;
};

interface CartContextType {
  cartItems: CartItem[];
  totalPrice: number;
  addToCart: (product: any, quantity: number) => void;
  updateQuantity: (product: any, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (product: any, quantity: number = 1) => {
    console.log("🚀 ~ addToCart ~ product:", product)
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);

      if (existingItem) {
        // If exists, update quantity
        return prevItems.map(item =>
          item.id === product.id 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      } else {
        // If new, add to cart
        return [
          ...prevItems,
          {
            id: product.id,
            title: product.title,
            price: product.price,
            quantity: quantity,
            image : product.image
          } as CartItem
        ];
      }
    });
  };

  const updateQuantity = (productId: number, newQuantity: number) => {
    setCartItems(prevItems => {
      if (newQuantity <= 0) {
        // Remove the item completely if new quantity is 0 or less
        return prevItems.filter(item => item.id !== productId);
      }

      // Update the quantity of the existing item
      return prevItems.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      );
    });
  };

  const clearCart = () => setCartItems([]);

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity, 
    0
  );

  return (
    <CartContext.Provider value={{ cartItems, totalPrice, addToCart, clearCart , updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};