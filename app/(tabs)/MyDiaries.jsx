import React, { useState, useCallback } from 'react';
import { Alert, Animated, Dimensions, StyleSheet, Text, View , TextInput} from 'react-native';

import { useFocusEffect } from "@react-navigation/native";

import AsyncStorage from '@react-native-async-storage/async-storage';
import { SwipeListView } from 'react-native-swipe-list-view';
import '../(tabs)/NewNote';
import '../../global.css';
import { NoteContent, OneNote } from './Note';

const MyDiaries = () => {
    const [notes, setNotes] = useState([])
    const [search, setSearch] = useState('')

    /**
     * @param {Record<string, string>} note
     * @example
     * const search = 'ToDay'
     * const result = notePredicate({content: 'My Day is VEry gooD, toDAY i am'})
     * 
     * console.log(result) // true
     */
    const notePredicate = (note) => {
        // Вытаскиваем content и дату создания
        const {
            content,
            createdAt,
        } = note

        // Приводим все к нижнему регистру
        const normalizedQuery = search.toLowerCase()
        const normalizedContent = content.toLowerCase() + createdAt.toLowerCase()

        // Проверяем есть ли вхождение поиска в заметке
        return normalizedContent.includes(normalizedQuery)
    }

    // Функция загрузки заметок
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

    useFocusEffect(
        React.useCallback(() => {
            loadNotes();
        }, [])
    );

    const onRemoveNote = async (id) => {
        try {
            const storedNotes = await AsyncStorage.getItem("notes");
            const parsedNotes = storedNotes ? JSON.parse(storedNotes) : [];

            const filtered = parsedNotes.filter(note => note.id !== id)
            await AsyncStorage.setItem('notes', JSON.stringify(filtered))

            return true
        } catch (error) {
            return false
        }
    }

    const onSwipeValueChange = swipeData => {
        const { key, value } = swipeData;

        if (value < -(Dimensions.get('window').width - 100)) {
            const tmp = [...notes]
            setNotes(prev => prev.filter(note => note.id !== key))
            onRemoveNote(key)
                .then(res => {
                    if (res === false) {
                        setNotes(tmp)
                    }
                })
        }
    }

    const renderHiddenItem = () => (
        <View
            className="bg-red-600 mb-4 rounded-lg shadow-md w-full"
            style={{
                height: 'calc(100% - 1rem)'
            }}
        >
            <View className="flex flex-row-reverse h-full">
                <View className="w-1/5 h-full flex items-center justify-center">
                    <Text>DELETE</Text>
                </View>
            </View>
        </View>
    )

    const filtered = notes.filter(notePredicate) // Для оптимизации можно положить в 
    // useMemo(() => ..., [search, notes.length])

    const isEmpty = filtered.length === 0

    /**
     * !Погуглить:
     * 
     * !Virtual Scroll
     * !Виртуальный скролл
     * 
     * !Prompt - 'виртуальный скроллинг в SwipeListView в ReactNative'
     * 
     * * Примеры:
     * * FixedSizeList(React)
     */

    return (
        <View className="bg-primary h-full w-full flex justify-center px-4 py-10 items-center flex-1">
            <Text className="text-2xl font-pextrabold text-white mb-4 pt-4 text-center">Мои записи</Text>
            
            <View className="p-1 bg-primary border-solid border-2 border-secondary rounded-lg mb-4">
               <TextInput
                  className='color-white mx-4 py-0 font-psemibold'
                  placeholder="Введите для поиска..."
                  placeholderTextColor="gray"
                  value={search}
                  onChangeText={setSearch}
               />
            </View>
            {
                isEmpty ? 
                    <Text className='text-2xl font-pextrabold text-white'>Нет заметок</Text> :
                    <SwipeListView
                        disableRightSwipe
                        recalculateHiddenLayout
                        className="w-full h-full px-4"
                        rightOpenValue={-70}
                        data={filtered}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item, index }) => <OneNote
                            note={item} 
                        />}
                        renderHiddenItem={renderHiddenItem}
                        onSwipeValueChange={onSwipeValueChange}
                    />
            }
        </View>
    );
};

export default MyDiaries