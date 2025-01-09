import React, { useState } from 'react'
import { View, Text, TextInput, SafeAreaView, Image } from 'react-native'

import { useStateContext } from '../state/context'
import * as SecureStore from "expo-secure-store";
import { CustomButton } from "../../components";

import "../../global.css";

export const SignIn = () => {
   const { dispatch, state } = useStateContext()
   const [password, setPassword] = useState('')

   const onSubmit = async () => {
      setPassword('')
      dispatch({
            type: 'SIGN-IN',
            payload: {
               password
            }

      })
   }
   const resetPass = async () => {
      await SecureStore.deleteItemAsync('diaryPassword')
      dispatch({
            type: 'RESET-PASS',
      })
   }

   return <View className="bg-primary h-full w-full flex justify-center items-center">
      <Text className="text-2xl font-pextrabold text-secondary my-5 items-center text-center">Авторизация</Text>
      <Image
            source={require("../../assets/images/diary-main.png")}
            resizeMode="contain"
            className="w-[115px] h-[115px]"
      />
      <SafeAreaView className="w-4/5 h-16 px-3 bg-black-100 rounded-2xl border-2 border-accent focus:border-accent-hover flex flex-row items-center mt-7">
            <TextInput
               className="flex-1 text-gray font-pbold text-base pl-3"
               secureTextEntry
               placeholder="Пароль"
               placeholderTextColor="#7B7B8B"
               value={password}
               onChangeText={setPassword}
            />
      </SafeAreaView>
      {
         
         state.loginErr != undefined ? <Text className="color-red-600 mt-5 text-xl">{state.loginErr}</Text> : null
      }
      <CustomButton
            title='Войти'
            handlePress={onSubmit}
            containerStyles="mt-5"
            isLoading={false}
      />
   </View>
}