import React, { useState, useCallback, useEffect } from 'react';
import { Alert, Dimensions, Text, View, TextInput, TouchableOpacity, StyleSheet, Image, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SwipeListView } from 'react-native-swipe-list-view';
import '../(tabs)/NewNote';
import '../../global.css';
import { NoteContent, OneNote } from './Note';
import { CustomButton } from "../../components";

import Constants from 'expo-constants';

const MyDiaries = () => {
   const [notes, setNotes] = useState([]);
   const [search, setSearch] = useState('');
   const [showCalendar, setShowCalendar] = useState(false); // Флаг для показа/скрытия календаря
   const [calendarHTML, setCalendarHTML] = useState('');

   const notePredicate = (note) => {
      const { content, createdAt } = note;
      const normalizedQuery = search.toLowerCase();
      const normalizedContent = content.toLowerCase() + createdAt.toLowerCase();
      return normalizedContent.includes(normalizedQuery);
   };

   const loadNotes = async () => {
      try {
         const storedNotes = await AsyncStorage.getItem("notes");
         const parsedNotes = storedNotes ? JSON.parse(storedNotes) : [];
         setNotes(parsedNotes);
      } catch (error) {
         Alert.alert("Ошибка", "Не удалось загрузить заметки");
         console.error(error);
      }
   };

   const generateCalendarHTML = (notes) => {
      const events = notes
         .filter(note => {
            // Убедимся, что createdAt существует и является корректной датой
            const date = new Date(note.createdAt);
            return !isNaN(date.getTime());
         })
         .map(note => ({
            title: note.content.substring(0, 20),
            date: new Date(note.createdAt).toISOString().split('T')[0],
         }));
   
      return `
         <!DOCTYPE html>
         <html lang="en">
         <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <link href="https://cdn.jsdelivr.net/npm/fullcalendar@5.11.3/main.min.css" rel="stylesheet" />
            <style>
               body {
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                  background-color: #161622;
                  height: full;
                  color: #fff;
                  margin: 10px;
                  padding: 0;
               }
               #calendar {
                  max-width: 900px;
                  margin: 1px;
                  height: 600px;
               }
            </style>
         </head>
         <body>
            <div id="calendar"></div>
            <script src="https://cdn.jsdelivr.net/npm/fullcalendar@5.11.3/main.min.js"></script>
            <script>
               document.addEventListener('DOMContentLoaded', function() {
                  const calendarEl = document.getElementById('calendar');
                  const calendar = new FullCalendar.Calendar(calendarEl, {
                     initialView: 'dayGridMonth',
                     events: ${JSON.stringify(events)},
                     themeSystem: 'standard',
                  });
                  calendar.render();
               });
            </script>
         </body>
         </html>
      `;
   };
   

   useFocusEffect(
      useCallback(() => {
         loadNotes();
      }, [])
   );

   useEffect(() => {
      setCalendarHTML(generateCalendarHTML(notes));
   }, [notes]);

   const onRemoveNote = async (id) => {
      try {
         const storedNotes = await AsyncStorage.getItem("notes");
         const parsedNotes = storedNotes ? JSON.parse(storedNotes) : [];

         const filtered = parsedNotes.filter(note => note.id !== id);
         await AsyncStorage.setItem('notes', JSON.stringify(filtered));

         return true;
      } catch (error) {
         console.error('Ошибка удаления заметки', error)
         return false;
      }
   };

   const onSwipeValueChange = swipeData => {
      const { key, value } = swipeData;

      if (value < -(Dimensions.get('window').width - 100)) {
         const tmp = [...notes];
         setNotes(prev => prev.filter(note => note.id !== key));
         onRemoveNote(key)
            .then(res => {
               if (res === false) {
                  setNotes(tmp);
               }
            });
      }
   };

   const renderHiddenItem = () => (
      <View
         className="bg-red-600 mb-4 rounded-lg shadow-md w-full"
         style={{
            height: 'calc(100% - 1rem)',
         }}
      >
         <View className="flex flex-row-reverse h-full">
            <View className="w-1/5 h-full flex items-center justify-center">
               <Text>DELETE</Text>
            </View>
         </View>
      </View>
   );

   const filtered = notes.filter(notePredicate);
   const isEmpty = filtered.length === 0;

   return (
      <View className="bg-primary h-full w-full flex justify-center px-4 py-10 items-center flex-1">
         <Text className="text-2xl font-pextrabold text-white mb-4 pt-4 text-center">Мои записи</Text>

         {!showCalendar?(
            <View className="p-1 bg-primary border-solid border-2 border-secondary rounded-lg mb-4">
               <TextInput
                  className='color-white mx-4 py-0 font-psemibold'
                  placeholder="Введите для поиска..."
                  placeholderTextColor="gray"
                  value={search}
                  onChangeText={setSearch}
               />
            </View>
         ):(<View></View>)}

         <CustomButton
         title={showCalendar ? 'Вернуться к списку' : 'Показать календарь'}
         handlePress={() => {
            setShowCalendar(!showCalendar);
         }}
         containerStyles="mb-5"
         />
         {showCalendar ? (
            <View className="flex-1 w-full">
               {Platform.OS === 'web' ? (
                  <iframe
                  src={calendarHTML}
                  title="Web Tuner"
                  />
               ) : (
                  <WebView
                  originWhitelist={['*']}
                  javaScriptEnabled={true} // Включаем поддержку JavaScript
                  domStorageEnabled={true} // Включаем хранилище DOM
                  startInLoadingState={true} // Показываем индикатор загрузки
                  renderLoading={() => <Text>Загрузка...</Text>} // Сообщение, пока загружается
                  className="bg-primary color-primary"
                  source={{ html: calendarHTML }}
                  />
               )}
            </View>
         ) : (
            isEmpty ? 
               <Text className='text-2xl font-pextrabold text-white'>Нет заметок</Text> :
               <SwipeListView
                  disableRightSwipe
                  recalculateHiddenLayout
                  className="w-full h-full px-4"
                  rightOpenValue={-70}
                  data={filtered}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => <OneNote note={item} />}
                  renderHiddenItem={renderHiddenItem}
                  onSwipeValueChange={onSwipeValueChange}
               />
         )}
      </View>
   );
};

const styles = StyleSheet.create({
   container: {
     flex: 1,
     marginTop: Constants.statusBarHeight,
   },
 });

export default MyDiaries;
