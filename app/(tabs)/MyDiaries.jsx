import React, { useState } from 'react';
import { Alert, Animated, Dimensions, StyleSheet, Text, View } from 'react-native';

import { useFocusEffect } from "@react-navigation/native";

import AsyncStorage from '@react-native-async-storage/async-storage';
import { SwipeListView } from 'react-native-swipe-list-view';
import '../(tabs)/NewNote';
import '../../global.css';
import { NoteContent, OneNote } from './Note';
import { SvgUri } from 'react-native-svg';

const MyDiaries = () => {
    const [notes, setNotes] = useState([]);

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

    return (
        <View className="bg-primary h-full w-full flex justify-center px-4 py-10 items-center flex-1">
            <Text className="text-2xl font-pextrabold text-white mb-4 pt-7 text-center">Мои записи</Text>
            <SwipeListView
                disableRightSwipe
                className="w-full h-full px-4"
                rightOpenValue={-70}
                data={notes}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <OneNote note={item} />}
                renderHiddenItem={renderHiddenItem}
                onSwipeValueChange={onSwipeValueChange}
            />
        </View>
    );
};

export default MyDiaries