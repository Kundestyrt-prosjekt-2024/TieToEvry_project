import { View, Text } from "react-native"
import React from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import AppHeader from "@/components/AppHeader"

const savingsParent = () => {
  return (
    <SafeAreaView className="bg-white h-full">
      <AppHeader parent />
      <Text>savingsParent</Text>
    </SafeAreaView>
  )
}

export default savingsParent
