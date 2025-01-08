import React, { useState } from 'react'
import { View, Text, TextInput, SafeAreaView, Image } from 'react-native'

import { useStateContext } from '../state/context'
import * as SecureStore from "expo-secure-store";
import { CustomButton } from "../../components";

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

   return <View className="bg-primary h-full w-full flex justify-center px-4 items-center">
      <Text className="text-2xl font-pextrabold text-white my-10 items-center text-center">Авторизация</Text>
      <Image
            source={require("../../assets/images/diary-main.png")}
            resizeMode="contain"
            className="w-[115px] h-[115px]"
      />
      <SafeAreaView className="w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 focus:border-secondary flex flex-row items-center mt-7">
            <TextInput
               className="flex-1 text-white font-pbold text-base"
               secureTextEntry
               placeholder="Пароль"
               placeholderTextColor="#7B7B8B"
               value={password}
               onChangeText={setPassword}
            />
      </SafeAreaView>
      {
            state.loginErr != undefined ? <Text className="text-3xl color-red-600">{state.loginErr}</Text> : null
      }
      <CustomButton
            title='Войти'
            handlePress={onSubmit}
            containerStyles="mt-7"
            isLoading={false}
      />
   </View>
}