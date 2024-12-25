import { View, Text, TouchableOpacity, Linking } from 'react-native'
import React, { useEffect, useState } from 'react'

import rncomm from 'react-native-communications'
import AsyncStorage from '@react-native-async-storage/async-storage'

const PHONE = '89202618810'
const MAIL = 'mikrozaim-ochen-bistro@mail.ru'

const Settings = () => {
    const [fail, setFail] = useState(null)
    const [loading, setLoading] = useState(false)
    const [profile, setProfile] = useState(null)

    const guard = (cb) => {
        return () => {
            setFail(null)
            try {
                cb()
            } catch (e) {
                setFail(e.message)
            }
        }
    }

    const getProfile = async () => {
        try {
            return JSON.parse(await AsyncStorage.getItem("profile")) ?? {}
        } catch (e) {
            console.error(e)
            return {}
        }
    }

    useEffect(() => {
        guard(async () => {
            setLoading(true)
            const profile = await getProfile()
            setProfile(profile)
            setLoading(false)
        })()
    }, [])

    const mailTemplate = ({ lastName, firstName }) => {
        if (!lastName && !firstName) {
            return `Добрый день! Прошу помочь мне с `
        }

        const name = [lastName, firstName].filter(Boolean).join(' ')

        return `Добрый день! Прошу помочь мне с \n\nС уважением, ${name}!`
    }

    const onCall = () => {
        rncomm.phonecall(PHONE, false)
        Linking.openURL(`tel:${PHONE}`);
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
                loading ?
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