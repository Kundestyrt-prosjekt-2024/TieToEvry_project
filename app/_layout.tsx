import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Stack } from "expo-router"
import { GestureHandlerRootView } from "react-native-gesture-handler"

const queryClient = new QueryClient()

export default function RootLayout() {
  return (
    <GestureHandlerRootView>
      <QueryClientProvider client={queryClient}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
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
            name="PaymentHistory"
            options={({ route }) => {
              const { name } = route.params as { name: string }
              return {
                headerBackTitle: "Tilbake",
                title: name ? `${name}` : "Betalingshistorikk",
              }
            }}
          />
          <Stack.Screen
            name="AskSend"
            options={({ route }) => {
              const { ask } = route.params as { ask: string }
              const isAsk = ask === "true"
              return {
                headerBackTitle: "Tilbake",
                title: isAsk ? "Be Om" : "Send" + " penger",
              }
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
      </QueryClientProvider>
    </GestureHandlerRootView>
  )
}
