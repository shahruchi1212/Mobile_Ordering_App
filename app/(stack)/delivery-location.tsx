import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { ScreenContainer } from '../../components/base/ScreenContainer';
import { useTheme } from '../../store/ThemeContext';
type ThemePlaceholder = ReturnType<typeof useTheme>['theme'];

export default function DeliveryLocationScreen() {
 
  const router = useRouter();
  const { theme } = useTheme();
  const themedStyles = createThemedStyles(theme);

  const [address, setAddress] = useState({
    street: '123 Main St',
    city: 'Springfield',
    zip: '90210',
    notes: 'Leave at front door.',
  });

  const handleConfirm = () => {
    if (!address.street || !address.city || !address.zip) {
      Alert.alert('Missing Info', 'Please fill in all required address fields.');
      return;
    }
    
    // Pass the address data to the Order Summary screen
    router.push({
      pathname: '/(stack)/order-summary',
      params: { 
        deliveryAddress: JSON.stringify(address) 
      },
    });
  };

  return (
    <ScreenContainer>
      <Text style={themedStyles.header}>Confirm Delivery Location</Text>
      
      <View style={themedStyles.card}>
        <Text style={themedStyles.label}>Street Address *</Text>
        <TextInput
          style={themedStyles.input}
          value={address.street}
          onChangeText={(text) => setAddress({...address, street: text})}
          placeholder="e.g., 123 Main St"
          placeholderTextColor={theme.colors.subtleText}
        />
        
        <Text style={themedStyles.label}>City *</Text>
        <TextInput
          style={themedStyles.input}
          value={address.city}
          onChangeText={(text) => setAddress({...address, city: text})}
          placeholder="e.g., Springfield"
          placeholderTextColor={theme.colors.subtleText}
        />
        
        <Text style={themedStyles.label}>Zip Code *</Text>
        <TextInput
          style={themedStyles.input}
          value={address.zip}
          onChangeText={(text) => setAddress({...address, zip: text})}
          keyboardType="number-pad"
          placeholder="e.g., 90210"
          placeholderTextColor={theme.colors.subtleText}
        />
        
        <Text style={themedStyles.label}>Delivery Notes (Optional)</Text>
        <TextInput
          style={[themedStyles.input, themedStyles.notesInput]}
          value={address.notes}
          onChangeText={(text) => setAddress({...address, notes: text})}
          placeholder="Ring bell twice..."
          placeholderTextColor={theme.colors.subtleText}
          multiline
        />
      </View>

      <Pressable style={themedStyles.confirmButton} onPress={handleConfirm}>
        <Text style={themedStyles.buttonText}>Confirm Address & Continue</Text>
      </Pressable>
    </ScreenContainer>
  );
}


const createThemedStyles = (theme: ThemePlaceholder) => StyleSheet.create({
  header: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    marginBottom: 20,
    color: theme.colors.text
  },
  card: {
    backgroundColor: theme.colors.cardBackground, 
    borderRadius: 10,
    padding: 15,
    elevation: 2,
    shadowColor: theme.colors.text, 
    shadowOpacity:  0.3,
    shadowRadius: 5,
  },
  label: { 
    fontSize: 14, 
    fontWeight: '600', 
    marginTop: 15, 
    marginBottom: 5, 
    color: theme.colors.subtleText 
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border, 
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: theme.colors.background, 
    color: theme.colors.text, 
  },
  notesInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  confirmButton: {
    backgroundColor: theme.colors.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30,
  },
  buttonText: {
    color: theme.colors.cardBackground, 
    fontSize: 18,
    fontWeight: 'bold',
  },
});