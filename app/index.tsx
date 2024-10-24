import React, { useEffect, useState } from "react"
import { Redirect } from "expo-router"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { View, Text } from "react-native"
import useAsyncUser from "@/hooks/useAsyncUser"

export default function Index() {
  const { hasUser, isChecking } = useAsyncUser()

  // Render a loading state while checking AsyncStorage
  if (isChecking) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    )
  }

  // Conditionally redirect based on user data
  if (hasUser) {
    return <Redirect href="/(tabs)/home" />
  } else {
    return <Redirect href="/(auth)/login" />
  }
}
