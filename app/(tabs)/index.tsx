import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Button, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { ScreenContainer } from '@/components/base/ScreenContainer';

import { ProductCard } from '@/components/specific/ProductCard';
import { fetchProducts, Product } from '@/services/api';
import { useFetchData } from '../../hooks/useFetchData';
import { useCart } from '../../store/CartContext';
import { useTheme } from '../../store/ThemeContext';

type ThemePlaceholder = ReturnType<typeof useTheme>['theme'];

const CartButton: React.FC = () => {
    const { cartItems } = useCart();
    const { theme, themeName } = useTheme();
    const themedStyles = createThemedStyles(theme as unknown as ThemePlaceholder, themeName);

    const router = useRouter();
    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <View style={themedStyles.cartButtonContainer}>
            <Pressable style={themedStyles.cartButton} onPress={() => router.navigate('/(stack)/request-product')}>
                <FontAwesome name="shopping-cart" size={24} color="#fff" />
                <View style={themedStyles.badge}>
                    <Text style={themedStyles.badgeText}>{cartCount}</Text>
                </View>
            </Pressable>
        </View>
    );
};

export default function HomeScreen() {
  const { theme, themeName } = useTheme();
  const themedStyles = createThemedStyles(theme as unknown as ThemePlaceholder, themeName);

  const { data: products, loading, error, refetch } = useFetchData<Product[]>(fetchProducts);
  const { cartItems, addToCart, updateQuantity } = useCart();
  const router = useRouter();

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
    router.navigate('/(stack)/request-product');
  };

  const getProductQuantity = (productId: number): number => {
    return cartItems.find(item => item.id === productId)?.quantity || 0;
  };
  
  const handleQuantityChange = (productId: number, newQuantity: number) => {
      updateQuantity(productId, newQuantity); 
  };

  const handleViewDetails = (product: Product) => {
    router.navigate('/(stack)/request-product'); 
  };
  

  if (loading) {
    return (
      <ScreenContainer scrollable={false}>
        <View style={themedStyles.center}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={themedStyles.loadingText}>Fetching delicious products...</Text>
        </View>
      </ScreenContainer>
    );
  }

  if (error) {
    return (
      <ScreenContainer scrollable={false}>
        <View style={themedStyles.center}>
          <Text style={themedStyles.errorText}>Error: {error}</Text>
          <Button 
            title="Try Again" 
            onPress={refetch} 
            color={theme.colors.primary}
          />
        </View>
      </ScreenContainer>
    );
  }
  
  return (
    <ScreenContainer scrollable={false}>
      <Text style={themedStyles.header}>⚡ Quick Order Products</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ProductCard 
            product={item} 
            onAddToCart={handleAddToCart}
            onQuantityChange={handleQuantityChange}
            currentQuantity={getProductQuantity(item.id)}
            onViewDetails={handleViewDetails}
          />
        )}
        contentContainerStyle={themedStyles.listContent}
        showsVerticalScrollIndicator={false}
      />
      {cartItems.length > 0 && <CartButton />}
    </ScreenContainer>
  );
}

const createThemedStyles = (theme: ThemePlaceholder, themeName: string) => StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: theme.colors.subtleText,
  },
  errorText: {
    fontSize: 18,
    color: theme.colors.warning,
    marginBottom: 20,
    textAlign: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: theme.colors.text,
  },
  listContent: {
    paddingBottom: 80, 
  },

  cartButtonContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 10,
  },
  cartButton: {
    backgroundColor: theme.colors.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: theme.colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: themeName === 'light' ? 0.25 : 0.5, 
    shadowRadius: 3.84,
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: theme.colors.warning,
    borderRadius: 12, 
    minWidth: 24, 
    height: 24,
    justifyContent: 'center', 
    alignItems: 'center',
  },
  badgeText: {
    color: theme.colors.cardBackground,
    fontWeight: 'bold',
    fontSize: 14, 
  }
});