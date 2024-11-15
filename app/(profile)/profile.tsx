import React from "react"
import HorizontalLine from "@/components/HorizontalLine"
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet"
import { useCallback, useRef } from "react"
import { View, Text, Image, TouchableOpacity, Pressable, FlatList, ScrollView, ActivityIndicator } from "react-native"
import AntDesign from "@expo/vector-icons/AntDesign"
import FontAwesome from "@expo/vector-icons/FontAwesome"
import { useRouter } from "expo-router"
import { updateProfilePicture } from "@/backend/src/UserDAO"
import { FirestoreTimestamp } from "@/backend/types/firebase"
import { useGetProfilePictures, useGetUser, useGetUserID } from "@/hooks/useGetFirestoreData"
import AsyncStorage from "@react-native-async-storage/async-storage"
import DataLoading from "@/components/DataLoading"
import DataError from "@/components/DataError"

const Profile = () => {
  const router = useRouter()
  const bottomSheetRef = useRef<BottomSheet>(null)
  const userID = useGetUserID()
  const user = useGetUser(userID.data || "")
  const profilePictures = useGetProfilePictures()

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
    await AsyncStorage.removeItem("userID")
    router.replace("/(auth)/login")
  }

  const handleProfilePictureUpdate = async (profilePictureUrl: string) => {
    if (userID.data) {
      await updateProfilePicture(userID.data, profilePictureUrl)
      user.refetch()
    }
  }

  function calculateAge(birthdayTimestamp: FirestoreTimestamp): number {
    const birthDate = new Date(birthdayTimestamp.seconds * 1000)
    const ageDifMs = Date.now() - birthDate.getTime()
    return new Date(ageDifMs).getUTCFullYear() - 1970
  }

  if (userID.isPending || user.isPending || profilePictures.isPending) {
    return <DataLoading />
  }

  if (userID.isError || user.isError || profilePictures.isError) {
    return <DataError />
  }

  const childrenPage = () => {
    return (
      <TouchableOpacity
        className="bg-[#FFC5D3] rounded-lg py-3 px-14 w-64 items-center"
        onPress={() => router.navigate("/myParents")}
        activeOpacity={0.8}
      >
        <Text className="text-xl">Mine foreldre</Text>
      </TouchableOpacity>
    )
  }

  const parentPage = () => {
    return (
      <TouchableOpacity
        className="bg-[#FFC5D3] rounded-lg py-3 px-14 w-64 items-center"
        onPress={() => router.navigate("/myChildren")}
        activeOpacity={0.8}
      >
        <Text className="text-xl">Mine barn</Text>
      </TouchableOpacity>
    )
  }
  return (
    <View className="h-full bg-white">
      <ScrollView>
        <View className="flex-col items-center py-10">
          <View className="relative">
            <Pressable
              onPress={handleOpenPress}
              className="bg-[#52D1DC] rounded-full w-10 h-10 justify-center items-center absolute right-6 top-6 z-10 border border-black"
              testID="edit-profile-picture-button"
            >
              <FontAwesome name="pencil" size={24} color="black" />
            </Pressable>
            <View className="w-72 h-72 rounded-full border border-black justify-center items-center overflow-hidden">
              <Image
                source={{ uri: user.data?.profilePicture }}
                className="w-full h-full"
                style={{ resizeMode: "cover" }}
                testID="profile-image"
              />
            </View>
          </View>
          <HorizontalLine />
          <Text className="text-lg">{user.data?.name}</Text>
          <Text className="text-lg">{user.data && calculateAge(user.data.birthdate)} år</Text>
          <View className="flex-col items-center gap-4 mt-8">
            <TouchableOpacity
              className="bg-[#FFC5D3] rounded-lg py-3 px-14 w-64 items-center"
              onPress={() => router.navigate("/settings")}
              activeOpacity={0.8}
            >
              <Text className="text-xl">Innstillinger</Text>
            </TouchableOpacity>
            {user.data?.parents ? childrenPage() : parentPage()}
            <TouchableOpacity className="py-3 px-14 w-64 items-center" onPress={handleLogout} activeOpacity={0.8}>
              <Text className="text-xl text-red-600">Logg ut</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={["70%"]}
        enablePanDownToClose={true}
        backdropComponent={renderBackdrop}
        index={-1}
      >
        <View className="flex-col items-center" testID="profile-bottom-sheet">
          <View className="w-full flex-row justify-end pr-6">
            <Pressable onPress={handleClosePress} testID="close-bottom-sheet-button">
              <AntDesign name="close" size={32} color="black" />
            </Pressable>
          </View>
          <Text className="font-bold text-lg">Velg profilbilde</Text>
          <ScrollView>
            <View className="pt-6 justify-center">
              <FlatList
                data={profilePictures.data}
                numColumns={4}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    className={`w-12 h-12 rounded-xl mx-4 my-2 ${item === user.data?.profilePicture ? "border-4 border-blue-500" : ""}`}
                    onPress={() => handleProfilePictureUpdate(item)}
                  >
                    <Image source={{ uri: item }} className="h-full w-full rounded-xl" />
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
