import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useRef, useState } from "react";
import { Alert, Keyboard, Text, TouchableOpacity, View, Dimensions, PanResponder, Image, ScrollView, TouchableWithoutFeedback } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import * as Notifications from 'expo-notifications';
import { CustomButton, CustomInput } from "../../components";
import "../../global.css";
import { MaterialCommunityIcons } from '@expo/vector-icons';

const GeneralSeeds = [
   'Felix',
   'Aneka',
   'John',
   'Gonny',
   'ZEROROEOSAR',
   'Amina',
   'Celly'
];

const getRandomSeed = () => {
   const idx = Math.floor(Math.random() * GeneralSeeds.length);
   return GeneralSeeds[idx];
};

const NewNote = ({ navigation }) => {
   const [note, setNote] = useState("");
   const [avatar, setAvatar] = useState("");
   const [images, setImages] = useState([]);
   const screenWidth = Dimensions.get('window').width;
   const screenHeight = Dimensions.get('window').height;
   const [height, setHeight] = useState(150);

   const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gestureState) => {
         setHeight((prevHeight) => {
            const newHeight = prevHeight + gestureState.dy;
            return Math.max(150, Math.min(newHeight, screenHeight - 400));
         });
      },
   });

   const pickImage = async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
         Alert.alert('Permission Denied', 'We need access to your gallery to pick images.');
         return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
         mediaTypes: ImagePicker.MediaTypeOptions.Images,
         allowsEditing: true,
         quality: 1,
      });

      if (!result.canceled) {
         setImages((prevImages) => [...prevImages, result.assets[0].uri]);
      }
   };

   const deleteImage = (index) => {
      setImages((prevImages) => prevImages.filter((_, i) => i !== index));
   };

   const saveNote = async () => {
      try {
         if (!note.trim()) {
            Alert.alert("Ошибка", "Заметка не может быть пустой");
            return;
         }

         const existingNotes = await AsyncStorage.getItem("notes");
         const notes = existingNotes ? JSON.parse(existingNotes) : [];

         const newNote = {
            id: Date.now().toString(),
            title: note.split("\n")[0].slice(0, 15) || "Без заголовка",
            content: note,
            image: images,
            createdAt: new Date().toLocaleString(),
            avatar: (avatar.trim() !== '') ? avatar : getRandomSeed(),
         };
         notes.push(newNote);

         await AsyncStorage.setItem("notes", JSON.stringify(notes));

         setNote("");
         setAvatar("");
         setImages([]);
         Alert.alert("Успех", "Заметка успешно сохранена");

         Notifications.scheduleNotificationAsync({
            content: {
               title: "Diary",
               body: "Поздравляем с новой заметкой!",
            },
            trigger: null,
         });

         if (navigation) navigation.navigate("MyDiaries");
      } catch (error) {
         Alert.alert("Ошибка", "Не удалось сохранить заметку");
         console.error(error);
      }
   };

   return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
         <View className="bg-primary h-full w-full px-4 py-8">
            <Text className="text-2xl font-pregular text-black mb-6 pt-32 items-center text-center">
               Создать запись
            </Text>
            <View className={`w-full border border-accent rounded-lg overflow-hidden bg-primary mb-4`} style={{ height }}>
               <ScrollView>
                  <CustomInput
                     value={note}
                     onChangeText={setNote}
                     placeholder="Введите текст заметки..."
                     inputStyle="text-lg font-pregular bg-primary w-full border-primary"
                     containerStyle=""
                     multiline={true}
                     isSecure={false}
                  />
                  {images.map((uri, index) => (
                     <View key={index} style={{ position: 'relative', marginBottom: 10 }}>
                        <Image 
                           source={{ uri }} 
                           style={{
                              width: screenWidth - 40,
                              height: undefined,
                              aspectRatio: 1,
                              borderRadius: 8,
                              marginBottom: 10,
                           }}
                        />
                        <TouchableOpacity 
                           style={{
                              position: 'absolute', 
                              top: 5, 
                              right: 5, 
                              backgroundColor: 'rgba(0, 0, 0, 0.5)', 
                              borderRadius: 20, 
                              padding: 5,
                           }} 
                           onPress={() => deleteImage(index)}
                        >
                           <MaterialCommunityIcons name="close-circle" size={24} color="white" />
                        </TouchableOpacity>
                     </View>
                  ))}
               </ScrollView>

               <View {...panResponder.panHandlers} className="h-5 bg-primary border-t border-accent" />
            </View>

            <View className="items-center">
               <CustomButton
                  title='Добавить фото'
                  handlePress={pickImage}
                  containerStyles="mt-4 w-4/5"
                  isLoading={false}
               />
               <CustomButton
                  title='Сохранить'
                  handlePress={saveNote}
                  containerStyles="mt-4 w-4/5"
                  isLoading={false}
               />
            </View>
         </View>
      </TouchableWithoutFeedback>
   );
};

export default NewNote;
