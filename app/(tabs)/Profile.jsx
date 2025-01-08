import { View, Text, TextInput, Alert } from 'react-native'
import React, { useState } from 'react'
import { useFocusEffect } from "@react-navigation/native";

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
   const [loading_del, setLoading_del] = useState(false)
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

   const onDeleteProfile = async () => {
      setFail(null)
      setLoading_del(true)
      try {
            await AsyncStorage.removeItem("profile")

      } catch (e) {
            setFail(e.message)
      }
      setLoading_del(false)
      setProfile({ ...DefaultProfile })
      Alert.alert("Успех", "Данные профиля сброшены");
   }

   return <View className="bg-primary h-full w-full px-4 py-8 bg-gr">
      <Text className="text-2xl font-pextrabold text-white mb-4 pt-7 items-center text-center">Профиль</Text>
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
            containerStyles="mb-5"
      />
      <CustomButton 
            title='Сбросить данные профиля'
            handlePress={onDeleteProfile}
            isLoading={loading_del}
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
   }

      useFocusEffect(React.useCallback(() => {
         onLoadProfile()
      }, []))

   if (profile === null) {
      return <Text>Загрузка профиля...</Text>
   }

   return <ProfileForm
      initProfile={profile}
   />
}

export default Profile