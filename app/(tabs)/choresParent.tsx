import { View, Text } from "react-native"
import React from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import AppHeader from "@/components/AppHeader"

const choresParent = () => {
  return (
    <SafeAreaView className="bg-white h-full">
      <AppHeader parent />
      <Text>choresParent</Text>
    </SafeAreaView>
  )
}

export default choresParent
