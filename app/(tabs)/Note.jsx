import { useState } from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'
import { SvgUri } from "react-native-svg";

export function NoteContent({ content }) {
    const [showAll, setShowAll] = useState(false)

    const preview = content.slice(0, 50)
    const canOpen = content.length > preview.length;

    const onToggle = () => {
        if (!canOpen) return
        setShowAll(prev => !prev)
    }
   //  console.log(showAll)


    return <>
        <Text className="text-gray-700 w-4/5">
            {showAll ? content : preview + (canOpen ? '...' : '')}
        </Text>
        {
            canOpen && <Text
                className="mb-2 font-psemibold color-blue-800"
                onPress={onToggle}
            >
                {showAll ? 'Скрыть' : 'Читать полностью'}
            </Text>
        }
    </>
}

export function OneNote({ note }) {

    return <View
        className="bg-white mb-4 rounded-lg shadow-md w-full flex flex-row"
    >
        <View className="w-4/5 ps-2 py-2">
            <Text className="text-2xl font-bold text-gray-800 mb-2">
                {note.title}
            </Text>
            <NoteContent content={note.content} />
               {note.image && Array.isArray(note.image) && note.image.length > 0 ? (
                  note.image.map((uri, index) => (
                     <Image key={index} source={{ uri }} style={styles.image} />
                  ))
               ) : null}
            <Text className="text-sm text-gray-500">
                {note.createdAt}
            </Text>
        </View>
        <View className="w-1/5 h-24 pe-2 py-2">
            <SvgUri
                width="100%"
                height="100%"
                uri={`https://api.dicebear.com/9.x/pixel-art/svg?seed=${note.avatar}`}
            />
        </View>
    </View>
}

const styles = StyleSheet.create({
   image: {
     width: '100%',
     height: 200,
   },
 });