import { View, Text, TextInput, Alert } from 'react-native'
import React, { useState } from 'react'
import { useFocusEffect } from "@react-navigation/native";

import { CustomButton } from '../../components'
import {CustomInput} from '../../components';

import AsyncStorage from '@react-native-async-storage/async-storage'
import "../../global.css";


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

   return <View className="bg-primary h-full w-full px-4 py-8">
      <Text className="text-2xl font-pregular text-black mb-6 pt-32 items-center text-center">Профиль</Text>
      
      <CustomInput
         label="Имя"
         placeholder='Введите имя...'
         disabled={loading}
         value={profile.firstName}
         onChangeText={(value) => setProfile(prev => ({ ...prev, firstName: value }))}
         inputStyle="text-lg font-semibold text-black w-4/5"
         containerStyle=""
      />
      
      <CustomInput
         label="Фамилия"
         placeholder='Введите фамилию...'
         disabled={loading}
         value={profile.lastName}
         onChangeText={(value) => setProfile(prev => ({ ...prev, lastName: value }))}
         inputStyle="text-lg font-semibold text-black w-4/5"
         containerStyle="mt-1"
      />
      <View className="items-center mt-3">
         <CustomButton 
               title='Сохранить'
               handlePress={onEditProfile}
               isLoading={loading}
               containerStyles="my-5 w-4/5"
               textStyles="px-3"
         />
         <CustomButton 
               title='Сбросить данные профиля'
               handlePress={onDeleteProfile}
               isLoading={loading_del}
               containerStyles="w-4/5"
               textStyles="px-3"
         />
      </View>

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