import { FontAwesome } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Product } from '../../services/api';
import { useTheme } from '../../store/ThemeContext'; // <-- IMPORT THEME
type ThemePlaceholder = ReturnType<typeof useTheme>['theme'];


interface Props {
  product: Product;
  onAddToCart: (product: Product) => void; 
  onViewDetails : (product: Product) => void; 
  onQuantityChange: (productId: number, newQuantity: number) => void; 
  currentQuantity: number; 
}

export const ProductCard: React.FC<Props> = ({ 
  product, 
  onAddToCart, 
  onQuantityChange,
  onViewDetails, 
  currentQuantity 
}) => {
  

  const { theme } = useTheme(); 
  const themedStyles = createThemedStyles(theme); 

  const handleDecrement = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newQuantity = currentQuantity - 1;
    onQuantityChange(product.id, newQuantity);
  };

  const handleIncrement = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newQuantity = currentQuantity + 1;
    if (currentQuantity === 0) {
        onAddToCart(product); 
    } else {
        onQuantityChange(product.id, newQuantity);
    }
  };

  const handleDetailsPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onViewDetails(product);
  };

 
  const renderControl = () => {
    if (currentQuantity > 0) {
  
      return (
        <View style={themedStyles.quantityControlContainer}>
          <Pressable 
            style={[themedStyles.quantityButton, currentQuantity === 1 && themedStyles.removeButton]} 
            onPress={handleDecrement}
          >
            <FontAwesome 
              name={currentQuantity === 1 ? 'trash-o' : 'minus'} 
              size={18} 
              color={currentQuantity === 1 ? theme.colors.warning : theme.colors.text} 
            />
          </Pressable>

          <Text style={themedStyles.quantityText}>{currentQuantity}</Text>

          <Pressable 
            style={themedStyles.quantityButton} 
            onPress={handleIncrement}
          >
            <FontAwesome name="plus" size={18} color={theme.colors.text} />
          </Pressable>
        </View>
      );
    }

  
    return (
      <Pressable 
        style={themedStyles.button} 
        onPress={handleIncrement}
      >
        <Text style={themedStyles.buttonText}>Add to Cart</Text>
        <FontAwesome name="cart-plus" size={18} color={theme.colors.cardBackground} />
      </Pressable>
    );
  };
  // ------------------------------------
  
  return (
    <Pressable style={themedStyles.card} onPress={handleDetailsPress}> 
      <Image 
        style={themedStyles.image}
        source={{ uri: product.image }}
        contentFit="contain"
      />
      <View style={themedStyles.details}>
        <Text style={themedStyles.title} numberOfLines={2}>{product.title}</Text>
        <Text style={themedStyles.price}>${product.price.toFixed(2)}</Text>
        <Text style={themedStyles.category}>{product.category}</Text>
      </View>
      {renderControl()}
    </Pressable>
  );
};


const createThemedStyles = (theme: ThemePlaceholder) => StyleSheet.create({
  card: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: theme.colors.background,
  },
  details: {
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
    minHeight: 40,
  },
  price: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.primary,
    marginTop: 4,
  },
  category: {
    fontSize: 12,
    color: theme.colors.subtleText,
    marginTop: 2,
    textTransform: 'capitalize',
  },
  button: { 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.success,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  buttonText: {
    color: theme.colors.cardBackground,
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  quantityControlContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    backgroundColor: theme.colors.cardBackground, 
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  quantityButton: {
    backgroundColor: theme.colors.primary, 
    paddingVertical: 12,
    width: '30%',
    alignItems: 'center',
  },
  removeButton: {
    backgroundColor: theme.colors.cardBackground,
    borderWidth: 1,
    borderColor: theme.colors.warning,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    textAlign: 'center',
    width: '40%',
  }
});