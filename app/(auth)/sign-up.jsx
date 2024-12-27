import React, { useState } from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Button, ScrollView, Dimensions, TextInput, Image } from 'react-native'

import { CustomButton } from "../../components";
import { useStateContext } from '../state/context'


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

    return (
        <SafeAreaView className="bg-primary h-full">
            <ScrollView>
                <View className="w-full flex justify-center h-full px-4 my-6 items-center"
                    style={{
                        minHeight: Dimensions.get("window").height - 100,
                    }}>
                    <Text className="text-2xl font-pextrabold text-white my-10 items-center text-center">Welcome to MyDiary</Text>

                    <Image
                        source={require("../../assets/images/diary-main.png")}
                        resizeMode="contain"
                        className="w-[115px] h-[115px]"
                    />

                    <View className="w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 focus:border-secondary flex flex-row items-center mt-7">
                        <TextInput
                            className="flex-1 text-white font-pbold text-base"
                            secureTextEntry
                            placeholder="Пароль"
                            placeholderTextColor="#7B7B8B"
                            value={password}
                            onChangeText={setPassword}
                        />
                    </View>
                    <CustomButton
                        title='Зарегистрироваться'
                        handlePress={onSubmit}
                        containerStyles="mt-7"
                        isLoading={false}
                    />
                    {
                        state.loginErr != undefined ? <Text className="color-red-600">{state.loginErr}</Text> : null
                    }
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}