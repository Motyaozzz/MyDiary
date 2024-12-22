import { View, Text, Image } from "react-native";
import { Tabs, Redirect } from "expo-router";

// import "../../global.css"
// import { icons } from "../../";
import "../../global.css"

const TabIcon = ({ icon, color, name, focused}) => {
   return (
      <View>
         <Image
            className="h-6 w-6"
            source = {icon}
         />
      </View>
   )
}

const TabsLayout = () => {
  return (
    <Tabs className="text-3xl text-center">
      <Tabs.Screen 
        name="MyDiaries"
        options={{
          title: "MyDiary",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
              <TabIcon
                 icon = {require('../../assets/icons/diary.png')}
              />
          ),
          options: {
            unmountOnBlur: true
          },
        }}
      />
      <Tabs.Screen 
        name="NewNote"
        options={{
          title: "NewNote",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
              <TabIcon
                 icon = {require('../../assets/icons/note.png')}
              />
          ),
        }}
      />
      <Tabs.Screen 
        name="Profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
              <TabIcon
                 icon = {require('../../assets/icons/profile.png')}
              />
          ),
        }}
      />
      <Tabs.Screen 
        name="Settings"
        options={{
          title: "Settings",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
              <TabIcon
                 icon = {require('../../assets/icons/settings.png')}
              />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
