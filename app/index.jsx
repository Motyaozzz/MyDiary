import { useState, useEffect } from 'react'
import { Text, View, Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Link } from "expo-router";
import "../global.css";
import * as SecureStore from "expo-secure-store";

import { StateContextProvider, useStateContext } from './state/context'
import { SignUp } from './(auth)/sign-up'
import { SignIn } from './(auth)/sign-in'

import { CustomButton } from "../components";
import { getNotificationPermissions, notificate } from './common';
import { PushNotifications } from './exponot';

function HomeScreen() {
    return <View className="flex-1 justify-center items-center">
         <PushNotifications />
         <Text className="text-3xl text-center font-pblack color-orange-400">
            MyDiary
        </Text>
        <Image
            source={require("../assets/images/diary-main.png")}
            className="h-40 w-40"
        />
        <StatusBar style="auto" />
        <Link
            href="/MyDiaries"
            className='bg-secondary rounded-2xl flex flex-row justify-center items-center py-4 px-4 mt-7 text-primary font-pbold text-lg'
        >
            Go to Home
        </Link>
    </View>
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


export default function App() {
    return <StateContextProvider>
        <AuthGuard>
            <HomeScreen />
        </AuthGuard>
    </StateContextProvider>
}