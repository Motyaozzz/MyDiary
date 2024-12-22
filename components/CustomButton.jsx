import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import "../global.css"

const CustomButton = ({
  title,
  handlePress,
  containerStyles,
  textStyles,
  isLoading,
}) => {
  return (
   <View 
   >
      <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className={`bg-secondary rounded-2xl flex flex-row justify-center items-center py-4 px-4 ${containerStyles} ${
         isLoading ? "opacity-50" : ""
      }`}
      disabled={isLoading}
   >
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
      </TouchableOpacity>
   </View>
  );
};

export default CustomButton;