import { Redirect } from "expo-router"
import { View, Text, ActivityIndicator } from "react-native"
import useUserStore from "@/store/userStore"
import { useEffect } from "react"

export default function Index() {
  const loadUserID = useUserStore((state) => state.loadUserID)
  const isLoading = useUserStore((state) => state.isLoading)
  const userID = useUserStore((state) => state.userID)

  useEffect(() => {
    // Load userID from AsyncStorage when the index screen mounts
    loadUserID()
  }, [loadUserID])

  // Render a loading state while checking AsyncStorage
  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="text-lg mt-2">Loading...</Text>
      </View>
    )
  }

  // Conditionally redirect based on user data
  if (userID) {
    return <Redirect href="/(tabs)/home" />
  } else {
    return <Redirect href="/(auth)/login" />
  }
}
