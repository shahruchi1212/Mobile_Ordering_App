import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';


const STORAGE_KEY = '@MobileOrderingApp:cart';


export type CartItem = {
  id: number;
  title: string;
  price: number;
  quantity: number;
  image: any;
};

interface CartContextType {
  cartItems: CartItem[];
  totalPrice: number;
  addToCart: (product: any, quantity: number) => void;
  updateQuantity: (productId: number, newQuantity: number) => void;
  clearCart: () => void;
  isLoaded: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);


export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);


  useEffect(() => {
    const loadCart = async () => {
      try {
        const storedCart = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedCart) {

          setCartItems(JSON.parse(storedCart) as CartItem[]);
        }
      } catch (error) {
        console.error('Failed to load cart from storage:', error);
      } finally {
        // Mark as loaded once attempt is complete
        setIsLoaded(true);
      }
    };
    loadCart();
  }, []);

  // ==========================================================
  // 2. SAVE DATA TO ASYNCSTORAGE (On cartItems change)
  // ==========================================================
  useEffect(() => {

    if (isLoaded) {
      const saveCart = async () => {
        try {

          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
        } catch (error) {
          console.error('Failed to save cart to storage:', error);
        }
      };
      saveCart();
    }
  }, [cartItems, isLoaded]);

  const addToCart = (product: any, quantity: number = 1) => {
    // console.log("🚀 ~ addToCart ~ product:", product);
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);

      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [
          ...prevItems,
          {
            id: product.id,
            title: product.title,
            price: product.price,
            quantity: quantity,
            image: product.image
          } as CartItem
        ];
      }
    });
  };

  const updateQuantity = (productId: number, newQuantity: number) => {
    setCartItems(prevItems => {
      if (newQuantity <= 0) {
        return prevItems.filter(item => item.id !== productId);
      }
      return prevItems.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      );
    });
  };

  const clearCart = () => setCartItems([]);


  const totalPrice = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cartItems]);

  return (
    <CartContext.Provider value={{ cartItems, totalPrice, addToCart, clearCart, updateQuantity, isLoaded }}>
      {isLoaded ? children : null}
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