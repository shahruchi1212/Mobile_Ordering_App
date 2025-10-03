
import React, { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../store/ThemeContext';

interface Props {
  children: ReactNode;
  scrollable?: boolean;
  style?: ViewStyle;
}

export const ScreenContainer: React.FC<Props> = ({ children, scrollable = true, style }) => {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme(); 
  const containerStyle = [
    styles.container,
    { backgroundColor: theme.colors.background, paddingTop: insets.top },
    style,
  ];

  if (scrollable) {
    return (
      <ScrollView 
        style={containerStyle} 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    );
  }

  return (
    <View style={[containerStyle, styles.content]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    flexGrow: 1,
  },
});