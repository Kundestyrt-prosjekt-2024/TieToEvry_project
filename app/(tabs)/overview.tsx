import { View, Text } from "react-native"
import React from "react"
import AppHeader from "@/components/AppHeader"
import { SafeAreaView } from "react-native-safe-area-context"

const overview = () => {
  return (
    <SafeAreaView className="bg-white h-full">
      <AppHeader />
      <Text>overview</Text>
    </SafeAreaView>
  )
}

export default overview
