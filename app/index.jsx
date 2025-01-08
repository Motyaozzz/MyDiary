import { useState, useEffect, useCallback } from 'react'
import { Text, View, Image, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Link } from "expo-router";
import "../global.css";
import * as SecureStore from "expo-secure-store";

import { StateContextProvider, useStateContext } from './state/context'
import { SignUp } from './(auth)/sign-up'
import { SignIn } from './(auth)/sign-in'

import TabsLayout from './(tabs)/_layout'

import Entypo from '@expo/vector-icons/Entypo';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from "expo-font";
import { useFonts } from "expo-font";

import { useRouter } from 'expo-router';


SplashScreen.preventAutoHideAsync();

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
   const router = useRouter();
   router.replace("/MyDiaries");
}


// function HomeScreen() {
//    const [isSplashVisible, setIsSplashVisible] = useState(true); // Стейт для SplashScreen
//    const router = useRouter();

//    useEffect(() => {
//    // Устанавливаем таймер для скрытия SplashScreen через 5 секунд
//    const timer = setTimeout(() => {
//       setIsSplashVisible(false); // Убираем SplashScreen
//       router.push("/MyDiaries"); // Перенаправляем на MyDiaries
//    }, 2000);

//    return () => clearTimeout(timer); // Очищаем таймер при размонтировании
//    }, [router]);

//    if (isSplashVisible) {
//    return (
//       <View style={styles.splashContainer}>
//          <Image
//             source={require("../assets/images/diary-main.png")}
//             resizeMode="contain"
//             className="w-[115px] h-[115px]"
//          />
//          <Text style={styles.splashText}>Загрузка...</Text>
//       </View>
//    );
//    }

//    return null; // Этот код никогда не будет виден, так как перенаправление происходит после SplashScreen
// }

function SplashScreenComponent({ onFinish }) {
   useEffect(() => {
   async function prepare() {
      // Имитация загрузки
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await SplashScreen.hideAsync();
      onFinish(); // Уведомляем, что SplashScreen завершился
   }
   prepare();
   }, [onFinish]);

   return (
      <View style={styles.splashContainer}>
      <Image
         source={require('../assets/images/diary-main.png')} // Проверьте правильность пути к изображению
         resizeMode="contain"
         style={styles.logo}
      />
      <Text style={styles.splashText}>Загрузка...</Text>
      </View>
   );
}


// function SplashScreenComponent() {
//    const router = useRouter();
//    const [isReady, setIsReady] = useState(false);

//    useEffect(() => {
//       async function prepare() {
//          try {
//             // Задержка для имитации загрузки
//             await new Promise((resolve) => setTimeout(resolve, 2000));
//          } catch (e) {
//             console.warn(e);
//          } finally {
//             setIsReady(true);
//          }
//       }
//       prepare();
//    }, []);

//    useEffect(() => {
//       if (isReady) {
//          SplashScreen.hideAsync().then(() => {
//             router.replace('/(auth)'); // Перенаправление после завершения SplashScreen
//          });
//       }
//    }, [isReady, router]);

//    return (
//       <View>
//          <Image
//             source={require('../assets/images/diary-main.png')}
//             resizeMode="contain"
//          />
//          <Text>Загрузка...</Text>
//       </View>
//    );
// }







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

export default function App() {
   // // const [appIsReady, setAppIsReady] = useState(false);

   // // useEffect(() => {
   // //    async function prepare() {
   // //       try {
   // //          await new Promise(resolve => setTimeout(resolve, 2000));
   // //       } catch (e) {
   // //          console.warn(e);
   // //       } finally {
   // //          // Tell the application to render
   // //          setAppIsReady(true);
   // //       }
   // //    }

   // //    prepare();
   // // }, []);

   // // const onLayoutRootView = useCallback(() => {
   // //    console.log(appIsReady)
   // //    if (appIsReady) {
   // //       console.log("im here")
   // //       SplashScreen.hide();
   // //    }
   // // }, [appIsReady]);
   
   // // // console.log('test', appIsReady);

   // // if (!appIsReady) {
   // //    console.log("im here_2")
   // //    return <View>
   // //       <Text>SplashScreen Demo! 👋</Text>
   // //       <Image
   // //       source={require("../assets/images/diary-main.png")}
   // //       resizeMode="contain"
   // //       className="w-[115px] h-[115px]"
   // //       />
   // //    </View>
   // }

   const [isSplashFinished, setIsSplashFinished] = useState(false);

   if (!isSplashFinished) {
   // Показываем SplashScreen, пока оно активно
   return <SplashScreenComponent onFinish={() => setIsSplashFinished(true)} />;
   }


   return (
      // <View
      //    // style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'black' }}
      //    // onLayout={onLayoutRootView}
      //    >
         <StateContextProvider>
            {/* <SplashScreenComponent/> */}
               <AuthGuard>
                  <HomeScreen/>
               </AuthGuard>
         </StateContextProvider>
      // </View>
   )
}


const styles = StyleSheet.create({
   splashContainer: {
     flex: 1, // Занимаем весь экран
     justifyContent: 'center', // Центрируем по вертикали
     alignItems: 'center', // Центрируем по горизонтали
     backgroundColor: 'black', // Черный фон
   },
   logo: {
     width: 120, // Укажите подходящий размер логотипа
     height: 120,
     marginBottom: 20, // Отступ от текста
   },
   splashText: {
     color: 'white', // Белый текст
     fontSize: 18, // Размер текста
     fontWeight: 'bold', // Полужирный текст
   },
 });