import React, { useState } from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, TextInput, Image } from 'react-native'

import { CustomButton } from "../../components";
import {CustomInput} from '../../components';

import { useStateContext } from '../state/context'

import "../../global.css";

export const SignUp = () => {
   const { dispatch, state } = useStateContext()
   const [password, setPassword] = useState('')
   const [fail, setFail] = useState(null)

   const onSubmit = async () => {
      dispatch({
            type: 'SIGN-UP',
            payload: {
               password
            }
      })

      setPassword('')
   }

   return <View className="bg-primary h-full w-full flex justify-center items-center">
      <Text className="text-2xl font-pregular text-black mb-10 items-center text-center">Регистрация</Text>
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
            title='Зарегистрироваться'
            handlePress={onSubmit}
            containerStyles="mt-3 w-auto h-auto"
            isLoading={false}
      />
   </View>
}