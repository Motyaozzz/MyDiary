import { SplashScreen, Stack } from 'expo-router'
import { useEffect } from "react";
import { useFonts } from "expo-font";
import "../global.css"
import { StateContextProvider } from './state/context';

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
    const [fontsLoaded, error] = useFonts({
        "Playfair-Black": require("../assets/fonts/PlayfairDisplay-Black.ttf"),
        "Playfair-Bold": require("../assets/fonts/PlayfairDisplay-Bold.ttf"),
        "Playfair-ExtraBold": require("../assets/fonts/PlayfairDisplay-ExtraBold.ttf"),
        "Playfair-Medium": require("../assets/fonts/PlayfairDisplay-Medium.ttf"),
        "Playfair-Regular": require("../assets/fonts/PlayfairDisplay-Regular.ttf"),
        "Playfair-SemiBold": require("../assets/fonts/PlayfairDisplay-SemiBold.ttf")
    });

    useEffect(() => {
        if (error) throw error;

        if (fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded, error]);

    if (!fontsLoaded) {
        return null;
    }

    if (!fontsLoaded && !error) {
        return null;
    }
    return (
      <StateContextProvider>
         <Stack>
            <Stack.Screen name="index" options={{ headerShown: false}} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false}} />
        </Stack>
      </StateContextProvider>
    )
}

export default RootLayout

