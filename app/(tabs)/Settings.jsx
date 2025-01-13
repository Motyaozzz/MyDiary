import { View, Text, Alert, Linking } from 'react-native';
import React, { useState } from 'react';
import { useFocusEffect } from "@react-navigation/native";
import rncomm from 'react-native-communications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from "expo-secure-store";
import { useStateContext } from '../state/context';
import { CustomButton, CustomInput } from '../../components';
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
      <View className="bg-primary h-full w-full px-4 py-8">
         <Text className="text-2xl font-pregular text-black mb-6 pt-32 items-center text-center">
            Настройки
         </Text>
         {fail && <Text className="text-red-600 text-2xl">{fail}</Text>}
         {profile === null ? (
            <Text className="text-white text-2xl">Загрузка...</Text>
         ) : (
            <>
               <CustomButton
                  title={'Звонок в поддержку'}
                  handlePress={onCall}
                  containerStyles="p-4 mb-6 rounded-full"
               />
               <CustomButton
                  title={'СМС в поддержку'}
                  handlePress={onSMS}
                  containerStyles="p-4 mb-6 rounded-full"
               />
               <CustomButton
                  title={'Письмо в поддержку'}
                  handlePress={onEmail}
                  containerStyles="p-4 mb-6 rounded-full"
               />
               <CustomButton
                  title={'Смена пароля'}
                  handlePress={() => setShowPasswordForm(!showPasswordForm)}
                  containerStyles="p-4 mb-6 rounded-full"
               />

               {showPasswordForm && (
                  <View className="items-center flex w-auto bg-primary border-solid border-4 border-accent rounded-lg">
                     <CustomInput
                        value={oldPassword}
                        onChangeText={setOldPassword}
                        isSecure={true}
                        placeholder="Старый пароль"
                        inputStyle="text-lg font-semibold text-gray w-4/5"
                        containerStyle="mt-3 mb-2 w-full"
                     />
                     <CustomInput
                        value={newPassword}
                        onChangeText={setNewPassword}
                        isSecure={true}
                        placeholder="Новый пароль"
                        inputStyle="text-lg font-semibold text-gray w-4/5"
                        containerStyle="mb-2 w-full"
                     />
                     <CustomInput
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        isSecure={true}
                        placeholder="Подтвердите новый пароль"
                        inputStyle="text-lg font-semibold text-gray w-4/5"
                        containerStyle="mb-3 w-full"
                     />
                     <CustomButton
                        title='Изменить пароль'
                        handlePress={handleChangePassword}
                        containerStyles="mb-4"
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
