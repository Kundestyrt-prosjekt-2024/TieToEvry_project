import { Tabs } from "expo-router"

const AuthLayout = () => {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarStyle: { display: "none" } }}>
      <Tabs.Screen name="login" />
      <Tabs.Screen name="signupAdult" />
    </Tabs>
  )
}

export default AuthLayout
