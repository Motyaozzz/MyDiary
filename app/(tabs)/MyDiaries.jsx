import React, { useState, useEffect } from 'react'
import { View, Text, Button, TextInput, TouchableOpacity, Alert, FlatList } from 'react-native'

import { useFocusEffect } from "@react-navigation/native";

import AsyncStorage from '@react-native-async-storage/async-storage'
import { OneNote } from './Note'
import '../(tabs)/NewNote'
import '../../global.css'

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

    return (
        <View className="bg-primary h-full w-full flex justify-center px-4 py-10 items-center flex-1">
            <Text className="text-2xl font-pextrabold text-white mb-4 items-center text-center">Мои записи</Text>
            <FlatList
                className="w-full px-4"
                data={notes}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <OneNote note={item} />}
            />
        </View>
    );
};

export default MyDiaries