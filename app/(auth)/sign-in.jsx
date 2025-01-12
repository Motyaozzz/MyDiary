import React, { useState } from 'react'
import { View, Text, TextInput, SafeAreaView, Image } from 'react-native'

import { useStateContext } from '../state/context'
import * as SecureStore from "expo-secure-store";
import { CustomButton } from "../../components";
import {CustomInput} from '../../components';

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
      <Text className="text-2xl font-pregular text-black mb-10 items-center text-center">Авторизация</Text>
      <Image
            source={require("../../assets/images/logo.png")}
            resizeMode="contain"
            className="w-[171px] h-[171px]"
      />
      <CustomInput
         value={password}
         onChangeText={setPassword}
         inputStyle="text-lg font-semibold text-gray w-4/5"
         containerStyle="my-5 w-full"
         placeholder="Пароль"
         isSecure={true}
      />
      {
         
         state.loginErr != undefined ? <Text className="color-red-600 mt-5 text-xl">{state.loginErr}</Text> : null
      }
      <CustomButton
            title='Войти'
            handlePress={onSubmit}
            containerStyles="mt-3 w-[110px] h-[55px]"
            isLoading={false}
      />
   </View>
}