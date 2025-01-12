import { useEffect, useState } from "react";
import { SplashScreen, Stack } from "expo-router";
import { View, Text } from "react-native";
import { useFonts } from "expo-font";
import LottieView from 'lottie-react-native';
import "../global.css";
import { StateContextProvider } from './state/context';

const RootLayout = () => {
   const [fontsLoaded, error] = useFonts({
      "Playfair-Black": require("../assets/fonts/PlayfairDisplay-Black.ttf"),
      "Playfair-Bold": require("../assets/fonts/PlayfairDisplay-Bold.ttf"),
      "Playfair-ExtraBold": require("../assets/fonts/PlayfairDisplay-ExtraBold.ttf"),
      "Playfair-Medium": require("../assets/fonts/PlayfairDisplay-Medium.ttf"),
      "Playfair-Regular": require("../assets/fonts/PlayfairDisplay-Regular.ttf"),
      "Playfair-SemiBold": require("../assets/fonts/PlayfairDisplay-SemiBold.ttf")
   });

   const [isReady, setIsReady] = useState(false);

   useEffect(() => {
      const timer = setTimeout(() => {
         setIsReady(true);
         SplashScreen.hideAsync();
      }, 2000);

      return () => clearTimeout(timer);
   }, []);

   if (!fontsLoaded || error || !isReady) {
      return (
         <View className="flex-1 items-center justify-center bg-primary">
               <LottieView
                  source={require('../assets/animations/book_lottie.json')}
                  autoPlay
                  loop
                  style={{ width: 600, height: 600 }}
               />
               <Text
               className="text-accent font-pbold text-5xl"
               >
               MyDiary
               </Text>
         </View>
      );
   }

   return (
      <StateContextProvider>
         <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
         </Stack>
      </StateContextProvider>
   );
};

export default RootLayout;
