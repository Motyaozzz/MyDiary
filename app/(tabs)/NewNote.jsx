import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useRef, useState } from "react";
import { StyleSheet, Alert, Keyboard, Text, TextInput, TouchableOpacity, View, Dimensions, PanResponder, Image, ScrollView } from "react-native";

import * as ImagePicker from 'expo-image-picker';

import * as Notifications from 'expo-notifications';
import { CustomButton } from "../../components";

import "../../global.css";


const GeneralSeeds = [
   'Felix',
   'Aneka',
   'John',
   'Gonny',
   'ZEROROEOSAR',
   'Amina',
   'Celly'
]

const getRandomSeed = () => {
   const idx = Math.floor(Math.random() * GeneralSeeds.length)
   return GeneralSeeds[idx]
}

const NewNote = ({ navigation }) => {
   const [note, setNote] = useState("");
   const [avatar, setAvatar] = useState("")
   const ref = useRef()

   const [height, setHeight] = useState(100);
   const [images, setImages] = useState([]);
   const screenHeight = Dimensions.get('window').height;

   const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gestureState) => {
         setHeight((prevHeight) => {
            const newHeight = prevHeight + gestureState.dy;
            return Math.max(70, Math.min(newHeight, screenHeight - 290));
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
            avatar: (avatar.trim() !== '') ? avatar : getRandomSeed()
         };
         notes.push(newNote);

         await AsyncStorage.setItem("notes", JSON.stringify(notes));

         setNote("");
         setAvatar("");
         setImages([])
         Alert.alert("Успех", "Заметка успешно сохранена");

         Notifications.scheduleNotificationAsync({
            content: {
               title: "Diary",
               body: "Поздравляем с новой заметкой!",
            },
            trigger: null,
         })

         if (navigation) navigation.navigate("MyDiaries");
      } catch (error) {
         Alert.alert("Ошибка", "Не удалось сохранить заметку");
         console.error(error);
      }
   }

   return (
      <TouchableOpacity
         activeOpacity={1}
         onPress={event => {
            try {
               if (event.target !== ref.current) {
                  Keyboard.dismiss()
               }
            } catch (e) {
               console.log(e)
            }
         }}
      >
         <View className="h-full w-full flex-column items-stretch justify-start px-4 py-10 bg-primary">
         <Text className="text-2xl font-pextrabold text-white mb-4 pt-7 items-center text-center">
            Создать запись
         </Text>
            <View style={[styles.textInputContainer, { height }]}>

            <ScrollView>
               <TextInput
                  style={styles.textInput}
                  placeholder="Введите текст заметки..."
                  placeholderTextColor="gray"
                  multiline
                  value={note}
                  onChangeText={setNote}
                  ref={ref}
               />
               {images.map((uri, index) => (
               <Image key={index} source={{ uri }} style={styles.image} />
               ))}
            </ScrollView>

            <View
               {...panResponder.panHandlers}
               style={styles.resizer}
            />
         </View>

         <CustomButton
               title='Добавить фото'
               handlePress={pickImage}
               containerStyles="mt-4"
               isLoading={false}
         />
         <CustomButton
            title='Сохранить'
            handlePress={saveNote}
            containerStyles="mt-4"
            isLoading={false}
         />
      </View>
      </TouchableOpacity>
   );
};

const styles = StyleSheet.create({
   container: {
   flex: 1,
   justifyContent: 'center',
   alignItems: 'center',
   backgroundColor: '#f5f5f5',
   },
   textInputContainer: {
   width: '100%',
   borderWidth: 1,
   borderColor: '#ccc',
   borderRadius: 5,
   overflow: 'hidden',
   backgroundColor: '#fff',
   },
   textInput: {
   flex: 1,
   padding: 10,
   textAlignVertical: 'top',
   },
   resizer: {
   height: 20,
   backgroundColor: 'rgba(0, 0, 0, 0.1)',
   borderTopWidth: 1,
   borderColor: '#ccc',
   },
   image: {
   width: 250,
   height: 150,
   marginVertical: 10,
   borderRadius: 5,
   },
});

export default NewNote