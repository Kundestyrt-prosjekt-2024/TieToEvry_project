import { Tabs } from "expo-router"

const TabsLayout = () => {
  return (
    <Tabs>
      <Tabs.Screen name="chores" options={{ headerShown: false }} />
      <Tabs.Screen name="savings" options={{ headerShown: false }} />
      <Tabs.Screen name="home" options={{ headerShown: false }} />
      <Tabs.Screen name="payment" options={{ headerShown: false }} />
      <Tabs.Screen name="education" options={{ headerShown: false }} />
    </Tabs>
  )
}

export default TabsLayout
