import { useState, useEffect } from 'react'
import { Text, View, Image, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Link } from "expo-router";
import "../global.css";
import * as SecureStore from "expo-secure-store";

import { StateContextProvider, useStateContext } from './state/context'
import { SignUp } from './(auth)/sign-up'
import { SignIn } from './(auth)/sign-in'

import { PushNotifications } from './exponot';
import { SplashScreen, Stack } from 'expo-router'
import { useRouter } from 'expo-router';



// function HomeScreen() {
//     return <View className="flex-1 justify-center items-center">
//          <PushNotifications />
//          <Text className="text-3xl text-center font-pblack color-orange-400">
//             MyDiary
//         </Text>
//         <Image
//             source={require("../assets/images/diary-main.png")}
//             className="h-40 w-40"
//         />
//         <StatusBar style="auto" />
//         <Link
//             href="/MyDiaries"
//             className='bg-secondary rounded-2xl flex flex-row justify-center items-center py-4 px-4 mt-7 text-primary font-pbold text-lg'
//         >
//             Go to Home
//         </Link>
//     </View>
// }





function HomeScreen() {
   const [isSplashVisible, setIsSplashVisible] = useState(true); // Стейт для SplashScreen
   const router = useRouter();
 
   useEffect(() => {
     // Устанавливаем таймер для скрытия SplashScreen через 5 секунд
     const timer = setTimeout(() => {
       setIsSplashVisible(false); // Убираем SplashScreen
       router.push("/MyDiaries"); // Перенаправляем на MyDiaries
     }, 5000);
 
     return () => clearTimeout(timer); // Очищаем таймер при размонтировании
   }, [router]);
 
   if (isSplashVisible) {
     return (
       <View style={styles.splashContainer}>
         <Image
            source={require("../assets/images/diary-main.png")}
            resizeMode="contain"
            className="w-[115px] h-[115px]"
         />
         <Text style={styles.splashText}>Загрузка...</Text>
       </View>
     );
   }
 
   return null; // Этот код никогда не будет виден, так как перенаправление происходит после SplashScreen
 }





function AuthGuard({ children }) {
    const { state } = useStateContext()

    if (!state.isSigned) {
        return <SignUp />
    }

    if (!state.isLogged) {
        return <SignIn />
    }

    return children
}

async function checkLastVisit() {
	const lastVisit = await AsyncStorage.getItem('lastVisit');
	const now = Date.now(); 
	
	if (lastVisit) {
	const lastVisitTime = parseInt(lastVisit, 10);
	const twoDaysInMs = 5;

	if (now - lastVisitTime > twoDaysInMs) {
	await notificate();
	} 
   }
   await AsyncStorage.setItem('lastVisit', now.toString()); 
}

const styles = StyleSheet.create({
   splashContainer: {
     flex: 1,
     justifyContent: "center",
     alignItems: "center",
     backgroundColor: "#ffffff",
   },
   splashText: {
     fontSize: 18,
     marginTop: 20,
     color: "#FFA500",
   },
 });

export default function App() {
    return <StateContextProvider>
        <AuthGuard>
            <HomeScreen />
        </AuthGuard>
    </StateContextProvider>
}