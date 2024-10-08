import { Stack } from "expo-router"
import { GestureHandlerRootView } from "react-native-gesture-handler"

export default function RootLayout() {
  return (
    <GestureHandlerRootView>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="profile" options={{ headerBackTitle: "Tilbake", headerTitle: "Profil" }} />
        <Stack.Screen name="Transactions" options={{headerBackTitle: "Tilbake",title: "Transaksjoner"}}/>
      </Stack>
    </GestureHandlerRootView>
  )
}
