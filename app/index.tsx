import { Redirect } from "expo-router"
import { View, Text } from "react-native"
import useUserID from "@/hooks/useUserID"

export default function Index() {
  const { isLoading, userID } = useUserID()

  // Render a loading state while checking AsyncStorage
  if (isLoading) {
    return (
      <View>
        <Text>Loading...</Text>
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
