import { View, Text, ScrollView, FlatList, Image, Alert } from "react-native"
import React from "react"
import { useGetUser, useGetUserID } from "@/hooks/useGetFirestoreData"
import DataLoading from "@/components/ui/DataLoading"
import Button from "@/components/ui/Button"
import { deleteUser } from "@/backend/src/userDAO"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { router } from "expo-router"

const Settings = () => {
  const userID = useGetUserID()
  const { data: user, isLoading: userLoading } = useGetUser(userID.data || "")

  // Utility to format timestamps
  function formatTimestamp(date: Date) {
    return new Intl.DateTimeFormat("nb-NO", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date)
  }

  if (userLoading || !user) {
    return <DataLoading />
  }

  // Conditional checks for parents
  const parents = user.parents || []
  const { data: parent1, isLoading: parent1Loading } = useGetUser(parents[0] || "")
  const { data: parent2, isLoading: parent2Loading } = useGetUser(parents[1] || "")

  const handleDelete = () => {
    Alert.alert(
      "Bekreft sletting",
      "Er du sikker på at du vil slette denne brukeren? Denne handlingen kan ikke reverseres.",
      [
        { text: "Lukk", style: "cancel" },
        { text: "Slett", style: "destructive", onPress: () => performDelete() },
      ]
    )
  }

  const handleLogout = async () => {
    await AsyncStorage.removeItem("userID")
    router.replace("/(auth)/Login")
  }

  const performDelete = async () => {
    if (user) {
      try {
        const wasDeleted = await deleteUser(user)
        if (wasDeleted) {
          handleLogout()
        }
      } catch (error) {
        console.error("Failed to delete user:", error)
      }
    } else {
      console.error("User data is undefined")
    }
  }

  return (
    <ScrollView className="flex-grow p-5 bg-white">
      {/* Profile Picture */}
      <View className="items-center mb-5">
        {user.profilePicture && <Image source={{ uri: user.profilePicture }} className="w-24 h-24 rounded-full mb-3" />}
        <Text className="text-2xl font-bold">{user.name || "User Name"}</Text>
      </View>

      {/* Birthdate */}
      <View className="flex-row justify-between items-center my-2 py-2 border-b border-gray-300">
        <Text className="text-base font-semibold text-gray-600">Bursdag:</Text>
        {user.birthdate?.seconds && (
          <Text className="text-base text-gray-800">{formatTimestamp(new Date(user.birthdate.seconds * 1000))}</Text>
        )}
      </View>

      {/* Account Creation Date */}
      <View className="flex-row justify-between items-center my-2 py-2 border-b border-gray-300">
        <Text className="text-base font-semibold text-gray-600">Bruker opprettet:</Text>
        {user.created_at?.seconds && (
          <Text className="text-base text-gray-800">{formatTimestamp(new Date(user.created_at.seconds * 1000))}</Text>
        )}
      </View>

      {/* Phone Number */}
      <View className="flex-row justify-between items-center my-2 py-2 border-b border-gray-300">
        <Text className="text-base font-semibold text-gray-600">Telefonnummer:</Text>
        <Text className="text-base text-gray-800">{user.phonenumber || "Not Available"}</Text>
      </View>

      {/* Children */}
      {user.children && user.children.length > 0 && (
        <View className="my-2 py-2 border-b border-gray-300">
          <Text className="text-base font-semibold text-gray-600">Barn:</Text>
          <FlatList
            data={user.children}
            keyExtractor={(item) => item}
            renderItem={({ item }) => <Text className="text-base text-gray-800">{item}</Text>}
            className="mt-2"
          />
        </View>
      )}

      {/* Parents */}
      {parents.length > 0 && (
        <View className="my-2 py-2 border-b border-gray-300">
          <Text className="text-base font-semibold text-gray-600">Foreldre:</Text>
          {!parent1Loading && parent1 && <Text className="text-base text-gray-800">{parent1.name}</Text>}
          {!parent2Loading && parent2 && <Text className="text-base text-gray-800">{parent2.name}</Text>}
        </View>
      )}

      {/* Delete User Button */}
      <View className="mt-5">
        <Button text="Slett bruker" classname="w-full" onClick={handleDelete} />
      </View>
    </ScrollView>
  )
}

export default Settings
