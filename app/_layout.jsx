import { useEffect, useState } from "react";
import { SplashScreen, Stack } from "expo-router";
import { Image, View, Text} from "react-native";
import { useFonts } from "expo-font";
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
         <View className="flex-1 justify-center items-center bg-white">
            <Text className="text-secondary-100 mb-5 text-3xl font-extrabold">Welcome to MyDiary!</Text>
            <Image
               source={require('../assets/images/diary-main.png')}
               className="w-[115px] h-[115px]"
               resizeMode="contain"
            />
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
