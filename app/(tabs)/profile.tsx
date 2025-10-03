
import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, StyleSheet, Switch, Text, View } from 'react-native';
import { ScreenContainer } from '../../components/base/ScreenContainer';


import { useFetchData } from '@/hooks/useFetchData';
import { fetchUserProfile } from '@/services/api';
import { useTheme } from '../../store/ThemeContext';
type ThemePlaceholder = ReturnType<typeof useTheme>['theme'];

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  website: string;
  company: {
    name: string;
  };
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
  };
}


const ProfileRow: React.FC<{ icon: string; label: string; value: string }> = ({ icon, label, value }) => {
  const { theme } = useTheme();
  return (
    <View style={themedStyles(theme).row}>
      <FontAwesome name={icon as any} size={20} color={theme.colors.primary} style={themedStyles(theme).icon} />
      <View style={themedStyles(theme).textContainer}>
        <Text style={themedStyles(theme).label}>{label}</Text>
        <Text style={themedStyles(theme).value}>{value}</Text>
      </View>
    </View>
  );
};

export default function ProfileScreen() {
  const { theme, themeName, toggleTheme } = useTheme();

  const { data: user, loading, error } = useFetchData<UserProfile>(() => fetchUserProfile());

  if (loading) {
    return (
      <ScreenContainer>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </ScreenContainer>
    );
  }

  if (error) {
    return (
      <ScreenContainer>
        <Text style={{ color: theme.colors.text }}>Error loading profile: {error}</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <Text style={themedStyles(theme).header}>My Profile</Text>


      <View style={themedStyles(theme).toggleSection}>
        <FontAwesome name={themeName === 'light' ? 'sun-o' : 'moon-o'} size={24} color={theme.colors.text} />
        <Text style={themedStyles(theme).toggleLabel}>
          {themeName === 'light' ? 'Light Mode' : 'Dark Mode'}
        </Text>
        <Switch
          value={themeName === 'dark'}
          onValueChange={toggleTheme}
          trackColor={{ false: theme.colors.subtleText, true: theme.colors.primary }}
          thumbColor={theme.colors.background}
        />
      </View>


      <View style={themedStyles(theme).card}>
        <Text style={themedStyles(theme).name}>{user?.name}</Text>
        <Text style={themedStyles(theme).company}>{user?.company.name}</Text>
      </View>


      <View style={themedStyles(theme).card}>
        <ProfileRow icon="envelope-o" label="Email" value={user?.email || 'N/A'} />
        <ProfileRow icon="phone" label="Phone" value={user?.phone.split(' ')[0] || 'N/A'} />
        <ProfileRow icon="globe" label="Website" value={user?.website || 'N/A'} />
      </View>


      <View style={themedStyles(theme).card}>
        <ProfileRow
          icon="home"
          label="Address"
          value={`${user?.address.street}, ${user?.address.city}`}
        />
        <Text style={themedStyles(theme).zip}>{user?.address.zipcode}</Text>
      </View>

    </ScreenContainer>
  );
}
const themedStyles = (theme: ThemePlaceholder) => StyleSheet.create({
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: theme.colors.text
  },
  card: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 4,
  },
  company: {
    fontSize: 16,
    color: theme.colors.subtleText,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  icon: {
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: theme.colors.subtleText,
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text,
  },
  zip: {
    fontSize: 14,
    color: theme.colors.subtleText,
    marginTop: 5,
    marginLeft: 40,
  },
  toggleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.cardBackground,
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  toggleLabel: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text,
    marginLeft: 15,
  }
});