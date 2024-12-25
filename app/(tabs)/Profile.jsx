import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'

import { CustomButton } from '../../components'
import AsyncStorage from '@react-native-async-storage/async-storage'

function Input({
    label,
    value,
    onChange,
    className = '',
    disabled = false
}) {

    const resolvedClassName = [className, 'w-100'].join(' ')

    const inputClassNames = ['color-black']
    if (disabled) {
        inputClassNames.push('bg-gray-100')
    } else {
        inputClassNames.push('bg-white')
    }

    return <View className={resolvedClassName}>
        <Text className='color-white mb-1'>{label}</Text>
        <TextInput
            editable={!disabled}
            className={inputClassNames.join(' ')}
            value={value}
            onChangeText={onChange}
            placeholder={'Не заполнено'}
        />
    </View>
}

const DefaultProfile = {
    firstName: '',
    lastName: ''
}

const ProfileForm = ({
    initProfile,
}) => {
    const [fail, setFail] = useState(null)
    const [loading, setLoading] = useState(false)
    const [profile, setProfile] = useState({ ...initProfile })

    const onEditProfile = async () => {
        setFail(null)
        setLoading(true)
        try {
            const json = JSON.stringify(profile)
            await AsyncStorage.setItem("profile", json)

        } catch (e) {
            setFail(e.message)
        }
        setLoading(false)
        Alert.alert("Успех", "Данные профиля сохранены");
    }

    return <View className="bg-primary h-full w-full px-4 py-8 bg-gr">
        <Text className="text-2xl font-pextrabold text-white mb-4 pt-7 items-center text-center">Профиль</Text>

        {/* <Text className='font-pmedium text-white mb-2 pt-7'>
         Имя
        </Text>
        <View className="bg-white w-full rounded-md border">
            <TextInput 
            placeholder="Введите имя..."
            placeholderTextColor="gray"
            disabled={loading}
            value={profile.firstName}
            onChange={(value) => setProfile(prev => ({ ...prev, firstName: value }))}
            />
        </View>

        <Text className='font-pmedium text-white mb-2 pt-7'>
         Фамилия
        </Text>
        <View className="bg-white w-full rounded-md border mb-6">
            <TextInput 
            placeholder="Введите фамилию..."
            placeholderTextColor="gray"
            disabled={loading}
            value={profile.lastName}
            onChange={(value) => setProfile(prev => ({ ...prev, lastName: value }))}
            />
        </View> */}
        <Input
            disabled={loading}
            className='my-5'
            label='Имя'
            value={profile.firstName}
            onChange={(value) => setProfile(prev => ({ ...prev, firstName: value }))}
        />
        <Input
            disabled={loading}
            className='my-5'
            label='Фамилия'
            value={profile.lastName}
            onChange={(value) => setProfile(prev => ({ ...prev, lastName: value }))}
        />
        <CustomButton 
            title='Сохранить'
            handlePress={onEditProfile}
            isLoading={loading}
        />
        {
            fail && <Text className='color-red-500'>{fail}</Text>
        }
    </View>
}

const Profile = () => {
    const [profile, setProfile] = useState(null)

    const onLoadProfile = async () => {
        try {
            const json = await AsyncStorage.getItem("profile")
            let loaded = JSON.parse(json)
            if (loaded === null) {
                loaded = { ...DefaultProfile }
            }
            setProfile(loaded)
        } catch (e) {
            setProfile({ ...DefaultProfile })
        }
        console.log(json)
    }

    useEffect(() => {
        onLoadProfile()
    }, [])

    if (profile === null) {
        return <Text>Загрузка профиля...</Text>
    }

    return <ProfileForm
        initProfile={profile}
    />
}

export default Profile