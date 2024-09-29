import HorizontalLine from "@/components/HorizontalLine"
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native"

const Profile = () => {
  return (
    <ScrollView className="h-full bg-white ">
      <View className="flex-col items-center pt-10">
        <Image className="w-72 h-72" source={require("@/assets/images/Default_pfp.png")} />
        <HorizontalLine />
        <Text className="text-lg">Navn Navnesen</Text>
        <Text className="text-lg">11 år</Text>
        <View className="flex-col items-center gap-4 mt-8">
          <TouchableOpacity
            className="bg-[#FFC5D3] rounded-lg py-3 px-14 w-64 items-center"
            onPress={() => console.log("Innstillinger")}
            activeOpacity={0.8}
          >
            <Text className="text-xl">Innstillinger</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-[#FFC5D3] rounded-lg py-3 px-14 w-64 items-center"
            onPress={() => console.log("Mine foreldre")}
            activeOpacity={0.8}
          >
            <Text className="text-xl">Mine foreldre</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="py-3 px-14 w-64 items-center"
            onPress={() => console.log("Logg ut")}
            activeOpacity={0.8}
          >
            <Text className="text-xl text-red-600">Logg ut</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}

export default Profile
