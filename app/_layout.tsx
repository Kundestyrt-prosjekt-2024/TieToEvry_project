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
              const { page } = route.params as { page: string }
              const isAsk = page === "ask"
              const isSend = page === "send"
              const title = isAsk ? "Be om penger" : isSend ? "Send penger" : "Ukepenger"
              return {
                headerBackTitle: "Tilbake",
                title: title,
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
            name="(profile)/myChildren"
            options={{ headerBackTitle: "Tilbake", headerTitle: "Mine barn" }}
          />
          <Stack.Screen
            name="Coins"
            options={{
              headerBackTitle: "Tilbake",
              title: "Gullrøtter",
            }}
          />
          <Stack.Screen
            name="SignupChild"
            options={{
              headerBackTitle: "Tilbake",
              title: "",
            }}
          />
        </Stack>
      </QueryClientProvider>
    </GestureHandlerRootView>
  )
}
