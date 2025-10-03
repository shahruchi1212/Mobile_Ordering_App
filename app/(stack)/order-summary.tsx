import { FontAwesome } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { placeOrder } from '../../services/api';
import { useCart } from '../../store/CartContext';
import { useTheme } from '../../store/ThemeContext';


type ThemePlaceholder = ReturnType<typeof useTheme>['theme'];


const SummaryItemRow: React.FC<{ item: any; theme: ThemePlaceholder; themeName: string }> = ({ item, theme, themeName }) => {
  
    const themedSummaryStyles = createThemedSummaryStyles(theme, themeName);
    
    return (
        <View style={themedSummaryStyles.itemRow}>
            <Image 
                style={themedSummaryStyles.itemImage}
                source={{ uri: item.image }}
                contentFit="contain"
            />
            <View style={themedSummaryStyles.itemDetails}>
                <Text style={themedSummaryStyles.itemTitle} numberOfLines={2}>
                    {item.title}
                </Text>
                <Text style={themedSummaryStyles.itemQuantity}>
                    Qty: {item.quantity}
                </Text>
            </View>
            <Text style={themedSummaryStyles.itemPrice}>
                ${(item.price * item.quantity).toFixed(2)}
            </Text>
        </View>
    );
};
// ---------------------------------------------------------------------

export default function OrderSummaryScreen() {

  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { cartItems, totalPrice, clearCart } = useCart();
  const params = useLocalSearchParams();
  const { theme, themeName } = useTheme(); 
  const themedStyles = createThemedStyles(theme, themeName);
  const themedSummaryStyles = createThemedSummaryStyles(theme, themeName);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const deliveryAddress = params.deliveryAddress ? JSON.parse(params.deliveryAddress as string) : null;
  const isAddressConfirmed = !!deliveryAddress && !!deliveryAddress.street;

  const shippingFee = 5.00;
  const serviceTax = totalPrice * 0.05;
  const grandTotal = totalPrice + shippingFee + serviceTax;

  const handleConfirmOrder = async () => {
    if (cartItems.length === 0) {
      Alert.alert('Cart Empty', 'Please add items before placing an order.');
      router.replace('../(tabs)'); 
      return;
    }
    
    if (!isAddressConfirmed) {
        Alert.alert('Address Required', 'Please add or confirm a delivery address to proceed.');
        return;
    }

    setIsPlacingOrder(true);
    
    try {
      const orderDetails = {
        items: cartItems.map(item => ({ id: item.id, qty: item.quantity, price: item.price })),
        delivery: deliveryAddress,
        total: grandTotal.toFixed(2),
        timestamp: new Date().toISOString(),
      };
      
      const { orderId } = await placeOrder(orderDetails);
      
      clearCart();
      
      router.replace({
        pathname: '/(stack)/order-status',
        params: { orderId, total: grandTotal.toFixed(2) },
      });
      
    } catch (error) {
      Alert.alert('Order Failed', 'Could not place order. Please try again.');
      setIsPlacingOrder(false);
    }
  };
  
  const handleAddAddressPress = () => {
      router.push('/(stack)/delivery-location');
  };

  const renderSummaryRow = (label: string, value: number | string, isTotal = false) => (
    <View style={themedSummaryStyles.row}>
      <Text style={[themedSummaryStyles.label, isTotal && themedSummaryStyles.totalLabel]}>{label}</Text>
      <Text style={[themedSummaryStyles.value, isTotal && themedSummaryStyles.totalValue]}>
        {typeof value === 'number' ? `$${value.toFixed(2)}` : value}
      </Text>
    </View>
  );

  const renderDeliverySection = () => {
    if (isAddressConfirmed) {
      return (
        <View style={themedStyles.card}>
          <Text style={themedSummaryStyles.addressText}>
            {`${deliveryAddress.street}, ${deliveryAddress.city}, ${deliveryAddress.zip}`}
          </Text>
          <Text style={themedSummaryStyles.notesText}>Notes: {deliveryAddress.notes || 'None'}</Text>
          <Pressable style={themedSummaryStyles.editButton} onPress={handleAddAddressPress}>
            <Text style={themedSummaryStyles.editButtonText}>Change Address</Text>
          </Pressable>
        </View>
      );
    } else {
      return (
        <View style={[themedStyles.card, themedSummaryStyles.missingAddressCard]}>
            <Text style={themedSummaryStyles.missingAddressText}>
                No delivery address added.
            </Text>
            <Pressable style={themedSummaryStyles.addButton} onPress={handleAddAddressPress}>
                <FontAwesome name="plus-circle" size={16} color="#fff" />
                <Text style={themedSummaryStyles.addButtonText}>Add Delivery Address</Text>
            </Pressable>
        </View>
      );
    }
  };

  return (
    <View style={themedStyles.container}>
      
      <ScrollView 
        contentContainerStyle={themedStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={themedStyles.header}>Final Order Summary</Text>

        <Text style={themedStyles.sectionHeader}>Delivery To:</Text>
        {renderDeliverySection()} 
        
        <Text style={themedStyles.sectionHeader}>Items ({cartItems.length}):</Text>
        <View style={themedStyles.card}>
          {cartItems.map(item => (
            <SummaryItemRow key={item.id} item={item} theme={theme} themeName={themeName} />
          ))}
        </View>

        <Text style={themedStyles.sectionHeader}>Pricing:</Text>
        <View style={themedStyles.card}>
          {renderSummaryRow('Subtotal', totalPrice)}
          {renderSummaryRow('Shipping Fee', shippingFee)}
          {renderSummaryRow('Service Tax (5%)', serviceTax)}
          <View style={themedSummaryStyles.separator} />
          {renderSummaryRow('Grand Total', grandTotal, true)}
        </View>
        
        <View style={{ height: 100 }} /> 

      </ScrollView>

      <View style={[themedStyles.fixedButtonContainer, { paddingBottom: insets.bottom + 10 }]}>
        <Pressable 
          style={[
            themedStyles.confirmButton, 
            isPlacingOrder && themedStyles.disabledButton,
            !isAddressConfirmed && themedStyles.disabledButton 
          ]} 
          onPress={handleConfirmOrder}
          disabled={isPlacingOrder || !isAddressConfirmed}
        >
          {isPlacingOrder ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={themedStyles.buttonText}>
                {isAddressConfirmed ? `Confirm & Pay $${grandTotal.toFixed(2)}` : 'Add Address to Continue'}
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}


const createThemedStyles = (theme: ThemePlaceholder, themeName: string) => StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: theme.colors.background,
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 0,
  },
  header: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 20, 
    color: theme.colors.text 
  },
  sectionHeader: { 
    fontSize: 18, 
    fontWeight: '600', 
    marginTop: 15, 
    marginBottom: 10, 
    color: theme.colors.subtleText 
  },
  card: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: theme.colors.text,
    shadowOpacity: themeName === 'light' ? 0.1 : 0.3,
    shadowRadius: 5,
  },
  
  fixedButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.cardBackground,
    paddingTop: 10,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  confirmButton: {
    backgroundColor: theme.colors.success,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 5,
  },
  disabledButton: {
    backgroundColor: theme.colors.disabled,
  },
  buttonText: {
    color: theme.colors.cardBackground, 
    fontSize: 18,
    fontWeight: 'bold',
  },
});


const createThemedSummaryStyles = (theme: ThemePlaceholder, themeName: string) => StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  label: { fontSize: 16, color: theme.colors.subtleText },
  value: { fontSize: 16, fontWeight: '500', color: theme.colors.text },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    marginVertical: 10,
  },
  totalLabel: { fontSize: 18, fontWeight: '700', color: theme.colors.text },
  totalValue: { fontSize: 20, fontWeight: 'bold', color: theme.colors.primary },
  
  addressText: { fontSize: 16, fontWeight: '600', color: theme.colors.text },
  notesText: { fontSize: 14, color: theme.colors.subtleText, marginTop: 5 },
  editButton: {
    alignSelf: 'flex-start',
    marginTop: 10,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 5,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  editButtonText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },

  missingAddressCard: {
    backgroundColor: themeName === 'light' ? '#fff3e0' : theme.colors.warning + '30', 
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.warning,
    alignItems: 'center',
  },
  missingAddressText: {
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 10,
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: theme.colors.warning, 
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: theme.colors.cardBackground,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },

  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  itemImage: {
    width: 40,
    height: 40,
    borderRadius: 4,
    marginRight: 10,
    backgroundColor: theme.colors.background,
  },
  itemDetails: {
    flex: 1,
  },
  itemTitle: { 
      fontSize: 15, 
      color: theme.colors.text, 
      fontWeight: '500',
  },
  itemQuantity: {
      fontSize: 13,
      color: theme.colors.subtleText,
      marginTop: 2,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.text,
    marginLeft: 10,
  },
});