import { sendLocalOrderNotification } from '@/hooks/useNotifications';
import { FontAwesome } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, Text, View } from 'react-native';
import { ScreenContainer } from '../../components/base/ScreenContainer';
import { useTheme } from '../../store/ThemeContext';


type ThemePlaceholder = ReturnType<typeof useTheme>['theme'];

type OrderStatus = 'PENDING' | 'EN_ROUTE' | 'DELIVERED';

interface StatusStep {
    status: OrderStatus;
    title: string;
    icon: string;
    color: string;
}

const STATUS_STEPS: StatusStep[] = [
    { status: 'PENDING', title: 'Order Confirmed', icon: 'hourglass-start', color: '#ffc107' },
    { status: 'EN_ROUTE', title: 'Out for Delivery', icon: 'truck', color: '#007aff' },
    { status: 'DELIVERED', title: 'Delivered!', icon: 'check-circle', color: '#28a745' },
];

export default function OrderStatusScreen() {

    const router = useRouter();
    const params = useLocalSearchParams();
    const { theme, themeName } = useTheme();
    const themedStyles = createThemedStyles(theme, themeName);
    const orderId = params.orderId as string;
    const total = params.total as string;

    const [currentStatus, setCurrentStatus] = useState<OrderStatus>('PENDING');

    useEffect(() => {
      
        sendLocalOrderNotification('PENDING');
        
        const timer1 = setTimeout(() => {
            const nextStatus: OrderStatus = 'EN_ROUTE';
            setCurrentStatus(nextStatus);
            sendLocalOrderNotification(nextStatus); 
        }, 3000);

      
        const timer2 = setTimeout(() => {
            const nextStatus: OrderStatus = 'DELIVERED';
            setCurrentStatus(nextStatus);
            sendLocalOrderNotification(nextStatus); 
        }, 6000);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
        
    }, []); 

    const handleGoHome = () => {
        router.replace('../(tabs)');
    };

    const getCurrentStep = () => STATUS_STEPS.findIndex(step => step.status === currentStatus);

    return (
        <ScreenContainer scrollable={false}>
            <View style={themedStyles.container}>
                <Text style={themedStyles.header}>Order Status</Text>
                <Text style={themedStyles.orderId}>Order ID: **{orderId || 'N/A'}**</Text>

                <View style={themedStyles.timeline}>
                    {STATUS_STEPS.map((step, index) => {
                        const isActive = index <= getCurrentStep();
                        return (
                            <View key={step.status} style={themedStyles.step}>
                                <View style={[themedStyles.iconCircle, { backgroundColor: isActive ? step.color : theme.colors.disabled }]}>
                                    <FontAwesome name={step.icon as any} size={24} color="#fff" />
                                </View>
                                <View style={themedStyles.textContainer}>
                                    <Text
                                        style={[
                                            themedStyles.stepTitle,
                                            isActive ? themedStyles.activeText : themedStyles.inactiveText
                                        ]}
                                    >
                                        {step.title}
                                    </Text>
                                    {isActive && index < STATUS_STEPS.length - 1 && (
                                        <ActivityIndicator size="small" color={step.color} style={themedStyles.spinner} />
                                    )}
                                </View>
                                {index < STATUS_STEPS.length - 1 && (
                                    <View
                                        style={[
                                            themedStyles.line,
                                            { backgroundColor: isActive ? step.color : theme.colors.border }
                                        ]}
                                    />
                                )}
                            </View>
                        );
                    })}
                </View>

                {currentStatus === 'DELIVERED' && (
                    <View style={[themedStyles.deliveryBox, { borderColor: STATUS_STEPS[2].color }]}>
                        <Text style={[themedStyles.deliveryText, { color: STATUS_STEPS[2].color }]}>
                            Your order is complete! Total Paid: **${total}**
                        </Text>
                    </View>
                )}

                <View style={themedStyles.buttonContainer}>
                    <Button
                        title="Back to Home"
                        onPress={handleGoHome}
                        color={theme.colors.primary}
                    />
                </View>
            </View>
        </ScreenContainer>
    );
}


const createThemedStyles = (theme: ThemePlaceholder, themeName: string) => StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 20,
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 5,
        color: theme.colors.text
    },
    orderId: {
        fontSize: 16,
        color: theme.colors.subtleText,
        marginBottom: 30
    },
    timeline: {
        width: '90%',
        paddingHorizontal: 20,
        alignItems: 'flex-start',
        marginBottom: 50,
    },
    step: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 90,
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
        marginRight: 15,
    },
    textContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    stepTitle: {
        fontSize: 18,
        fontWeight: '400',
    },
    inactiveText: {
        color: theme.colors.subtleText, 
    },
    activeText: {
        fontWeight: '600',
        color: theme.colors.text, 
    },
    spinner: {
        marginLeft: 10,
    },
    line: {
        position: 'absolute',
        left: 20,
        top: 40,
        width: 2,
        height: 50,
    },
    deliveryBox: {
        padding: 20,
        backgroundColor: themeName === 'light' ? '#e6ffed' : '#28a74530',
        borderRadius: 10,
        borderWidth: 1,
        marginVertical: 20,
    },
    deliveryText: {
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    buttonContainer: {
        width: '80%',
        marginTop: 30,
    }
});