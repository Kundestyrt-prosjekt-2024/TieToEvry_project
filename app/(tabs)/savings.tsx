import AppHeader from "@/components/AppHeader"
import SavingGoalCard from "@/components/SavingGoalCard"
import { Text, View, Image, ScrollView, Dimensions, TouchableOpacity, ImageBackground, TextInput } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const { width, height } = Dimensions.get("window")

const Savings = () => {
  return (
    /**
     * TODO
     *  [] Snakkeboble
     */
    <SafeAreaView>
      <AppHeader />
      <View className="h-full bg-white">
        <View className="items-center py-5">
          <Text>Spare med Sphare! Her finner du sparetips som kan hjelpe deg å nå målet ditt!</Text>
        </View>
        <View className="flex-row py-5 px-10">
          <View>
            <Image className="w-85 h-154" source={require("@/assets/images/sphare.png")} />
          </View>
          <View className="flex-col justify-end">
            <View className="relative justify-start px-8 py-4">
              <Image className="" source={require("@/assets/images/figma_bubble.png")}/>
              <Text className="absolute top-11 left-12 text-sm text-black text-center">Du er halvveis til målet ditt! Hurra!</Text>
            </View>
            <View className="justify-end px-8">
              <Text className="text-2xl">Dine sparemål</Text>
            </View>
          </View>
        </View>
        <ScrollView>
          <View className="flex-col items-center py-5">
            <SavingGoalCard></SavingGoalCard>
          </View>
        </ScrollView>
        <View className="absolute flex-col items-center bottom-20 right-5">
          <TouchableOpacity className="bg-[#52D1DC] w-10 h-10 rounded-full" onPress={() => console.log("Legg til sparemål")}>
                <Text className="w-10 h-10 text-center text-3xl">+</Text>
          </TouchableOpacity>
          <Text className="text-xs text-center">Nytt mål</Text>
        </View>
        </View>
    </SafeAreaView>
  )
}

export default Savings
