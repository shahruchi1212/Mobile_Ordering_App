
import { FontAwesome } from '@expo/vector-icons';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../store/ThemeContext';

type ThemePlaceholder = ReturnType<typeof useTheme>['theme'];
type CustomHeaderProps = NativeStackHeaderProps & {
    showBack?: boolean;
};

export const CustomHeader: React.FC<CustomHeaderProps> = ({
    options,
    route,
    showBack = true
}) => {

    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { theme } = useTheme();
    const themedStyles = createThemedStyles(theme);

    const title = options.title !== undefined ? options.title : route.name;

    const handleBackPress = () => {
        router.back();
    };

    return (
        <View style={[themedStyles.headerContainer, { paddingTop: insets.top }]}>
            <View style={themedStyles.contentContainer}>
                <View style={themedStyles.left}>
                    {showBack && (
                        <Pressable onPress={handleBackPress} style={themedStyles.backButton}>
                            <FontAwesome name="arrow-left" size={20} color={theme.colors.text} />
                        </Pressable>
                    )}
                </View>

                <View style={themedStyles.center}>
                    <Text style={themedStyles.title} numberOfLines={1}>{title}</Text>
                </View>

                <View style={themedStyles.right} />
            </View>
        </View>
    );
};


const createThemedStyles = (theme: ThemePlaceholder) => StyleSheet.create({
    headerContainer: {
        backgroundColor: theme.colors.cardBackground,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
        paddingBottom: 10,
    },
    contentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 45,
        paddingHorizontal: 16,
    },
    left: {
        flex: 1,
        justifyContent: 'flex-start',
    },
    center: {
        flex: 4,
        alignItems: 'center',
    },
    right: {
        flex: 1,
        alignItems: 'flex-end',
    },
    backButton: {
        padding: 5,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
});