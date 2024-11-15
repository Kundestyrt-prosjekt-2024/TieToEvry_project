import { View, Text, ScrollView, FlatList, Image } from "react-native"
import React from "react"
import { User } from "@/backend/types/user"
import { useGetParents, useGetUser, useGetUserID } from "@/hooks/useGetFirestoreData"
import DataLoading from "@/components/DataLoading"


const Settings = () => {
  const userID = useGetUserID()
  const {data: user, isLoading: isLoading } = useGetUser(userID.data || "")
  // const {data: parents} = useGetParents(user?.parents || []);

  function formatTimestamp(date: Date) {
    return new Intl.DateTimeFormat("nb-NO", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date)
  }

  if (isLoading || !user) {
    return <DataLoading />
  }

  return (
    <ScrollView className="flex-grow p-5 bg-white">
      {/* Profile Picture */}
      <View className="items-center mb-5">
        <Image source={{ uri: user.profilePicture }} className="w-24 h-24 rounded-full mb-3" />
        <Text className="text-2xl font-bold">{user.name}</Text>
      </View>

      {/* Birthdate */}
      <View className="flex-row justify-between items-center my-2 py-2 border-b border-gray-300">
        <Text className="text-base font-semibold text-gray-600">Birthdate:</Text>
        <Text className="text-base text-gray-800">{formatTimestamp(new Date(user.birthdate.seconds * 1000))}</Text>
      </View>

      {/* Account Creation Date */}
      <View className="flex-row justify-between items-center my-2 py-2 border-b border-gray-300">
        <Text className="text-base font-semibold text-gray-600">Account Created:</Text>
        <Text className="text-base text-gray-800">{formatTimestamp(new Date(user.created_at.seconds * 1000))}</Text>
      </View>

      {/* Phone Number */}
      <View className="flex-row justify-between items-center my-2 py-2 border-b border-gray-300">
        <Text className="text-base font-semibold text-gray-600">Phone Number:</Text>
        <Text className="text-base text-gray-800">{user.phonenumber}</Text>
      </View>

      {/* Children */}
      {user.children && user.children.length > 0 ? (
        <View className="my-2 py-2 border-b border-gray-300">
          <Text className="text-base font-semibold text-gray-600">Children:</Text>
          <FlatList
            data={user.children}
            keyExtractor={(item) => item}
            renderItem={({ item }) => <Text className="text-base text-gray-800">{item}</Text>}
            className="mt-2"
          />
        </View>
      ) : (
        null
        )}

      {/* Parents */}
      {user.parents && user.parents.length > 0 ? (
        <View className="my-2 py-2 border-b border-gray-300">
          <Text className="text-base font-semibold text-gray-600">Parents:</Text>
          <FlatList
            data={user.parents}
            keyExtractor={(item) => item}
            renderItem={({ item }) => <Text className="text-base text-gray-800">{item}</Text>}
            className="mt-2"
          />
        </View>
      ) : (
        null
      )}

    </ScrollView>
  );
}

export default Settings
