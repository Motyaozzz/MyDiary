import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import { View } from 'react-native';

Notifications.setNotificationHandler({
   handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
   }),
});

async function registerForPushNotificationsAsync() {
   let token;
   const { status: existingStatus } = await Notifications.getPermissionsAsync();
   let finalStatus = existingStatus;
   if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
   }
   if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
   }
   const projectId = Constants.expoConfig.extra.eas.projectId;
   token = (await Notifications.getExpoPushTokenAsync({projectId})).data;

   return token;
}

export function PushNotifications() {
   useEffect(() => {
      registerForPushNotificationsAsync()
         .then((token) => {
            Notifications.scheduleNotificationAsync({
               content: {
               title: "Diary",
               body: "Добрый день! Давно вас ждем!",
               },
               trigger: null,
            })
         })
}, []);

return <View></View>
}
