// app/(stack)/_layout.tsx (Updated)
import { Stack } from 'expo-router';
import React from 'react';
import { CustomHeader } from '../../components/base/CustomHeader'; // Import the custom component

export default function StackLayout() {
  return (
    <Stack
      screenOptions={{
        header: (props) => <CustomHeader {...props} />,
        headerShown: true, 
      }}
    >
     
      <Stack.Screen 
        name="request-product" 
        options={{ 
            title: 'Your Shopping Cart',
        }} 
      />
      
      <Stack.Screen 
        name="delivery-location" 
        options={{ title: 'Delivery Address' }} 
      />
      
      <Stack.Screen 
        name="order-summary" 
        options={{ title: 'Order Summary' }} 
      />
      
      <Stack.Screen 
        name="order-status" 
        options={{ 
            title: 'Order Tracking',
            headerShown: false, 
        }} 
      />
    </Stack>
  );
}