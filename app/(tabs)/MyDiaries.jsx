import React, { useState, useCallback, useEffect } from 'react';
import { Alert, Dimensions, Text, View, TextInput, Platform, Image, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SwipeListView } from 'react-native-swipe-list-view';
import '../(tabs)/NewNote';
import '../../global.css';
import { OneNote } from './Note';
import { CustomButton } from "../../components";

import "../../global.css";

const MyDiaries = () => {
   const [notes, setNotes] = useState([]);
   const [search, setSearch] = useState('');
   const [showCalendar, setShowCalendar] = useState(false);
   const [calendarHTML, setCalendarHTML] = useState('');

   const screenWidth = Dimensions.get('window').width;

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
                  background-color: #FFEACD;
                  height: full;
                  color: #000;
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

   const renderHiddenItem = (data) => (
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
      <View className="bg-primary h-full w-full flex justify-center px-4 pt-20 items-center flex-1">
         <Text className="text-2xl font-pregular text-black mb-3 items-center text-center">Мои записи</Text>

         {/* Поле поиска и кнопка календаря */}
         {!showCalendar && (
            <View className="flex-row items-center mb-6">
            <View className="flex-row items-center w-2/3 border-2 border-accent rounded-full px-4">
               <Image
                  source={require("../../assets/icons/search.png")}
                  resizeMode="contain"
                  className="w-8 h-8"
               />
               <TextInput
                     className="flex-1 text-gray font-pregular"
                     placeholder="Поиск"
                     placeholderTextColor="gray"
                     value={search}
                     onChangeText={setSearch}
                  />
               </View>
               <TouchableOpacity onPress={() => setShowCalendar(true)} style={{ marginLeft: 10 }}>
                  <Image
                     source={require("../../assets/icons/calendar.png")}
                     resizeMode="contain"
                     style={{ width: 30, height: 30 }}
                  />
               </TouchableOpacity>
            </View>
         )}

         {/* Кастомная кнопка при показе календаря */}
         {showCalendar ? (
            <CustomButton
               title="Вернуться к списку"
               handlePress={() => setShowCalendar(false)}
               containerStyles="mb-5"
            />
         ) : null}

         {/* Контент */}
         {showCalendar ? (
            <View className="flex-1 w-full">
               {Platform.OS === 'web' ? (
                  <iframe
                     src={calendarHTML}
                     title="Calendar"
                     style={{ width: '100%', height: '100%' }}
                  />
               ) : (
                  <WebView
                     originWhitelist={['*']}
                     javaScriptEnabled={true}
                     domStorageEnabled={true}
                     startInLoadingState={true}
                     renderLoading={() => <Text className="text-center h-full w-full">Загрузка...</Text>}
                     className="bg-primary"
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

export default MyDiaries;
