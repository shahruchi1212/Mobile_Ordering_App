import { FontAwesome } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import { Button, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { ScreenContainer } from '../../components/base/ScreenContainer';
import { CartItem, useCart } from '../../store/CartContext';
import { useTheme } from '../../store/ThemeContext';


type ThemePlaceholder = ReturnType<typeof useTheme>['theme'];
const CartItemRow: React.FC<{ item: CartItem }> = ({ item }) => {
  const { theme } = useTheme();
  const themedCartStyles = createThemedCartStyles(theme as unknown as ThemePlaceholder);

  return (
    <View style={themedCartStyles.row}>
      
      <Image 
        style={themedCartStyles.image}
        source={{ uri: item.image }}
        contentFit="contain"
      />
      
      <View style={themedCartStyles.detailsContainer}>
          <Text style={themedCartStyles.title} numberOfLines={2}>{item.title}</Text>
          <View style={themedCartStyles.quantityContainer}>
              <Text style={themedCartStyles.quantity}>Qty: {item.quantity}</Text>
              <Text style={themedCartStyles.price}>${(item.price * item.quantity).toFixed(2)}</Text>
          </View>
      </View>
    </View>
  );
};

export default function CartScreen() {
  const { cartItems, totalPrice } = useCart();
  const { theme } = useTheme();
  const themedStyles = createThemedStyles(theme as unknown as ThemePlaceholder);
  const router = useRouter();

  const handleCheckout = () => {
    if (cartItems.length > 0) {
      router.push('/(stack)/delivery-location');
    }
  };
  
  const handleBackToHome = () => {
    router.replace('../(tabs)');
  };

  if (cartItems.length === 0) {
    return (
      <ScreenContainer scrollable={false}>
        <View style={themedStyles.center}>
          <FontAwesome name="shopping-cart" size={60} color={theme.colors.subtleText} />
          <Text style={themedStyles.emptyText}>Your cart is empty.</Text>
          <Button 
            title="Go Back to Shopping" 
            onPress={handleBackToHome} 
            color={theme.colors.primary} 
          />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scrollable={false}>
      <Text style={themedStyles.header}>Your Cart</Text>
      
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <CartItemRow item={item} />}
        style={themedStyles.list}
      />

      <View style={themedStyles.summaryBox}>
        <Text style={themedStyles.summaryText}>Total:</Text>
        <Text style={themedStyles.totalPrice}>${totalPrice.toFixed(2)}</Text>
      </View>

      <Pressable style={themedStyles.checkoutButton} onPress={handleCheckout}>
        <Text style={themedStyles.checkoutButtonText}>Proceed to Delivery</Text>
      </Pressable>
    </ScreenContainer>
  );
}


const createThemedStyles = (theme: ThemePlaceholder) => StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { 
    fontSize: 18, 
    color: theme.colors.subtleText, 
    marginVertical: 20 
  },
  header: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    marginBottom: 15,
    color: theme.colors.text
  },
  list: { flexGrow: 1, marginBottom: 15 },
  summaryBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border, 
  },
  summaryText: { 
    fontSize: 18, 
    fontWeight: '500', 
    color: theme.colors.text 
  },
  totalPrice: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: theme.colors.primary 
  },
  checkoutButton: {
    backgroundColor: theme.colors.success, 
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  checkoutButtonText: {
    color: theme.colors.cardBackground, 
    fontSize: 18,
    fontWeight: 'bold',
  },
});


const createThemedCartStyles = (theme: ThemePlaceholder) => StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border, 
  },
  image: {
    width: 60,
    height: 60,
    marginRight: 10,
    borderRadius: 8,
    backgroundColor: theme.colors.cardBackground, 
    borderWidth: 1,
    borderColor: theme.colors.border, 
  },
  detailsContainer: {
      flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text, 
    marginBottom: 4,
  },
  quantityContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 4,
  },
  quantity: {
    fontSize: 15,
    color: theme.colors.subtleText, 
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text, 
  },
});