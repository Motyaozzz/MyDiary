import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import { Alert, Text, TextInput, View } from "react-native";

import { Link } from "expo-router";
import { CustomButton } from "../../components";

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

    // Функция сохранения заметки
    const saveNote = async () => {
        try {
            if (!note.trim()) {
                Alert.alert("Ошибка", "Заметка не может быть пустой");
                return;
            }

            // Получение существующих заметок из AsyncStorage
            const existingNotes = await AsyncStorage.getItem("notes");
            const notes = existingNotes ? JSON.parse(existingNotes) : [];

            // Добавление новой заметки
            const newNote = {
                id: Date.now().toString(),
                title: note.split("\n")[0].slice(0, 15) || "Без заголовка",
                content: note,
                createdAt: new Date().toLocaleString(),
                avatar: (avatar.trim() !== '') ? avatar : getRandomSeed()
            };
            notes.push(newNote);

            // Сохранение обновленного списка заметок
            await AsyncStorage.setItem("notes", JSON.stringify(notes));

            // Очистка поля заметки и уведомление пользователя
            setNote("");
            setAvatar("")
            Alert.alert("Успех", "Заметка успешно сохранена");

            // Перенаправление на другой экран (например, список заметок)
            if (navigation) navigation.navigate("MyDiaries");
        } catch (error) {
            Alert.alert("Ошибка", "Не удалось сохранить заметку");
            console.error(error);
        }
    };

    return (
        <View className="h-full w-full flex-column items-stretch justify-start px-4 py-10 bg-primary">
            <Text
                className="text-2xl font-pextrabold text-white text-center mb-4"
            >
                Создать запись
            </Text>
            <View
                className="h-4/5 mb-4"
            >
                <TextInput
                    className="text-white h-4/5 rounded-lg shadow-md"
                    placeholder="Введите текст заметки..."
                    placeholderTextColor="white"
                    multiline
                    value={note}
                    onChangeText={setNote}
                    style={{
                        textAlignVertical: "top",
                        color: 'white',
                    }}
                />
                <TextInput
                    className="text-white h-1/5 rounded-lg shadow-md"
                    placeholder="Введите ключ для иконки (любое слово)..."
                    placeholderTextColor="white"
                    multiline
                    value={avatar}
                    onChangeText={setAvatar}
                    style={{
                        textAlignVertical: "top",
                        color: 'white',
                    }}
                />
            </View>
            <CustomButton
                title='Сохранить'
                handlePress={saveNote}
                containerStyles="mt-7"
                isLoading={false}
            />
        </View>
    );
};

export default NewNote