import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Button, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { ScreenContainer } from '@/components/base/ScreenContainer';

import { ProductCard } from '@/components/specific/ProductCard';
import { registerForPushNotificationsAsync } from '@/hooks/useNotifications';
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
        <View style={themedStyles.cartButtonContainer} testID="cart-button-badge">
            <Pressable style={themedStyles.cartButton} onPress={() => router.navigate('/(stack)/request-product')}>
                <FontAwesome name="shopping-cart" size={24} color="#fff" />
                <View style={themedStyles.badge}>
                    <Text style={themedStyles.badgeText}>{cartCount}</Text>
                </View>
            </Pressable>
        </View>
    );
};


interface SearchHeaderProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    theme: ThemePlaceholder;
    themedStyles: ReturnType<typeof createThemedStyles>;
}

const SearchHeader: React.FC<SearchHeaderProps> = ({ searchQuery, setSearchQuery, theme, themedStyles }) => {
    const [isSearchVisible, setIsSearchVisible] = useState(false);

    const toggleSearch = () => {
        setIsSearchVisible(prev => {
            const nextVisibility = !prev;
            if (!nextVisibility) {
                setSearchQuery('');
            }
            return nextVisibility;
        });
    };

    return (
        <View>
            <View style={themedStyles.headerRow}>
                <Text style={themedStyles.headerText}>⚡ Quick Order Products</Text>
                
                <Pressable onPress={toggleSearch}>
                    <FontAwesome 
                        name={isSearchVisible ? "close" : "search"} 
                        size={24} 
                        color={theme.colors.text} 
                    />
                </Pressable>
            </View>

            {isSearchVisible && (
                <View style={themedStyles.searchInputContainer}>
                    <FontAwesome name="search" size={18} color={theme.colors.subtleText} style={themedStyles.searchIcon} />
                    <TextInput
                        style={themedStyles.searchInput}
                        placeholder="Search products by name..."
                        placeholderTextColor={theme.colors.subtleText}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        autoFocus={true}
                    />
                </View>
            )}
        </View>
    );
};



export default function HomeScreen() {
  const { theme, themeName } = useTheme();
  const themedStyles = createThemedStyles(theme as unknown as ThemePlaceholder, themeName);

  const { data: products, loading, error, refetch } = useFetchData<Product[]>(fetchProducts);
  const { cartItems, addToCart, updateQuantity } = useCart();
  const router = useRouter();
  

  const [searchQuery, setSearchQuery] = useState('');

 
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    if (!searchQuery) return products;

    const lowerCaseQuery = searchQuery.toLowerCase();
    
    return products.filter(product => 
        product.title.toLowerCase().includes(lowerCaseQuery) ||
        product.category?.toLowerCase().includes(lowerCaseQuery) 
    );
  }, [products, searchQuery]);


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
  

   useEffect(() => {
    registerForPushNotificationsAsync();
  
  }, []);
  

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
        <SearchHeader 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            theme={theme as unknown as ThemePlaceholder}
            themedStyles={themedStyles}
        />
      
      <FlatList
        data={filteredProducts} // Use the filtered list
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
      
        ListEmptyComponent={() => (
            <View style={themedStyles.center}>
                <Text style={themedStyles.loadingText}>No products match your search.</Text>
            </View>
        )}
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
    paddingVertical: 20, 
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

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerText: { 
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.cardBackground,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: theme.colors.text,
    fontSize: 16,
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