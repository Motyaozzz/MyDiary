import { View, Text, TouchableOpacity, Linking } from 'react-native'
import React, { useEffect, useState, useCallback } from 'react'

import { useFocusEffect } from "@react-navigation/native";

import rncomm from 'react-native-communications'
import AsyncStorage from '@react-native-async-storage/async-storage'

const PHONE = '89202618810'
const MAIL = 'mikrozaim-ochen-bistro@mail.ru'

// function generateIsNumberEven (num) {
//     let code = `function isNumberEvent (num) {`
//     code += 'if (num < 0) {'
//     code += '  return "Нельзя отрицательные"'
//     code += '}'
//     for (let i = 0; i < num; i++) {
//         code += `if (num === ${i}) {\n\treturn ${String(i % 2 === 0)}\n}`
//     }
//     code += '}'
//     return code
// }

// function highPerofrmance(n) {
//     const code = generateIsNumberEven(n)
//     eval(code)
// }

const Settings = () => {
    const [fail, setFail] = useState(null)
    const [profile, setProfile] = useState(null)

    const guard = useCallback((cb) => {
        return () => {
            setFail(null)
            try {
                cb()
            } catch (e) {
                setFail(e.message)
            }
        }
    }, [])

    useFocusEffect(React.useCallback(() => {
        const onLoadProfile = async() => {
            let profile
            try {
                profile = JSON.parse(await AsyncStorage.getItem("profile")) ?? {}
            } catch (e) {
                console.error(e)
                profile = {}
            }
            setProfile(profile)
        }

        onLoadProfile()
    }, []))

    const mailTemplate = ({ lastName, firstName }) => {
        if (!lastName && !firstName) {
            return `Добрый день! Прошу помочь мне с `
        }

        const name = [lastName, firstName].filter(Boolean).join(' ')

        return `Добрый день! Прошу помочь мне с \n\nС уважением, ${name}!`
    }

    const onCall = () => {
        Linking.openURL(`tel:${PHONE}`)
    }

    const onSMS = () => {
        const template = mailTemplate(profile)
        rncomm.text(PHONE, template)
    }

    const onEmail = () => {
        const template = mailTemplate(profile)
        rncomm.email([MAIL], null, null, null, template)
    }

    return (
        <View className="bg-primary h-full w-full px-4 py-8 bg-gr">
            <Text className="text-2xl font-pextrabold text-white mb-4 pt-7 items-center text-center">
                Настройки
            </Text>
            {
                fail && <Text className='text-red-600 text-2xl'>{fail}</Text>
            }
            {
                profile === null ?
                    <Text className='text-white text-2xl'>Загрузка</Text> :
                    <>
                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={guard(onCall)}
                            className='p-4 bg-slate-700 mb-4 rounded-lg'
                        >
                            <Text className='text-white text-xl'>Звонок в поддержку</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={guard(onSMS)}
                            className='p-4 bg-slate-700 mb-4 rounded-lg'
                        >
                            <Text className='text-white text-xl'>СМС в поддержку</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={guard(onEmail)}
                            className='p-4 bg-slate-700 mb-4 rounded-lg'
                        >
                            <Text className='text-white text-xl'>Письмо в поддержку</Text>
                        </TouchableOpacity>
                    </>
            }
        </View>
    )
}

export default Settings