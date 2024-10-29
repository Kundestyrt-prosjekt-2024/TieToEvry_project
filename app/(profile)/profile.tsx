import HorizontalLine from "@/components/HorizontalLine"
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet"
import { useCallback, useEffect, useRef, useState } from "react"
import { View, Text, Image, TouchableOpacity, Pressable, FlatList, ScrollView } from "react-native"
import AntDesign from "@expo/vector-icons/AntDesign"
import FontAwesome from "@expo/vector-icons/FontAwesome"
import { useRouter } from "expo-router"
import useUserStore from "@/store/userStore"
import { getUser } from "@/backend/src/UserDAO"
import { User } from "@/backend/types/user"

const Profile = () => {
  const router = useRouter()
  const bottomSheetRef = useRef<BottomSheet>(null)
  const logout = useUserStore((state: { logout: any }) => state.logout)
  const userID = useUserStore((state) => state.userID)
  const [currUser, setCurruser] = useState<User | undefined>(undefined)

  useEffect(() => {
    const fetchUser = async () => {
      if (userID) {
        const id = userID.substring(1, userID.length - 1)
        const user = await getUser(id)
        setCurruser(user)
      }
    }
    fetchUser()
  }, [userID])

  const handleClosePress = useCallback(() => {
    bottomSheetRef.current?.close()
  }, [])

  const handleOpenPress = useCallback(() => {
    bottomSheetRef.current?.expand()
  }, [])

  const renderBackdrop = useCallback(
    (props: any) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />,
    []
  )

  const data = [
    {
      source: require("@/assets/images/animal-pfp.png"),
    },
    {
      source: require("@/assets/images/animal-pfp.png"),
    },
    {
      source: require("@/assets/images/animal-pfp.png"),
    },
    {
      source: require("@/assets/images/animal-pfp.png"),
    },
    {
      source: require("@/assets/images/animal-pfp.png"),
    },
    {
      source: require("@/assets/images/animal-pfp.png"),
    },
    {
      source: require("@/assets/images/animal-pfp.png"),
    },
    {
      source: require("@/assets/images/animal-pfp.png"),
    },
    {
      source: require("@/assets/images/animal-pfp.png"),
    },
    {
      source: require("@/assets/images/animal-pfp.png"),
    },
  ]

  const handleLogout = async () => {
    logout()
    router.replace("/(auth)/login")
  }

  return (
    <View className="h-full bg-white">
      <ScrollView>
        <View className="flex-col items-center py-10">
          <View className="relative">
            <Pressable
              onPress={handleOpenPress}
              className="bg-[#52D1DC] rounded-full w-10 h-10 justify-center items-center absolute right-6 top-6 z-10 border border-black"
            >
              <FontAwesome name="pencil" size={24} color="black" />
            </Pressable>
            <View className="w-72 h-72 rounded-full border border-black justify-center items-center">
              <Image className="w-full h-full" source={require("@/assets/images/Default_pfp.png")} />
            </View>
          </View>
          <HorizontalLine />
          <Text className="text-lg">{currUser?.name}</Text>
          <Text className="text-lg">{}</Text>
          <View className="flex-col items-center gap-4 mt-8">
            <TouchableOpacity
              className="bg-[#FFC5D3] rounded-lg py-3 px-14 w-64 items-center"
              onPress={() => router.navigate("/settings")}
              activeOpacity={0.8}
            >
              <Text className="text-xl">Innstillinger</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-[#FFC5D3] rounded-lg py-3 px-14 w-64 items-center"
              onPress={() => router.navigate("/myParents")}
              activeOpacity={0.8}
            >
              <Text className="text-xl">Mine foreldre</Text>
            </TouchableOpacity>
            <TouchableOpacity className="py-3 px-14 w-64 items-center" onPress={handleLogout} activeOpacity={0.8}>
              <Text className="text-xl text-red-600">Logg ut</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={["50%"]}
        enablePanDownToClose={true}
        backdropComponent={renderBackdrop}
        index={-1}
      >
        <View className="flex-col items-center">
          <View className="w-full flex-row justify-end pr-6">
            <Pressable onPress={handleClosePress}>
              <AntDesign name="close" size={32} color="black" />
            </Pressable>
          </View>
          <Text className="font-bold text-lg">Velg profilbilde</Text>
          <ScrollView>
            <View className="pt-6 justify-center">
              <FlatList
                data={data}
                numColumns={4}
                renderItem={({ item }) => (
                  <Pressable className="w-12 h-12 mx-4 my-2" onPress={() => console.log("Endrer pfp")}>
                    <Image source={item.source} className="h-full w-full"></Image>
                  </Pressable>
                )}
                keyExtractor={(_item, index) => index.toString()}
                scrollEnabled={false}
              />
            </View>
          </ScrollView>
        </View>
      </BottomSheet>
    </View>
  )
}

export default Profile
