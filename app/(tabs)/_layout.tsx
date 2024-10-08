import { Tabs } from "expo-router"
import { Coins, GraduationCap, ListCheck, PiggyBank, Rabbit } from "lucide-react-native"

const TabsLayout = () => {
  
  return (
    <Tabs>
      <Tabs.Screen 
        name="savings" 
        options={{ 
        headerShown: false,
        tabBarShowLabel: false,
        tabBarIcon: ({ color, size, focused }) => (
          <PiggyBank color={focused ? "#52D1DC": color} size={size} />
        ),
        tabBarLabel: "Spare",
        }} 
      />
      <Tabs.Screen 
        name="chores" 
        options={{ 
        headerShown: false,
        tabBarShowLabel: false,
        tabBarIcon: ({ color, size, focused }) => (
          <ListCheck color={focused ? "#52D1DC": color} size={size} />
        ),
        tabBarLabel: "Gjøremål",
        }} 
      />
      <Tabs.Screen 
        name="home" 
        options={{ 
        headerShown: false,
        tabBarShowLabel: false,
        tabBarIcon: ({ color, size, focused }) => (
          <Rabbit color={focused ? "#52D1DC": color} size={size} />
        ),
        tabBarLabel: "Hjem",
        }} 
      />
      <Tabs.Screen 
        name="payment" 
        options={{ 
        headerShown: false,
        tabBarShowLabel: false,
        tabBarIcon: ({ color, size, focused }) => (
          <Coins color={focused ? "#52D1DC": color} size={size} />
        ),
        tabBarLabel: "Be om penger",
        }} 
      />
      <Tabs.Screen 
        name="education" 
        options={{ 
        headerShown: false,
        tabBarShowLabel: false,
        tabBarIcon: ({ color, size, focused }) => (
          <GraduationCap color={focused ? "#52D1DC": color} size={size} />
        ),
        }} 
      />
      </Tabs>
    )

}

export default TabsLayout
