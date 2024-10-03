import { View, Text, Image } from "react-native"
import React from "react"
import { ScrollView } from "react-native-gesture-handler"

const MyParents = () => {
  return (
    <View className="h-full bg-white">
      <ScrollView>
        <View className="flex-row justify-center items-center pt-12 w-full">
          <View className="flex-col gap-6 items-center mr-8">
            <Image className="w-36 h-36" source={require("@/assets/images/father-pfp.png")} />
            <View className="flex-col items-center">
              <Text className="font-bold">Navne Navnesen</Text>
              <Text>41 år</Text>
            </View>
          </View>
          <View className="flex-col gap-6 items-center">
            <Image className="w-36 h-36" source={require("@/assets/images/mother-pfp.png")} />
            <View className="flex-col items-center">
              <Text className="font-bold">Navny Navnesen</Text>
              <Text>39 år</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default MyParents
