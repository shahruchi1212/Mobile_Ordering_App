import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true, 
    shouldShowList: true,   
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});


export async function registerForPushNotificationsAsync() {
  let token;

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.error('Failed to get push token: Permissions not granted.');
    return;
  }

  try {
    token = (await Notifications.getExpoPushTokenAsync({ 
        projectId: 'YOUR_EXPO_PROJECT_ID_HERE' 
    })).data;
    
    console.log('Expo Push Token:', token);
  } catch (error) {
    // console.error('Error getting Expo Push Token:', error);
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}



type OrderStatusNotification = 'PENDING' | 'EN_ROUTE' | 'DELIVERED';

/**
 * Mocks the arrival of a remote push notification by scheduling a local one.
 */
export async function sendLocalOrderNotification(status: OrderStatusNotification) {
  let body = 'Your order status has been updated.';

  if (status === 'PENDING') {
      body = 'Your order has been confirmed!';
  } else if (status === 'EN_ROUTE') {
      body = 'Good news! Your order is out for delivery! 🛵';
  } else if (status === 'DELIVERED') {
      body = 'Your order has been delivered! 🎉';
  }
  
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Order Status Update',
      body: body,
      data: { status: status, orderId: 'MOCK-12345' },
    },
    trigger: { 
      type: 'timeInterval', 
      seconds: 1, 
      repeats: false, 
    },
  });
}