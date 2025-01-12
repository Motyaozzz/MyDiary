import React from 'react';
import { View, TextInput, Text } from 'react-native';

const CustomInput = ({ 
label, 
placeholder = "Поиск", 
value, 
onChangeText, 
inputStyle = '', 
containerStyle = '',
isSecure = false,
multiline= false
}) => {
return (
   <View className={`mb-3 ${containerStyle}`}>
      {label && <Text className="text-lg font-pregular text-black mb-2 ml-20">{label}</Text>}
      <View className={`items-center`}>
      <TextInput
         value={value}
         onChangeText={onChangeText}
         placeholder={placeholder}
         placeholderTextColor="gray"
         secureTextEntry={isSecure}
         multiline={multiline} 
         className={`color-gray p-3 font-pregular bg-primary border-solid border border-accent focus:border-2 rounded-full flex ${inputStyle}`}
      />
      </View>
   </View>
);
};

export default CustomInput;
