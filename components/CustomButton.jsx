import { ActivityIndicator, Text, TouchableHighlight, View } from "react-native";
import "../global.css";

const CustomButton = ({
title,
handlePress,
containerStyles,
textStyles,
isLoading,
underlayColor = "#f58822",
}) => {
return (
      <TouchableHighlight
      onPress={handlePress}
      underlayColor={underlayColor}
      className={`bg-accent rounded-2xl flex flex-row justify-center items-center py-4 px-4 font-pbold ${containerStyles} ${
         isLoading ? "opacity-50" : ""
      }`}
      disabled={isLoading}
      >
      <View className="flex flex-row items-center">
         <Text className={`text-primary font-pbold text-lg ${textStyles}`}>
            {title}
         </Text>

         {isLoading && (
            <ActivityIndicator
            animating={isLoading}
            color="#fff"
            size="small"
            className="ml-2"
            />
         )}
      </View>
      </TouchableHighlight>
);
};

export default CustomButton;