import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { CartProvider } from '../store/CartContext';
import { ThemeProvider, useTheme } from '../store/ThemeContext';

function ThemedRootLayout() {
  const { theme } = useTheme();

  const statusBarStyle = theme.statusBarStyle === 'dark' ? 'dark' : 'light';

  return (
    <>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(stack)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
      <StatusBar style={statusBarStyle} />
    </>
  );
}


export default function RootLayout() {
  return (
    <ThemeProvider>
      <CartProvider>
        <ThemedRootLayout />
      </CartProvider>
    </ThemeProvider>
  );
}