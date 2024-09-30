import { Stack } from "expo-router"

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen options={{ headerShown: false }} name="(tabs)" />
      <Stack.Screen
        name="Transactions"
        options={{
          headerBackTitle: "Tilbake",
          title: "Transaksjoner",
        }}
      />
    </Stack>
  )
}
