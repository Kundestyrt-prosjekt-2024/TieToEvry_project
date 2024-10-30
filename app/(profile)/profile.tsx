import React from "react"
import HorizontalLine from "@/components/HorizontalLine"
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet"
import { useCallback, useEffect, useRef, useState } from "react"
import { View, Text, Image, TouchableOpacity, Pressable, FlatList, ScrollView, ActivityIndicator } from "react-native"
import AntDesign from "@expo/vector-icons/AntDesign"
import FontAwesome from "@expo/vector-icons/FontAwesome"
import { useRouter } from "expo-router"
import useUserStore from "@/store/userStore"
import { getUser, setProfilePictureFS } from "@/backend/src/UserDAO"
import { User } from "@/backend/types/user"
import { FirestoreTimestamp } from "@/backend/types/user"
import { getProfilePictures } from "@/backend/src/ProfileDAO"

const Profile = () => {
  const router = useRouter()
  const bottomSheetRef = useRef<BottomSheet>(null)
  const logout = useUserStore((state: { logout: any }) => state.logout)
  const userID = useUserStore((state) => state.userID)
  const [isFetching, setIsFetching] = useState(true)
  const [currUser, setCurruser] = useState<User | undefined>(undefined)
  const [age, setAge] = useState<number | undefined>(undefined)
  const [profilePictures, setProfilePictures] = useState<string[]>([])
  const [profilePicture, setProfilePicture] = useState<string | undefined>(undefined)
  const defaultProfilePicture =
    "https://firebasestorage.googleapis.com/v0/b/mobile-banking-app-dacb3.appspot.com/o/Profile%20Pictures%2FDefault_pfp.png?alt=media&token=3c5ea107-33ee-4b7b-8df6-4ab8b3522aaa"

  useEffect(() => {
    const fetchUser = async () => {
      if (userID) {
        setIsFetching(true)
        const id = userID.substring(1, userID.length - 1)
        const user = await getUser(id)
        setCurruser(user)
        setAge(calculateAge(user?.birthdate as FirestoreTimestamp))
        setProfilePicture(user?.profilePicture ? user.profilePicture : defaultProfilePicture)
        setIsFetching(false)
      }
    }
    fetchUser()
  }, [userID])

  useEffect(() => {
    const fetchProfilePictures = async () => {
      const pictures = await getProfilePictures()
      setProfilePictures(pictures)
    }
    fetchProfilePictures()
  }, [])

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

  const handleLogout = async () => {
    logout()
    router.replace("/(auth)/login")
  }

  function calculateAge(birthdayTimestamp: FirestoreTimestamp): number {
    const birthDate = new Date(birthdayTimestamp.seconds * 1000)
    const ageDifMs = Date.now() - birthDate.getTime()
    return new Date(ageDifMs).getUTCFullYear() - 1970
  }

  return (
    <View className="h-full bg-white">
      <ScrollView>
        <View className="flex-col items-center py-10">
          {isFetching ? (
            <ActivityIndicator size="large" color="#52D1DC" />
          ) : (
            <>
              <View className="relative">
                <Pressable
                  onPress={handleOpenPress}
                  className="bg-[#52D1DC] rounded-full w-10 h-10 justify-center items-center absolute right-6 top-6 z-10 border border-black"
                >
                  <FontAwesome name="pencil" size={24} color="black" />
                </Pressable>
                <View className="w-72 h-72 rounded-full border border-black justify-center items-center overflow-hidden">
                  <Image source={{ uri: profilePicture }} className="w-full h-full" style={{ resizeMode: "cover" }} />
                </View>
              </View>
              <HorizontalLine />
              <Text className="text-lg">{currUser?.name}</Text>
              <Text className="text-lg">{age} år</Text>
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
            </>
          )}
        </View>
      </ScrollView>
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={["70%"]}
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
                data={profilePictures}
                numColumns={4}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    className="w-12 h-12 mx-4 my-2"
                    onPress={() => {
                      userID && setProfilePictureFS(userID.substring(1, userID.length - 1), item),
                        setProfilePicture(item)
                    }}
                  >
                    <Image source={{ uri: item }} className="h-full w-full" />
                  </TouchableOpacity>
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
