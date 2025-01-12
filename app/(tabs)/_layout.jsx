import { View, Image } from "react-native";
import { Tabs } from "expo-router";

import "../../global.css";

const TabIcon = ({ icon, color, name, focused }) => {
   return (
      <View>
         <Image
            className="h-7 w-7"  // Устанавливаем размер иконок 40x40 (h-10 и w-10 = 40px)
            source={icon}
         />
      </View>
   );
}

const TabsLayout = () => {
   return (
      <Tabs
         screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: '#FF9C01',
            tabBarLabelStyle: {
               display: 'none', // Убираем текст под иконками
            },
            headerStyle: {
               backgroundColor: '#fff',
            },
            headerShadowVisible: false,
            headerTintColor: '#fff',
            tabBarStyle: {
               backgroundColor: '#F3BA99', // Фон для нижнего меню
               borderTopWidth: 2, // Толщина границы
               borderTopColor: '#E6563A', // Цвет обводки
               paddingBottom: 5, // Дополнительный отступ
               height: 50, // Увеличиваем высоту Tab Bar
               paddingTop: 5, // Добавляем немного отступ сверху
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
