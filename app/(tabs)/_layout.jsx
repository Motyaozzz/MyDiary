import { View, Image } from "react-native";
import { Tabs } from "expo-router";

import "../../global.css"

const TabIcon = ({ icon, color, name, focused }) => {
   return (
      <View>
            <Image
               className="h-6 w-6"
               source={icon}
            />
      </View>
   )
}

const TabsLayout = () => {
   return (
         <Tabs
         screenOptions={{
         headerShown: false,
         tabBarActiveTintColor: '#FF9C01',
         headerStyle: {
            backgroundColor: '#fff',
         },
         // headerShadowVisible: false,
         headerTintColor: '#fff',
         tabBarStyle: {
         backgroundColor: '#25292e',
         },
         }}
         >
            <Tabs.Screen
               name="MyDiaries"
               options={{
                  title: "MyDiary",
                  headerShown: false,
                  display: 'none',
                  headerBackVisible: false,
                  unmountOnBlur: true,
                  tabBarIcon: ({ color, focused }) => (
                        <TabIcon
                           icon={require('../../assets/icons/diary.png')}
                        />
                  ),
               }}
            />
            <Tabs.Screen
               name="NewNote"
               options={{
                  title: "NewNote",
                  headerShown: false,
                  headerBackVisible: false,
                  tabBarIcon: ({ color, focused }) => (
                        <TabIcon
                           icon={require('../../assets/icons/note.png')}
                        />
                  ),
               }}
            />
            <Tabs.Screen
               name="Profile"
               options={{
                  title: "Profile",
                  headerShown: false,
                  headerBackVisible: false,
                  tabBarIcon: ({ color, focused }) => (
                        <TabIcon
                           icon={require('../../assets/icons/profile.png')}
                        />
                  ),
               }}
            />
            <Tabs.Screen
               name="Settings"
               options={{
                  title: "Settings",
                  headerShown: false,
                  headerBackVisible: false,
                  tabBarIcon: ({ color, focused }) => (
                        <TabIcon
                           icon={require('../../assets/icons/settings.png')}
                        />
                  ),
               }}
            />
      </Tabs>
   );
};

export default TabsLayout;
