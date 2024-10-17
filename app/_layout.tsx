import { Stack } from "expo-router"
import { GestureHandlerRootView } from "react-native-gesture-handler"

export default function RootLayout() {
  return (
    <GestureHandlerRootView>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(profile)/profile" options={{ headerBackTitle: "Tilbake", headerTitle: "Profil" }} />
        <Stack.Screen
          name="Transactions"
          options={{
            headerBackTitle: "Tilbake",
            title: "Transaksjoner",
          }}
        />
        <Stack.Screen
          name="(profile)/settings"
          options={{ headerBackTitle: "Tilbake", headerTitle: "Innstillinger" }}
        />
        <Stack.Screen
          name="(profile)/myParents"
          options={{ headerBackTitle: "Tilbake", headerTitle: "Mine foreldre" }}
        />
        <Stack.Screen
          name="Coins"
          options={{
            headerBackTitle: "Tilbake",
            title: "Gullrøtter",
          }}
        />
      </Stack>
    </GestureHandlerRootView>
  )
}
