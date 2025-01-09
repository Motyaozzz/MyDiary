import { View, Text, TouchableOpacity, TextInput, Alert, Linking } from 'react-native';
import React, { useState } from 'react';
import { useFocusEffect } from "@react-navigation/native";
import rncomm from 'react-native-communications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from "expo-secure-store";
import { useStateContext } from '../state/context';
import { CustomButton } from '../../components';
import "../../global.css";



const PHONE = '88005553535';
const MAIL = 'mikrozaim-ochen-bistro@mail.ru';

const Settings = () => {
   const { dispatch, state } = useStateContext();
   const [profile, setProfile] = useState(null);
   const [showPasswordForm, setShowPasswordForm] = useState(false);
   const [oldPassword, setOldPassword] = useState('');
   const [newPassword, setNewPassword] = useState('');
   const [confirmPassword, setConfirmPassword] = useState('');
   const [fail, setFail] = useState(null);


   useFocusEffect(
      React.useCallback(() => {
         const onLoadProfile = async () => {
            try {
               const storedProfile = JSON.parse(await AsyncStorage.getItem("profile")) ?? {};
               setProfile(storedProfile);
            } catch (error) {
               console.error(error);
               setProfile({});
            }
         };
         onLoadProfile();
      }, [])
   );

   const mailTemplate = ({ lastName, firstName }) => {
      if (!lastName && !firstName) {
         return `Добрый день! Прошу помочь мне с `;
      }
      const name = [lastName, firstName].filter(Boolean).join(' ');
      return `Добрый день! Прошу помочь мне с \n\nС уважением, ${name}!`;
   };

   const onCall = () => Linking.openURL(`tel:${PHONE}`);
   const onSMS = () => rncomm.text(PHONE, mailTemplate(profile));
   const onEmail = () => rncomm.email([MAIL], null, null, null, mailTemplate(profile));

   const handleChangePassword = async () => {
      try {
         const storedPassword = await SecureStore.getItemAsync('diaryPassword');
         if (oldPassword !== storedPassword) {
            Alert.alert('Ошибка', 'Старый пароль неверен');
            return;
         }
         if (newPassword == oldPassword){
            Alert.alert('Ошибка', 'Новый пароль совпадает со старым')
            return;
         }
         if (newPassword.length < 4) {
            Alert.alert('Ошибка', 'Новый пароль должен быть от 4-х символов');
            return;
         }
         if (newPassword !== confirmPassword) {
            Alert.alert('Ошибка', 'Пароли не совпадают');
            return;
         }

         dispatch({
            type: 'CHANGE-PASS',
            payload: {
               oldPassword,
               newPassword,
               confirmPassword,
            },
         });

         await SecureStore.setItemAsync('diaryPassword', newPassword);

         Alert.alert('Успех', 'Пароль успешно изменен');
         setShowPasswordForm(false);
         setOldPassword('');
         setNewPassword('');
         setConfirmPassword('');
      } catch (error) {
         console.error(error);
         Alert.alert('Ошибка', 'Не удалось сменить пароль');
      }
   };

   return (
      <View className="bg-primary h-full w-full px-4 py-8 bg-gr">
         <Text className="text-2xl font-pextrabold text-white mb-4 pt-7 items-center text-center">
            Настройки
         </Text>
         {fail && <Text className="text-red-600 text-2xl">{fail}</Text>}
         {profile === null ? (
            <Text className="text-white text-2xl">Загрузка...</Text>
         ) : (
            <>
               <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={onCall}
                  className="p-4 bg-slate-700 mb-4 rounded-lg"
               >
                  <Text className="text-white text-xl">Звонок в поддержку</Text>
               </TouchableOpacity>

               <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={onSMS}
                  className="p-4 bg-slate-700 mb-4 rounded-lg"
               >
                  <Text className="text-white text-xl">СМС в поддержку</Text>
               </TouchableOpacity>

               <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={onEmail}
                  className="p-4 bg-slate-700 mb-4 rounded-lg"
               >
                  <Text className="text-white text-xl">Письмо в поддержку</Text>
               </TouchableOpacity>

               <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setShowPasswordForm(!showPasswordForm)}
                  className="p-4 bg-slate-700 mb-4 rounded-lg"
               >
                  <Text className="text-white text-xl">Смена пароля</Text>
               </TouchableOpacity>

               {showPasswordForm && (
                  <View className="p-4 bg-gray-800 rounded-lg">
                     <TextInput
                        placeholder="Старый пароль"
                        secureTextEntry
                        className="bg-white mb-2 p-3 rounded-md"
                        value={oldPassword}
                        onChangeText={setOldPassword}
                     />
                     <TextInput
                        placeholder="Новый пароль"
                        secureTextEntry
                        className="bg-white mb-2 p-3 rounded-md"
                        value={newPassword}
                        onChangeText={setNewPassword}
                     />
                     <TextInput
                        placeholder="Подтвердите новый пароль"
                        secureTextEntry
                        className="bg-white mb-2 p-3 rounded-md"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                     />
                     <CustomButton
                        title='Изменить пароль'
                        handlePress={handleChangePassword}
                        containerStyles="mt-3"
                        isLoading={false}
                     />
                  </View>
               )}
            </>
         )}
      </View>
   );
};

export default Settings;
