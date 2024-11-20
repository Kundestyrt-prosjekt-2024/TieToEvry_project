import { Tabs } from "expo-router"

const AuthLayout = () => {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarStyle: { display: "none" } }}>
      <Tabs.Screen name="Login" />
      <Tabs.Screen name="SignupAdult" />
    </Tabs>
  )
}

export default AuthLayout
